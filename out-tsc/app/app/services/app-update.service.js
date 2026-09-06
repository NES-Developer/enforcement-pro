import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../environments/environment';
import { AppUpdater } from '../native/app-updater.plugin';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/app-http.service";
import * as i2 from "@ionic/angular";
import * as i3 from "./constants.service";
export class AppUpdateService {
    constructor(appHttp, alertController, constants) {
        this.appHttp = appHttp;
        this.alertController = alertController;
        this.constants = constants;
        this.checkTimeoutMs = 20000;
        this.dismissedKey = 'ep_dismissed_update_code';
        this.installStarted = false;
        this.lastAlertMessage = '';
        this.promptOpen = false;
    }
    async getInstalledVersion() {
        const platform = Capacitor.getPlatform();
        const fallback = {
            platform,
            packageName: 'com.enforcemnetpro.app',
            versionName: this.constants.APP_VERSION,
            versionCode: this.constants.APP_VERSION_CODE
        };
        try {
            const info = await Promise.race([
                App.getInfo(),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('version-timeout')), 1500);
                })
            ]);
            return {
                platform,
                packageName: info.id || fallback.packageName,
                versionName: info.version || fallback.versionName,
                versionCode: this.parseVersionCode(info.build) || fallback.versionCode
            };
        }
        catch {
            return fallback;
        }
    }
    async check(reason) {
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
        }
        catch (error) {
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
    async checkAndInstallIfNeeded(reason) {
        return this.checkAndPromptIfNeeded(reason);
    }
    async checkAndPromptIfNeeded(reason) {
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
    async install(manifest) {
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
    formatApkSize(bytes) {
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
    async runPromptedCheck(reason) {
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
        const installStarted = await this.presentUpdatePrompt(result.current, result.manifest, result.forceUpdate);
        return {
            ...result,
            installStarted
        };
    }
    async fetchManifest(current, reason) {
        const params = new URLSearchParams({
            platform: 'android',
            packageName: current.packageName,
            currentVersionName: current.versionName,
            currentVersionCode: String(current.versionCode || 0),
            reason
        });
        const response = await this.appHttp.request('GET', `${environment.mobileUpdateCheckUrl}?${params.toString()}`, undefined, {
            auth: false,
            timeoutMs: this.checkTimeoutMs
        });
        return this.normaliseManifest(response);
    }
    async installUpdate(current, manifest) {
        const downloadUrl = (manifest.apkUrl || '').trim();
        if (current.platform !== 'android') {
            await this.presentUpdateProblem(manifest.forceUpdate ? 'Update required' : 'Update available', 'A new app version is published, but automatic install is only available on Android devices.');
            return false;
        }
        if (!downloadUrl) {
            await this.presentUpdateProblem('Update required', 'The server reported a new app version but did not include a public APK URL.');
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
        }
        catch (error) {
            this.installStarted = false;
            await this.presentUpdateProblem('Update failed', error?.message || 'The app update could not be started.');
            return false;
        }
    }
    async presentUpdatePrompt(current, manifest, forceUpdate) {
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
        return new Promise(async (resolve) => {
            let settled = false;
            let installing = false;
            const finish = (installStarted) => {
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
    wasDismissed(manifest) {
        const versionCode = manifest.latestVersionCode;
        if (!versionCode) {
            return false;
        }
        return this.readDismissedVersionCode() === versionCode;
    }
    dismissOptional(manifest) {
        if (!manifest.latestVersionCode) {
            return;
        }
        try {
            localStorage.setItem(this.dismissedKey, String(manifest.latestVersionCode));
        }
        catch {
            // Ignore storage failures; the next check can ask again.
        }
    }
    readDismissedVersionCode() {
        try {
            return this.parseVersionCode(localStorage.getItem(this.dismissedKey));
        }
        catch {
            return 0;
        }
    }
    normaliseManifest(response) {
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
    isUpdateAvailable(current, manifest) {
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
    isForceUpdate(current, manifest) {
        if (manifest.forceUpdate === true || manifest.isRequired === true) {
            return true;
        }
        const minimumSupportedVersionCode = manifest.minimumSupportedVersionCode;
        return minimumSupportedVersionCode !== undefined
            && current.versionCode > 0
            && current.versionCode < minimumSupportedVersionCode;
    }
    emptyResult(checked) {
        return {
            checked,
            updateAvailable: false,
            forceUpdate: false,
            installStarted: false
        };
    }
    parseVersionCode(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
    }
    parseOptionalVersionCode(value) {
        if (value === null || value === undefined || value === '') {
            return undefined;
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) ? Math.trunc(parsed) : undefined;
    }
    parseOptionalBoolean(value) {
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
    async presentUpdateProblem(header, message) {
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
    static { this.ɵfac = function AppUpdateService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppUpdateService)(i0.ɵɵinject(i1.AppHttpService), i0.ɵɵinject(i2.AlertController), i0.ɵɵinject(i3.ConstantsService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AppUpdateService, factory: AppUpdateService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppUpdateService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.AppHttpService }, { type: i2.AlertController }, { type: i3.ConstantsService }], null); })();
//# sourceMappingURL=app-update.service.js.map