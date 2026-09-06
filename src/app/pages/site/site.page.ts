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
import {Site  } from '../../models/site';
import { User } from 'src/app/models/user';
import { BackgroundTaskService } from '../../services/background-task.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.page.html',
  styleUrls: ['./site.page.scss'],
})
export class SitePage implements OnInit, OnDestroy 
{

    private checkLoginTimeoutId: any;
    private refreshIntervalId: any;
    private isFetchingSites = false;
    private nextSitesFetchAt = 0;
    private activeAlert: HTMLIonAlertElement | null = null;

    sites: any[] = [];
    user: User;
    selected_site!: Site; // Variable to hold selected site
    search_site: string = '';
    url: string = '';
    filteredSites: any[] = [];
    searchQuery: string = '';
    is_logged_in: boolean = true;
    token: string = '';
    sitesLoadFailed = false;


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private alertController: AlertController,
        private loading:LoadingService,
        private platform: Platform,
        private backgroundTasks: BackgroundTaskService

    ) {

        this.user = new User();
        // this.selected_site = new Site();

        this.platform.ready().then(() => {
            this.blockBackButton();
        });


    }

    async ngOnInit() {
        this.loading.showLoading();

        try {
            await this.data.waitUntilHydrated();
            this.loadData();
            this.init();
        } finally {
            this.loading.hideLoading();
        }

    }

    async ionViewWillEnter() {
        await this.data.waitUntilHydrated();
        this.loadData();
        this.init();
    }

    blockBackButton() {
        this.backgroundTasks.registerSubscription(
            this.platform.backButton.subscribeWithPriority(9999, () => {})
        );
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

        if (!this.checkLoginTimeoutId) {
            this.checkLoginTimeoutId = this.backgroundTasks.setTimeout(() => {
                this.checkLoggedIn();
            }, 4000);
        }

        if (!this.refreshIntervalId && this.sites.length === 0) {
            this.refreshIntervalId = this.backgroundTasks.setInterval(() => {
                this.refresh();
            }, 5000);
        }

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
            this.backgroundTasks.clearTimer(this.checkLoginTimeoutId);
            this.checkLoginTimeoutId = null;
        }

        if (this.refreshIntervalId) {
            this.backgroundTasks.clearTimer(this.refreshIntervalId);
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

    forceRefresh() {
        this.nextSitesFetchAt = 0;
        this.loadData();
    }

    getSites(): void {
        if (this.isFetchingSites) {
            return;
        }

        if (Date.now() < this.nextSitesFetchAt) {
            return;
        }

        this.isFetchingSites = true;
        this.sitesLoadFailed = false;
        
        this.api.getSites().subscribe({
            next: (data) => {
                this.isFetchingSites = false;
                this.nextSitesFetchAt = 0;
                this.sites = Array.isArray(data?.data) ? data.data : [];
                this.data.setSites(this.sites);
                this.sitesLoadFailed = this.sites.length === 0;

                if (this.sites.length > 0) {
                    this.stopSitesRefreshInterval();
                } else {
                    this.nextSitesFetchAt = Date.now() + 30000;
                }
                // this.selected_site = this.data.getSelectedSite();
                // this.url = this.data.getUrl();
                // this.loadData();
            },
            error: (error) => {
                this.isFetchingSites = false;
                this.sitesLoadFailed = true;
                this.nextSitesFetchAt = Date.now() + (error.status == 429 ? 60000 : 15000);

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please report error.');
                } 
                else if (error.status == 401) 
                {
                    this.presentAlert('Auth Failed', 'Please login again.');
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                }
                else if (error.status == 429)
                {
                    this.presentAlert('Please wait', 'Too many requests. Sites will reload automatically in a minute.');
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

        if (this.sites.length === 0) {
            const cachedSites = this.data.getSites();

            if (Array.isArray(cachedSites) && cachedSites.length > 0) {
                this.sites = cachedSites;
                this.sitesLoadFailed = false;
                this.stopSitesRefreshInterval();
                return;
            }

            this.getSites();
            return;
        }

        this.stopSitesRefreshInterval();
    }

    private stopSitesRefreshInterval() {
        if (this.refreshIntervalId) {
            this.backgroundTasks.clearTimer(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }
    }



    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;

        return url;
    }

    setSite(site_id: any) {

        this.selected_site = this.sites.find((site) => site.id === site_id);

        if (!this.selected_site) {
            this.presentAlert('Error', 'Unable to select that site. Please try again.');
            return;
        }

        const cachedSiteId = Number(this.data.getEnviroPost()?.site_id || 0);
        const canUseCache = this.data.checkFPNData() && cachedSiteId === Number(this.selected_site.id);

        let enviro_post = new EnviroPost();
        enviro_post.site_id = this.selected_site.id;

        this.data.setSelectedSite(this.selected_site);
        this.data.setEnviroPost(enviro_post);

        if (canUseCache) {
            this.navigate('/dashboard');
            this.getFPNData(false);
            return;
        }

        this.loading.showLoading();
        this.getFPNData(true);
    }

    getFPNData(navigateOnComplete = true): void {

        let site_id: number = 0;

        if (this.selected_site) {
            site_id = this.selected_site.id
        } else {
           let site: any = this.data.getSelectedSite();
            site_id = site.id; 
        }

        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                try {
                    this.applyFPNData(data, site_id);
                } catch (error) {
                    console.error('Error applying FPN data:', error);
                }

                this.loading.hideLoading();
                if (navigateOnComplete) {
                    this.navigate('/dashboard');
                }
            },
            error: (error) => {
                this.loading.hideLoading();

                if (this.selected_site || this.data.getSelectedSite()) {
                    if (navigateOnComplete) {
                        this.navigate('/dashboard');
                    }
                    return;
                }

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please report error.');
                } 
                else if (error.status == 401) 
                {
                    this.presentAlert('Auth Failed', 'Please try Auto Login.');
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                }
                else if (error.status == 429)
                {
                    this.presentAlert('Please wait', 'Too many requests. Please wait a moment and select the site again.');
                } 
                else 
                {
                    this.presentAlert('Error', error.message);
                } 
            }
        });
    }

    private applyFPNData(data: any, site_id: number): void {
        const payload = data?.data || {};

        this.data.removeEnviroLookUps();

        this.data.setSalutations(payload.salutations || []);
        this.data.setFPNNumberOfflinePrinter(payload.fpn_number_offline_printer || []);
        this.data.setBuilds(payload.builds || []);
        this.data.setHairColors(payload.hair_colors || []);
        this.data.setZones(payload.zones || []);
        this.data.setOffenceHow(payload.offence_how || []);
        this.data.setOffenceLocationSuffix(payload.offence_location_suffix || []);
        this.data.setAddressVerifiedBy(payload.address_verified_via || []);
        this.data.setEthnicities(payload.ethnicities || []);
        this.data.setIdShown(payload.id_shown || []);
        this.data.setWeather(payload.weathers || []);
        this.data.setVisibility(payload.visibility || []);
        this.data.setPOIPrefix(payload.poi_prefix || []);

        const site_offence = payload.site_offences || [];
        this.data.setSiteOffences(site_offence);

        const offences = this.extractOffence(site_offence);
        this.data.setOffences(offences);
        this.data.setOffenceGroups(this.extractOffenceGroups(offences));

        const enviro_post = new EnviroPost();
        enviro_post.site_id = site_id;
        this.data.setEnviroPost(enviro_post);
    }

    extractOffence(site_offences: SiteOffence[]): Offence[] {
        const groups = (site_offences || [])
            .map(site_offence => site_offence?.offences)
            .filter((group): group is Offence => !!group?.id);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as Offence);
    }

    extractOffenceGroups(offences: Offence[]): OffenceGroup[] {
        const groups = (offences || [])
            .map(offence => offence?.offenceGroup)
            .filter((group): group is OffenceGroup => !!group?.id);
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
        if (this.activeAlert) {
            return;
        }

        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['Okay'],
        });
        this.activeAlert = alert;
        await alert.present();

        if (header == 'Processing')
        {
           setTimeout(() => {
                alert.dismiss();
            }, 3000); 
        }

        await alert.onDidDismiss();
        if (this.activeAlert === alert) {
            this.activeAlert = null;
        }
    }

}
