import { TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { AppUpdateService } from './app-update.service';
import { ConstantsService } from './constants.service';
import { AppHttpService } from './enforcementpro/app-http.service';

describe('AppUpdateService', () => {
    let service: AppUpdateService;
    let appHttp: jasmine.SpyObj<AppHttpService>;
    let alerts: jasmine.SpyObj<AlertController>;

    beforeEach(() => {
        appHttp = jasmine.createSpyObj('AppHttpService', ['request']);
        alerts = jasmine.createSpyObj('AlertController', ['create']);
        alerts.create.and.resolveTo({
            present: async () => undefined,
            onDidDismiss: () => Promise.resolve()
        } as any);

        TestBed.configureTestingModule({
            providers: [
                AppUpdateService,
                ConstantsService,
                { provide: AppHttpService, useValue: appHttp },
                { provide: AlertController, useValue: alerts }
            ]
        });

        service = TestBed.inject(AppUpdateService);
    });

    it('asks the published-update API without auth and treats a newer version as available', async () => {
        appHttp.request.and.resolveTo({
            latestVersionName: '1.1.0',
            latestVersionCode: 13,
            minimumSupportedVersionCode: 10,
            updateAvailable: true,
            forceUpdate: false,
            apkUrl: 'https://app.enforcementpro.co.uk/mobile-updates/enforcementpro-1.1.0.apk',
            releaseNotes: 'Camera fixes'
        });

        const result = await service.check('settings');

        expect(result.checked).toBeTrue();
        expect(result.updateAvailable).toBeTrue();
        expect(result.forceUpdate).toBeFalse();
        expect(result.manifest?.latestVersionName).toBe('1.1.0');
        expect(appHttp.request).toHaveBeenCalledWith(
            'GET',
            jasmine.stringMatching(/\/api\/mobile-app-updates\/latest\?.*platform=android/),
            undefined,
            jasmine.objectContaining({ auth: false })
        );
    });

    it('treats a 404 as no published update', async () => {
        appHttp.request.and.rejectWith({ status: 404, message: 'No published mobile app update is available.' });

        const result = await service.check('login-page');

        expect(result.checked).toBeTrue();
        expect(result.updateAvailable).toBeFalse();
        expect(result.forceUpdate).toBeFalse();
        expect(result.error).toBeUndefined();
    });

    it('marks a required update when the server says the device is below the minimum', async () => {
        appHttp.request.and.resolveTo({
            latestVersionName: '2.0.0',
            latestVersionCode: 20,
            minimumSupportedVersionCode: 18,
            updateAvailable: true,
            forceUpdate: true
        });

        const result = await service.check('app-start');

        expect(result.updateAvailable).toBeTrue();
        expect(result.forceUpdate).toBeTrue();
    });

    it('does not auto-install from settings checks', async () => {
        appHttp.request.and.resolveTo({
            latestVersionName: '1.1.0',
            latestVersionCode: 13,
            updateAvailable: true,
            forceUpdate: false,
            apkUrl: 'https://app.enforcementpro.co.uk/mobile-updates/enforcementpro-1.1.0.apk'
        });

        const result = await service.checkAndPromptIfNeeded('settings');

        expect(result.updateAvailable).toBeTrue();
        expect(result.installStarted).toBeFalse();
        expect(alerts.create).not.toHaveBeenCalled();
    });

    it('compares installed and published version codes', () => {
        const current = {
            platform: 'android',
            packageName: 'com.enforcemnetpro.app',
            versionName: '1.0.0',
            versionCode: 12
        };

        expect(service.isUpdateAvailable(current, { latestVersionCode: 13 })).toBeTrue();
        expect(service.isUpdateAvailable(current, { latestVersionCode: 12 })).toBeFalse();
        expect(service.isForceUpdate(current, { minimumSupportedVersionCode: 13 })).toBeTrue();
        expect(service.isForceUpdate(current, { minimumSupportedVersionCode: 10 })).toBeFalse();
    });
});
