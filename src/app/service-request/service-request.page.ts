import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';
import { DataService } from '../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { Site } from '../models/site';
import { Zone } from '../models/zone';
import { AppLog } from '../models/app-log';
import { ApiService } from '../services/enforcementpro/api.service';
import { Weather } from '../models/weather';
import { POIPrefix } from '../models/poi-prefix';
import { Visibility } from '../models/visibility';
import { Offence } from '../models/offence';
import { OffenceGroup } from '../models/offence-group';
import { SiteOffence } from '../models/site-offence';
import { Observable, Subscriber } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Login } from '../models/login';
//import * as L from 'leaflet';

@Component({
  selector: 'app-service-request',
  templateUrl: 'service-request.page.html',
  styleUrls: ['service-request.page.scss']
})
export class ServiceRequestPage implements OnInit {

    map: any;
    selected_site!: Site;

    zones: Zone[] = [];
    sites: Site[] = [];

    position_lng: string = "0";
    position_lat: string = "0";

    device_id: string = "0";
    site_id: number = 0;
    zone_id: string = '0';

    app_log: AppLog;

    constructor(
        private auth: AuthService,
        private data: DataService,
        private router: Router,
        private api: ApiService,
        private alertController: AlertController,

    ) {
        this.auth.checkLoggedIn();

        this.app_log = new AppLog;
    }


    ngOnInit(): void {
        this.init();
    }

    init() {
        if (!this.data.checkFPNData()){
            this.getFPNData();
        }

        if (this.data.checkSelectedSite() == false) {
            this.navigate('site');
        }        

        this.loadData();
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

    storeAppLog() {
        this.app_log.device_id = this.device_id;
        this.app_log.site_id = this.site_id.toString();
        this.app_log.zone_id = this.zone_id;
        let user = this.auth.getUser();
        this.app_log.user_id = user.id;
        console.log(2, this.app_log.user_id);

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
                console.log(data);

                let salutations = data.data.salutations;
                this.data.setSalutations(salutations);

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
        this.site_id = this.selected_site.id;

        this.sites = this.data.getSites();
        this.zones = this.data.getZones();

        // console.log(this.app_log.device_id );
        if (this.data.checkAppLog()) {
            this.app_log = this.data.getAppLog();
            this.app_log.device_id = this.device_id;
            this.app_log.zone_id = this.zone_id;
            
        } else {
            this.device_id = this.app_log.device_id;
            this.zone_id = this.app_log.zone_id;
        }
        this.app_log.user_id = this.auth.getUser().id;

        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.app_log.lat = position.latitude;
            this.position_lat = position.latitude;
            this.app_log.lng = position.longitude;
            this.position_lng = position.longitude;
        });
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
        this.api.postTrack(this.app_log).subscribe({
            next: (response) => {
                console.log('Response:', response);
                // Handle the response here
                if(response.success === false) 
                {
                    let message = response.message + " (Please Edit)";
                    this.presentAlert('Error', message);
                } else {
                    this.presentAlert('Success', 'Ping Successful');
                }
            },
            error: (error) => {
                console.error('Error:', error);
                this.presentAlert('Error', error.message);
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
