import { Component } from '@angular/core';
import { AppLog } from '../../models/app-log';
import { Clipboard } from '@capacitor/clipboard';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/auth.service";
import * as i2 from "../../services/enforcementpro/api.service";
import * as i3 from "../../services/enforcementpro/data.service";
import * as i4 from "@angular/router";
import * as i5 from "@angular/common/http";
import * as i6 from "@ionic/angular";
import * as i7 from "../../services/loading.service";
import * as i8 from "../../services/background-task.service";
import * as i9 from "../../services/patrol.service";
import * as i10 from "../../services/tracking.service";
import * as i11 from "../../services/thermal-printer.service";
import * as i12 from "../../services/queue-sync.service";
import * as i13 from "@angular/common";
import * as i14 from "../../components/nav-bar/nav-bar.component";
function DashboardPage_div_0_ion_note_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-note", 37);
    i0.ɵɵtext(1, " FPN, camera, and queue tools stay locked until patrol starts. Lemo AI can research offences anytime. ");
    i0.ɵɵelementEnd();
} }
function DashboardPage_div_0_div_89_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 38)(1, "h3");
    i0.ɵɵtext(2, "No tickets yet");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Submitted FPNs will appear here.");
    i0.ɵɵelementEnd()();
} }
function DashboardPage_div_0_article_90_ion_badge_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-badge");
    i0.ɵɵtext(1, "Notebook found");
    i0.ɵɵelementEnd();
} }
function DashboardPage_div_0_article_90_ion_button_9_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 45);
    i0.ɵɵlistener("click", function DashboardPage_div_0_article_90_ion_button_9_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const fpn_r5 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.notebookEntry(fpn_r5)); });
    i0.ɵɵtext(1, " Notebook ");
    i0.ɵɵelementEnd();
} }
function DashboardPage_div_0_article_90_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 39)(1, "div", 11)(2, "div")(3, "h3", 12);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 40);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(7, DashboardPage_div_0_article_90_ion_badge_7_Template, 2, 0, "ion-badge", 0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "div", 41);
    i0.ɵɵtemplate(9, DashboardPage_div_0_article_90_ion_button_9_Template, 2, 0, "ion-button", 42);
    i0.ɵɵelementStart(10, "ion-button", 43);
    i0.ɵɵlistener("click", function DashboardPage_div_0_article_90_Template_ion_button_click_10_listener() { const fpn_r5 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.copyFPNNumber(fpn_r5.fpn_number)); });
    i0.ɵɵtext(11, "Copy");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(12, "ion-button", 44);
    i0.ɵɵlistener("click", function DashboardPage_div_0_article_90_Template_ion_button_click_12_listener() { const fpn_r5 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.printFPN(fpn_r5)); });
    i0.ɵɵtext(13, "Print");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const fpn_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(fpn_r5.fpn_number);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", fpn_r5.offender == null ? null : fpn_r5.offender.first_name, " ", fpn_r5.offender == null ? null : fpn_r5.offender.last_name, "");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.notebookEntryIsEmpty(fpn_r5));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.notebookEntryIsEmpty(fpn_r5));
} }
function DashboardPage_div_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div")(1, "ion-header", 1);
    i0.ɵɵelement(2, "ion-router-outlet")(3, "app-nav-bar");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "ion-content", 2)(5, "div", 3)(6, "section", 4)(7, "p", 5);
    i0.ɵɵtext(8, "Duty desk");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "h1");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(11, "p");
    i0.ɵɵtext(12);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 6);
    i0.ɵɵelement(14, "img", 7);
    i0.ɵɵelementStart(15, "ion-button", 8);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_15_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.route("/site")); });
    i0.ɵɵelement(16, "ion-icon", 9);
    i0.ɵɵtext(17, " Change site ");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(18, "section", 10)(19, "div", 11)(20, "div")(21, "p", 5);
    i0.ɵɵtext(22, "Patrol");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(23, "h3", 12);
    i0.ɵɵtext(24);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "span", 13);
    i0.ɵɵtext(26);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 14);
    i0.ɵɵtext(28);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "div", 15)(30, "ion-button", 16);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_30_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.startPatrol()); });
    i0.ɵɵtext(31, " Start patrol ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "ion-button", 17);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_32_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.endPatrol()); });
    i0.ɵɵtext(33, " End patrol ");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(34, DashboardPage_div_0_ion_note_34_Template, 2, 0, "ion-note", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "section", 19)(36, "div", 20)(37, "p", 5);
    i0.ɵɵtext(38, "Lemo AI");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "h2");
    i0.ɵɵtext(40, "Offence support");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(41, "p");
    i0.ɵɵtext(42, "Research legislation, create an FPN, and attach images using the site and zone already selected.");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(43, "ion-button", 21);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_43_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.route("/lemo")); });
    i0.ɵɵelement(44, "ion-icon", 22);
    i0.ɵɵtext(45, " Open Lemo AI ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "section", 19)(47, "div", 20)(48, "p", 5);
    i0.ɵɵtext(49, "Overview");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "h2");
    i0.ɵɵtext(51, "Today at a glance");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(52, "div", 23)(53, "div", 24)(54, "div", 25);
    i0.ɵɵtext(55, "FPNs submitted");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "div", 26);
    i0.ɵɵtext(57);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(58, "div", 24)(59, "div", 25);
    i0.ɵɵtext(60, "On queue");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(61, "div", 26);
    i0.ɵɵtext(62);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(63, "div", 24)(64, "div", 25);
    i0.ɵɵtext(65, "Submit rate");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(66, "div", 26);
    i0.ɵɵtext(67);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(68, "div", 27);
    i0.ɵɵtext(69, "of total records");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(70, "div", 24)(71, "div", 25);
    i0.ɵɵtext(72, "GPS tracking");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(73, "div", 28);
    i0.ɵɵtext(74);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(75, "div", 27);
    i0.ɵɵtext(76);
    i0.ɵɵelementEnd()()()();
    i0.ɵɵelementStart(77, "div", 15)(78, "ion-button", 29);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_78_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.printFoward()); });
    i0.ɵɵelement(79, "ion-icon", 30);
    i0.ɵɵtext(80, " Forward paper ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(81, "ion-button", 31);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_81_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.fpnDuplicate()); });
    i0.ɵɵtext(82, " Remove duplicate ");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(83, "section", 32)(84, "div", 20)(85, "p", 5);
    i0.ɵɵtext(86, "Recent tickets");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(87, "h2");
    i0.ɵɵtext(88, "Issued FPNs");
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(89, DashboardPage_div_0_div_89_Template, 5, 0, "div", 33)(90, DashboardPage_div_0_article_90_Template, 14, 5, "article", 34);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(91, "ion-button", 35);
    i0.ɵɵlistener("click", function DashboardPage_div_0_Template_ion_button_click_91_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.logout()); });
    i0.ɵɵelement(92, "ion-icon", 36);
    i0.ɵɵtext(93, " Sign out ");
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("translucent", true);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("fullscreen", true);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.user.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.selected_site.name);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("src", ctx_r1.getImageUrl(ctx_r1.selected_site.logo), i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance(4);
    i0.ɵɵclassProp("is-active", ctx_r1.isOnPatrol);
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r1.patrolStatus);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ep-chip--live", ctx_r1.isOnPatrol)("ep-chip--warn", !ctx_r1.isOnPatrol);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.isOnPatrol ? "On duty" : "Off duty", " ");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.patrolHours);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", ctx_r1.isOnPatrol);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.isOnPatrol);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", !ctx_r1.isOnPatrol);
    i0.ɵɵadvance(23);
    i0.ɵɵtextInterpolate(ctx_r1.submittedCount);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r1.queueCount);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate1("", ctx_r1.submitRate, "%");
    i0.ɵɵadvance(7);
    i0.ɵɵtextInterpolate(ctx_r1.gpsSummary);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.hasGpsFix ? "Last fix" : "Awaiting fix");
    i0.ɵɵadvance(13);
    i0.ɵɵproperty("ngIf", !(ctx_r1.recent_fpns == null ? null : ctx_r1.recent_fpns.length));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.recent_fpns);
} }
function DashboardPage_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div")(1, "ion-content", 2)(2, "div", 46)(3, "p", 5);
    i0.ɵɵtext(4, "Please wait");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "h2");
    i0.ɵɵtext(6, "Retrieving your information");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(7, "img", 47)(8, "ion-spinner", 48);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("fullscreen", true);
} }
export class DashboardPage {
    get submittedCount() {
        return this.recent_fpns?.length ?? 0;
    }
    get queueCount() {
        const queue = this.data.getEnviroQue();
        return Array.isArray(queue) ? queue.length : 0;
    }
    get totalRecordCount() {
        return this.submittedCount + this.queueCount;
    }
    get submitRate() {
        const total = this.totalRecordCount;
        if (total === 0) {
            return 0;
        }
        return Math.round((this.submittedCount / total) * 100);
    }
    get hasGpsFix() {
        return this.app_log.lat !== '0' && this.app_log.lng !== '0';
    }
    get gpsSummary() {
        if (!this.hasGpsFix) {
            return 'No GPS fix yet';
        }
        return `${this.app_log.lat}, ${this.app_log.lng}`;
    }
    get isOnPatrol() {
        return this.patrol.isOnPatrol();
    }
    get patrolStatus() {
        return this.patrol.getStatusText();
    }
    get patrolHours() {
        return this.patrol.getHoursText();
    }
    constructor(auth, api, data, router, http, alertController, loading, platform, backgroundTasks, patrol, tracking, printer, queueSync) {
        this.auth = auth;
        this.api = api;
        this.data = data;
        this.router = router;
        this.http = http;
        this.alertController = alertController;
        this.loading = loading;
        this.platform = platform;
        this.backgroundTasks = backgroundTasks;
        this.patrol = patrol;
        this.tracking = tracking;
        this.printer = printer;
        this.queueSync = queueSync;
        this.name = '';
        this.url = '';
        this.token = '';
        this.recent_fpns = [];
        this.selected_site = null; // Variable to hold selected site
        this.baseUrl = 'https://app.enforcementpro.co.uk/';
        this.app_log = new AppLog();
        this.user = new User();
        this.loadData();
        this.platform.ready().then(() => {
            this.blockBackButton();
        });
    }
    loadData() {
        this.user = this.data.getUser() || new User();
        this.token = this.data.getToken() || '';
        this.url = this.data.getUrl();
        this.selected_site = this.data.getSelectedSite() || null;
        this.app_log = this.data.getAppLog() || new AppLog();
        this.getRecentFPN();
    }
    async ngOnInit() {
        this.loading.showLoading();
        try {
            await this.data.waitUntilHydrated();
            this.loadData();
            this.init();
            this.checkSelectedSite();
        }
        finally {
            this.loading.hideLoading();
        }
    }
    async ionViewWillEnter() {
        try {
            await this.data.waitUntilHydrated();
        }
        catch {
            // Hydration is best-effort; still leave the wait screen.
        }
        this.loadData();
        this.init();
        this.checkSelectedSite();
    }
    blockBackButton() {
        this.backgroundTasks.registerSubscription(this.platform.backButton.subscribeWithPriority(9999, () => { }));
    }
    async printFoward() {
        try {
            await this.printer.feedPaper();
        }
        catch (error) {
            console.error("Paper feed failed:", error);
            this.presentAlert('Print Error', error?.message || 'Unable to feed printer paper.');
        }
    }
    fpnDuplicate() {
        let enviro_que = this.data.getEnviroQue();
        let counter = 0;
        for (let i = 0; i < this.recent_fpns.length; i++) {
            for (let x = 0; x < enviro_que.length; x++) {
                if (this.recent_fpns[i].offender.town == enviro_que[x].town &&
                    this.recent_fpns[i].offender.first_name == enviro_que[x].first_name &&
                    this.recent_fpns[i].offender.last_name == enviro_que[x].last_name &&
                    this.recent_fpns[i].offence_location == enviro_que[x].offence_location &&
                    this.recent_fpns[i].offence_id == enviro_que[x].offence_id &&
                    this.recent_fpns[i].zone_id == enviro_que[x].zone_id) {
                    this.data.spliceEnviroQue(enviro_que[x]);
                    counter++;
                }
            }
        }
        if (counter > 0) {
            this.presentAlert('Found', 'Duplicate found, thank you for reporting. We removed it from Queue.');
            this.refresh();
        }
        else {
            this.presentAlert('Nothing Found', 'No duplicate found, attempt resubmitting.');
        }
    }
    init() {
        if (!this.checkLoginTimeoutId) {
            this.checkLoginTimeoutId = this.backgroundTasks.setTimeout(() => {
                this.checkLoggedIn();
            }, 4000);
        }
        if (!this.refreshIntervalId) {
            this.refreshIntervalId = this.backgroundTasks.setTimeout(() => {
                this.refresh();
            }, 5000);
        }
        if (!this.pingIntervalId) {
            this.pingIntervalId = this.backgroundTasks.setInterval(() => {
                this.refresh();
                this.ping();
            }, 30000);
        }
        if (!this.checkSelectedSiteTimeoutId) {
            this.checkSelectedSiteTimeoutId = this.backgroundTasks.setTimeout(() => {
                this.checkSelectedSite();
            }, 30000);
        }
        this.tracking.syncTrackingState().catch(() => undefined);
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
        if (this.pingIntervalId) {
            this.backgroundTasks.clearTimer(this.pingIntervalId);
            this.pingIntervalId = null;
        }
        if (this.checkSelectedSiteTimeoutId) {
            this.backgroundTasks.clearTimer(this.checkSelectedSiteTimeoutId);
            this.checkSelectedSiteTimeoutId = null;
        }
    }
    checkSelectedSite() {
        this.selected_site = this.data.getSelectedSite() || this.selected_site || null;
        if (this.selected_site?.id) {
            return;
        }
        this.selected_site = null;
        this.token = this.token || this.data.getToken() || '';
        if (!this.token) {
            this.route('/login');
            return;
        }
        this.route('/site');
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
    getImageUrl(prefix) {
        let url = this.url + '/' + prefix;
        return url;
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
    ping() {
        if (this.token !== '') {
            this.tracking.pingNow().catch(() => undefined);
        }
    }
    async startPatrol() {
        this.patrol.startPatrol(8);
        try {
            await this.tracking.syncTrackingState();
            this.queueSync.start();
            this.refresh();
            this.presentAlert('Patrol Started', 'Location tracking is now active for your patrol hours.');
        }
        catch (error) {
            this.patrol.endPatrol();
            this.presentAlert('Location Required', error?.message || 'Location permission is required to start patrol.');
        }
    }
    async endPatrol() {
        this.patrol.endPatrol();
        await this.tracking.stop();
        this.refresh();
        this.presentAlert('Patrol Ended', 'FPN tools are locked until you start patrol again.');
    }
    getRecentFPN() {
        if (this.user?.id > 0) {
            this.api.getRecentFPNs(this.user.id).subscribe({
                next: (response) => {
                    this.recent_fpns = response.data;
                    // console.log('Response:', response);
                },
                // error: (error) => {
                // console.error('Error:', error);
                // }
            });
        }
    }
    getFpnImageUrl(fpn_number) {
        // Generate the random 0 or 1
        let randomValue = 0; // Generates 0 or 1
        let correctLink = this.getRequestTicket(randomValue, fpn_number);
        if (!correctLink) {
            randomValue = 1;
            correctLink = this.getRequestTicket(randomValue, fpn_number);
        }
        const link = `uploads/tickets/EP${randomValue}_${fpn_number}_PRINT_1_fpn.png`;
        return link;
    }
    async printImageFromUrl(imageUrl) {
        try {
            await this.printer.printImage(imageUrl);
            console.log("Printing completed successfully");
        }
        catch (error) {
            console.error("Complete Print Error:", error);
            this.presentAlert('Print Error', error?.message || 'Unable to print ticket.');
        }
    }
    // Helper function to convert Blob to Base64 string
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                // Remove the data:image/png;base64, prefix if the plugin requires raw base64
                resolve(base64String.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    printFPN(fpn) {
        // console.log(fpn.ticket);
        let ticket_image = this.baseUrl + 'uploads/tickets/' + fpn.ticket;
        this.printImageFromUrl(ticket_image);
    }
    getRequestTicket(randomValue, fpn_number) {
        const url = `https://app.enforcementpro.co.uk/uploads/tickets/EP${randomValue}_${fpn_number}_PRINT_1_fpn.png`;
        // let user_id = this.auth.getUser().id;
        this.http.get(url, { responseType: 'blob' }).subscribe({
            next: (response) => {
                // this.recent_fpns = response.data;
                console.log('Response:', response);
                return true;
            },
            error: (error) => {
                console.error('Error1:', error);
                return false;
            }
        });
    }
    onSiteChange() {
        this.data.setSelectedSite(this.selected_site);
    }
    route(route) {
        this.router.navigate([route]);
    }
    logout() {
        this.loading.showLoading();
        let queue = this.data.getEnviroQue();
        // Check if there are any FPNs with an empty notebook entry
        let outstandingNotebookEntries = this.recent_fpns.some(fpn => this.notebookEntryIsEmpty(fpn));
        if (queue.length == 0 && !outstandingNotebookEntries) {
            // Proceed with logout if there are no outstanding notebook entries
            // this.clearTimers();
            this.loading.hideLoading();
            this.auth.logout();
        }
        else if (outstandingNotebookEntries) {
            this.loading.hideLoading();
            // Alert user to complete all notebook entries before logging out
            this.presentAlert('Error', 'Please complete all outstanding Notebook Entries before logging out.');
        }
        else {
            // Alert user if there are FPNs in the queue
            this.loading.hideLoading();
            this.presentAlert('Error', 'Found FPNs on Queue, please submit before logging out.');
        }
    }
    copyFPNNumber(fpn_number) {
        Clipboard.write({
            string: fpn_number
        });
        this.presentAlert('Successful', 'Copied FPN Number to Clipboard');
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: 'Okay'
                }
            ],
        });
        await alert.present();
    }
    notebookEntry(fpn) {
        this.router.navigate(['/notebook', fpn.id], { queryParams: { fpn_number: fpn.fpn_number } });
        console.log(fpn.notebook_entry); //notebook_entry
    }
    notebookEntryIsEmpty(fpn) {
        return !fpn.notebook_entry || fpn.notebook_entry.length === 0;
    }
    static { this.ɵfac = function DashboardPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardPage)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.DataService), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i5.HttpClient), i0.ɵɵdirectiveInject(i6.AlertController), i0.ɵɵdirectiveInject(i7.LoadingService), i0.ɵɵdirectiveInject(i6.Platform), i0.ɵɵdirectiveInject(i8.BackgroundTaskService), i0.ɵɵdirectiveInject(i9.PatrolService), i0.ɵɵdirectiveInject(i10.TrackingService), i0.ɵɵdirectiveInject(i11.ThermalPrinterService), i0.ɵɵdirectiveInject(i12.QueueSyncService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DashboardPage, selectors: [["app-dashboard"]], decls: 2, vars: 2, consts: [[4, "ngIf"], [3, "translucent"], [3, "fullscreen"], [1, "ep-page"], [1, "ep-hero"], [1, "ep-kicker"], [1, "ep-hero__site"], ["alt", "", 3, "src"], ["fill", "clear", "size", "small", 3, "click"], ["slot", "start", "name", "pencil-outline"], [1, "ep-patrol"], [1, "ep-ticket__top"], [1, "ep-ticket__title"], [1, "ep-chip"], [1, "ep-patrol__hours"], [1, "ep-actions", "ep-actions--split"], ["expand", "block", "color", "success", 3, "click", "disabled"], ["expand", "block", "color", "medium", 3, "click", "disabled"], ["class", "ep-note", 4, "ngIf"], [1, "ep-section"], [1, "ep-section__head"], ["expand", "block", "color", "primary", 3, "click"], ["slot", "start", "name", "sparkles-outline"], [1, "ep-stat-grid"], [1, "ep-stat"], [1, "ep-stat__label"], [1, "ep-stat__value"], [1, "ep-stat__sub"], [1, "ep-stat__value", "ep-stat__value--sm"], ["expand", "block", 3, "click"], ["slot", "start", "name", "print-outline"], ["expand", "block", "color", "medium", 3, "click"], [1, "ep-section", 2, "margin-top", "14px"], ["class", "ep-empty", 4, "ngIf"], ["class", "ep-ticket", 4, "ngFor", "ngForOf"], ["expand", "block", "fill", "clear", 1, "ep-logout", 3, "click"], ["slot", "start", "name", "log-out-outline"], [1, "ep-note"], [1, "ep-empty"], [1, "ep-ticket"], [1, "ep-ticket__meta"], [1, "ep-ticket__actions"], ["size", "small", 3, "click", 4, "ngIf"], ["size", "small", "color", "medium", 3, "click"], ["size", "small", "color", "dark", 3, "click"], ["size", "small", 3, "click"], [1, "ep-wait"], ["src", "assets/ic_app_logo.png", "alt", "Enforcement Pro"], ["name", "crescent"]], template: function DashboardPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, DashboardPage_div_0_Template, 94, 24, "div", 0)(1, DashboardPage_div_1_Template, 9, 1, "div", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", ctx.selected_site == null ? null : ctx.selected_site.id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !(ctx.selected_site == null ? null : ctx.selected_site.id));
        } }, dependencies: [i13.NgForOf, i13.NgIf, i6.IonBadge, i6.IonButton, i6.IonContent, i6.IonHeader, i6.IonIcon, i6.IonNote, i6.IonSpinner, i6.IonRouterOutlet, i14.NavBarComponent], styles: [".ep-hero__site[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n\n.ep-hero__site[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  height: 40px;\n  background: #fff;\n  border-radius: 10px;\n  padding: 4px;\n}\n\n.ep-hero__site[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --color: #fff8e8;\n  margin: 0;\n  min-height: 36px;\n}\n\n.ep-logout[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  --color: var(--ep-crimson);\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardPage, [{
        type: Component,
        args: [{ selector: 'app-dashboard', template: "<div *ngIf=\"selected_site?.id\">\n  <ion-header [translucent]=\"true\">\n    <ion-router-outlet></ion-router-outlet>\n    <app-nav-bar></app-nav-bar>\n  </ion-header>\n\n  <ion-content [fullscreen]=\"true\">\n    <div class=\"ep-page\">\n      <section class=\"ep-hero\">\n        <p class=\"ep-kicker\">Duty desk</p>\n        <h1>{{ user.name }}</h1>\n        <p>{{ selected_site.name }}</p>\n        <div class=\"ep-hero__site\">\n          <img [src]=\"getImageUrl(selected_site.logo)\" alt=\"\" />\n          <ion-button fill=\"clear\" size=\"small\" (click)=\"route('/site')\">\n            <ion-icon slot=\"start\" name=\"pencil-outline\"></ion-icon>\n            Change site\n          </ion-button>\n        </div>\n      </section>\n\n      <section class=\"ep-patrol\" [class.is-active]=\"isOnPatrol\">\n        <div class=\"ep-ticket__top\">\n          <div>\n            <p class=\"ep-kicker\">Patrol</p>\n            <h3 class=\"ep-ticket__title\">{{ patrolStatus }}</h3>\n          </div>\n          <span class=\"ep-chip\" [class.ep-chip--live]=\"isOnPatrol\" [class.ep-chip--warn]=\"!isOnPatrol\">\n            {{ isOnPatrol ? 'On duty' : 'Off duty' }}\n          </span>\n        </div>\n        <div class=\"ep-patrol__hours\">{{ patrolHours }}</div>\n        <div class=\"ep-actions ep-actions--split\">\n          <ion-button expand=\"block\" color=\"success\" [disabled]=\"isOnPatrol\" (click)=\"startPatrol()\">\n            Start patrol\n          </ion-button>\n          <ion-button expand=\"block\" color=\"medium\" [disabled]=\"!isOnPatrol\" (click)=\"endPatrol()\">\n            End patrol\n          </ion-button>\n        </div>\n        <ion-note *ngIf=\"!isOnPatrol\" class=\"ep-note\">\n          FPN, camera, and queue tools stay locked until patrol starts. Lemo AI can research offences anytime.\n        </ion-note>\n      </section>\n\n      <section class=\"ep-section\">\n        <div class=\"ep-section__head\">\n          <p class=\"ep-kicker\">Lemo AI</p>\n          <h2>Offence support</h2>\n        </div>\n        <p>Research legislation, create an FPN, and attach images using the site and zone already selected.</p>\n        <ion-button expand=\"block\" color=\"primary\" (click)=\"route('/lemo')\">\n          <ion-icon slot=\"start\" name=\"sparkles-outline\"></ion-icon>\n          Open Lemo AI\n        </ion-button>\n      </section>\n\n      <section class=\"ep-section\">\n        <div class=\"ep-section__head\">\n          <p class=\"ep-kicker\">Overview</p>\n          <h2>Today at a glance</h2>\n        </div>\n        <div class=\"ep-stat-grid\">\n          <div class=\"ep-stat\">\n            <div class=\"ep-stat__label\">FPNs submitted</div>\n            <div class=\"ep-stat__value\">{{ submittedCount }}</div>\n          </div>\n          <div class=\"ep-stat\">\n            <div class=\"ep-stat__label\">On queue</div>\n            <div class=\"ep-stat__value\">{{ queueCount }}</div>\n          </div>\n          <div class=\"ep-stat\">\n            <div class=\"ep-stat__label\">Submit rate</div>\n            <div class=\"ep-stat__value\">{{ submitRate }}%</div>\n            <div class=\"ep-stat__sub\">of total records</div>\n          </div>\n          <div class=\"ep-stat\">\n            <div class=\"ep-stat__label\">GPS tracking</div>\n            <div class=\"ep-stat__value ep-stat__value--sm\">{{ gpsSummary }}</div>\n            <div class=\"ep-stat__sub\">{{ hasGpsFix ? 'Last fix' : 'Awaiting fix' }}</div>\n          </div>\n        </div>\n      </section>\n\n      <div class=\"ep-actions ep-actions--split\">\n        <ion-button expand=\"block\" (click)=\"printFoward()\">\n          <ion-icon slot=\"start\" name=\"print-outline\"></ion-icon>\n          Forward paper\n        </ion-button>\n        <ion-button expand=\"block\" color=\"medium\" (click)=\"fpnDuplicate()\">\n          Remove duplicate\n        </ion-button>\n      </div>\n\n      <section class=\"ep-section\" style=\"margin-top: 14px;\">\n        <div class=\"ep-section__head\">\n          <p class=\"ep-kicker\">Recent tickets</p>\n          <h2>Issued FPNs</h2>\n        </div>\n\n        <div class=\"ep-empty\" *ngIf=\"!recent_fpns?.length\">\n          <h3>No tickets yet</h3>\n          <p>Submitted FPNs will appear here.</p>\n        </div>\n\n        <article class=\"ep-ticket\" *ngFor=\"let fpn of recent_fpns\">\n          <div class=\"ep-ticket__top\">\n            <div>\n              <h3 class=\"ep-ticket__title\">{{ fpn.fpn_number }}</h3>\n              <p class=\"ep-ticket__meta\">{{ fpn.offender?.first_name }} {{ fpn.offender?.last_name }}</p>\n            </div>\n            <ion-badge *ngIf=\"!notebookEntryIsEmpty(fpn)\">Notebook found</ion-badge>\n          </div>\n          <div class=\"ep-ticket__actions\">\n            <ion-button *ngIf=\"notebookEntryIsEmpty(fpn)\" size=\"small\" (click)=\"notebookEntry(fpn)\">\n              Notebook\n            </ion-button>\n            <ion-button size=\"small\" color=\"medium\" (click)=\"copyFPNNumber(fpn.fpn_number)\">Copy</ion-button>\n            <ion-button size=\"small\" color=\"dark\" (click)=\"printFPN(fpn)\">Print</ion-button>\n          </div>\n        </article>\n      </section>\n\n      <ion-button expand=\"block\" fill=\"clear\" class=\"ep-logout\" (click)=\"logout()\">\n        <ion-icon slot=\"start\" name=\"log-out-outline\"></ion-icon>\n        Sign out\n      </ion-button>\n    </div>\n  </ion-content>\n</div>\n\n<div *ngIf=\"!selected_site?.id\">\n  <ion-content [fullscreen]=\"true\">\n    <div class=\"ep-wait\">\n      <p class=\"ep-kicker\">Please wait</p>\n      <h2>Retrieving your information</h2>\n      <img src=\"assets/ic_app_logo.png\" alt=\"Enforcement Pro\" />\n      <ion-spinner name=\"crescent\"></ion-spinner>\n    </div>\n  </ion-content>\n</div>\n", styles: [".ep-hero__site {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n\n.ep-hero__site img {\n  height: 40px;\n  background: #fff;\n  border-radius: 10px;\n  padding: 4px;\n}\n\n.ep-hero__site ion-button {\n  --color: #fff8e8;\n  margin: 0;\n  min-height: 36px;\n}\n\n.ep-logout {\n  margin-top: 8px;\n  --color: var(--ep-crimson);\n}\n"] }]
    }], () => [{ type: i1.AuthService }, { type: i2.ApiService }, { type: i3.DataService }, { type: i4.Router }, { type: i5.HttpClient }, { type: i6.AlertController }, { type: i7.LoadingService }, { type: i6.Platform }, { type: i8.BackgroundTaskService }, { type: i9.PatrolService }, { type: i10.TrackingService }, { type: i11.ThermalPrinterService }, { type: i12.QueueSyncService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DashboardPage, { className: "DashboardPage" }); })();
//# sourceMappingURL=dashboard.page.js.map