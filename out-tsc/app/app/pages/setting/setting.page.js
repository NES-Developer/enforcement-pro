import { Component } from '@angular/core';
import { AppLog } from '../../models/app-log';
import { Observable } from 'rxjs';
import { App } from '@capacitor/app';
import { EnviroPost } from 'src/app/models/enviro';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/auth.service";
import * as i2 from "../../services/enforcementpro/data.service";
import * as i3 from "@angular/router";
import * as i4 from "../../services/enforcementpro/api.service";
import * as i5 from "@ionic/angular";
import * as i6 from "../../services/constants.service";
import * as i7 from "src/app/services/loading.service";
import * as i8 from "../../services/background-task.service";
import * as i9 from "../../services/tracking.service";
import * as i10 from "../../services/app-update.service";
import * as i11 from "@angular/common";
import * as i12 from "@angular/forms";
import * as i13 from "../../components/nav-bar/nav-bar.component";
function SettingPage_p_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 24);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.apkSizeLabel);
} }
function SettingPage_p_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.releaseNotes);
} }
function SettingPage_ion_button_37_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 29);
    i0.ɵɵlistener("click", function SettingPage_ion_button_37_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.installPublishedUpdate()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r0.updateBusy);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.installingUpdate ? "Installing\u2026" : ctx_r0.forceUpdate ? "Install required update" : "Install update", " ");
} }
function SettingPage_ion_select_option_47_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const site_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", site_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", site_r3.name, " ");
} }
function SettingPage_ion_select_option_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const zone_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", zone_r4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", zone_r4.name, " ");
} }
export class SettingPage {
    // app_version: str
    constructor(auth, data, router, api, alertController, constantsService, platform, loading, backgroundTasks, tracking, appUpdate) {
        // this.auth.checkLoggedIn();
        this.auth = auth;
        this.data = data;
        this.router = router;
        this.api = api;
        this.alertController = alertController;
        this.constantsService = constantsService;
        this.platform = platform;
        this.loading = loading;
        this.backgroundTasks = backgroundTasks;
        this.tracking = tracking;
        this.appUpdate = appUpdate;
        this.api_app_version = "";
        this.api_app_url = "";
        this.app_version_code = this.constantsService.APP_VERSION_CODE;
        this.releaseNotes = "";
        this.apkSizeLabel = "";
        this.updateAvailable = false;
        this.forceUpdate = false;
        this.checkingUpdate = false;
        this.installingUpdate = false;
        this.updateStatusLabel = 'Checking server…';
        this.selected_zone = null;
        this.zones = [];
        this.sites = [];
        this.position_lng = "0";
        this.position_lat = "0";
        this.device_id = "0";
        this.site_id = 0;
        this.app_version = this.constantsService.APP_VERSION;
        this.currentStep = 1;
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
        this.backgroundTasks.registerSubscription(this.platform.backButton.subscribeWithPriority(9999, () => { }));
    }
    init() {
        if (!this.data.checkFPNData()) {
            this.getFPNData();
        }
        if (this.data.checkSelectedSite() == false) {
            this.navigate('site');
        }
        void this.refreshInstalledVersion();
        void this.checkForUpdate(false);
        this.loadData();
    }
    get updateBusy() {
        return this.checkingUpdate || this.installingUpdate;
    }
    async refreshInstalledVersion() {
        const current = await this.appUpdate.getInstalledVersion();
        this.app_version = current.versionName;
        this.app_version_code = current.versionCode;
    }
    async checkForUpdate(showFeedback = true) {
        if (this.updateBusy) {
            return;
        }
        this.checkingUpdate = true;
        try {
            const result = await this.appUpdate.check('settings');
            this.applyUpdateResult(result);
            if (showFeedback && result.error) {
                await this.presentAlert('Update check failed', result.error);
            }
            else if (showFeedback && !result.updateAvailable) {
                await this.presentAlert('Up to date', 'This device is already on the published Android version.');
            }
        }
        finally {
            this.checkingUpdate = false;
        }
    }
    async installPublishedUpdate() {
        if (this.updateBusy) {
            return;
        }
        this.installingUpdate = true;
        try {
            const result = await this.appUpdate.install();
            this.applyUpdateResult(result);
            if (result.installStarted) {
                await this.presentAlert('Install started', 'Android will ask you to confirm the update.');
            }
            else if (result.error) {
                await this.presentAlert('Update failed', result.error);
            }
        }
        finally {
            this.installingUpdate = false;
        }
    }
    applyUpdateResult(result) {
        if (result.current) {
            this.app_version = result.current.versionName;
            this.app_version_code = result.current.versionCode;
        }
        const manifest = result.manifest;
        if (manifest) {
            this.api_app_version = manifest.latestVersionName || '';
            this.api_app_url = manifest.apkUrl || '';
            this.releaseNotes = (manifest.releaseNotes || '').trim();
            this.apkSizeLabel = this.appUpdate.formatApkSize(manifest.apkSizeBytes);
            this.data.setApiAppVersion(this.api_app_version);
            this.data.setApiAppUrl(this.api_app_url);
        }
        this.updateAvailable = !!result.updateAvailable;
        this.forceUpdate = !!result.forceUpdate;
        this.updateStatusLabel = result.error
            ? 'Could not reach the update server'
            : this.updateAvailable
                ? (this.forceUpdate ? 'Required update' : 'Update available')
                : 'Up to date';
    }
    autoLogin() {
        let login = this.data.getLogin();
        this.auth.login(login.id, login.pin).subscribe((response) => {
            if (response.error_code) {
                let message = response.message;
                this.presentAlert("Login Attempt Failed", "Please Logout and Login again.");
            }
            else if (response.access_token !== '' || response.user) {
                this.auth.handleLoginResponse(response);
            }
        }, (error) => {
            this.presentAlert("Login Attempt Failed", "Please Logout and Login again.");
        });
    }
    downloadFile() {
        void this.installPublishedUpdate();
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
        let user = this.auth.getUser();
        if (user !== '') {
            this.app_log.user_id = user.id.toString();
        }
        this.getCurrentPosition()
            .subscribe((position) => {
            this.app_log.lat = position.latitude;
            this.position_lat = position.latitude;
            this.app_log.lng = position.longitude;
            this.position_lng = position.longitude;
        });
        this.data.setAppLog(this.app_log);
    }
    getFPNData() {
        let site = this.data.getSelectedSite();
        let site_id = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                this.data.applyFPNData(data);
                this.zones = this.data.getZones();
            },
            error: (error) => {
                console.error('Error fetching SR Data:', error);
                // Handle error as needed
            }
        });
    }
    extractOffence(site_offences) {
        const groups = site_offences.map(site_offence => site_offence.offences);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    extractOffenceGroups(offences) {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    loadData() {
        this.selected_site = this.data.getSelectedSite();
        this.selected_zone = this.data.getSelectedZone();
        this.site_id = this.selected_site.id;
        this.api_app_version = this.data.getApiAppVersion();
        this.api_app_url = this.data.getApiAppUrl();
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
    getCurrentPosition() {
        return new Observable((observer) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    observer.next({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    observer.complete();
                });
            }
            else {
                observer.error();
            }
        });
    }
    navigate(route) {
        this.router.navigate([route]);
    }
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
    forceCloseApp() {
        App.exitApp(); // Force closes the app
    }
    cancelEnvio() {
        let enviro_post = new EnviroPost();
        this.data.setEnviroPost(enviro_post);
    }
    getEnviroSizeInBytes() {
        let enviro_data = this.data.getEnviroPost();
        const json = JSON.stringify(enviro_data);
        return new Blob([json]).size; // gives exact byte size
    }
    async presentAlert(header, message) {
        let primary_button_title = 'Ok';
        let secondary_button_title = 'Cancel';
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
    static { this.ɵfac = function SettingPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingPage)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.Router), i0.ɵɵdirectiveInject(i4.ApiService), i0.ɵɵdirectiveInject(i5.AlertController), i0.ɵɵdirectiveInject(i6.ConstantsService), i0.ɵɵdirectiveInject(i5.Platform), i0.ɵɵdirectiveInject(i7.LoadingService), i0.ɵɵdirectiveInject(i8.BackgroundTaskService), i0.ɵɵdirectiveInject(i9.TrackingService), i0.ɵɵdirectiveInject(i10.AppUpdateService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SettingPage, selectors: [["app-setting"]], decls: 71, vars: 21, consts: [[3, "translucent"], [3, "fullscreen"], [1, "ep-page"], [1, "ep-page-head"], [1, "ep-kicker"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-stat-grid"], [1, "ep-stat"], [1, "ep-stat__label"], [1, "ep-stat__value", "ep-stat__value--sm"], [1, "ep-stat__sub"], ["class", "ep-ticket__meta", 4, "ngIf"], ["class", "ep-update-notes", 4, "ngIf"], [1, "ep-actions"], ["expand", "block", "color", "light", 3, "click", "disabled"], ["expand", "block", "color", "primary", 3, "disabled", "click", 4, "ngIf"], ["expand", "block", 3, "click"], ["interface", "action-sheet", "label", "Site", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel", "disabled"], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "action-sheet", "label", "Zone", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], [1, "ep-field-row"], ["label", "Longitude", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "disabled", "ngModel"], ["label", "Latitude", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "disabled", "ngModel"], [1, "ep-ticket__meta"], ["expand", "block", "color", "light", 3, "click"], ["slot", "start", "name", "key-outline"], ["expand", "block", "color", "danger", 3, "click"], [1, "ep-update-notes"], ["expand", "block", "color", "primary", 3, "click", "disabled"], [3, "value"]], template: function SettingPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-header", 0);
            i0.ɵɵelement(1, "app-nav-bar");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "ion-content", 1)(3, "div", 2)(4, "div", 3)(5, "p", 4);
            i0.ɵɵtext(6, "Officer tools");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "h1");
            i0.ɵɵtext(8, "Settings");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "p");
            i0.ɵɵtext(10, "Device, site, and session controls.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "section", 5)(12, "div", 6)(13, "p", 4);
            i0.ɵɵtext(14, "Build");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "h3");
            i0.ɵɵtext(16, "App version");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 7)(18, "div", 8)(19, "div", 9);
            i0.ɵɵtext(20, "Installed");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "div", 10);
            i0.ɵɵtext(22);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "div", 11);
            i0.ɵɵtext(24);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "div", 8)(26, "div", 9);
            i0.ɵɵtext(27, "Published");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "div", 10);
            i0.ɵɵtext(29);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(30, "div", 11);
            i0.ɵɵtext(31);
            i0.ɵɵelementEnd()()();
            i0.ɵɵtemplate(32, SettingPage_p_32_Template, 2, 1, "p", 12)(33, SettingPage_p_33_Template, 2, 1, "p", 13);
            i0.ɵɵelementStart(34, "div", 14)(35, "ion-button", 15);
            i0.ɵɵlistener("click", function SettingPage_Template_ion_button_click_35_listener() { return ctx.checkForUpdate(); });
            i0.ɵɵtext(36);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(37, SettingPage_ion_button_37_Template, 2, 2, "ion-button", 16);
            i0.ɵɵelementStart(38, "ion-button", 17);
            i0.ɵɵlistener("click", function SettingPage_Template_ion_button_click_38_listener() { return ctx.navigate("/dashboard"); });
            i0.ɵɵtext(39, "Home");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(40, "section", 5)(41, "div", 6)(42, "p", 4);
            i0.ɵɵtext(43, "Location");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "h3");
            i0.ɵɵtext(45, "Site and zone");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(46, "ion-select", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingPage_Template_ion_select_ngModelChange_46_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.site_id, $event) || (ctx.site_id = $event); return $event; });
            i0.ɵɵlistener("ionChange", function SettingPage_Template_ion_select_ionChange_46_listener() { return ctx.storeAppLog(); });
            i0.ɵɵtemplate(47, SettingPage_ion_select_option_47_Template, 2, 2, "ion-select-option", 19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "ion-select", 20);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingPage_Template_ion_select_ngModelChange_48_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.selected_zone, $event) || (ctx.selected_zone = $event); return $event; });
            i0.ɵɵlistener("ionChange", function SettingPage_Template_ion_select_ionChange_48_listener() { return ctx.storeAppLog(); });
            i0.ɵɵtemplate(49, SettingPage_ion_select_option_49_Template, 2, 2, "ion-select-option", 19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "div", 21)(51, "ion-input", 22);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingPage_Template_ion_input_ngModelChange_51_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.position_lng, $event) || (ctx.position_lng = $event); return $event; });
            i0.ɵɵlistener("ionChange", function SettingPage_Template_ion_input_ionChange_51_listener() { return ctx.storeAppLog(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "ion-input", 23);
            i0.ɵɵtwoWayListener("ngModelChange", function SettingPage_Template_ion_input_ngModelChange_52_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.position_lat, $event) || (ctx.position_lat = $event); return $event; });
            i0.ɵɵlistener("ionChange", function SettingPage_Template_ion_input_ionChange_52_listener() { return ctx.storeAppLog(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(53, "p", 24);
            i0.ɵɵtext(54);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "section", 5)(56, "div", 6)(57, "p", 4);
            i0.ɵɵtext(58, "Session");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "h3");
            i0.ɵɵtext(60, "Actions");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(61, "div", 14)(62, "ion-button", 25);
            i0.ɵɵlistener("click", function SettingPage_Template_ion_button_click_62_listener() { return ctx.autoLogin(); });
            i0.ɵɵelement(63, "ion-icon", 26);
            i0.ɵɵtext(64, " Auto login ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "ion-button", 17);
            i0.ɵɵlistener("click", function SettingPage_Template_ion_button_click_65_listener() { return ctx.ping(); });
            i0.ɵɵtext(66, "Ping");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "ion-button", 27);
            i0.ɵɵlistener("click", function SettingPage_Template_ion_button_click_67_listener() { return ctx.cancelEnvio(); });
            i0.ɵɵtext(68, "Cancel FPN");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(69, "ion-button", 27);
            i0.ɵɵlistener("click", function SettingPage_Template_ion_button_click_69_listener() { return ctx.forceCloseApp(); });
            i0.ɵɵtext(70, "Force close");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(20);
            i0.ɵɵtextInterpolate(ctx.app_version);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.app_version_code ? "Code " + ctx.app_version_code : "Device build");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.api_app_version || "\u2014");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.updateStatusLabel);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.apkSizeLabel);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.releaseNotes);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", ctx.updateBusy);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.checkingUpdate ? "Checking\u2026" : "Check for update", " ");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.updateAvailable);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.site_id);
            i0.ɵɵproperty("disabled", true);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.sites);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.selected_zone);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.zones);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("disabled", true);
            i0.ɵɵtwoWayProperty("ngModel", ctx.position_lng);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", true);
            i0.ɵɵtwoWayProperty("ngModel", ctx.position_lat);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("FPN size: ", ctx.getEnviroSizeInBytes(), " bytes");
        } }, dependencies: [i11.NgForOf, i11.NgIf, i12.NgControlStatus, i12.MaxLengthValidator, i12.NgModel, i5.IonButton, i5.IonContent, i5.IonHeader, i5.IonIcon, i5.IonInput, i5.IonSelect, i5.IonSelectOption, i5.SelectValueAccessor, i5.TextValueAccessor, i13.NavBarComponent], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingPage, [{
        type: Component,
        args: [{ selector: 'app-setting', template: "<ion-header [translucent]=\"true\">\n  <app-nav-bar></app-nav-bar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n  <div class=\"ep-page\">\n    <div class=\"ep-page-head\">\n      <p class=\"ep-kicker\">Officer tools</p>\n      <h1>Settings</h1>\n      <p>Device, site, and session controls.</p>\n    </div>\n\n    <section class=\"ep-section\">\n      <div class=\"ep-section__head\">\n        <p class=\"ep-kicker\">Build</p>\n        <h3>App version</h3>\n      </div>\n      <div class=\"ep-stat-grid\">\n        <div class=\"ep-stat\">\n          <div class=\"ep-stat__label\">Installed</div>\n          <div class=\"ep-stat__value ep-stat__value--sm\">{{ app_version }}</div>\n          <div class=\"ep-stat__sub\">{{ app_version_code ? 'Code ' + app_version_code : 'Device build' }}</div>\n        </div>\n        <div class=\"ep-stat\">\n          <div class=\"ep-stat__label\">Published</div>\n          <div class=\"ep-stat__value ep-stat__value--sm\">{{ api_app_version || '\u2014' }}</div>\n          <div class=\"ep-stat__sub\">{{ updateStatusLabel }}</div>\n        </div>\n      </div>\n      <p class=\"ep-ticket__meta\" *ngIf=\"apkSizeLabel\">{{ apkSizeLabel }}</p>\n      <p class=\"ep-update-notes\" *ngIf=\"releaseNotes\">{{ releaseNotes }}</p>\n      <div class=\"ep-actions\">\n        <ion-button expand=\"block\" color=\"light\" [disabled]=\"updateBusy\" (click)=\"checkForUpdate()\">\n          {{ checkingUpdate ? 'Checking\u2026' : 'Check for update' }}\n        </ion-button>\n        <ion-button expand=\"block\" color=\"primary\" *ngIf=\"updateAvailable\" [disabled]=\"updateBusy\" (click)=\"installPublishedUpdate()\">\n          {{ installingUpdate ? 'Installing\u2026' : (forceUpdate ? 'Install required update' : 'Install update') }}\n        </ion-button>\n        <ion-button expand=\"block\" (click)=\"navigate('/dashboard')\">Home</ion-button>\n      </div>\n    </section>\n\n    <section class=\"ep-section\">\n      <div class=\"ep-section__head\">\n        <p class=\"ep-kicker\">Location</p>\n        <h3>Site and zone</h3>\n      </div>\n\n      <ion-select interface=\"action-sheet\" label=\"Site\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"site_id\" [disabled]=\"true\" (ionChange)=\"storeAppLog()\">\n        <ion-select-option *ngFor=\"let site of sites\" [value]=\"site.id\">\n          {{ site.name }}\n        </ion-select-option>\n      </ion-select>\n\n      <ion-select interface=\"action-sheet\" label=\"Zone\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"selected_zone\" (ionChange)=\"storeAppLog()\">\n        <ion-select-option *ngFor=\"let zone of zones\" [value]=\"zone\">\n          {{ zone.name }}\n        </ion-select-option>\n      </ion-select>\n\n      <div class=\"ep-field-row\">\n        <ion-input label=\"Longitude\" label-placement=\"stacked\" fill=\"outline\" [disabled]=\"true\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"position_lng\" (ionChange)=\"storeAppLog()\"></ion-input>\n        <ion-input label=\"Latitude\" label-placement=\"stacked\" fill=\"outline\" [disabled]=\"true\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"position_lat\" (ionChange)=\"storeAppLog()\"></ion-input>\n      </div>\n\n      <p class=\"ep-ticket__meta\">FPN size: {{ getEnviroSizeInBytes() }} bytes</p>\n    </section>\n\n    <section class=\"ep-section\">\n      <div class=\"ep-section__head\">\n        <p class=\"ep-kicker\">Session</p>\n        <h3>Actions</h3>\n      </div>\n      <div class=\"ep-actions\">\n        <ion-button expand=\"block\" color=\"light\" (click)=\"autoLogin()\">\n          <ion-icon slot=\"start\" name=\"key-outline\"></ion-icon>\n          Auto login\n        </ion-button>\n        <ion-button expand=\"block\" (click)=\"ping()\">Ping</ion-button>\n        <ion-button expand=\"block\" color=\"danger\" (click)=\"cancelEnvio()\">Cancel FPN</ion-button>\n        <ion-button expand=\"block\" color=\"danger\" (click)=\"forceCloseApp()\">Force close</ion-button>\n      </div>\n    </section>\n  </div>\n</ion-content>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.AuthService }, { type: i2.DataService }, { type: i3.Router }, { type: i4.ApiService }, { type: i5.AlertController }, { type: i6.ConstantsService }, { type: i5.Platform }, { type: i7.LoadingService }, { type: i8.BackgroundTaskService }, { type: i9.TrackingService }, { type: i10.AppUpdateService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SettingPage, { className: "SettingPage" }); })();
//# sourceMappingURL=setting.page.js.map