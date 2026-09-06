import { Injectable } from '@angular/core';
import { registerPlugin } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { AppLog } from '../models/app-log';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/data.service";
import * as i2 from "./location.service";
import * as i3 from "./patrol.service";
import * as i4 from "./app-update.service";
import * as i5 from "./enforcementpro/app-http.service";
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');
export class TrackingService {
    constructor(data, location, patrol, appUpdate, appHttp) {
        this.data = data;
        this.location = location;
        this.patrol = patrol;
        this.appUpdate = appUpdate;
        this.appHttp = appHttp;
        this.trackUrl = 'https://app.enforcementpro.co.uk/api/app/user/track';
        this.updateCheckIntervalMs = 15 * 60 * 1000;
        this.watcherId = null;
        this.lastPostedAt = 0;
        this.lastUpdateCheckedAt = 0;
        this.isPosting = false;
    }
    async syncTrackingState() {
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
    async startWatcher() {
        if (this.watcherId) {
            return;
        }
        this.watcherId = await BackgroundGeolocation.addWatcher({
            backgroundTitle: 'EnforcementPro patrol tracking',
            backgroundMessage: 'Location tracking is active while you are on patrol.',
            requestPermissions: true,
            stale: false,
            distanceFilter: 25
        }, (location, error) => {
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
        });
    }
    async stop() {
        if (!this.watcherId) {
            return;
        }
        await BackgroundGeolocation.removeWatcher({ id: this.watcherId }).catch(() => undefined);
        this.watcherId = null;
    }
    async pingNow() {
        if (!this.patrol.isOnPatrol()) {
            return;
        }
        const position = await this.location.requireCurrentPosition();
        await this.postTrack(this.buildAppLog(position.latitude, position.longitude, this.telemetryFromCurrentPosition(position)));
    }
    async flushQueuedTracks() {
        const queued = [...this.data.getTrackingQueue()];
        if (queued.length === 0 || this.isPosting) {
            return;
        }
        const unsent = [];
        for (const item of queued) {
            const ok = await this.postTrack(item, false);
            if (!ok) {
                unsent.push(item);
            }
        }
        this.data.setTrackingQueue(unsent);
    }
    handleLocation(location) {
        if (!this.patrol.isOnPatrol()) {
            this.stop();
            return;
        }
        const now = Date.now();
        if (now - this.lastPostedAt < 15000) {
            return;
        }
        const log = this.buildAppLog(location.latitude.toString(), location.longitude.toString(), this.telemetryFromBackgroundLocation(location));
        this.location.rememberFix({
            latitude: log.lat,
            longitude: log.lng,
            accuracy: log.accuracy_meters || 0,
            altitude: log.altitude_meters,
            altitudeAccuracy: log.altitude_accuracy_meters,
            speed: log.speed_mps,
            heading: log.heading_degrees,
            timestamp: Date.now()
        });
        this.postTrack(log);
    }
    buildAppLog(lat, lng, telemetry = {}) {
        const appLog = this.data.getAppLog() || new AppLog();
        const user = this.data.getUser();
        const site = this.data.getSelectedSite();
        appLog.type = 'ping';
        appLog.user_id = (user?.id || appLog.user_id || 0).toString();
        appLog.site_id = (site?.id || appLog.site_id || 0).toString();
        appLog.lat = lat;
        appLog.lng = lng;
        this.applyTelemetry(appLog, telemetry);
        this.removeZoneId(appLog);
        this.data.setAppLog(appLog);
        this.patrol.updateLastFix(lat, lng);
        const cleanLog = { ...appLog };
        this.removeZoneId(cleanLog);
        return cleanLog;
    }
    telemetryFromCurrentPosition(position) {
        return {
            accuracy: position.accuracy,
            altitude: position.altitude,
            altitudeAccuracy: position.altitudeAccuracy,
            speed: position.speed,
            heading: position.heading,
            recordedAt: this.timestampToIso(position.timestamp),
            source: 'foreground',
            isMocked: false
        };
    }
    telemetryFromBackgroundLocation(location) {
        return {
            accuracy: location.accuracy,
            altitude: location.altitude,
            altitudeAccuracy: location.altitudeAccuracy,
            speed: location.speed,
            heading: location.bearing,
            recordedAt: this.timestampToIso(location.time),
            source: 'background',
            isMocked: !!location.simulated
        };
    }
    applyTelemetry(appLog, telemetry) {
        appLog.recorded_at = telemetry.recordedAt || new Date().toISOString();
        appLog.accuracy_meters = this.normaliseOptionalNumber(telemetry.accuracy, 0);
        appLog.altitude_meters = this.normaliseOptionalNumber(telemetry.altitude);
        appLog.altitude_accuracy_meters = this.normaliseOptionalNumber(telemetry.altitudeAccuracy, 0);
        appLog.speed_mps = this.normaliseOptionalNumber(telemetry.speed, 0);
        appLog.heading_degrees = this.normaliseHeading(telemetry.heading);
        appLog.source = telemetry.source || 'mobile';
        appLog.is_mocked = !!telemetry.isMocked;
    }
    timestampToIso(timestamp) {
        if (typeof timestamp !== 'number' || !Number.isFinite(timestamp) || timestamp <= 0) {
            return new Date().toISOString();
        }
        return new Date(timestamp).toISOString();
    }
    normaliseOptionalNumber(value, min) {
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            return null;
        }
        if (min !== undefined && value < min) {
            return null;
        }
        return Number(value.toFixed(2));
    }
    normaliseHeading(value) {
        const heading = this.normaliseOptionalNumber(value);
        if (heading === null) {
            return null;
        }
        return Number((((heading % 360) + 360) % 360).toFixed(2));
    }
    async postTrack(appLog, queueOnFailure = true) {
        const token = this.data.getToken();
        if (!token) {
            return false;
        }
        this.removeZoneId(appLog);
        this.checkForAppUpdate().catch(() => undefined);
        this.isPosting = true;
        try {
            const payload = await firstValueFrom(this.appHttp.post(this.trackUrl, appLog, {
                timeoutMs: 20000
            }));
            this.lastPostedAt = Date.now();
            this.handleTrackResponse(payload);
            return true;
        }
        catch (error) {
            if (queueOnFailure) {
                this.data.pushTrackingQueue(appLog);
                if (!this.handleTrackProblem(error?.error) && !this.data.checkSelectedZone()) {
                    this.handleGenericProblem();
                }
            }
            if (!error?.status || error.status === 0) {
                this.handleNetworkProblem();
            }
            return false;
        }
        finally {
            this.isPosting = false;
        }
    }
    async checkForAppUpdate() {
        const now = Date.now();
        if (now - this.lastUpdateCheckedAt < this.updateCheckIntervalMs) {
            return;
        }
        this.lastUpdateCheckedAt = now;
        await this.appUpdate.checkAndInstallIfNeeded('app-log').catch(() => undefined);
    }
    handleTrackResponse(responseData) {
        const payload = this.normaliseResponseData(responseData);
        const zone = this.extractZone(payload);
        if (zone?.id) {
            this.applyDetectedZone(zone);
            return;
        }
        this.handleTrackProblem(payload);
    }
    handleTrackProblem(responseData) {
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
    applyDetectedZone(zone) {
        const selectedZone = {
            ...zone,
            id: Number(zone.id)
        };
        this.data.setSelectedZone(selectedZone);
        this.data.clearZoneDetectionStatus();
        this.applyZoneToNewFpn(selectedZone);
    }
    applyZoneToNewFpn(zone) {
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
    handleNoZone(message) {
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
    handleNetworkProblem(message) {
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
    handleGenericProblem() {
        this.data.setZoneDetectionStatus({
            code: 'error',
            message: 'Unable to confirm your zone. Please select a zone.',
            updated_at: new Date().toISOString()
        });
    }
    normaliseResponseData(responseData) {
        if (typeof responseData !== 'string') {
            return responseData || {};
        }
        try {
            return JSON.parse(responseData);
        }
        catch {
            return { message: responseData };
        }
    }
    extractZone(payload) {
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
    isZone(value) {
        return !!value && Number(value.id) > 0 && typeof value.name === 'string';
    }
    extractMessage(payload) {
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
    extractZoneStatus(payload) {
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
    isNetworkStatus(status, message) {
        const text = `${status} ${message}`.toLowerCase();
        return text.includes('network') || text.includes('offline') || text.includes('connection');
    }
    isNoZoneStatus(status, message) {
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
    removeZoneId(appLog) {
        if (appLog && Object.prototype.hasOwnProperty.call(appLog, 'zone_id')) {
            delete appLog.zone_id;
        }
    }
    static { this.ɵfac = function TrackingService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TrackingService)(i0.ɵɵinject(i1.DataService), i0.ɵɵinject(i2.LocationService), i0.ɵɵinject(i3.PatrolService), i0.ɵɵinject(i4.AppUpdateService), i0.ɵɵinject(i5.AppHttpService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: TrackingService, factory: TrackingService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TrackingService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.DataService }, { type: i2.LocationService }, { type: i3.PatrolService }, { type: i4.AppUpdateService }, { type: i5.AppHttpService }], null); })();
//# sourceMappingURL=tracking.service.js.map