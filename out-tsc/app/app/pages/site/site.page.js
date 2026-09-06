import { Component } from '@angular/core';
import { EnviroPost } from 'src/app/models/enviro';
import { User } from 'src/app/models/user';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/auth.service";
import * as i2 from "../../services/enforcementpro/api.service";
import * as i3 from "../../services/enforcementpro/data.service";
import * as i4 from "@angular/router";
import * as i5 from "@ionic/angular";
import * as i6 from "../../services/loading.service";
import * as i7 from "../../services/background-task.service";
import * as i8 from "@angular/common";
import * as i9 from "@angular/forms";
function SitePage_div_24_img_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 17);
} }
function SitePage_div_24_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Unable to load sites. Tap refresh to try again.");
    i0.ɵɵelementEnd();
} }
function SitePage_div_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 15);
    i0.ɵɵtemplate(1, SitePage_div_24_img_1_Template, 1, 0, "img", 16)(2, SitePage_div_24_p_2_Template, 2, 0, "p", 14);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r0.sitesLoadFailed);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.sitesLoadFailed);
} }
function SitePage_ng_container_25_article_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 19);
    i0.ɵɵelement(1, "img", 20);
    i0.ɵɵelementStart(2, "h3");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ion-button", 21);
    i0.ɵɵlistener("click", function SitePage_ng_container_25_article_1_Template_ion_button_click_4_listener() { const site_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.setSite(site_r3.id)); });
    i0.ɵɵtext(5, "Select");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const site_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r0.getImageUrl(site_r3.logo), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(site_r3.name);
} }
function SitePage_ng_container_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, SitePage_ng_container_25_article_1_Template, 6, 2, "article", 18);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r0.sites);
} }
function SitePage_ng_container_26_article_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 19);
    i0.ɵɵelement(1, "img", 20);
    i0.ɵɵelementStart(2, "h3");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ion-button", 21);
    i0.ɵɵlistener("click", function SitePage_ng_container_26_article_1_Template_ion_button_click_4_listener() { const site_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.setSite(site_r5.id)); });
    i0.ɵɵtext(5, "Select");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const site_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", ctx_r0.getImageUrl(site_r5.logo), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(site_r5.name);
} }
function SitePage_ng_container_26_div_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 23)(1, "h3");
    i0.ɵɵtext(2, "No sites found");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Try another search.");
    i0.ɵɵelementEnd()();
} }
function SitePage_ng_container_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, SitePage_ng_container_26_article_1_Template, 6, 2, "article", 18)(2, SitePage_ng_container_26_div_2_Template, 5, 0, "div", 22);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r0.filteredSites);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r0.filteredSites.length === 0);
} }
export class SitePage {
    constructor(auth, api, data, router, alertController, loading, platform, backgroundTasks) {
        this.auth = auth;
        this.api = api;
        this.data = data;
        this.router = router;
        this.alertController = alertController;
        this.loading = loading;
        this.platform = platform;
        this.backgroundTasks = backgroundTasks;
        this.isFetchingSites = false;
        this.nextSitesFetchAt = 0;
        this.activeAlert = null;
        this.sites = [];
        this.search_site = '';
        this.url = '';
        this.filteredSites = [];
        this.searchQuery = '';
        this.is_logged_in = true;
        this.token = '';
        this.sitesLoadFailed = false;
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
        }
        finally {
            this.loading.hideLoading();
        }
    }
    async ionViewWillEnter() {
        await this.data.waitUntilHydrated();
        this.loadData();
        this.init();
    }
    blockBackButton() {
        this.backgroundTasks.registerSubscription(this.platform.backButton.subscribeWithPriority(9999, () => { }));
    }
    logout() {
        this.loading.showLoading();
        let queue = this.data.getEnviroQue();
        if (queue.length == 0) {
            this.loading.hideLoading();
            this.auth.logout();
        }
        else {
            this.loading.hideLoading();
            this.presentAlert('Error', 'Found FPNs on Queue,  please submit before logging out.');
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
    clearTimers() {
        if (this.checkLoginTimeoutId) {
            this.backgroundTasks.clearTimer(this.checkLoginTimeoutId);
            this.checkLoginTimeoutId = null;
        }
        if (this.refreshIntervalId) {
            this.backgroundTasks.clearTimer(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }
    }
    checkLoggedIn() {
        if (this.token == '') {
            this.token = this.data.getToken();
            if (this.token == '') {
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
    getSites() {
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
                }
                else {
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
                if (error.status == 500) {
                    this.presentAlert('Server Error', 'Please report error.');
                }
                else if (error.status == 401) {
                    this.presentAlert('Auth Failed', 'Please login again.');
                }
                else if (error.status == 0) {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                }
                else if (error.status == 429) {
                    this.presentAlert('Please wait', 'Too many requests. Sites will reload automatically in a minute.');
                }
                else {
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
    stopSitesRefreshInterval() {
        if (this.refreshIntervalId) {
            this.backgroundTasks.clearTimer(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }
    }
    getImageUrl(prefix) {
        let url = this.url + '/' + prefix;
        return url;
    }
    setSite(site_id) {
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
    getFPNData(navigateOnComplete = true) {
        let site_id = 0;
        if (this.selected_site) {
            site_id = this.selected_site.id;
        }
        else {
            let site = this.data.getSelectedSite();
            site_id = site.id;
        }
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                try {
                    this.data.applyFPNData(data);
                    const enviro_post = new EnviroPost();
                    enviro_post.site_id = site_id;
                    this.data.setEnviroPost(enviro_post);
                }
                catch (error) {
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
                if (error.status == 500) {
                    this.presentAlert('Server Error', 'Please report error.');
                }
                else if (error.status == 401) {
                    this.presentAlert('Auth Failed', 'Please try Auto Login.');
                }
                else if (error.status == 0) {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                }
                else if (error.status == 429) {
                    this.presentAlert('Please wait', 'Too many requests. Please wait a moment and select the site again.');
                }
                else {
                    this.presentAlert('Error', error.message);
                }
            }
        });
    }
    extractOffence(site_offences) {
        const groups = (site_offences || [])
            .map(site_offence => site_offence?.offences)
            .filter((group) => !!group?.id);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    extractOffenceGroups(offences) {
        const groups = (offences || [])
            .map(offence => offence?.offenceGroup)
            .filter((group) => !!group?.id);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    navigate(route) {
        this.router.navigate([route]);
    }
    filterSites() {
        this.filteredSites = this.sites.filter(site => {
            return site.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
    }
    async presentAlert(header, message) {
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
        if (header == 'Processing') {
            setTimeout(() => {
                alert.dismiss();
            }, 3000);
        }
        await alert.onDidDismiss();
        if (this.activeAlert === alert) {
            this.activeAlert = null;
        }
    }
    static { this.ɵfac = function SitePage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SitePage)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.DataService), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i5.AlertController), i0.ɵɵdirectiveInject(i6.LoadingService), i0.ɵɵdirectiveInject(i5.Platform), i0.ɵɵdirectiveInject(i7.BackgroundTaskService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SitePage, selectors: [["app-site"]], decls: 27, vars: 6, consts: [[3, "translucent"], [1, "ep-nav"], [1, "ep-nav__row"], [1, "ep-nav__col"], [1, "ep-nav__btn", 3, "click"], ["name", "home-outline"], [1, "ep-nav__label"], ["name", "refresh-outline"], [3, "fullscreen"], [1, "ep-page"], [1, "ep-page-head"], [1, "ep-kicker"], ["placeholder", "Search sites", 3, "ngModelChange", "ionInput", "ngModel"], ["class", "site-load", 4, "ngIf"], [4, "ngIf"], [1, "site-load"], ["src", "../assets/loader.gif", "alt", "", 4, "ngIf"], ["src", "../assets/loader.gif", "alt", ""], ["class", "ep-site-card", 4, "ngFor", "ngForOf"], [1, "ep-site-card"], ["alt", "", 3, "src"], ["size", "small", 3, "click"], ["class", "ep-empty", 4, "ngIf"], [1, "ep-empty"]], template: function SitePage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-header", 0);
            i0.ɵɵelement(1, "ion-router-outlet");
            i0.ɵɵelementStart(2, "ion-toolbar", 1)(3, "ion-row", 2)(4, "ion-col", 3)(5, "ion-tab-button", 4);
            i0.ɵɵlistener("click", function SitePage_Template_ion_tab_button_click_5_listener() { return ctx.navigate("/dashboard"); });
            i0.ɵɵelement(6, "ion-icon", 5);
            i0.ɵɵelementStart(7, "span", 6);
            i0.ɵɵtext(8, "Home");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(9, "ion-col", 3)(10, "ion-tab-button", 4);
            i0.ɵɵlistener("click", function SitePage_Template_ion_tab_button_click_10_listener() { return ctx.forceRefresh(); });
            i0.ɵɵelement(11, "ion-icon", 7);
            i0.ɵɵelementStart(12, "span", 6);
            i0.ɵɵtext(13, "Refresh");
            i0.ɵɵelementEnd()()()()()();
            i0.ɵɵelementStart(14, "ion-content", 8)(15, "div", 9)(16, "div", 10)(17, "p", 11);
            i0.ɵɵtext(18, "Assignment");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "h1");
            i0.ɵɵtext(20, "Choose a site");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "p");
            i0.ɵɵtext(22, "Search and lock in the location you are working.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(23, "ion-searchbar", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function SitePage_Template_ion_searchbar_ngModelChange_23_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.searchQuery, $event) || (ctx.searchQuery = $event); return $event; });
            i0.ɵɵlistener("ionInput", function SitePage_Template_ion_searchbar_ionInput_23_listener() { return ctx.filterSites(); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(24, SitePage_div_24_Template, 3, 2, "div", 13)(25, SitePage_ng_container_25_Template, 2, 1, "ng-container", 14)(26, SitePage_ng_container_26_Template, 3, 2, "ng-container", 14);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance(14);
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.searchQuery);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.searchQuery == "" && ctx.sites.length < 1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.searchQuery == "");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.searchQuery != "");
        } }, dependencies: [i8.NgForOf, i8.NgIf, i9.NgControlStatus, i9.NgModel, i5.IonButton, i5.IonCol, i5.IonContent, i5.IonHeader, i5.IonIcon, i5.IonRow, i5.IonSearchbar, i5.IonTabButton, i5.IonToolbar, i5.TextValueAccessor, i5.IonRouterOutlet], styles: [".site-load[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 160px;\n}\n\nion-searchbar[_ngcontent-%COMP%] {\n  padding: 0 0 14px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SitePage, [{
        type: Component,
        args: [{ selector: 'app-site', template: "<ion-header [translucent]=\"true\">\n    <ion-router-outlet></ion-router-outlet>\n    <ion-toolbar class=\"ep-nav\">\n        <ion-row class=\"ep-nav__row\">\n            <ion-col class=\"ep-nav__col\">\n                <ion-tab-button class=\"ep-nav__btn\" (click)=\"navigate('/dashboard')\">\n                    <ion-icon name=\"home-outline\"></ion-icon>\n                    <span class=\"ep-nav__label\">Home</span>\n                </ion-tab-button>\n            </ion-col>\n            <ion-col class=\"ep-nav__col\">\n                <ion-tab-button class=\"ep-nav__btn\" (click)=\"forceRefresh()\">\n                    <ion-icon name=\"refresh-outline\"></ion-icon>\n                    <span class=\"ep-nav__label\">Refresh</span>\n                </ion-tab-button>\n            </ion-col>\n        </ion-row>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n    <div class=\"ep-page\">\n        <div class=\"ep-page-head\">\n            <p class=\"ep-kicker\">Assignment</p>\n            <h1>Choose a site</h1>\n            <p>Search and lock in the location you are working.</p>\n        </div>\n\n        <ion-searchbar\n            [(ngModel)]=\"searchQuery\"\n            placeholder=\"Search sites\"\n            (ionInput)=\"filterSites()\">\n        </ion-searchbar>\n\n        <div class=\"site-load\" *ngIf=\"searchQuery == '' && sites.length<1\">\n            <img *ngIf=\"!sitesLoadFailed\" src=\"../assets/loader.gif\" alt=\"\">\n            <p *ngIf=\"sitesLoadFailed\">Unable to load sites. Tap refresh to try again.</p>\n        </div>\n\n        <ng-container *ngIf=\"searchQuery == ''\">\n            <article class=\"ep-site-card\" *ngFor=\"let site of sites\">\n                <img [src]=\"getImageUrl(site.logo)\" alt=\"\" />\n                <h3>{{ site.name }}</h3>\n                <ion-button size=\"small\" (click)=\"setSite(site.id)\">Select</ion-button>\n            </article>\n        </ng-container>\n\n        <ng-container *ngIf=\"searchQuery != ''\">\n            <article class=\"ep-site-card\" *ngFor=\"let site of filteredSites\">\n                <img [src]=\"getImageUrl(site.logo)\" alt=\"\" />\n                <h3>{{ site.name }}</h3>\n                <ion-button size=\"small\" (click)=\"setSite(site.id)\">Select</ion-button>\n            </article>\n            <div class=\"ep-empty\" *ngIf=\"filteredSites.length === 0\">\n                <h3>No sites found</h3>\n                <p>Try another search.</p>\n            </div>\n        </ng-container>\n    </div>\n</ion-content>\n", styles: [".site-load {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 160px;\n}\n\nion-searchbar {\n  padding: 0 0 14px;\n}\n"] }]
    }], () => [{ type: i1.AuthService }, { type: i2.ApiService }, { type: i3.DataService }, { type: i4.Router }, { type: i5.AlertController }, { type: i6.LoadingService }, { type: i5.Platform }, { type: i7.BackgroundTaskService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SitePage, { className: "SitePage" }); })();
//# sourceMappingURL=site.page.js.map