import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { Site } from '../../models/site';
import { Zone } from '../../models/zone';
import { AppLog } from '../../models/app-log';
import { ApiService } from '../../services/enforcementpro/api.service';
import { Weather } from '../../models/weather';
import { POIPrefix } from '../../models/poi-prefix';
import { Visibility } from '../../models/visibility';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { SiteOffence } from '../../models/site-offence';
import { Observable, Subscriber, interval } from 'rxjs';
import { AlertController, Platform } from '@ionic/angular';
import { Login } from '../../models/login';
import { ZoneDetection } from '../../models/zone-detection';
//import * as L from 'leaflet';
import { ConstantsService } from '../../services/constants.service';
import { User } from '../../models/user';
import { App } from '@capacitor/app';
import { EnviroPost } from 'src/app/models/enviro';
import { LoadingService } from 'src/app/services/loading.service';
import { BackgroundTaskService } from '../../services/background-task.service';
import { TrackingService } from '../../services/tracking.service';
import { AppUpdateService } from '../../services/app-update.service';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.page.html',
    styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

    api_app_version: string = "";
    api_app_url: string = "";

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
        
        if (this.data.checkApiAppVersion() == false) {
            this.getVersion();
        }

        this.loadData();
    }

    async getVersion(): Promise<void>
    {
        const result = await this.appUpdate.checkAndInstallIfNeeded('settings');
        const manifest = result.manifest;

        if (manifest) {
            this.api_app_version = manifest.latestVersionName || '';
            this.api_app_url = manifest.apkUrl || '';
            this.data.setApiAppVersion(this.api_app_version);
            this.data.setApiAppUrl(this.api_app_url);
        }
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
        this.appUpdate.checkAndInstallIfNeeded('settings').catch(() => undefined);
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
                this.data.removeEnviroLookUps()


                let salutations = data.data.salutations;
                this.data.setSalutations(salutations);

                let fpn_number_and_barcode = data.data.fpn_number_offline_printer;
                this.data.setFPNNumberOfflinePrinter(fpn_number_and_barcode);

                let builds = data.data.builds;
                this.data.setBuilds(builds);

                let hair_colours = data.data.hair_colors;//Please leave spelling as is, returned as 'hair_colors' app uses it as 'hair_colours'
                this.data.setHairColors(hair_colours);

                this.zones = data.data.zones;
                this.data.setZones(this.zones);

                let offence_how = data.data.offence_how;
                this.data.setOffenceHow(offence_how);

                let offence_location_suffix = data.data.offence_location_suffix;
                this.data.setOffenceLocationSuffix(offence_location_suffix);

                let address_verified_by = data.data.address_verified_via;
                this.data.setAddressVerifiedBy(address_verified_by);

                let ethnicities = data.data.ethnicities;
                this.data.setEthnicities(ethnicities);

                let id_shown = data.data.id_shown;
                this.data.setIdShown(id_shown);

                let weather: Weather[] = data.data.weathers;
                this.data.setWeather(weather);

                let visibility: Visibility[] = data.data.visibility;
                this.data.setVisibility(visibility);

                let poi_prefix: POIPrefix[] = data.data.poi_prefix;
                this.data.setPOIPrefix(poi_prefix);

                let site_offence = data.data.site_offences;
                this.data.setSiteOffences(site_offence);

                let offences = this.extractOffence(site_offence);
                this.data.setOffences(offences);

                let offenceGroups = this.extractOffenceGroups(offences);
                this.data.setOffenceGroups(offenceGroups);

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
        this.api_app_url = this.data.getApiAppVersion();

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

    deviceValidation() {
        this.api.deviceValidation(this.app_log.device_id).subscribe({
            next: (response) => {
                // console.log('Response:', response);
                // Handle the response here
                let message = response.message;
                if(response.success === false) 
                {
                    this.presentAlert('Error', response.msg);

                } else {
                    this.storeAppLog();
                    
                    this.presentAlert('Success', response.msg);
                }
            },
            error: (error) => {
                console.error('Error:', error);
                this.presentAlert('Error', 'Server Error: ' + error.message );
            }
        });
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

    ZoneDetection() {

        let zone_detection = new ZoneDetection();

        zone_detection.lat = this.app_log.lat;
        zone_detection.lng = this.app_log.lng;

        let site = this.data.getSelectedSite();
        zone_detection.site_id = site.id.toString();

        

        this.api.zoneDetection(zone_detection).subscribe({
            next: (response) => {
                if (response.success === false){

                    this.data.setZoneDetectionStatus({
                        code: 'not_in_zone',
                        message: response.message || 'You are not in a zone. Please select a zone.',
                        updated_at: new Date().toISOString()
                    });
                    this.presentAlert('Error', response.message);
                } else {


                    this.selected_zone = {
                        ...response,
                        id: Number(response.id)
                    };
                    this.data.setSelectedZone(this.selected_zone);
                    this.data.clearZoneDetectionStatus();
                    this.data.setAppLog(this.app_log);

                    let enviro_data = this.data.getEnviroPost();
                    enviro_data.zone_id = Number(response.id);
                    this.data.setEnviroPost(enviro_data);


                    this.presentAlert('Success', 'We found your zone, your at: ' + response.name);
                    this.storeAppLog();

                    this.ping();

                }
            },
            error: () => {
                this.data.setZoneDetectionStatus({
                    code: 'network',
                    message: 'Unable to confirm your zone. Please select a zone.',
                    updated_at: new Date().toISOString()
                });
            }
        });
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
