import { Component } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
// import { App } from '@capacitor/app';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { enviroStepperStep, findFirstMissingFpnField } from '../../helpers/fpn-core-validation';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/auth.service";
import * as i2 from "../../services/enforcementpro/data.service";
import * as i3 from "../../services/enforcementpro/api.service";
import * as i4 from "@ionic/angular";
import * as i5 from "@angular/router";
import * as i6 from "../../services/loading.service";
import * as i7 from "../../services/background-task.service";
import * as i8 from "../../services/fpn-submission.service";
import * as i9 from "../../services/patrol.service";
import * as i10 from "../../services/tracking.service";
import * as i11 from "../../services/thermal-printer.service";
import * as i12 from "../../services/lemo-encourage.service";
import * as i13 from "../../services/offline-ticket.service";
import * as i14 from "../../services/queue-sync.service";
function EnviroPage_app_step1_14_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step1");
} }
function EnviroPage_app_step2_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step2");
} }
function EnviroPage_app_step3_16_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step3");
} }
function EnviroPage_app_step4_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step4");
} }
function EnviroPage_app_step5_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step5");
} }
function EnviroPage_app_step_evidence_19_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step-evidence");
} }
function EnviroPage_app_step6_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step6");
} }
function EnviroPage_app_step7_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "app-step7");
} }
function EnviroPage_div_23_ion_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 17);
    i0.ɵɵlistener("click", function EnviroPage_div_23_ion_button_1_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.confirmLeave()); });
    i0.ɵɵtext(1, " Cancel ");
    i0.ɵɵelementEnd();
} }
function EnviroPage_div_23_ion_button_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 17);
    i0.ɵɵlistener("click", function EnviroPage_div_23_ion_button_2_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.previousStep()); });
    i0.ɵɵtext(1, " Back ");
    i0.ɵɵelementEnd();
} }
function EnviroPage_div_23_p_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 18);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("Next: ", ctx_r2.nextStepTitle, "");
} }
function EnviroPage_div_23_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵtemplate(1, EnviroPage_div_23_ion_button_1_Template, 2, 0, "ion-button", 13)(2, EnviroPage_div_23_ion_button_2_Template, 2, 0, "ion-button", 13);
    i0.ɵɵelementStart(3, "ion-button", 14);
    i0.ɵɵlistener("click", function EnviroPage_div_23_Template_ion_button_click_3_listener() { i0.ɵɵrestoreView(_r1); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.nextStep()); });
    i0.ɵɵtext(4, " Continue ");
    i0.ɵɵelement(5, "ion-icon", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, EnviroPage_div_23_p_6_Template, 2, 1, "p", 16);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("ep-wizard-bar--split", ctx_r2.currentStep > 1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.currentStep === 1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r2.currentStep > 1);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", ctx_r2.nextStepTitle);
} }
function EnviroPage_div_24_ion_button_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 17);
    i0.ɵɵlistener("click", function EnviroPage_div_24_ion_button_5_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r2 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r2.nextStep()); });
    i0.ɵɵtext(1, "Add notebook");
    i0.ɵɵelementEnd();
} }
function EnviroPage_div_24_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 19)(1, "ion-button", 17);
    i0.ɵɵlistener("click", function EnviroPage_div_24_Template_ion_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.previousStep()); });
    i0.ɵɵtext(2, "Back");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ion-button", 20);
    i0.ɵɵlistener("click", function EnviroPage_div_24_Template_ion_button_click_3_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.saveFPN()); });
    i0.ɵɵtext(4, "Save");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, EnviroPage_div_24_ion_button_5_Template, 2, 0, "ion-button", 13);
    i0.ɵɵelementStart(6, "ion-button", 21);
    i0.ɵɵlistener("click", function EnviroPage_div_24_Template_ion_button_click_6_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.submitForm()); });
    i0.ɵɵtext(7, "Submit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(8, "ion-button", 22);
    i0.ɵɵlistener("click", function EnviroPage_div_24_Template_ion_button_click_8_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.confirmLeave()); });
    i0.ɵɵtext(9, "Cancel");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("ngIf", ctx_r2.currentStep === 7);
} }
export class EnviroPage {
    constructor(auth, data, api, alertController, route2, router, loading, platform, backgroundTasks, fpnSubmission, patrol, tracking, printer, encourage, offlineTicket, queueSync) {
        this.auth = auth;
        this.data = data;
        this.api = api;
        this.alertController = alertController;
        this.route2 = route2;
        this.router = router;
        this.loading = loading;
        this.platform = platform;
        this.backgroundTasks = backgroundTasks;
        this.fpnSubmission = fpnSubmission;
        this.patrol = patrol;
        this.tracking = tracking;
        this.printer = printer;
        this.encourage = encourage;
        this.offlineTicket = offlineTicket;
        this.queueSync = queueSync;
        this.selected_site = null;
        this.currentStep = 1;
        this.stepTitles = [
            '',
            'Site offence',
            'Offender',
            'Validation',
            'Offence',
            'Location',
            'Evidence',
            'Confirm',
            'Notebook',
        ];
        this.baseUrl = 'https://app.enforcementpro.co.uk/';
        this.isSubmitting = false;
        this.user = new User();
        this.app_log = new AppLog();
        this.enviro_post = new EnviroPost();
        this.platform.ready().then(() => {
            this.blockBackButton();
            // this.listenToAppResume();
        });
        this.loadData();
        this.route2.queryParams.subscribe(params => {
            this.applyResumeStep(parseInt(params['currentStep'], 10));
        });
    }
    async ngOnInit() {
        this.loading.showLoading();
        await this.data.init();
        this.loadData();
        this.applyResumeStep(parseInt(this.route2.snapshot.queryParamMap.get('currentStep') || '', 10));
        if (!this.patrol.canUseFpnTools()) {
            this.loading.hideLoading();
            this.presentAlert('Patrol Required', 'Start patrol from the dashboard before using FPN tools.');
            this.router.navigate(['/dashboard']);
            return;
        }
        this.init();
        this.loading.hideLoading();
    }
    init() {
        this.tracking.syncTrackingState().catch(() => undefined);
        this.backgroundTasks.setTimeout(() => {
            this.refresh();
        }, 5000);
        this.backgroundTasks.setInterval(() => {
            this.ping();
        }, 30000); // 30 seconds in milliseconds
    }
    blockBackButton() {
        this.backgroundTasks.registerSubscription(this.platform.backButton.subscribeWithPriority(9999, () => {
            if (this.currentStep > 1) {
                this.previousStep();
                return;
            }
            void this.confirmLeave();
        }));
    }
    navigate(route) {
        this.router.navigate([route]);
    }
    route(route) {
        this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
    }
    loadData() {
        this.selected_site = this.data.getSelectedSite();
        this.enviro_post = this.data.getEnviroPost();
        this.user = this.data.getUser();
        this.assignOfficerId();
        this.app_log = this.data.getAppLog() || new AppLog();
        if (!this.data.checkFPNData()) {
            this.getFPNData();
        }
    }
    getFPNData() {
        this.api.getFPNData(this.selected_site.id).subscribe({
            next: (data) => {
                this.data.applyFPNData(data);
            },
            error: (error) => {
                if (error.status == 500) {
                    this.presentAlert('Server Error', 'Please contact support');
                }
                else if (error.status == 401) {
                    this.presentAlert('Auth Failed', 'Please login again.');
                }
                else if (error.status == 0) {
                    this.presentAlert('Network Error', 'No internet connection. Please place in que, find better reception and try again.');
                }
                else {
                    this.presentAlert('Error', error.message);
                }
            }
        });
    }
    extractOffence(site_offences) {
        const groups = site_offences.map(site_offence => site_offence.offences);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    get stepTitle() {
        return this.stepTitles[this.currentStep] ?? '';
    }
    get stepProgress() {
        return ((this.currentStep - 1) / 7) * 100;
    }
    get nextStepTitle() {
        return this.stepTitles[this.currentStep + 1] ?? '';
    }
    extractOffenceGroups(offences) {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    validationOptions() {
        return { requireZone: this.data.getZones().length > 0 };
    }
    firstMissingField() {
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        return findFirstMissingFpnField(this.enviro_post, this.validationOptions());
    }
    validator() {
        const gap = this.firstMissingField();
        if (gap && gap.stepperStep <= this.currentStep) {
            this.presentAlert('Wait!', gap.message);
            return false;
        }
        return true;
    }
    submitValidator() {
        const gap = this.firstMissingField();
        if (gap) {
            this.presentAlert('Wait!', gap.message);
            this.currentStep = gap.stepperStep;
            return false;
        }
        this.assignOfficerId();
        return true;
    }
    coreFpnValidator() {
        return this.submitValidator();
    }
    applyResumeStep(parsed) {
        const needed = enviroStepperStep(this.data.getEnviroPost() || this.enviro_post, this.validationOptions());
        if (Number.isFinite(parsed) && parsed > 1) {
            this.currentStep = Math.min(parsed, needed);
            return;
        }
        this.currentStep = needed;
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
    nextStep() {
        let checker = this.validator();
        if (checker) {
            if (this.currentStep < 8) {
                this.currentStep++;
            }
        }
    }
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
        }
    }
    assignOfficerId() {
        if (this.enviro_post.officer_id == 0) {
            if (this.user && this.user.id > 0) {
                this.app_log.user_id = this.user.id.toString();
                this.enviro_post.officer_id = this.user.id;
            }
            else {
                this.user = this.data.getUser();
                if (this.user.id > 0) {
                    this.app_log.user_id = this.user.id.toString();
                    this.enviro_post.officer_id = this.user.id;
                }
            }
            this.data.setAppLog(this.app_log);
            this.data.setEnviroPost(this.enviro_post);
        }
    }
    submitForm() {
        if (this.isSubmitting) {
            return;
        }
        let checker = this.submitValidator();
        if (checker) {
            this.isSubmitting = true;
            this.loading.showLoading();
            this.assignOfficerId();
            this.fpnSubmission.submit(this.enviro_post)
                .then(async (result) => {
                this.loading.hideLoading();
                this.isSubmitting = false;
                if (result.status === 'posted') {
                    this.fpn = result.response?.data || result.response;
                    if (this.fpn?.fpn_number) {
                        Clipboard.write({
                            string: this.fpn.fpn_number
                        });
                    }
                    const ticketUrl = this.resolveServerTicketUrl(this.fpn || result.response, this.fpn?.fpn_number || result.response?.fpn_number);
                    if (ticketUrl) {
                        await this.printImageFromUrl(ticketUrl);
                    }
                    const pepTalk = this.encourage.line(this.encourage.recordPosted());
                    this.presentAlert('Success', `${result.message}\n\n${pepTalk}`);
                    this.cancel();
                    return;
                }
                if (result.status === 'queued') {
                    if (!result.message.includes('already uploading')) {
                        this.offlineTicket.printFor(this.enviro_post).catch(() => undefined);
                    }
                    this.queueSync.start();
                    this.presentAlert('Queued', result.message);
                    this.cancel();
                    return;
                }
                this.presentAlert(result.status === 'blocked' ? 'Patrol Required' : 'Error', result.message);
            })
                .catch((error) => {
                this.loading.hideLoading();
                this.isSubmitting = false;
                this.presentAlert('Error', error?.message || 'Unable to submit FPN.');
            });
        }
    }
    refresh() {
        this.loadData();
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['Okay'],
        });
        await alert.present();
    }
    async confirmLeave() {
        const alert = await this.alertController.create({
            header: 'Leave FPN?',
            message: 'Keep this draft for later, or discard it?',
            buttons: [
                { text: 'Stay', role: 'cancel' },
                {
                    text: 'Keep draft',
                    handler: () => {
                        this.router.navigate(['/dashboard']);
                    },
                },
                {
                    text: 'Discard',
                    role: 'destructive',
                    handler: () => {
                        this.cancel();
                    },
                },
            ],
        });
        await alert.present();
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
    cancel(destination = '/dashboard') {
        this.currentStep = 1;
        this.enviro_post = new EnviroPost();
        this.data.setEnviroPost(this.enviro_post);
        this.router.navigate([destination]);
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
        this.tracking.pingNow().catch(() => undefined);
    }
    resolveServerTicketUrl(payload, fpnNumber) {
        const ticket = payload?.ticket || payload?.ticket_image || payload?.print_ticket || payload?.data?.ticket;
        if (typeof ticket === 'string' && ticket.trim()) {
            if (ticket.startsWith('http://') || ticket.startsWith('https://')) {
                return ticket;
            }
            const path = ticket.includes('/') ? ticket.replace(/^\//, '') : `uploads/tickets/${ticket}`;
            return `${this.baseUrl}${path}`;
        }
        const number = String(fpnNumber || payload?.fpn_number || payload?.data?.fpn_number || '').trim();
        if (number) {
            return `${this.baseUrl}uploads/tickets/EP1_${number}_PRINT_1_fpn.png`;
        }
        return null;
    }
    saveFPN() {
        if (this.isSubmitting) {
            return;
        }
        let checker = this.coreFpnValidator();
        if (checker) {
            this.isSubmitting = true;
            this.loading.showLoading();
            let queue = this.data.getEnviroQue();
            if (queue.length < 25) {
                this.assignOfficerId();
                this.fpnSubmission.queueForLater(this.enviro_post)
                    .then((result) => {
                    this.loading.hideLoading();
                    this.isSubmitting = false;
                    if (result.status === 'queued') {
                        this.offlineTicket.printFor(this.enviro_post).catch(() => undefined);
                        this.presentAlert('FPN Saved', 'FPN Saved');
                        this.cancel('/queue');
                        return;
                    }
                    this.presentAlert(result.status === 'blocked' ? 'Patrol Required' : 'Error', result.message);
                })
                    .catch((error) => {
                    this.loading.hideLoading();
                    this.isSubmitting = false;
                    this.presentAlert('Error', error?.message || 'Unable to save FPN.');
                });
            }
            else {
                this.loading.hideLoading();
                this.isSubmitting = false;
                this.presentAlert('Error', 'Queue has exceeded 25, please submit. Submit some FPNs on queue to increase space.');
            }
        }
    }
    static { this.ɵfac = function EnviroPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EnviroPage)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.ApiService), i0.ɵɵdirectiveInject(i4.AlertController), i0.ɵɵdirectiveInject(i5.ActivatedRoute), i0.ɵɵdirectiveInject(i5.Router), i0.ɵɵdirectiveInject(i6.LoadingService), i0.ɵɵdirectiveInject(i4.Platform), i0.ɵɵdirectiveInject(i7.BackgroundTaskService), i0.ɵɵdirectiveInject(i8.FpnSubmissionService), i0.ɵɵdirectiveInject(i9.PatrolService), i0.ɵɵdirectiveInject(i10.TrackingService), i0.ɵɵdirectiveInject(i11.ThermalPrinterService), i0.ɵɵdirectiveInject(i12.LemoEncourageService), i0.ɵɵdirectiveInject(i13.OfflineTicketService), i0.ɵɵdirectiveInject(i14.QueueSyncService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EnviroPage, selectors: [["app-enviro"]], decls: 25, vars: 18, consts: [[3, "translucent"], [3, "photoCount", "currentStep"], [1, "ep-steps"], [1, "ep-steps__meta"], [1, "ep-steps__title"], [1, "ep-steps__track"], [1, "ep-steps__fill"], [3, "ngSwitch"], [4, "ngSwitchCase"], [1, "ep-wizard-footer"], ["class", "ep-wizard-bar", 3, "ep-wizard-bar--split", 4, "ngIf"], ["class", "ep-wizard-bar ep-wizard-bar--grid", 4, "ngIf"], [1, "ep-wizard-bar"], ["expand", "block", "color", "medium", 3, "click", 4, "ngIf"], ["expand", "block", "color", "primary", 1, "ep-wizard-bar__next", 3, "click"], ["slot", "end", "name", "arrow-forward"], ["class", "ep-wizard-bar__hint", 4, "ngIf"], ["expand", "block", "color", "medium", 3, "click"], [1, "ep-wizard-bar__hint"], [1, "ep-wizard-bar", "ep-wizard-bar--grid"], ["expand", "block", "color", "light", 3, "click"], ["expand", "block", "color", "success", 3, "click"], ["expand", "block", "color", "medium", "fill", "outline", 3, "click"]], template: function EnviroPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-header", 0);
            i0.ɵɵelement(1, "ion-router-outlet")(2, "app-nav-bar", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "ion-content");
            i0.ɵɵelement(4, "router-outlet");
            i0.ɵɵelementStart(5, "div", 2)(6, "div", 3)(7, "span");
            i0.ɵɵtext(8);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "span", 4);
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "div", 5);
            i0.ɵɵelement(12, "div", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementContainerStart(13, 7);
            i0.ɵɵtemplate(14, EnviroPage_app_step1_14_Template, 1, 0, "app-step1", 8)(15, EnviroPage_app_step2_15_Template, 1, 0, "app-step2", 8)(16, EnviroPage_app_step3_16_Template, 1, 0, "app-step3", 8)(17, EnviroPage_app_step4_17_Template, 1, 0, "app-step4", 8)(18, EnviroPage_app_step5_18_Template, 1, 0, "app-step5", 8)(19, EnviroPage_app_step_evidence_19_Template, 1, 0, "app-step-evidence", 8)(20, EnviroPage_app_step6_20_Template, 1, 0, "app-step6", 8)(21, EnviroPage_app_step7_21_Template, 1, 0, "app-step7", 8);
            i0.ɵɵelementContainerEnd();
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "ion-footer", 9);
            i0.ɵɵtemplate(23, EnviroPage_div_23_Template, 7, 5, "div", 10)(24, EnviroPage_div_24_Template, 10, 1, "div", 11);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("photoCount", ctx.enviro_post.offence_images.length)("currentStep", ctx.currentStep);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate1("Step ", ctx.currentStep, " of 8");
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.stepTitle);
            i0.ɵɵadvance(2);
            i0.ɵɵstyleProp("--progress", ctx.stepProgress + "%");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitch", ctx.currentStep);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 1);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 2);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 3);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 4);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 5);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 6);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 7);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngSwitchCase", 8);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.currentStep < 7);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.currentStep > 6);
        } }, styles: ["[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.ep-wizard-footer[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 20;\n  background: #fffdf7;\n  box-shadow: 0 -12px 28px rgba(16, 35, 45, 0.14);\n}\n\n.ep-wizard-bar[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n  padding: 12px 16px calc(14px + env(safe-area-inset-bottom));\n}\n\n.ep-wizard-bar[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 54px;\n  font-size: 17px;\n}\n\n.ep-wizard-bar__next[_ngcontent-%COMP%] {\n  --background: #c9a227;\n  --color: #10232d;\n  font-weight: 800;\n}\n\n.ep-wizard-bar__hint[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  margin: 0;\n  text-align: center;\n  font-size: 13px;\n  font-weight: 700;\n  color: #5a6a72;\n}\n\n.ep-wizard-bar--split[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr 1.4fr;\n}\n\n.ep-wizard-bar--grid[_ngcontent-%COMP%] {\n  grid-template-columns: 1fr 1fr;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EnviroPage, [{
        type: Component,
        args: [{ selector: 'app-enviro', template: "<ion-header [translucent]=\"true\">\n    <ion-router-outlet></ion-router-outlet>\n    <app-nav-bar\n        [photoCount]=\"enviro_post.offence_images.length\"\n        [currentStep]=\"currentStep\">\n    </app-nav-bar>\n</ion-header>\n\n<ion-content>\n  <router-outlet></router-outlet>\n\n  <div class=\"ep-steps\">\n    <div class=\"ep-steps__meta\">\n      <span>Step {{ currentStep }} of 8</span>\n      <span class=\"ep-steps__title\">{{ stepTitle }}</span>\n    </div>\n    <div class=\"ep-steps__track\">\n      <div class=\"ep-steps__fill\" [style.--progress]=\"stepProgress + '%'\"></div>\n    </div>\n  </div>\n\n  <ng-container [ngSwitch]=\"currentStep\">\n      <app-step1 *ngSwitchCase=\"1\"></app-step1>\n      <app-step2 *ngSwitchCase=\"2\"></app-step2>\n      <app-step3 *ngSwitchCase=\"3\"></app-step3>\n      <app-step4 *ngSwitchCase=\"4\"></app-step4>\n      <app-step5 *ngSwitchCase=\"5\"></app-step5>\n      <app-step-evidence *ngSwitchCase=\"6\"></app-step-evidence>\n      <app-step6 *ngSwitchCase=\"7\"></app-step6>\n      <app-step7 *ngSwitchCase=\"8\"></app-step7>\n  </ng-container>\n</ion-content>\n\n<ion-footer class=\"ep-wizard-footer\">\n  <div class=\"ep-wizard-bar\" [class.ep-wizard-bar--split]=\"currentStep > 1\" *ngIf=\"currentStep < 7\">\n    <ion-button expand=\"block\" color=\"medium\" *ngIf=\"currentStep === 1\" (click)=\"confirmLeave()\">\n      Cancel\n    </ion-button>\n    <ion-button expand=\"block\" color=\"medium\" *ngIf=\"currentStep > 1\" (click)=\"previousStep()\">\n      Back\n    </ion-button>\n    <ion-button expand=\"block\" color=\"primary\" class=\"ep-wizard-bar__next\" (click)=\"nextStep()\">\n      Continue\n      <ion-icon slot=\"end\" name=\"arrow-forward\"></ion-icon>\n    </ion-button>\n    <p class=\"ep-wizard-bar__hint\" *ngIf=\"nextStepTitle\">Next: {{ nextStepTitle }}</p>\n  </div>\n\n  <div class=\"ep-wizard-bar ep-wizard-bar--grid\" *ngIf=\"currentStep > 6\">\n    <ion-button expand=\"block\" color=\"medium\" (click)=\"previousStep()\">Back</ion-button>\n    <ion-button expand=\"block\" color=\"light\" (click)=\"saveFPN()\">Save</ion-button>\n    <ion-button expand=\"block\" color=\"medium\" *ngIf=\"currentStep === 7\" (click)=\"nextStep()\">Add notebook</ion-button>\n    <ion-button expand=\"block\" color=\"success\" (click)=\"submitForm()\">Submit</ion-button>\n    <ion-button expand=\"block\" color=\"medium\" fill=\"outline\" (click)=\"confirmLeave()\">Cancel</ion-button>\n  </div>\n</ion-footer>\n", styles: [":host {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.ep-wizard-footer {\n  position: relative;\n  z-index: 20;\n  background: #fffdf7;\n  box-shadow: 0 -12px 28px rgba(16, 35, 45, 0.14);\n}\n\n.ep-wizard-bar {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n  padding: 12px 16px calc(14px + env(safe-area-inset-bottom));\n}\n\n.ep-wizard-bar ion-button {\n  margin: 0;\n  min-height: 54px;\n  font-size: 17px;\n}\n\n.ep-wizard-bar__next {\n  --background: #c9a227;\n  --color: #10232d;\n  font-weight: 800;\n}\n\n.ep-wizard-bar__hint {\n  grid-column: 1 / -1;\n  margin: 0;\n  text-align: center;\n  font-size: 13px;\n  font-weight: 700;\n  color: #5a6a72;\n}\n\n.ep-wizard-bar--split {\n  grid-template-columns: 1fr 1.4fr;\n}\n\n.ep-wizard-bar--grid {\n  grid-template-columns: 1fr 1fr;\n}\n"] }]
    }], () => [{ type: i1.AuthService }, { type: i2.DataService }, { type: i3.ApiService }, { type: i4.AlertController }, { type: i5.ActivatedRoute }, { type: i5.Router }, { type: i6.LoadingService }, { type: i4.Platform }, { type: i7.BackgroundTaskService }, { type: i8.FpnSubmissionService }, { type: i9.PatrolService }, { type: i10.TrackingService }, { type: i11.ThermalPrinterService }, { type: i12.LemoEncourageService }, { type: i13.OfflineTicketService }, { type: i14.QueueSyncService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EnviroPage, { className: "EnviroPage" }); })();
//# sourceMappingURL=enviro.page.js.map