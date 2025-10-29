import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingService } from '../../services/loading.service';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { POIPrefix } from '../../models/poi-prefix';
import { SiteOffence } from '../../models/site-offence';
import { Visibility } from '../../models/visibility';
import { Weather } from '../../models/weather';
import { EnviroPost } from 'src/app/models/enviro';

@Component({
  selector: 'app-site',
  templateUrl: './site.page.html',
  styleUrls: ['./site.page.scss'],
})
export class SitePage implements OnInit {

    sites: any[] = [];
    user: any = null;
    selected_site: any; // Variable to hold selected site
    search_site: string = '';
    url: string = '';
    filteredSites: any[] = [];
    searchQuery: string = '';


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private alertController: AlertController,
        private loading:LoadingService
    ) {
        
    }
    ngOnInit(): void {
        this.init();      
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
        this.auth.checkLoggedIn();
        this.user = this.auth.getUser();

        if (this.data.checkSites() === false) {
            this.getSites();
        } 
        
        this.loadData();
    }

    refresh() {
        window.location.reload();
    }

    getSites(): void {
        this.api.getSites().subscribe({
            next: (data) => {
                this.data.setSites(data.data);
                this.loadData();
            },
            error: (error) => {
                console.error('Error fetching sites Data:', error);
                this.presentAlert("Error", error.error.message)
                // Handle error as needed
            }
        });
    }

    loadData() {
        this.sites = this.data.getSites();
        this.selected_site = this.data.getSelectedSite() || null;
        this.url = this.data.getUrl();
    }

    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;

        return url;
    }

    setSite(site_id: any) {

        let enviro_post = new EnviroPost();
        this.data.setEnviroPost(enviro_post);

        this.selected_site = this.sites.find((site) => site.id === site_id);


        this.data.setSelectedSite(this.selected_site);
        this.getFPNData();
    }

    getFPNData(): void {
        this.loading.showLoading();

        let site: any = this.data.getSelectedSite();
        let site_id: number = site.id;
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

                this.loading.hideLoading();

                this.router.navigate(['']).then(() => {
                    window.location.reload();
                });
                
            },
            error: (error) => {
                this.loading.hideLoading();

                this.presentAlert('Error', error.message);
                console.error('Error 1:', error);
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
        let button_title: string = 'Ok';
        let button_retry: string = '';
        let message_display: string = 'Please Click Okay.';
        if (header == "Error") {
            message_display = message + ". Please attempt to logout and log back in.";
            button_retry = 'Retry';

        }
        const alert = await this.alertController.create({
            header: header,
            message: message_display,
            buttons: [
                {
                    text: button_title
                },
                {
                    text: button_retry,
                    handler: () => {
                        if (header == "Error") {
                            this.getFPNData();
                        }
                    }
                }
            ],
        });
        await alert.present();
    }

}
