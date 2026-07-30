import { registerPlugin } from '@capacitor/core';

export interface InstallApkOptions {
    apkUrl: string;
    sha256?: string;
    packageName?: string;
}

export interface InstallApkResult {
    status: 'install_requested';
    apkVersionCode?: number;
    apkVersionName?: string;
    packageName?: string;
}

export interface AppUpdaterPlugin {
    installApk(options: InstallApkOptions): Promise<InstallApkResult>;
}

export const AppUpdater = registerPlugin<AppUpdaterPlugin>('AppUpdater');
