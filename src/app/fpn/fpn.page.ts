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

@Component({
  selector: 'app-fpn',
  templateUrl: 'fpn.page.html',
  styleUrls: ['fpn.page.scss']
})
export class FPNPage implements OnInit {

    map: any;

    enviro_post: EnviroPost;

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController
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

    ngOnInit() {
        this.loadData();
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

    nextStep() {
        if (this.currentStep < 7) {
            this.currentStep++;
        }
    } 

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }

    submitForm() {
        console.log('Form submitted!');
        this.api.postFPN(this.enviro_post).subscribe({
            next: (response) => {
                console.log('Response:', response);
                // Handle the response here
            },
            error: (error) => {
                console.error('Error:', error);
                // Handle the error here
            }
        });
        // Add form submission logic here
    }

    submitFPN() {
        console.log('Form submitted!');
        this.api.postFPN(this.enviro_post).subscribe({
            next: (response) => {
                console.log('Response:', response);
                // Handle the response here
                if(response.success === false) 
                {
                    let message = response.message + " (Please Edit)";
                    this.presentAlert('Error', message);
                } else {
                    let fpn_number = response.data.fpn_number;
                    this.presentAlert('Success', fpn_number);
                    // this.data.spliceEnviroQue(this.enviro_post);
                    // this.enviro_que = this.data.getEnviroQue();
                }
            },
            error: (error) => {
                // console.error('Error:', error);
                this.presentAlert('Error', error);

                // Handle the error here
            }
        });
        // Add form submission logic here
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
          header: header,
          message: message,
          buttons: ['Okay'],
        });
        await alert.present();
    }

    saveFPN() {
        this.data.pushEnviroQue();
        window.
        location.reload();
    }

    



}
