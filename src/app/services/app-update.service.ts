import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { AppUpdater } from '../native/app-updater.plugin';
import { AppHttpService } from './enforcementpro/app-http.service';
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
    isRequired?: boolean;
    apkUrl?: string;
    apkSha256?: string;
    apkSizeBytes?: number;
    releaseNotes?: string;
    publishedAt?: string;
    message?: string;
}

export interface AppUpdateCheckResult {
    checked: boolean;
    updateAvailable: boolean;
    forceUpdate: boolean;
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
    private readonly dismissedKey = 'ep_dismissed_update_code';
    private inFlight?: Promise<AppUpdateCheckResult>;
    private installStarted = false;
    private lastAlertMessage = '';
    private promptOpen = false;

    constructor(
        private appHttp: AppHttpService,
        private alertController: AlertController,
        private constants: ConstantsService
    ) {}

    async getInstalledVersion(): Promise<InstalledAppVersion> {
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

    async check(reason: AppUpdateCheckReason): Promise<AppUpdateCheckResult> {
        if (!environment.mobileUpdateCheckEnabled) {
            return this.emptyResult(false);
        }

        const current = await this.getInstalledVersion();

        try {
            const manifest = await this.fetchManifest(current, reason);
            const updateAvailable = this.isUpdateAvailable(current, manifest);
            const forceUpdate = this.isForceUpdate(current, manifest);

            return {
                checked: true,
                updateAvailable,
                forceUpdate,
                installStarted: false,
                current,
                manifest
            };
        } catch (error: any) {
            if (error?.status === 404) {
                return {
                    checked: true,
                    updateAvailable: false,
                    forceUpdate: false,
                    installStarted: false,
                    current
                };
            }

            return {
                checked: false,
                updateAvailable: false,
                forceUpdate: false,
                installStarted: false,
                current,
                error: error?.message || 'Unable to check for app updates.'
            };
        }
    }

    async checkAndInstallIfNeeded(reason: AppUpdateCheckReason): Promise<AppUpdateCheckResult> {
        return this.checkAndPromptIfNeeded(reason);
    }

    async checkAndPromptIfNeeded(reason: AppUpdateCheckReason): Promise<AppUpdateCheckResult> {
        if (this.installStarted) {
            return {
                checked: false,
                updateAvailable: true,
                forceUpdate: true,
                installStarted: true
            };
        }

        if (this.inFlight) {
            return this.inFlight;
        }

        this.inFlight = this.runPromptedCheck(reason).finally(() => {
            this.inFlight = undefined;
        });

        return this.inFlight;
    }

    async install(manifest?: MobileAppUpdateManifest): Promise<AppUpdateCheckResult> {
        const current = await this.getInstalledVersion();
        const nextManifest = manifest || (await this.check('settings')).manifest;

        if (!nextManifest) {
            return {
                checked: true,
                updateAvailable: false,
                forceUpdate: false,
                installStarted: false,
                current,
                error: 'No published update is available.'
            };
        }

        const installStarted = await this.installUpdate(current, nextManifest);

        return {
            checked: true,
            updateAvailable: this.isUpdateAvailable(current, nextManifest),
            forceUpdate: this.isForceUpdate(current, nextManifest),
            installStarted,
            current,
            manifest: nextManifest,
            error: installStarted ? undefined : 'The app update could not be started.'
        };
    }

    formatApkSize(bytes?: number): string {
        if (!bytes || bytes <= 0) {
            return '';
        }

        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unit = 0;

        while (size >= 1024 && unit < units.length - 1) {
            size /= 1024;
            unit++;
        }

        return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
    }

    private async runPromptedCheck(reason: AppUpdateCheckReason): Promise<AppUpdateCheckResult> {
        const result = await this.check(reason);

        if (!result.checked || !result.updateAvailable || !result.manifest) {
            return result;
        }

        if (reason === 'settings') {
            return result;
        }

        const backgroundOnlyForce = reason === 'app-log' || reason === 'fpn-data-fetch';
        if (backgroundOnlyForce && !result.forceUpdate) {
            return result;
        }

        if (!result.forceUpdate && this.wasDismissed(result.manifest)) {
            return result;
        }

        const installStarted = await this.presentUpdatePrompt(result.current!, result.manifest, result.forceUpdate);

        return {
            ...result,
            installStarted
        };
    }

    private async fetchManifest(current: InstalledAppVersion, reason: AppUpdateCheckReason): Promise<MobileAppUpdateManifest> {
        const params = new URLSearchParams({
            platform: 'android',
            packageName: current.packageName,
            currentVersionName: current.versionName,
            currentVersionCode: String(current.versionCode || 0),
            reason
        });

        const response = await this.appHttp.request(
            'GET',
            `${environment.mobileUpdateCheckUrl}?${params.toString()}`,
            undefined,
            {
                auth: false,
                timeoutMs: this.checkTimeoutMs
            }
        );

        return this.normaliseManifest(response);
    }

    private async installUpdate(current: InstalledAppVersion, manifest: MobileAppUpdateManifest): Promise<boolean> {
        const downloadUrl = (manifest.apkUrl || '').trim();

        if (current.platform !== 'android') {
            await this.presentUpdateProblem(
                manifest.forceUpdate ? 'Update required' : 'Update available',
                'A new app version is published, but automatic install is only available on Android devices.'
            );
            return false;
        }

        if (!downloadUrl) {
            await this.presentUpdateProblem(
                'Update required',
                'The server reported a new app version but did not include a public APK URL.'
            );
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
            await this.presentUpdateProblem('Update failed', error?.message || 'The app update could not be started.');
            return false;
        }
    }

    private async presentUpdatePrompt(current: InstalledAppVersion, manifest: MobileAppUpdateManifest, forceUpdate: boolean): Promise<boolean> {
        if (this.promptOpen) {
            return false;
        }

        this.promptOpen = true;

        const versionLabel = manifest.latestVersionName || 'a new version';
        const notes = (manifest.releaseNotes || '').trim();
        const size = this.formatApkSize(manifest.apkSizeBytes);
        const message = [
            forceUpdate
                ? `This device must install ${versionLabel} before it can keep being used.`
                : `${versionLabel} is ready to install.`,
            size ? `Size: ${size}` : '',
            notes
        ].filter(Boolean).join('\n\n');

        return new Promise<boolean>(async (resolve) => {
            let settled = false;
            let installing = false;
            const finish = (installStarted: boolean) => {
                if (settled) {
                    return;
                }

                settled = true;
                resolve(installStarted);
            };
            const startInstall = () => {
                installing = true;
                void this.installUpdate(current, manifest).then(finish);
            };

            const alert = await this.alertController.create({
                header: forceUpdate ? 'Update required' : 'Update available',
                message,
                backdropDismiss: !forceUpdate,
                buttons: forceUpdate
                    ? [{
                        text: 'Install',
                        handler: startInstall
                    }]
                    : [
                        {
                            text: 'Later',
                            role: 'cancel',
                            handler: () => {
                                this.dismissOptional(manifest);
                                finish(false);
                            }
                        },
                        {
                            text: 'Install',
                            handler: startInstall
                        }
                    ]
            });

            alert.onDidDismiss().then(() => {
                this.promptOpen = false;
                if (!installing) {
                    if (!forceUpdate) {
                        this.dismissOptional(manifest);
                    }
                    finish(false);
                }
            });

            await alert.present();
        });
    }

    private wasDismissed(manifest: MobileAppUpdateManifest): boolean {
        const versionCode = manifest.latestVersionCode;
        if (!versionCode) {
            return false;
        }

        return this.readDismissedVersionCode() === versionCode;
    }

    private dismissOptional(manifest: MobileAppUpdateManifest): void {
        if (!manifest.latestVersionCode) {
            return;
        }

        try {
            localStorage.setItem(this.dismissedKey, String(manifest.latestVersionCode));
        } catch {
            // Ignore storage failures; the next check can ask again.
        }
    }

    private readDismissedVersionCode(): number {
        try {
            return this.parseVersionCode(localStorage.getItem(this.dismissedKey));
        } catch {
            return 0;
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
            forceUpdate: this.parseOptionalBoolean(raw.forceUpdate ?? raw.required ?? raw.isRequired),
            isRequired: this.parseOptionalBoolean(raw.isRequired ?? raw.forceUpdate),
            apkUrl: raw.apkUrl ?? raw.downloadUrl ?? raw.url,
            apkSha256: raw.apkSha256 ?? raw.sha256,
            apkSizeBytes: this.parseOptionalVersionCode(raw.apkSizeBytes ?? raw.fileSizeBytes),
            releaseNotes: raw.releaseNotes,
            publishedAt: raw.publishedAt,
            message: raw.message
        };
    }

    isUpdateAvailable(current: InstalledAppVersion, manifest: MobileAppUpdateManifest): boolean {
        if (this.isForceUpdate(current, manifest)) {
            return true;
        }

        if (manifest.updateAvailable === true) {
            return true;
        }

        const latestVersionCode = manifest.latestVersionCode;
        if (latestVersionCode !== undefined && current.versionCode > 0) {
            return latestVersionCode > current.versionCode;
        }

        if (manifest.latestVersionName) {
            return manifest.latestVersionName !== current.versionName;
        }

        return false;
    }

    isForceUpdate(current: InstalledAppVersion, manifest: MobileAppUpdateManifest): boolean {
        if (manifest.forceUpdate === true || manifest.isRequired === true) {
            return true;
        }

        const minimumSupportedVersionCode = manifest.minimumSupportedVersionCode;
        return minimumSupportedVersionCode !== undefined
            && current.versionCode > 0
            && current.versionCode < minimumSupportedVersionCode;
    }

    private emptyResult(checked: boolean): AppUpdateCheckResult {
        return {
            checked,
            updateAvailable: false,
            forceUpdate: false,
            installStarted: false
        };
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
