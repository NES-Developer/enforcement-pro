import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { Site } from '../../models/site';
import { Zone } from '../../models/zone';
import { AppLog } from '../../models/app-log';
import { ApiService } from '../../services/enforcementpro/api.service';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { SiteOffence } from '../../models/site-offence';
import { Observable, Subscriber, interval } from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { Login } from '../../models/login';
//import * as L from 'leaflet';
import { ConstantsService } from '../../services/constants.service';
import { User } from '../../models/user';
import { App } from '@capacitor/app';
import { EnviroPost } from 'src/app/models/enviro';
import { LoadingService } from 'src/app/services/loading.service';
import { BackgroundTaskService } from '../../services/background-task.service';
import { TrackingService } from '../../services/tracking.service';
import { AppUpdateCheckResult, AppUpdateService } from '../../services/app-update.service';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

    api_app_version: string = "";
    api_app_url: string = "";
    app_version_code: number = this.constantsService.APP_VERSION_CODE;
    releaseNotes: string = "";
    apkSizeLabel: string = "";
    updateAvailable = false;
    forceUpdate = false;
    checkingUpdate = false;
    installingUpdate = false;
    updateStatusLabel = 'Checking server…';

    map: any;
    selected_site!: Site;
    selected_zone: Zone | null = null;

    zones: Zone[] = [];
    sites: Site[] = [];

    position_lng: string = "0";
    position_lat: string = "0";

    device_id: string = "0";
    site_id: number = 0;

    app_log: AppLog;
    app_version: string = this.constantsService.APP_VERSION;

    // app_version: str

    constructor(
        private auth: AuthService,
        private data: DataService,
        private router: Router,
        private api: ApiService,
        private alertController: AlertController,
        private constantsService: ConstantsService,
        private platform: Platform,
        private loading:LoadingService,
        private backgroundTasks: BackgroundTaskService,
        private tracking: TrackingService,
        private appUpdate: AppUpdateService


    ) {
        // this.auth.checkLoggedIn();

        this.platform.ready().then(() => {
            this.blockBackButton();
        });

        this.app_log = new AppLog;
    }

    async ngOnInit() {
        await this.data.init();

        this.init();

        this.ping();
        this.backgroundTasks.setInterval(() => {
            this.ping();
        }, 30000); // 30 seconds in milliseconds
    }

    blockBackButton() {
        this.backgroundTasks.registerSubscription(
            this.platform.backButton.subscribeWithPriority(9999, () => {})
        );
    }

    init() {
        if (!this.data.checkFPNData()){
            this.getFPNData();
        }

        if (this.data.checkSelectedSite() == false) {
            this.navigate('site');
        }   
        
        void this.refreshInstalledVersion();
        void this.checkForUpdate(false);

        this.loadData();
    }

    get updateBusy(): boolean {
        return this.checkingUpdate || this.installingUpdate;
    }

    async refreshInstalledVersion(): Promise<void> {
        const current = await this.appUpdate.getInstalledVersion();
        this.app_version = current.versionName;
        this.app_version_code = current.versionCode;
    }

    async checkForUpdate(showFeedback = true): Promise<void> {
        if (this.updateBusy) {
            return;
        }

        this.checkingUpdate = true;

        try {
            const result = await this.appUpdate.check('settings');
            this.applyUpdateResult(result);

            if (showFeedback && result.error) {
                await this.presentAlert('Update check failed', result.error);
            } else if (showFeedback && !result.updateAvailable) {
                await this.presentAlert('Up to date', 'This device is already on the published Android version.');
            }
        } finally {
            this.checkingUpdate = false;
        }
    }

    async installPublishedUpdate(): Promise<void> {
        if (this.updateBusy) {
            return;
        }

        this.installingUpdate = true;

        try {
            const result = await this.appUpdate.install();
            this.applyUpdateResult(result);

            if (result.installStarted) {
                await this.presentAlert('Install started', 'Android will ask you to confirm the update.');
            } else if (result.error) {
                await this.presentAlert('Update failed', result.error);
            }
        } finally {
            this.installingUpdate = false;
        }
    }

    private applyUpdateResult(result: AppUpdateCheckResult): void {
        if (result.current) {
            this.app_version = result.current.versionName;
            this.app_version_code = result.current.versionCode;
        }

        const manifest = result.manifest;
        if (manifest) {
            this.api_app_version = manifest.latestVersionName || '';
            this.api_app_url = manifest.apkUrl || '';
            this.releaseNotes = (manifest.releaseNotes || '').trim();
            this.apkSizeLabel = this.appUpdate.formatApkSize(manifest.apkSizeBytes);
            this.data.setApiAppVersion(this.api_app_version);
            this.data.setApiAppUrl(this.api_app_url);
        }

        this.updateAvailable = !!result.updateAvailable;
        this.forceUpdate = !!result.forceUpdate;
        this.updateStatusLabel = result.error
            ? 'Could not reach the update server'
            : this.updateAvailable
                ? (this.forceUpdate ? 'Required update' : 'Update available')
                : 'Up to date';
    }

    autoLogin() {
        let login: Login = this.data.getLogin();

        this.auth.login(login.id, login.pin).subscribe(
            (response) => {
                if(response.error_code) {
                    let message: string = response.message;
                    this.presentAlert("Login Attempt Failed", "Please Logout and Login again.")
                } else if (response.access_token !== '' || response.user) {
                     this.auth.handleLoginResponse(response);
                }
            },
            (error) => {
                this.presentAlert("Login Attempt Failed", "Please Logout and Login again.")
            }
        );
    }

    downloadFile() {
        void this.installPublishedUpdate();
    }

    

    storeAppLog() {

        this.app_log.device_id = this.device_id;
        this.app_log.site_id = this.site_id.toString();

        if (this.selected_zone?.id) {
            this.data.setSelectedZone(this.selected_zone);
            this.data.clearZoneDetectionStatus();

            let enviro_data = this.data.getEnviroPost();
            if (enviro_data && enviro_data.zone_id <= 0) {
                enviro_data.zone_id = Number(this.selected_zone.id);
                this.data.setEnviroPost(enviro_data);
            }
        }


        let user: any = this.auth.getUser();
        if (user !== '') {
            this.app_log.user_id = user.id.toString();
        }

        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.app_log.lat = position.latitude;
            this.position_lat = position.latitude;
            this.app_log.lng = position.longitude;
            this.position_lng = position.longitude;
        });

        this.data.setAppLog(this.app_log);
    }


    getFPNData(): void {
        let site: any = this.data.getSelectedSite();
        let site_id: number = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                this.data.applyFPNData(data);
                this.zones = this.data.getZones();
            },
            error: (error) => {
                console.error('Error fetching SR Data:', error);
                // Handle error as needed
            }
        });
    }

    extractOffence(site_offences: SiteOffence[]): Offence[] {
        const groups = site_offences.map(site_offence => site_offence.offences);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as Offence);
    }

    extractOffenceGroups(offences: Offence[]): OffenceGroup[] {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as OffenceGroup);
    }

    loadData() {
        this.selected_site = this.data.getSelectedSite();
        this.selected_zone = this.data.getSelectedZone();
        this.site_id = this.selected_site.id;

        this.api_app_version = this.data.getApiAppVersion();
        this.api_app_url = this.data.getApiAppUrl();

        this.sites = this.data.getSites();
        this.zones = this.data.getZones();

        if (this.data.checkAppLog()) {
            this.app_log = this.data.getAppLog();
            this.device_id = this.app_log.device_id;
        } 

        this.storeAppLog();

        // this.app_version = this.constantsService.APP_VERSION;
        // console.log('App Version:', this.constantsService.APP_VERSION);

    }

    private getCurrentPosition(): any {
        return new Observable((observer: Subscriber<any>) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: any) => {
            observer.next({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            observer.complete();
            });
        } else {
            observer.error();
        }
        });
    }


    navigate(route: string){
        this.router.navigate([route]);
    }
  

    currentStep: number = 1;

    nextStep() {
        if (this.currentStep < 4) {
        this.currentStep++;
        }
    } 

    previousStep() {
        if (this.currentStep > 1) {
        this.currentStep--;
        }
    }

    ping() {
        this.tracking.pingNow().catch(() => undefined);
    }

    forceCloseApp() {
        App.exitApp(); // Force closes the app
    }

    cancelEnvio() {
        let enviro_post = new EnviroPost();
        this.data.setEnviroPost(enviro_post);
    }

    getEnviroSizeInBytes(): number {
        let enviro_data = this.data.getEnviroPost();
        const json = JSON.stringify(enviro_data);
        return new Blob([json]).size; // gives exact byte size
    }    

    async presentAlert(header: string, message: string) {
        let primary_button_title: string = 'Ok';
        let secondary_button_title: string = 'Cancel';
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: primary_button_title,
                },
                {
                    text: secondary_button_title,
                }
            ],
        });
        await alert.present();
    }

}
