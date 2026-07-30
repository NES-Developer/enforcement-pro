import { Injectable } from '@angular/core';
import { CapacitorHttp, registerPlugin } from '@capacitor/core';
import type {
    BackgroundGeolocationPlugin,
    CallbackError,
    Location as BackgroundLocation
} from '@capacitor-community/background-geolocation';
import { AppLog } from '../models/app-log';
import { DataService } from './enforcementpro/data.service';
import { LocationService } from './location.service';
import { PatrolService } from './patrol.service';
import { AppUpdateService } from './app-update.service';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    private readonly trackUrl = 'https://app.enforcementpro.co.uk/api/app/user/track';
    private readonly updateCheckIntervalMs = 15 * 60 * 1000;
    private watcherId: string | null = null;
    private lastPostedAt = 0;
    private lastUpdateCheckedAt = 0;
    private isPosting = false;

    constructor(
        private data: DataService,
        private location: LocationService,
        private patrol: PatrolService,
        private appUpdate: AppUpdateService
    ) {}

    async syncTrackingState(): Promise<void> {
        await this.data.init();

        if (!this.patrol.isOnPatrol()) {
            await this.stop();
            return;
        }

        await this.location.requireLocationPermission();
        await this.startWatcher();
        await this.pingNow();
        await this.flushQueuedTracks();
    }

    async startWatcher(): Promise<void> {
        if (this.watcherId) {
            return;
        }

        this.watcherId = await BackgroundGeolocation.addWatcher(
            {
                backgroundTitle: 'EnforcementPro patrol tracking',
                backgroundMessage: 'Location tracking is active while you are on patrol.',
                requestPermissions: true,
                stale: false,
                distanceFilter: 25
            },
            (location?: BackgroundLocation, error?: CallbackError) => {
                if (error) {
                    if (error.code === 'NOT_AUTHORIZED') {
                        this.stop();
                    }
                    return;
                }

                if (!location) {
                    return;
                }

                this.handleLocation(location);
            }
        );
    }

    async stop(): Promise<void> {
        if (!this.watcherId) {
            return;
        }

        await BackgroundGeolocation.removeWatcher({ id: this.watcherId }).catch(() => undefined);
        this.watcherId = null;
    }

    async pingNow(): Promise<void> {
        if (!this.patrol.isOnPatrol()) {
            return;
        }

        const position = await this.location.requireCurrentPosition();

        await this.postTrack(
            this.buildAppLog(position.latitude, position.longitude)
        );
    }

    async flushQueuedTracks(): Promise<void> {
        const queued = [...this.data.getTrackingQueue()];

        if (queued.length === 0 || this.isPosting) {
            return;
        }

        const unsent: AppLog[] = [];

        for (const item of queued) {
            const ok = await this.postTrack(item, false);

            if (!ok) {
                unsent.push(item);
            }
        }

        this.data.setTrackingQueue(unsent);
    }

    private handleLocation(location: BackgroundLocation): void {
        if (!this.patrol.isOnPatrol()) {
            this.stop();
            return;
        }

        const now = Date.now();

        if (now - this.lastPostedAt < 15000) {
            return;
        }

        const log = this.buildAppLog(location.latitude.toString(), location.longitude.toString());
        this.postTrack(log);
    }

    private buildAppLog(lat: string, lng: string): AppLog {
        const appLog = this.data.getAppLog() || new AppLog();
        const user = this.data.getUser();
        const site = this.data.getSelectedSite();

        appLog.type = 'ping';
        appLog.user_id = (user?.id || appLog.user_id || 0).toString();
        appLog.site_id = (site?.id || appLog.site_id || 0).toString();
        appLog.lat = lat;
        appLog.lng = lng;
        this.removeZoneId(appLog);

        this.data.setAppLog(appLog);
        this.patrol.updateLastFix(lat, lng);

        const cleanLog = { ...appLog };
        this.removeZoneId(cleanLog);
        return cleanLog;
    }

    private async postTrack(appLog: AppLog, queueOnFailure: boolean = true): Promise<boolean> {
        const token = this.data.getToken();

        if (!token) {
            return false;
        }

        this.removeZoneId(appLog);
        this.checkForAppUpdate().catch(() => undefined);

        this.isPosting = true;

        try {
            const response = await CapacitorHttp.post({
                url: this.trackUrl,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: appLog
            });

            const ok = response.status >= 200 && response.status < 300;

            if (ok) {
                this.lastPostedAt = Date.now();
                this.handleTrackResponse(response.data);
            } else if (queueOnFailure) {
                this.data.pushTrackingQueue(appLog);
                if (!this.handleTrackProblem(response.data) && !this.data.checkSelectedZone()) {
                    this.handleGenericProblem();
                }
            }

            return ok;
        } catch {
            if (queueOnFailure) {
                this.data.pushTrackingQueue(appLog);
            }

            this.handleNetworkProblem();
            return false;
        } finally {
            this.isPosting = false;
        }
    }

    private async checkForAppUpdate(): Promise<void> {
        const now = Date.now();

        if (now - this.lastUpdateCheckedAt < this.updateCheckIntervalMs) {
            return;
        }

        this.lastUpdateCheckedAt = now;
        await this.appUpdate.checkAndInstallIfNeeded('app-log').catch(() => undefined);
    }

    private handleTrackResponse(responseData: any): void {
        const payload = this.normaliseResponseData(responseData);
        const zone = this.extractZone(payload);

        if (zone?.id) {
            this.applyDetectedZone(zone);
            return;
        }

        this.handleTrackProblem(payload);
    }

    private handleTrackProblem(responseData: any): boolean {
        const payload = this.normaliseResponseData(responseData);
        const message = this.extractMessage(payload);
        const status = this.extractZoneStatus(payload);

        if (this.isNetworkStatus(status, message)) {
            this.handleNetworkProblem(message);
            return true;
        }

        if (this.isNoZoneStatus(status, message)) {
            this.handleNoZone(message);
            return true;
        }

        return false;
    }

    private applyDetectedZone(zone: any): void {
        const selectedZone = {
            ...zone,
            id: Number(zone.id)
        };

        this.data.setSelectedZone(selectedZone);
        this.data.clearZoneDetectionStatus();
        this.applyZoneToNewFpn(selectedZone);
    }

    private applyZoneToNewFpn(zone: any): void {
        if (!zone?.id) {
            return;
        }

        const enviroPost = this.data.getEnviroPost();
        const site = this.data.getSelectedSite();

        if (!enviroPost || enviroPost.zone_id > 0) {
            return;
        }

        if (site?.id && zone.site_id && zone.site_id.toString() !== site.id.toString()) {
            return;
        }

        if (site?.id && enviroPost.site_id <= 0) {
            enviroPost.site_id = site.id;
        }

        enviroPost.zone_id = Number(zone.id);
        this.data.setEnviroPost(enviroPost);
    }

    private handleNoZone(message?: string): void {
        const enviroPost = this.data.getEnviroPost();

        if (!enviroPost || enviroPost.zone_id <= 0) {
            this.data.setSelectedZone(null);
        }

        this.data.setZoneDetectionStatus({
            code: 'not_in_zone',
            message: message || 'You are not in a zone. Please select a zone.',
            updated_at: new Date().toISOString()
        });
    }

    private handleNetworkProblem(message?: string): void {
        const selectedZone = this.data.getSelectedZone();

        if (selectedZone?.id) {
            this.applyZoneToNewFpn(selectedZone);
            this.data.clearZoneDetectionStatus();
            return;
        }

        this.data.setZoneDetectionStatus({
            code: 'network',
            message: message || 'Unable to confirm your zone. Please select a zone.',
            updated_at: new Date().toISOString()
        });
    }

    private handleGenericProblem(): void {
        this.data.setZoneDetectionStatus({
            code: 'error',
            message: 'Unable to confirm your zone. Please select a zone.',
            updated_at: new Date().toISOString()
        });
    }

    private normaliseResponseData(responseData: any): any {
        if (typeof responseData !== 'string') {
            return responseData || {};
        }

        try {
            return JSON.parse(responseData);
        } catch {
            return { message: responseData };
        }
    }

    private extractZone(payload: any): any {
        const data = payload?.data;
        const candidates = [
            payload,
            data,
            payload?.selected_zone,
            payload?.selectedZone,
            payload?.zone,
            payload?.zone_details,
            payload?.selected_zone_details,
            data?.selected_zone,
            data?.selectedZone,
            data?.zone,
            data?.zone_details,
            data?.selected_zone_details
        ];

        return candidates.find(candidate => this.isZone(candidate));
    }

    private isZone(value: any): boolean {
        return !!value && Number(value.id) > 0 && typeof value.name === 'string';
    }

    private extractMessage(payload: any): string {
        const data = payload?.data;
        const messages = [
            payload?.message,
            payload?.msg,
            payload?.zone_message,
            payload?.zoneMessage,
            data?.message,
            data?.msg,
            data?.zone_message,
            data?.zoneMessage
        ];

        return messages.find(message => typeof message === 'string' && message.trim() !== '') || '';
    }

    private extractZoneStatus(payload: any): string {
        const data = payload?.data;
        const statuses = [
            payload?.status,
            payload?.zone_status,
            payload?.zoneStatus,
            payload?.zone_error,
            payload?.zoneError,
            data?.status,
            data?.zone_status,
            data?.zoneStatus,
            data?.zone_error,
            data?.zoneError
        ];

        return statuses.find(status => typeof status === 'string' && status.trim() !== '') || '';
    }

    private isNetworkStatus(status: string, message: string): boolean {
        const text = `${status} ${message}`.toLowerCase();
        return text.includes('network') || text.includes('offline') || text.includes('connection');
    }

    private isNoZoneStatus(status: string, message: string): boolean {
        const text = `${status} ${message}`.toLowerCase();
        return text.includes('not_in_zone')
            || text.includes('zone_not_found')
            || text.includes('not in a zone')
            || text.includes('not in zone')
            || text.includes('outside zone')
            || text.includes('out of zone')
            || text.includes('no zone')
            || text.includes('zone not found')
            || text.includes('not within');
    }

    private removeZoneId(appLog: any): void {
        if (appLog && Object.prototype.hasOwnProperty.call(appLog, 'zone_id')) {
            delete appLog.zone_id;
        }
    }
}
