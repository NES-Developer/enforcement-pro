import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequest } from '../models/service-request';
import { ApiService } from '../services/enforcementpro/api.service';
import { AuthService } from '../services/enforcementpro/auth.service';
import { DataService } from '../services/enforcementpro/data.service';
import { OffenceGroup } from '../models/offence-group';
import { Offence } from '../models/offence';
import { FormGroup } from '@angular/forms';
import { SiteOffence } from '../models/site-offence';
import { Weather } from '../models/weather';
import { Visibility } from '../models/visibility';
import { POIPrefix } from '../models/poi-prefix';
import { EnviroPost } from '../models/enviro';
import { AlertController } from '@ionic/angular';
import { isEmpty } from 'rxjs';
import { ThermalPrinterService } from '../services/thermal-printer.service';


@Component({
  selector: 'app-fpn',
  templateUrl: 'fpn.page.html',
  styleUrls: ['fpn.page.scss']
})
export class FPNPage implements OnInit {

    map: any;

    enviro_post: EnviroPost;
    fpn: any;

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private thermalPrinterService: ThermalPrinterService,

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

                        this.presentAlert('Success', this.fpn.fpn_number);
                        this.enviro_post = new EnviroPost();
                        this.data.setEnviroPost(this.enviro_post);
                        this.printReceipt(this.fpn.ticket);

                    }
                },
                error: (error) => {
                    console.error('Error:', error);
                    this.presentAlert('Error', error);
                }
            });
        }
    }

    refresh() {
        window.location.reload();
    }

    async presentAlert(header: string, message: string) {
        let button_title: string = 'Ok';
        if (header == "Success") {
            button_title = "Finish"
        }
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: button_title,
                    handler: () => {
                        if (header == "Success") {
                            
                            window.location.reload();
                        }
                    }
                }
            ],
        });
        await alert.present();
    }

    async printReceipt(ticketUrl: string) {
        const alert = await this.alertController.create({
          header: 'Print Receipt',
          message: 'Was the printing successful?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                this.printReceipt(ticketUrl); // Retry printing
              }
            },
            {
              text: 'Yes',
              role: 'cancel',
              handler: () => {
                console.log('Printing confirmed');
              }
            }
          ]
        });
    
        try {
          await this.thermalPrinterService.printImage(ticketUrl);
          await alert.present();
        } catch (error) {
          console.error('Error printing', error);
          this.presentAlert('Error', 'Failed to print. Please try again.');
          this.printReceipt(ticketUrl); // Retry printing in case of error
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
