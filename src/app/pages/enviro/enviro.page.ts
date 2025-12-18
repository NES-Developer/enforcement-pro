
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { OffenceGroup } from '../../models/offence-group';
import { Offence } from '../../models/offence';
import { SiteOffence } from '../../models/site-offence';
import { Weather } from '../../models/weather';
import { Visibility } from '../../models/visibility';
import { POIPrefix } from '../../models/poi-prefix';
import { EnviroPost } from '../../models/enviro';
import { AlertController, Platform } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { AppLauncher } from '@capacitor/app-launcher';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
// import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { User } from '../../models/user';
import { Observable, Subscriber, timeout } from 'rxjs';

import { App as CapacitorApp } from '@capacitor/app';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'app-enviro',
    templateUrl: './enviro.page.html',
    styleUrls: ['./enviro.page.scss'],
  })
  export class EnviroPage implements OnInit {

    selected_site: any = null;

     
    appStateListener: any;

    app_log: AppLog;
    map: any;
    currentStep: number = 1;
    enviro_post: EnviroPost;
    fpn: any;
    baseUrl: string = 'https://app.enforcementpro.co.uk/';
    id: any;
    isSubmitting: boolean = false;

    user: User;

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private route2: ActivatedRoute,
        private router: Router,
        private loading:LoadingService,
        private platform: Platform


    ) {
        this.user = new User();
        this.app_log = new AppLog();
        this.enviro_post = new EnviroPost();

        this.platform.ready().then(() => {
            this.blockBackButton();
            // this.listenToAppResume();

        });

        this.loadData();


        this.route2.queryParams.subscribe(params => {
            let currentStep = params['currentStep'] ?? 1; // Fallback to 1 if null or undefined

            if (currentStep !== 1)
            {
                this.currentStep = parseInt(currentStep);
            } 
        });
            


    }

    async ngOnInit() {
        this.loading.showLoading();

        await this.data.init();
    
        this.init();

        this.loading.hideLoading();

    }

    init() {
        setTimeout(() => {
            this.refresh();
        }, 5000);

        setInterval(() => {
            this.ping();
        }, 30000); // 30 seconds in milliseconds
    }

    blockBackButton() {
        this.platform.backButton.subscribeWithPriority(9999, () => {});
    }

    navigate(route: string){
        this.router.navigate([route]);
    }

    route(route: string) {
        this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
    }

    loadData() {
        this.selected_site = this.data.getSelectedSite();
        this.enviro_post = this.data.getEnviroPost();
        this.user = this.data.getUser();
        this.assignOfficerId();
        this.app_log = this.data.getAppLog();
       
        if (!this.data.checkFPNData()){
            this.getFPNData();
        } 
    }

    getFPNData(): void {
        
        this.api.getFPNData(this.selected_site.id).subscribe({
            next: (data) => {

                this.data.removeEnviroLookUps();

                let salutations = data.data.salutations;
                this.data.setSalutations(salutations);

                let fpn_number_and_barcode = data.data.fpn_number_offline_printer;
                this.data.setFPNNumberOfflinePrinter(fpn_number_and_barcode);
                // console.log(fpn_number_and_barcode);

                let builds = data.data.builds;
                this.data.setBuilds(builds);

                let hair_colours = data.data.hair_colors;//Please leave spelling as is, returned as 'hair_colors' app uses it as 'hair_colours'
                this.data.setHairColors(hair_colours);

                let zones = data.data.zones;
                this.data.setZones(zones);

                let offence_how = data.data.offence_how;
                console.log(offence_how);
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

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please contact support');
                } 
                else if (error.status == 401) {
                    this.presentAlert('Wait', 'We are auto-logging you in. Please wait.');
                    this.auth.autoLogin(); 
                    this.getFPNData();
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please place in que, find better reception and try again.');
                } 
                else 
                {
                    this.presentAlert('Error', error.message);
                }  
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
    
    validator(): boolean {
        switch (this.currentStep) {
            case 1:
                if (this.enviro_post.zone_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide your Zone.');
                    return false;
                }
                if (this.enviro_post.offence_type_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide the Offence Group.');
                    return false;
                }
                if (this.enviro_post.offence_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide the Offence.');
                    return false;
                }
                break;
            case 2:
                //console.log(this.enviro_post);
                if (this.enviro_post.is_bwc_active == '') {
                    this.presentAlert('Wait!', 'Please provide BWC.');
                    return false;
                }
                if (this.enviro_post.salutation == '') {
                    this.presentAlert('Wait!', 'Please provide offender Salutation.');
                    return false;
                }
                if (this.enviro_post.first_name == '') {
                    this.presentAlert('Wait!', 'Please provide offender First Name.');
                    return false;
                }
                if (this.enviro_post.last_name == '') {
                    this.presentAlert('Wait!', 'Please provide offender Last Name.');
                    return false;
                }
                if (this.enviro_post.address == '') {
                    this.presentAlert('Wait!', 'Please provide offender Address.');
                    return false;
                }
                if (this.enviro_post.town == '') {
                    this.presentAlert('Wait!', 'Please provide offender Town.');
                    return false;
                }
                if (this.enviro_post.county == '') {
                    this.presentAlert('Wait!', 'Please provide offender Country.');
                    return false;
                }
                if (this.enviro_post.post_code == '') {
                    this.presentAlert('Wait!', 'Please provide offender Postal Code.');
                    return false;
                }
                if (this.enviro_post.town == '') {
                    this.presentAlert('Wait!', 'Please provide offender Town.');
                    return false;
                }
                break;
            case 3:
                if (this.enviro_post.proof_of_address == '')
                {
                    this.presentAlert('Wait!', 'Please provide Proof of Address');
                    return false;
                }
                if (this.enviro_post.proof_of_id == '')
                {
                    this.presentAlert('Wait!', 'Please provide Proof of ID');
                    return false;
                }
                break;
            case 4:
                if (this.enviro_post.location_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Location.');
                    return false;
                }
                if (this.enviro_post.action_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Action.');
                    return false;
                }
                if (this.enviro_post.language == '') {
                    this.presentAlert('Wait!', 'Please provide Language.');
                    return false;
                }
                break;
            case 5:
                if (this.enviro_post.offence_location == '') {
                    this.presentAlert('Wait!', 'Please provide Offence Location');
                    return false;
                } 
                if (this.enviro_post.poi == '') {
                    this.presentAlert('Wait!', 'Please provide POI.');
                    return false;
                }
                if (this.enviro_post.land_type_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Land Type.');
                    return false;
                }
                
                if (!this.enviro_post.offence_datetime) {
                    this.presentAlert('Wait!', 'Please provide Offence timestamp.');
                    return false;
                }
                if (!this.enviro_post.issue_datetime) {
                    this.presentAlert('Wait!', 'Please provide Issue timestamp.');
                    return false;
                }
                if (!this.enviro_post.enviro_issued_onspot) {
                    this.presentAlert('Wait!', 'Please provide informantion of issue onspot');
                    return false;
                }
                break;
            case 6:
                if (this.enviro_post.signature == '') {
                    this.presentAlert('Wait!', 'Please provide Signature.');
                    return false;
                }
                if (this.enviro_post.offence_images.length == 0) {
                    this.presentAlert('Wait!', 'Please provide Offence Images.');
                    return false;
                }
                break;
            case 7:
                if (!this.enviro_post.notebook_entries.is_fpn_advised) {
                    this.presentAlert('Wait!', 'Please provide if FPN is adviced.');
                    return false;
                }
                if (!this.enviro_post.notebook_entries.is_fpn_handed) {
                    this.presentAlert('Wait!', 'Please provide if FPN is handed.');
                    return false;
                }
                if (this.enviro_post.notebook_entries.hair == 0) {
                    this.presentAlert('Wait!', 'Please provide hair details.');
                    return false;
                }
                if (this.enviro_post.notebook_entries.gender == '') {
                    this.presentAlert('Wait!', 'Please provide offender Gender.');
                    return false;
                }
                if (this.enviro_post.notebook_entries.visibility_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Visibility.');
                    return false;
                }
                if (this.enviro_post.notebook_entries.weather_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Weather.');
                    return false;
                }
                if (this.enviro_post.notebook_entries.ethnicity_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide offender Ethnicity.');
                    return false;
                }

        }
        return true;
    }


    submitValidator(): boolean {
        if (this.enviro_post.site_id <= 0) {
            this.presentAlert('Wait!', 'Please provide your Site. Please navigate on Home Page');
            this.currentStep = 1;
            return false;
        }
        if (this.enviro_post.zone_id <= 0) {
            this.presentAlert('Wait!', 'Please provide your Zone.');
            this.currentStep = 1;
            return false;
        }
        if (this.enviro_post.offence_type_id <= 0) {
            this.presentAlert('Wait!', 'Please provide the Offence Group.');
            this.currentStep = 1;
            return false;
        }
        if (this.enviro_post.offence_id <= 0) {
            this.presentAlert('Wait!', 'Please provide the Offence.');
            this.currentStep = 1;
            return false;
        }
        if (this.enviro_post.is_bwc_active == '') {
            this.presentAlert('Wait!', 'Please provide BWC.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.salutation == '') {
            this.presentAlert('Wait!', 'Please provide offender Salutation.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.first_name == '') {
            this.presentAlert('Wait!', 'Please provide offender First Name.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.last_name == '') {
            this.presentAlert('Wait!', 'Please provide offender Last Name.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.address == '') {
            this.presentAlert('Wait!', 'Please provide offender Address.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.town == '') {
            this.presentAlert('Wait!', 'Please provide offender Town.');
            this.currentStep = 2;
            return false;

        }
        if (this.enviro_post.county == '') {
            this.presentAlert('Wait!', 'Please provide offender Country.');
            this.currentStep = 2;
            return false;

        }
        if (this.enviro_post.post_code == '') {
            this.presentAlert('Wait!', 'Please provide offender Postal Code.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.town == '') {
            this.presentAlert('Wait!', 'Please provide offender Town.');
            this.currentStep = 2;
            return false;
        }
        if (this.enviro_post.proof_of_address == '')
        {
            this.presentAlert('Wait!', 'Please provide Proof of Address');
            this.currentStep = 3;
            return false;
        }
        if (this.enviro_post.proof_of_id == '')
        {
            this.presentAlert('Wait!', 'Please provide Proof of ID');
            this.currentStep = 3;
            return false;
        }
        if (this.enviro_post.location_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Location.');
            this.currentStep = 4;
            return false;
        }
        if (this.enviro_post.action_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Action.');
            this.currentStep = 4;
            return false;
        }
        if (this.enviro_post.language == '') {
            this.presentAlert('Wait!', 'Please provide Language.');
            this.currentStep = 4;
            return false;
        }
        if (this.enviro_post.offence_location == '') {
            this.presentAlert('Wait!', 'Please provide Offence Location');
            this.currentStep = 5;
            return false;
        } 
        if (this.enviro_post.poi == '') {
            this.presentAlert('Wait!', 'Please provide POI.');
            this.currentStep = 5;
            return false;
        }
        if (this.enviro_post.land_type_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Land Type.');
            this.currentStep = 5;
            return false;
        }
        if (this.enviro_post.enviro_issued_onspot == '') {
            this.presentAlert('Wait!', 'Please provide informantion of issue onspot');
            this.currentStep = 5;
            return false;
        }
        if (this.enviro_post.signature == '') {
            this.presentAlert('Wait!', 'Please provide Signature.');
            this.currentStep = 6;
            return false;
        }
        if (this.enviro_post.offence_images.length == 0) {
            this.presentAlert('Wait!', 'Please provide Offence Images.');
            this.currentStep = 6;
            return false;
        }

        //Set the officer as current logged in user
        if (this.enviro_post.officer_id == 0)
        {
            if (this.user.id == 0)
            {
                this.user = this.data.getUser();
            }
            this.enviro_post.officer_id = this.user.id;
        }
    
        return true;
    }
    
    nextStep() {
        let checker = this.validator();
        if (checker) {
            if (this.currentStep < 7) {
                this.currentStep++;
            }
        }
    } 

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    assignOfficerId() 
    {
        if (this.enviro_post.officer_id == 0) {
            if (this.user && this.user.id > 0) {
                this.app_log.user_id = this.user.id.toString();
                this.enviro_post.officer_id = this.user.id;
            } else {
                this.user = this.data.getUser();
                if (this.user.id > 0) {
                    this.app_log.user_id = this.user.id.toString();
                    this.enviro_post.officer_id = this.user.id;
                }
            }
            this.data.setAppLog(this.app_log);
            this.data.setEnviroPost(this.enviro_post);
        }
    }

    submitForm() {
        if (this.isSubmitting) {
            return;
        }

        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.enviro_post.lat = position.latitude;
            this.enviro_post.lng = position.longitude;
        });

        let checker = this.submitValidator();
        if (checker) {
            this.isSubmitting = true;
            this.loading.showLoading();
            this.offenceSwitcherForserver();
            this.assignOfficerId();
            this.api.postFPN(this.enviro_post).subscribe({
                next: (response) => {
                    this.loading.hideLoading();
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";

                        
                        this.loading.hideLoading();

                        this.offenceSwitcherForserver();
                        this.isSubmitting = false;

                        this.presentAlert('Error', message);

                    } else {
                        this.fpn = response.data;
                        
                        Clipboard.write({
                            string: this.fpn.fpn_number
                        });

                        this.loading.hideLoading();
                        
                        this.isSubmitting = false;

                        this.presentAlert('Success', 'FPN submitted successfully.');

                        this.cancel();
                    }

                },
                error: (error) => {
                    this.offenceSwitcherForserver();

                    this.loading.hideLoading();

                    if (error.status == 500)
                    {
                        this.presentAlert('Server Error', 'Please place in que and report error.');
                    } 
                    else if (error.status == 401) {
                        this.presentAlert('Auth Failed', 'Please try auto-logging you in.');
                        // this.auth.autoLogin(); 
                        // this.submitForm();
                    } 
                    else if (error.status == 0)
                    {
                        
                        if (this.enviro_post.offence_images.length > 1)
                        {
                            let offence_images_length = this.enviro_post.offence_images.length;
                            this.presentAlert('Processing', 'please Wait! Network error, we are compressing your image');
                            this.data.spliceOffenceImageEnviroPost(this.enviro_post.offence_images[offence_images_length - 1])
                            this.submitForm();
                        } else if (this.enviro_post.offence_images.length == 1) {
                            //Compress the image as its base64
                            this.presentAlert('Network Error', 'No internet connection. Please place in que, find better reception and try again.');

                        }
                    } 
                    else 
                    {
                        this.presentAlert('Error', error.message);
                    }   
                }
            });

        }
    }

    offenceSwitcherForserver() {
        let offence = this.enviro_post.offence_id;
        let offence_group = this.enviro_post.offence_type_id;

        this.enviro_post.offence_id = offence_group;
        this.enviro_post.offence_type_id = offence;
    }

    refresh() {
        this.loadData();
    }

    async presentAlert(header: string, message: string) {
        let primary_button_title: string = 'Ok';
        let secondary_button_title: string = 'Cancel';
        if (header == "Success") {
            secondary_button_title = "Print"
        }
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                
                {
                    text: secondary_button_title,
                    handler: () => {
                        if (header == "Success") {
                            this.openOtherApp();
                        }
                    }
                }
            ],
        });
        await alert.present();
    }

    cancel() {
        this.currentStep = 1;       

        this.enviro_post = new EnviroPost();
        this.data.setEnviroPost(this.enviro_post);

        this.router.navigate(['/tabs/fpn'], { queryParams: { currentStep: this.currentStep } });
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

    ping() {
        if (this.app_log == null) {
            this.app_log = this.data.getAppLog();
            if (this.app_log == null) {
                this.app_log = new AppLog();
            }
        }

        if (this.app_log.user_id)
        {
            this.app_log.user_id = this.user.id.toString();
        }
        
        if (this.app_log.site_id)
        {
            this.app_log.site_id = this.selected_site.id.toString();
        }

        this.app_log.zone_id = this.enviro_post.zone_id.toString();

        this.getCurrentPosition()
            .subscribe((position: any) => {
                this.app_log.lat = position.latitude;
                this.app_log.lng = position.longitude;
            });

        this.data.setAppLog(this.app_log);
        
        this.api.postTrack(this.app_log).subscribe({
            next: (response) => {
                // console.log('Response:', response);
                
            },
            error: (error) => {
                // console.error('Error:', error);
            }
        });
    }

    async openOtherApp() {
        try {
            try {
                await AppLauncher.openUrl({
                    url: 'com.example.enforcementproprinter'
                });
            } catch (error) {
                await AppLauncher.openUrl({
                    url: 'com.ahmedelsayed.sunmiprinterapp.test'
                });
            }
        } catch (error) {
          console.error('Error launching app:', error);
          this.presentAlert('Error', 'Cannot find printer app. Navigate manually')
        }
    }

    saveFPN() {
        if (this.isSubmitting) {
            return;
        }

        this.getCurrentPosition()
            .subscribe((position: any) => {
                this.enviro_post.lat = position.latitude;
                this.enviro_post.lng = position.longitude;
            });

        let checker = this.submitValidator();

        if (checker) {
            this.loading.showLoading();
            //this.assignOfficerId();
            let queue = this.data.getEnviroQue();

            if (queue.length < 25) {            
                this.offenceSwitcherForserver();
                this.assignOfficerId();

                this.data.setEnviroPost(this.enviro_post);

                this.data.pushEnviroQue();
                this.loading.hideLoading();

                this.presentAlert('Saved', 'FPN has been captured in Queue');

                this.cancel();

            } else {
                this.loading.hideLoading();
                this.presentAlert('Error', 'Queue has exceeded 25, please submit. Submit some FPNs on queue to increase space.')
            }
        }
    }

    



}
