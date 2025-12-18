import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { POIPrefix } from '../../models/poi-prefix';
import { SiteOffence } from '../../models/site-offence';
import { Visibility } from '../../models/visibility';
import { Weather } from '../../models/weather';
import { EnviroPost } from 'src/app/models/enviro';
import { interval } from 'rxjs';
import {Site  } from '../../models/site';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-site',
  templateUrl: './site.page.html',
  styleUrls: ['./site.page.scss'],
})
export class SitePage implements OnInit, OnDestroy 
{

    private checkLoginTimeoutId: any;
    private refreshIntervalId: any;

    sites: any[] = [];
    user: User;
    selected_site!: Site; // Variable to hold selected site
    search_site: string = '';
    url: string = '';
    filteredSites: any[] = [];
    searchQuery: string = '';
    is_logged_in: boolean = true;
    token: string = '';


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private alertController: AlertController,
        private loading:LoadingService,
        private platform: Platform

    ) {

        this.user = new User();
        // this.selected_site = new Site();
        this.loadData();

        this.platform.ready().then(() => {
            this.blockBackButton();
        });


    }

    async ngOnInit() {
        this.loading.showLoading();

        await this.data.init();
        this.init();

        this.loading.hideLoading();

    }

    blockBackButton() {
        this.platform.backButton.subscribeWithPriority(9999, () => {});
    }

    logout(): void {
        this.loading.showLoading();
        let queue = this.data.getEnviroQue();
        if (queue.length == 0) {
            this.loading.hideLoading();
            this.auth.logout();
        } else {
            this.loading.hideLoading();
            this.presentAlert('Error', 'Found FPNs on Queue,  please submit before logging out.')
        }
    }

    init() {

        // setTimeout(() => {
        //     this.checkLoggedIn();
        // }, 4000);

        // setInterval(() => {
        //     this.refresh();
        // }, 5000);


        this.checkLoginTimeoutId = setTimeout(() => {
            this.checkLoggedIn();
        }, 4000);
        
        this.refreshIntervalId = setInterval(() => {
            this.refresh();
        }, 5000);

    }

    ngOnDestroy() {
        this.clearTimers();
    }
    
    ionViewWillLeave() {
        // Ionic lifecycle: also clear when leaving this page
        this.clearTimers();
    }

    private clearTimers() {
        if (this.checkLoginTimeoutId) {
            clearTimeout(this.checkLoginTimeoutId);
            this.checkLoginTimeoutId = null;
        }

        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }
    }


    checkLoggedIn() 
    {
        if (this.token == '')
        {
            this.token = this.data.getToken();

            if (this.token == '')
            {
                this.logout();
            }
        }
    }

    refresh() {
        this.loadData();
    }

    getSites(): void {
        
        this.api.getSites().subscribe({
            next: (data) => {
                this.sites = data.data;
                this.data.setSites(this.sites);
                // this.selected_site = this.data.getSelectedSite();
                // this.url = this.data.getUrl();
                // this.loadData();
            },
            error: (error) => {
                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please report error.');
                } 
                else if (error.status == 401) 
                {
                    // this.presentAlert('Processing', 'Retrieving data. '+this.token);

                    // this.auth.autoLogin();
                    if (this.token == '')
                    {
                        this.auth.autoLogin();
                    }
                    
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                } 
                else 
                {
                    this.presentAlert('Error', error.message);
                } 
            }
        });
    }

    loadData() {

        this.token = this.data.getToken();
        this.user = this.auth.getUser() || new User();
        this.selected_site = this.data.getSelectedSite() || null;
        this.url = this.data.getUrl();
        this.assignSites();

    }

    assignSites() {

        let has_sites: boolean = false;

        if (this.sites.length == 0) 
        {
            this.sites = this.data.getSites();

            if (this.sites.length == 0)
            {
                has_sites = false;
            } else {
                has_sites = true;
            }       
        } else {
            has_sites = true;
        }
        
        if (!has_sites) {

            this.getSites();
        }
    }



    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;

        return url;
    }

    setSite(site_id: any) {

        this.loading.showLoading();

        let enviro_post = new EnviroPost();

        this.selected_site = this.sites.find((site) => site.id === site_id);

        enviro_post.site_id = this.selected_site.id;

        this.data.setSelectedSite(this.selected_site);

        this.data.setEnviroPost(enviro_post);

        this.getFPNData();

        this.loading.hideLoading();
    }

    getFPNData(): void {

        let site_id: number = 0;

        if (this.selected_site) {
            site_id = this.selected_site.id
        } else {
           let site: any = this.data.getSelectedSite();
            site_id = site.id; 
        }

        this.api.getFPNData(site_id).subscribe({
            next: (data) => {

                this.data.removeEnviroLookUps();
                
                let salutations = data.data.salutations;
                this.data.setSalutations(salutations);

                let fpn_number_and_barcode = data.data.fpn_number_offline_printer;
                this.data.setFPNNumberOfflinePrinter(fpn_number_and_barcode);

                let builds = data.data.builds;
                console.log(data);
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

                let enviro_post = new EnviroPost();
                enviro_post.site_id = site_id;
                this.data.setEnviroPost(enviro_post);


                // this.router.navigate(['/dashboard']);

                this.navigate('/dashboard');
                
            },
            error: (error) => {

                // this.presentAlert('Error', error.message);
                // console.error('Error 1:', error);

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please report error.');
                } 
                else if (error.status == 401) 
                {
                    this.presentAlert('Auth Failed', 'Please try Auto Login.');
                    // this.getFPNData();
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
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


    navigate(route: string){
        this.router.navigate([route]);
    }

    filterSites () {
        this.filteredSites = this.sites.filter(site => {
            return site.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
    }

    async presentAlert(header: string, message: string) {
        // let button_title: string = 'Ok';
        // let button_retry: string = 'Retry';
        // let message_display: string = 'Please Click Okay.';
        // if (header == "Error") {
        //     message_display = message + ". Please attempt to logout and log back in.";
        //     button_retry = 'Retry';

        // }
        const alert = await this.alertController.create({
            header: header,
            message: message,
        });
        await alert.present();

        let timeout: number = 3000;

        if (header == 'Processing')
        {
           setTimeout(() => {
                alert.dismiss();
            }, timeout); 
        }
        
    }

}
