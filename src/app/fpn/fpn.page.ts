import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/enforcementpro/api.service';
import { AuthService } from '../services/enforcementpro/auth.service';
import { DataService } from '../services/enforcementpro/data.service';
import { OffenceGroup } from '../models/offence-group';
import { Offence } from '../models/offence';
import { SiteOffence } from '../models/site-offence';
import { Weather } from '../models/weather';
import { Visibility } from '../models/visibility';
import { POIPrefix } from '../models/poi-prefix';
import { EnviroPost } from '../models/enviro';
import { AlertController } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';

import { AppLog } from '../models/app-log';



@Component({
  selector: 'app-fpn',
  templateUrl: 'fpn.page.html',
  styleUrls: ['fpn.page.scss']
})
export class FPNPage implements OnInit {

    app_log: AppLog;

    map: any;

    enviro_post: EnviroPost;
    fpn: any;

    baseUrl: string = 'https://app.enforcementpro.co.uk/';

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,

    ) {
        this.auth.checkLoggedIn();

        if (!this.data.checkFPNData()){
            this.getFPNData();
        }

        let enviro_post = this.data.getEnviroPost();
        if (enviro_post) {
            this.enviro_post = enviro_post;
        } else {
            this.enviro_post = new EnviroPost();
        }

        this.app_log = new AppLog();
    }


    route():void {
        this.currentStep = 7;
    }

    ngOnInit() {
        this.loadData();
        let user = this.auth.getUser();
        this.enviro_post.officer_id = user.id;
    }

    loadData() {
        this.app_log = this.data.getAppLog();
        // Trigger a method every 30 minutes (1800000 milliseconds)
        if(this.data.checkAppLog()) {
            setInterval(() => {
                this.ping();
            }, 1800000);
        }

        // this.enviro_post = this.data.getEnviroPost();

        console.log(this.enviro_post);
    }

    getFPNData(): void {
        let site: any = this.data.getSelectedSite();
        let site_id: number = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                // alert(1);
                console.log(data);

                let salutations = data.data.salutations;
                this.data.setSalutations(salutations);

                let builds = data.data.builds;
                this.data.setBuilds(builds);

                let hair_colours = data.data.hair_colors;//Please leave spelling as is, returned as 'hair_colors' app uses it as 'hair_colours'
                this.data.setHairColors(hair_colours);

                let zones = data.data.zones;
                this.data.setZones(zones);

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
    
    currentStep: number = 1;

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
                if (this.enviro_post.gender == '') {
                    this.presentAlert('Wait!', 'Please provide offender Gender.');
                    return false;
                }
                if (this.enviro_post.town == '') {
                    this.presentAlert('Wait!', 'Please provide offender Town.');
                    return false;
                }
                break;
            case 3:
                if (this.enviro_post.ethnicity_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide offender Ethnicity.');
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
                if (this.enviro_post.land_type_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Land Type.');
                    return false;
                }
                if (this.enviro_post.visibility_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Visibility.');
                    return false;
                }
                if (this.enviro_post.weather_id <= 0) {
                    this.presentAlert('Wait!', 'Please provide Weather.');
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
                if (!this.enviro_post.notebook_entries.hair) {
                    this.presentAlert('Wait!', 'Please provide hair details.');
                    return false;
                }
                if (!this.enviro_post.notebook_entries.were) {
                    this.presentAlert('Wait!', 'Please provide hair details.');
                    return false;
                }

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

    submitForm() {
        let checker = this.validator();
        if (checker) {
            this.api.postFPN(this.enviro_post).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";
                        this.presentAlert('Error', message);
                    } else {
                        this.fpn = response.data;
                        this.enviro_post = new EnviroPost();
                        this.data.setEnviroPost(this.enviro_post);
                        Clipboard.write({
                            string: this.fpn.ticket
                        });
                        this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + this.fpn.fpn_number + '. URL has been copied to your clipboard.');     
                        //Please navigate to a new app here NEMO              
                    }
                },
                error: (error) => {
                    console.error('Error:', error);
                    this.presentAlert('Error', error.message);
                }
            });
        }
    }

    refresh() {
        window.location.reload();
    }

    async presentAlert(header: string, message: string) {
        let primary_button_title: string = 'Ok';
        let secondary_button_title: string = 'Cancel';
        if (header == "Success") {
            primary_button_title = "Finish"
            secondary_button_title = ""
        }
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: primary_button_title,
                    handler: () => {
                        if (header == "Success") {
                            window.location.reload();
                        }
                    }
                },
                {
                    text: secondary_button_title,
                }
            ],
        });
        await alert.present();
    }

    ping() {
        if (this.data.checkAppLog()) {
            this.api.postTrack(this.app_log).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    
                },
                error: (error) => {
                    console.error('Error:', error);
                }
            });
        }
    }

    saveFPN() {
        let checker = this.validator();

        if (checker) {
            this.data.pushEnviroQue();
            window.location.reload();
        }
        
    }

    



}
