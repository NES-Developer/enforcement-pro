import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { firstValueFrom, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppUpdater } from '../native/app-updater.plugin';
import { ConstantsService } from './constants.service';

export type AppUpdateCheckReason = 'app-start' | 'app-resume' | 'fpn-data-fetch' | 'logged-out' | 'logout' | 'login-page' | 'settings' | 'app-log';

export interface InstalledAppVersion {
    platform: string;
    packageName: string;
    versionName: string;
    versionCode: number;
}

export interface MobileAppUpdateManifest {
    platform?: string;
    latestVersionName?: string;
    latestVersionCode?: number;
    minimumSupportedVersionCode?: number;
    updateAvailable?: boolean;
    forceUpdate?: boolean;
    apkUrl?: string;
    apkSha256?: string;
    apkSizeBytes?: number;
    releaseNotes?: string;
    publishedAt?: string;
}

export interface AppUpdateCheckResult {
    checked: boolean;
    updateAvailable: boolean;
    installStarted: boolean;
    current?: InstalledAppVersion;
    manifest?: MobileAppUpdateManifest;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    private readonly checkTimeoutMs = 20000;
    private inFlight?: Promise<AppUpdateCheckResult>;
    private installStarted = false;
    private lastAlertMessage = '';

    constructor(
        private http: HttpClient,
        private alertController: AlertController,
        private constants: ConstantsService
    ) {}

    async checkAndInstallIfNeeded(reason: AppUpdateCheckReason): Promise<AppUpdateCheckResult> {
        if (!environment.mobileUpdateCheckEnabled) {
            return {
                checked: false,
                updateAvailable: false,
                installStarted: false
            };
        }

        if (this.installStarted) {
            return {
                checked: false,
                updateAvailable: true,
                installStarted: true
            };
        }

        if (this.inFlight) {
            return this.inFlight;
        }

        this.inFlight = this.runUpdateCheck(reason).finally(() => {
            this.inFlight = undefined;
        });

        return this.inFlight;
    }

    private async runUpdateCheck(reason: AppUpdateCheckReason): Promise<AppUpdateCheckResult> {
        const current = await this.getInstalledVersion();

        try {
            const manifest = await this.fetchManifest(current, reason);
            const updateAvailable = this.isUpdateAvailable(current, manifest);

            if (!updateAvailable) {
                return {
                    checked: true,
                    updateAvailable: false,
                    installStarted: false,
                    current,
                    manifest
                };
            }

            const installStarted = await this.installUpdate(current, manifest);

            return {
                checked: true,
                updateAvailable: true,
                installStarted,
                current,
                manifest
            };
        } catch (error: any) {
            return {
                checked: false,
                updateAvailable: false,
                installStarted: false,
                current,
                error: error?.message || 'Unable to check for app updates.'
            };
        }
    }

    private async fetchManifest(current: InstalledAppVersion, reason: AppUpdateCheckReason): Promise<MobileAppUpdateManifest> {
        const params = new HttpParams()
            .set('platform', current.platform)
            .set('packageName', current.packageName)
            .set('currentVersionName', current.versionName)
            .set('currentVersionCode', current.versionCode.toString())
            .set('reason', reason);

        const response = await firstValueFrom(
            this.http.get<any>(environment.mobileUpdateCheckUrl, { params }).pipe(timeout(this.checkTimeoutMs))
        );

        return this.normaliseManifest(response);
    }

    private async installUpdate(current: InstalledAppVersion, manifest: MobileAppUpdateManifest): Promise<boolean> {
        const downloadUrl = manifest.apkUrl;

        if (current.platform !== 'android') {
            await this.presentUpdateProblem('Update Required', 'A new app version is available, but automatic APK install is only supported on Android.');
            return false;
        }

        if (!downloadUrl) {
            await this.presentUpdateProblem('Update Required', 'The server reported a new app version but did not include a public APK URL.');
            return false;
        }

        this.installStarted = true;

        try {
            await AppUpdater.installApk({
                apkUrl: downloadUrl,
                sha256: manifest.apkSha256,
                packageName: current.packageName
            });

            return true;
        } catch (error: any) {
            this.installStarted = false;
            await this.presentUpdateProblem('Update Failed', error?.message || 'The app update could not be started.');
            return false;
        }
    }

    private async getInstalledVersion(): Promise<InstalledAppVersion> {
        const platform = Capacitor.getPlatform();

        try {
            const info = await App.getInfo();

            return {
                platform,
                packageName: info.id || 'com.enforcemnetpro.app',
                versionName: info.version || this.constants.APP_VERSION,
                versionCode: this.parseVersionCode(info.build)
            };
        } catch {
            return {
                platform,
                packageName: 'com.enforcemnetpro.app',
                versionName: this.constants.APP_VERSION,
                versionCode: 0
            };
        }
    }

    private normaliseManifest(response: any): MobileAppUpdateManifest {
        const raw = response?.data ?? response ?? {};

        return {
            platform: raw.platform,
            latestVersionName: raw.latestVersionName ?? raw.latestVersion ?? raw.version ?? raw.app_version,
            latestVersionCode: this.parseOptionalVersionCode(raw.latestVersionCode ?? raw.latestBuild ?? raw.versionCode ?? raw.build),
            minimumSupportedVersionCode: this.parseOptionalVersionCode(raw.minimumSupportedVersionCode ?? raw.minimumSupportedBuild ?? raw.minVersionCode),
            updateAvailable: this.parseOptionalBoolean(raw.updateAvailable),
            forceUpdate: this.parseOptionalBoolean(raw.forceUpdate ?? raw.required),
            apkUrl: raw.apkUrl ?? raw.downloadUrl ?? raw.url,
            apkSha256: raw.apkSha256 ?? raw.sha256,
            apkSizeBytes: this.parseOptionalVersionCode(raw.apkSizeBytes ?? raw.fileSizeBytes),
            releaseNotes: raw.releaseNotes,
            publishedAt: raw.publishedAt
        };
    }

    private isUpdateAvailable(current: InstalledAppVersion, manifest: MobileAppUpdateManifest): boolean {
        const minimumSupportedVersionCode = manifest.minimumSupportedVersionCode;
        const latestVersionCode = manifest.latestVersionCode;

        if (minimumSupportedVersionCode !== undefined && current.versionCode > 0 && current.versionCode < minimumSupportedVersionCode) {
            return true;
        }

        if (manifest.updateAvailable === true) {
            return true;
        }

        if (manifest.forceUpdate === true) {
            return true;
        }

        if (latestVersionCode !== undefined && current.versionCode > 0) {
            return latestVersionCode > current.versionCode;
        }

        if (manifest.latestVersionName) {
            return manifest.latestVersionName !== current.versionName;
        }

        return false;
    }

    private parseVersionCode(value: any): number {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
    }

    private parseOptionalVersionCode(value: any): number | undefined {
        if (value === null || value === undefined || value === '') {
            return undefined;
        }

        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.trunc(parsed) : undefined;
    }

    private parseOptionalBoolean(value: any): boolean | undefined {
        if (value === null || value === undefined || value === '') {
            return undefined;
        }

        if (typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            return ['1', 'true', 'yes'].includes(value.toLowerCase());
        }

        return Boolean(value);
    }

    private async presentUpdateProblem(header: string, message: string): Promise<void> {
        if (this.lastAlertMessage === message) {
            return;
        }

        this.lastAlertMessage = message;

        const alert = await this.alertController.create({
            header,
            message,
            backdropDismiss: false,
            buttons: ['Okay']
        });

        await alert.present();
    }
}
