import { Component } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { NotebookEntry } from '../../models/notebook-entry';
import { User } from 'src/app/models/user';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/auth.service";
import * as i2 from "../../services/enforcementpro/data.service";
import * as i3 from "../../services/enforcementpro/api.service";
import * as i4 from "@ionic/angular";
import * as i5 from "@angular/router";
import * as i6 from "../../services/loading.service";
import * as i7 from "../../services/background-task.service";
import * as i8 from "../../services/tracking.service";
import * as i9 from "../../services/fpn-submission.service";
import * as i10 from "../../services/thermal-printer.service";
import * as i11 from "../../services/offline-ticket.service";
import * as i12 from "../../services/queue-sync.service";
import * as i13 from "@angular/common";
import * as i14 from "@angular/forms";
import * as i15 from "../../components/nav-bar/nav-bar.component";
function NotebookPage_p_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2("", ctx_r0.enviro_post.first_name, " ", ctx_r0.enviro_post.last_name, "");
} }
function NotebookPage_p_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("FPN ", ctx_r0.fpn_number, "");
} }
function NotebookPage_ion_select_option_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r2.textOnMachine, " ");
} }
function NotebookPage_ion_select_option_33_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r3.textOnMachine, " ");
} }
function NotebookPage_ion_select_option_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r4.textOnMachine, " ");
} }
function NotebookPage_ion_select_option_59_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r5.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r5.visibility, " ");
} }
function NotebookPage_ion_select_option_61_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r6 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r6.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r6.textOnMachine, " ");
} }
function NotebookPage_ng_container_67_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 11)(2, "ion-input", 33);
    i0.ɵɵlistener("ionChange", function NotebookPage_ng_container_67_Template_ion_input_ionChange_2_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_ng_container_67_Template_ion_input_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.notebook_entries.witness_name, $event) || (ctx_r0.notebook_entries.witness_name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ion-input", 34);
    i0.ɵɵlistener("ionChange", function NotebookPage_ng_container_67_Template_ion_input_ionChange_3_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_ng_container_67_Template_ion_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.notebook_entries.witness_phone, $event) || (ctx_r0.notebook_entries.witness_phone = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "ion-input", 35);
    i0.ɵɵlistener("ionChange", function NotebookPage_ng_container_67_Template_ion_input_ionChange_4_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_ng_container_67_Template_ion_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.notebook_entries.witness_address, $event) || (ctx_r0.notebook_entries.witness_address = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "ion-textarea", 36);
    i0.ɵɵlistener("ionChange", function NotebookPage_ng_container_67_Template_ion_textarea_ionChange_5_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_ng_container_67_Template_ion_textarea_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r0.notebook_entries.witness_statement, $event) || (ctx_r0.notebook_entries.witness_statement = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.notebook_entries.witness_name);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.notebook_entries.witness_phone);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.notebook_entries.witness_address);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r0.notebook_entries.witness_statement);
} }
function NotebookPage_section_69_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 37)(1, "ion-button", 38);
    i0.ɵɵlistener("click", function NotebookPage_section_69_Template_ion_button_click_1_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.route("/queue")); });
    i0.ɵɵtext(2, "Back");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ion-button", 39);
    i0.ɵɵlistener("click", function NotebookPage_section_69_Template_ion_button_click_3_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.submitFpn(false)); });
    i0.ɵɵtext(4, "Submit");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "ion-button", 40);
    i0.ɵɵlistener("click", function NotebookPage_section_69_Template_ion_button_click_5_listener() { i0.ɵɵrestoreView(_r8); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.submitFpn(true)); });
    i0.ɵɵtext(6, "Submit & print");
    i0.ɵɵelementEnd()();
} }
function NotebookPage_section_70_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "section", 37)(1, "ion-button", 38);
    i0.ɵɵlistener("click", function NotebookPage_section_70_Template_ion_button_click_1_listener() { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.route("/dashboard")); });
    i0.ɵɵtext(2, "Back");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ion-button", 39);
    i0.ɵɵlistener("click", function NotebookPage_section_70_Template_ion_button_click_3_listener() { i0.ɵɵrestoreView(_r9); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.submitForm()); });
    i0.ɵɵtext(4, "Submit");
    i0.ɵɵelementEnd()();
} }
export class NotebookPage {
    get ethnicities() {
        return this.data.getEthnicities() || [];
    }
    get weather() {
        return this.data.getWeather() || [];
    }
    get visibility() {
        return this.data.getVisibility() || [];
    }
    get builds() {
        return this.data.getBuilds() || [];
    }
    get hair_colours() {
        return this.data.getHairColours() || [];
    }
    constructor(auth, data, api, alertController, route2, router, loading, backgroundTasks, tracking, fpnSubmission, printer, offlineTicket, queueSync) {
        this.auth = auth;
        this.data = data;
        this.api = api;
        this.alertController = alertController;
        this.route2 = route2;
        this.router = router;
        this.loading = loading;
        this.backgroundTasks = backgroundTasks;
        this.tracking = tracking;
        this.fpnSubmission = fpnSubmission;
        this.printer = printer;
        this.offlineTicket = offlineTicket;
        this.queueSync = queueSync;
        this.fpn_number = "";
        this.isSubmitting = false;
        this.currentStep = 1;
        this.baseUrl = 'https://app.enforcementpro.co.uk/';
        this.user = new User();
        this.enviro_post = new EnviroPost();
        this.enviro_post.notebook_entries = new NotebookEntry();
        this.notebook_entries = new NotebookEntry();
        this.app_log = new AppLog();
        this.loadData();
        this.id = this.route2.snapshot.paramMap.get('id');
        if (this.id == 0) {
            if (this.enviro_post.notebook_entries !== undefined || this.enviro_post.notebook_entries !== null) {
                this.notebook_entries = this.enviro_post.notebook_entries;
            }
            this.route2.queryParams.subscribe(params => {
                this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
            });
        }
        else {
            this.route2.queryParams.subscribe(params => {
                this.fpn_number = params['fpn_number']; // Fallback to null if not present
            });
        }
    }
    async ngOnInit() {
        await this.data.init();
        this.init();
    }
    ping() {
        this.tracking.pingNow().catch(() => undefined);
    }
    init() {
        this.backgroundTasks.setInterval(() => {
            this.refresh();
        }, 5000);
        this.backgroundTasks.setInterval(() => {
            this.ping();
        }, 30000);
    }
    loadData() {
        this.app_log = this.data.getAppLog() || new AppLog();
        this.enviro_post = this.data.getEnviroPost();
        this.user = this.data.getUser();
        if (!this.data.checkFPNData()) {
            this.getFPNData();
        }
    }
    validator() {
        if (!this.notebook_entries.is_fpn_advised) {
            this.presentAlert('Wait!', 'Please provide if FPN is adviced.');
            return false;
        }
        if (!this.notebook_entries.is_fpn_handed) {
            this.presentAlert('Wait!', 'Please provide if FPN is handed.');
            return false;
        }
        if (this.notebook_entries.hair == 0) {
            this.presentAlert('Wait!', 'Please provide hair details.');
            return false;
        }
        if (this.notebook_entries.gender == '') {
            this.presentAlert('Wait!', 'Please provide offender Gender.');
            return false;
        }
        if (this.notebook_entries.visibility_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Visibility.');
            return false;
        }
        if (this.notebook_entries.weather_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Weather.');
            return false;
        }
        if (this.notebook_entries.ethnicity_id <= 0) {
            this.presentAlert('Wait!', 'Please provide offender Ethnicity.');
            return false;
        }
        console.log(this.enviro_post.notebook_entries);
        return true;
    }
    route(route) {
        if (this.id == 0) {
            this.enviro_post = new EnviroPost();
            this.data.setEnviroPost(this.enviro_post);
        }
        if (route == "/queue") {
            this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
        }
        else {
            this.router.navigate([route]);
        }
    }
    saveEnviroData() {
        if (this.id == 0) {
            if (this.enviro_post.notebook_entries.hair !== 0 && this.enviro_post.notebook_entries.did !== '' && this.enviro_post.notebook_entries.were !== '' && this.enviro_post.notebook_entries.is_fpn_advised !== '' && this.enviro_post.notebook_entries.is_fpn_handed !== '') {
                this.enviro_post.notebook_entries = this.notebook_entries;
                this.data.setEnviroPost(this.enviro_post);
            }
        }
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
    submitFpn(print) {
        if (this.isSubmitting) {
            return;
        }
        let checker = this.validator();
        if (checker) {
            this.isSubmitting = true;
            this.loading.showLoading();
            this.fpnSubmission.submit(this.enviro_post)
                .then((result) => {
                this.loading.hideLoading();
                this.isSubmitting = false;
                if (result.status === 'posted') {
                    let fpn = result.response.data;
                    Clipboard.write({
                        string: fpn.fpn_number
                    });
                    if (print == true && fpn.ticket) {
                        let ticket_image = this.baseUrl + fpn.ticket;
                        this.printImageFromUrl(ticket_image);
                    }
                    this.data.spliceEnviroQue(this.enviro_post);
                    this.enviro_post = new EnviroPost();
                    this.data.setEnviroPost(this.enviro_post);
                    this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + '. FPN number has been copied to your clipboard.');
                    this.route('/dashboard');
                    return;
                }
                if (result.status === 'queued') {
                    if (print && !result.message.includes('already uploading')) {
                        this.offlineTicket.printFor(this.enviro_post).catch(() => undefined);
                    }
                    this.queueSync.start();
                    this.presentAlert('Queued', result.message);
                    this.route('/queue');
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
    submitForm() {
        if (this.isSubmitting) {
            return;
        }
        let checker = this.validator();
        if (checker) {
            this.isSubmitting = true;
            this.loading.showLoading();
            this.notebook_entries.enviro_id = this.id;
            this.api.postNoteBook(this.notebook_entries).subscribe({
                next: (response) => {
                    this.loading.showLoading();
                    // Handle the response here
                    if (response.success === false) {
                        let message = response.message + " (Please Edit)";
                        this.isSubmitting = false;
                        this.presentAlert('Error', message);
                    }
                    else {
                        this.isSubmitting = false;
                        this.presentAlert('Success', 'Notebook entry captured');
                        this.route('/dashboard');
                    }
                }, error: (error) => {
                    this.loading.hideLoading();
                    if (error.status == 500) {
                        this.presentAlert('Server Error', 'Please place in que and report error.');
                    }
                    else if (error.status == 401) {
                        this.presentAlert('Auth Failed', 'Please login again.');
                    }
                    else if (error.status == 0) {
                        this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                    }
                    else {
                        this.presentAlert('Error', error.message);
                    }
                }
            });
        }
    }
    async presentAlert(header, message) {
        let button_title = 'Ok';
        if (header == "Success") {
            button_title = "Finish";
        }
        const alert = await this.alertController.create({
            header: header,
            message: message,
        });
        await alert.present();
    }
    refresh() {
        // this.loading.showLoading();
        this.loadData();
        // this.loading.hideLoading();
        // window.location.reload();
    }
    getFPNData() {
        let site = this.data.getSelectedSite();
        let site_id = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                this.data.applyFPNData(data);
            },
            error: (error) => {
                // this.loadData();
                if (error.status == 500) {
                    this.presentAlert('Server Error', 'Please report error.');
                }
                else if (error.status == 0) {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
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
    extractOffenceGroups(offences) {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
            .map(id => groups.find(group => group.id === id));
    }
    static { this.ɵfac = function NotebookPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotebookPage)(i0.ɵɵdirectiveInject(i1.AuthService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.ApiService), i0.ɵɵdirectiveInject(i4.AlertController), i0.ɵɵdirectiveInject(i5.ActivatedRoute), i0.ɵɵdirectiveInject(i5.Router), i0.ɵɵdirectiveInject(i6.LoadingService), i0.ɵɵdirectiveInject(i7.BackgroundTaskService), i0.ɵɵdirectiveInject(i8.TrackingService), i0.ɵɵdirectiveInject(i9.FpnSubmissionService), i0.ɵɵdirectiveInject(i10.ThermalPrinterService), i0.ɵɵdirectiveInject(i11.OfflineTicketService), i0.ɵɵdirectiveInject(i12.QueueSyncService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NotebookPage, selectors: [["app-notebook"]], decls: 71, vars: 33, consts: [[3, "translucent"], [3, "currentStep"], [3, "fullscreen"], [1, "ep-page"], [1, "ep-page-head"], [1, "ep-kicker"], [4, "ngIf"], [1, "ep-section"], [1, "ep-section__head"], ["interface", "action-sheet", "label", "Is FPN advised *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Is FPN handed *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [1, "ep-field-row"], ["label", "Height in feet", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Height in inch", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["interface", "action-sheet", "label", "Build", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "action-sheet", "label", "Hair colours *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Distance from offender", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Distinguishing features", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Nearest bin", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Offender comments", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Police comments", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "BWC asset", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["interface", "action-sheet", "label", "Gender *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Ethnicity *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Caution 1", "label-placement", "stacked", "fill", "outline", "type", "time", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Caution 2", "label-placement", "stacked", "fill", "outline", "type", "time", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Visibility *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Weather *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Is witness available?", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Officer statement", "label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "ionChange", "ngModelChange", "ngModel"], ["class", "ep-actions", 4, "ngIf"], [3, "value"], ["label", "Witness name", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Witness phone", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Witness address", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Witness statement", "label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "ionChange", "ngModelChange", "ngModel"], [1, "ep-actions"], ["expand", "block", "color", "medium", 3, "click"], ["expand", "block", 3, "click"], ["expand", "block", "color", "success", 3, "click"]], template: function NotebookPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-header", 0);
            i0.ɵɵelement(1, "app-nav-bar", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "ion-content", 2)(3, "div", 3)(4, "div", 4)(5, "p", 5);
            i0.ɵɵtext(6, "Evidence notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "h1");
            i0.ɵɵtext(8, "Notebook");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(9, NotebookPage_p_9_Template, 2, 2, "p", 6)(10, NotebookPage_p_10_Template, 2, 1, "p", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "section", 7)(12, "div", 8)(13, "p", 5);
            i0.ɵɵtext(14, "Encounter");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "h3");
            i0.ɵɵtext(16, "Notebook entries");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "ion-select", 9);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_17_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_17_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.is_fpn_advised, $event) || (ctx.notebook_entries.is_fpn_advised = $event); return $event; });
            i0.ɵɵelementStart(18, "ion-select-option");
            i0.ɵɵtext(19, "yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "ion-select-option");
            i0.ɵɵtext(21, "no");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "ion-select", 10);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_22_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_22_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.is_fpn_handed, $event) || (ctx.notebook_entries.is_fpn_handed = $event); return $event; });
            i0.ɵɵelementStart(23, "ion-select-option");
            i0.ɵɵtext(24, "yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "ion-select-option");
            i0.ɵɵtext(26, "no");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(27, "div", 11)(28, "ion-input", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_28_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.height_in_feet, $event) || (ctx.notebook_entries.height_in_feet = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_28_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "ion-input", 13);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_29_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.height_in_inch, $event) || (ctx.notebook_entries.height_in_inch = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_29_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "ion-select", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_30_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.build, $event) || (ctx.notebook_entries.build = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_30_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtemplate(31, NotebookPage_ion_select_option_31_Template, 2, 2, "ion-select-option", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "ion-select", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_32_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.hair, $event) || (ctx.notebook_entries.hair = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_32_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtemplate(33, NotebookPage_ion_select_option_33_Template, 2, 2, "ion-select-option", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "ion-input", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_34_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.distance_from_offender, $event) || (ctx.notebook_entries.distance_from_offender = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_34_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(35, "ion-input", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_35_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.distinguishing_features, $event) || (ctx.notebook_entries.distinguishing_features = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_35_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "ion-input", 19);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_36_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.nearest_bin, $event) || (ctx.notebook_entries.nearest_bin = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_36_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "ion-input", 20);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_37_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.offender_comments, $event) || (ctx.notebook_entries.offender_comments = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_37_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "ion-input", 21);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_38_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.police_comments, $event) || (ctx.notebook_entries.police_comments = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_38_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "ion-input", 22);
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_39_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.bwv_assest, $event) || (ctx.notebook_entries.bwv_assest = $event); return $event; });
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_39_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(40, "section", 7)(41, "div", 8)(42, "p", 5);
            i0.ɵɵtext(43, "Extra");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(44, "h3");
            i0.ɵɵtext(45, "FPN details");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(46, "ion-select", 23);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_46_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_46_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.gender, $event) || (ctx.notebook_entries.gender = $event); return $event; });
            i0.ɵɵelementStart(47, "ion-select-option");
            i0.ɵɵtext(48, "Male");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "ion-select-option");
            i0.ɵɵtext(50, "Female");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "ion-select-option");
            i0.ɵɵtext(52, "Other");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(53, "ion-select", 24);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_53_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_53_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.ethnicity_id, $event) || (ctx.notebook_entries.ethnicity_id = $event); return $event; });
            i0.ɵɵtemplate(54, NotebookPage_ion_select_option_54_Template, 2, 2, "ion-select-option", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "div", 11)(56, "ion-input", 25);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_56_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_56_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.caution, $event) || (ctx.notebook_entries.caution = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "ion-input", 26);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_input_ionChange_57_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_input_ngModelChange_57_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.second_caution, $event) || (ctx.notebook_entries.second_caution = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(58, "ion-select", 27);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_58_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_58_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.visibility_id, $event) || (ctx.notebook_entries.visibility_id = $event); return $event; });
            i0.ɵɵtemplate(59, NotebookPage_ion_select_option_59_Template, 2, 2, "ion-select-option", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(60, "ion-select", 28);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_60_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_60_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.weather_id, $event) || (ctx.notebook_entries.weather_id = $event); return $event; });
            i0.ɵɵtemplate(61, NotebookPage_ion_select_option_61_Template, 2, 2, "ion-select-option", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(62, "ion-select", 29);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_select_ionChange_62_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_select_ngModelChange_62_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.is_witness_available, $event) || (ctx.notebook_entries.is_witness_available = $event); return $event; });
            i0.ɵɵelementStart(63, "ion-select-option");
            i0.ɵɵtext(64, "Yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(65, "ion-select-option");
            i0.ɵɵtext(66, "No");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(67, NotebookPage_ng_container_67_Template, 6, 4, "ng-container", 6);
            i0.ɵɵelementStart(68, "ion-textarea", 30);
            i0.ɵɵlistener("ionChange", function NotebookPage_Template_ion_textarea_ionChange_68_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function NotebookPage_Template_ion_textarea_ngModelChange_68_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.notebook_entries.officer_statement, $event) || (ctx.notebook_entries.officer_statement = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(69, NotebookPage_section_69_Template, 7, 0, "section", 31)(70, NotebookPage_section_70_Template, 5, 0, "section", 31);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance();
            i0.ɵɵproperty("currentStep", ctx.currentStep);
            i0.ɵɵadvance();
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngIf", ctx.id == 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.id > 0);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.is_fpn_advised);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.is_fpn_handed);
            i0.ɵɵadvance(6);
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.height_in_feet);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.height_in_inch);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.build);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.builds);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.hair);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.hair_colours);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.distance_from_offender);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.distinguishing_features);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.nearest_bin);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.offender_comments);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.police_comments);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.bwv_assest);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.gender);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.ethnicity_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.ethnicities);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.caution);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.second_caution);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.visibility_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.visibility);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.weather_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.weather);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.is_witness_available);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", ctx.notebook_entries.is_witness_available === "Yes");
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.notebook_entries.officer_statement);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.id == 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.id > 0);
        } }, dependencies: [i13.NgForOf, i13.NgIf, i14.NgControlStatus, i14.MaxLengthValidator, i14.NgModel, i4.IonButton, i4.IonContent, i4.IonHeader, i4.IonInput, i4.IonSelect, i4.IonSelectOption, i4.IonTextarea, i4.SelectValueAccessor, i4.TextValueAccessor, i15.NavBarComponent], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotebookPage, [{
        type: Component,
        args: [{ selector: 'app-notebook', template: "<ion-header [translucent]=\"true\">\n    <app-nav-bar [currentStep]=\"currentStep\"></app-nav-bar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n    <div class=\"ep-page\">\n        <div class=\"ep-page-head\">\n            <p class=\"ep-kicker\">Evidence notes</p>\n            <h1>Notebook</h1>\n            <p *ngIf=\"id == 0\">{{ enviro_post.first_name }} {{ enviro_post.last_name }}</p>\n            <p *ngIf=\"id > 0\">FPN {{ fpn_number }}</p>\n        </div>\n\n        <section class=\"ep-section\">\n            <div class=\"ep-section__head\">\n                <p class=\"ep-kicker\">Encounter</p>\n                <h3>Notebook entries</h3>\n            </div>\n\n            <ion-select interface=\"action-sheet\" label=\"Is FPN advised *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.is_fpn_advised\">\n                <ion-select-option>yes</ion-select-option>\n                <ion-select-option>no</ion-select-option>\n            </ion-select>\n\n            <ion-select interface=\"action-sheet\" label=\"Is FPN handed *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.is_fpn_handed\">\n                <ion-select-option>yes</ion-select-option>\n                <ion-select-option>no</ion-select-option>\n            </ion-select>\n\n            <div class=\"ep-field-row\">\n                <ion-input label=\"Height in feet\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.height_in_feet\" (ionChange)=\"saveEnviroData()\"></ion-input>\n                <ion-input label=\"Height in inch\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.height_in_inch\" (ionChange)=\"saveEnviroData()\"></ion-input>\n            </div>\n\n            <ion-select interface=\"action-sheet\" label=\"Build\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"notebook_entries.build\" (ionChange)=\"saveEnviroData()\">\n                <ion-select-option *ngFor=\"let group of builds\" [value]=\"group.id\">\n                    {{ group.textOnMachine }}\n                </ion-select-option>\n            </ion-select>\n\n            <ion-select interface=\"action-sheet\" label=\"Hair colours *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"notebook_entries.hair\" (ionChange)=\"saveEnviroData()\">\n                <ion-select-option *ngFor=\"let group of hair_colours\" [value]=\"group.id\">\n                    {{ group.textOnMachine }}\n                </ion-select-option>\n            </ion-select>\n\n            <ion-input label=\"Distance from offender\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.distance_from_offender\" (ionChange)=\"saveEnviroData()\"></ion-input>\n            <ion-input label=\"Distinguishing features\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.distinguishing_features\" (ionChange)=\"saveEnviroData()\"></ion-input>\n            <ion-input label=\"Nearest bin\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.nearest_bin\" (ionChange)=\"saveEnviroData()\"></ion-input>\n            <ion-input label=\"Offender comments\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.offender_comments\" (ionChange)=\"saveEnviroData()\"></ion-input>\n            <ion-input label=\"Police comments\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.police_comments\" (ionChange)=\"saveEnviroData()\"></ion-input>\n            <ion-input label=\"BWC asset\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"notebook_entries.bwv_assest\" (ionChange)=\"saveEnviroData()\"></ion-input>\n        </section>\n\n        <section class=\"ep-section\">\n            <div class=\"ep-section__head\">\n                <p class=\"ep-kicker\">Extra</p>\n                <h3>FPN details</h3>\n            </div>\n\n            <ion-select interface=\"action-sheet\" label=\"Gender *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"saveEnviroData()\" multiple=\"false\" [(ngModel)]=\"notebook_entries.gender\">\n                <ion-select-option>Male</ion-select-option>\n                <ion-select-option>Female</ion-select-option>\n                <ion-select-option>Other</ion-select-option>\n            </ion-select>\n\n            <ion-select interface=\"action-sheet\" label=\"Ethnicity *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.ethnicity_id\">\n                <ion-select-option *ngFor=\"let group of ethnicities\" [value]=\"group.id\">\n                    {{ group.textOnMachine }}\n                </ion-select-option>\n            </ion-select>\n\n            <div class=\"ep-field-row\">\n                <ion-input label=\"Caution 1\" label-placement=\"stacked\" fill=\"outline\" type=\"time\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.caution\"></ion-input>\n                <ion-input label=\"Caution 2\" label-placement=\"stacked\" fill=\"outline\" type=\"time\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.second_caution\"></ion-input>\n            </div>\n\n            <ion-select interface=\"action-sheet\" label=\"Visibility *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.visibility_id\">\n                <ion-select-option *ngFor=\"let group of visibility\" [value]=\"group.id\">\n                    {{ group.visibility }}\n                </ion-select-option>\n            </ion-select>\n\n            <ion-select interface=\"action-sheet\" label=\"Weather *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.weather_id\">\n                <ion-select-option *ngFor=\"let group of weather\" [value]=\"group.id\">\n                    {{ group.textOnMachine }}\n                </ion-select-option>\n            </ion-select>\n\n            <ion-select interface=\"action-sheet\" label=\"Is witness available?\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.is_witness_available\">\n                <ion-select-option>Yes</ion-select-option>\n                <ion-select-option>No</ion-select-option>\n            </ion-select>\n\n            <ng-container *ngIf=\"notebook_entries.is_witness_available === 'Yes'\">\n                <div class=\"ep-field-row\">\n                    <ion-input label=\"Witness name\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.witness_name\"></ion-input>\n                    <ion-input label=\"Witness phone\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.witness_phone\"></ion-input>\n                </div>\n                <ion-input label=\"Witness address\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.witness_address\"></ion-input>\n                <ion-textarea label=\"Witness statement\" label-placement=\"stacked\" fill=\"outline\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.witness_statement\"></ion-textarea>\n            </ng-container>\n\n            <ion-textarea label=\"Officer statement\" label-placement=\"stacked\" fill=\"outline\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"notebook_entries.officer_statement\"></ion-textarea>\n        </section>\n\n        <section class=\"ep-actions\" *ngIf=\"id == 0\">\n            <ion-button expand=\"block\" color=\"medium\" (click)=\"route('/queue')\">Back</ion-button>\n            <ion-button expand=\"block\" (click)=\"submitFpn(false)\">Submit</ion-button>\n            <ion-button expand=\"block\" color=\"success\" (click)=\"submitFpn(true)\">Submit & print</ion-button>\n        </section>\n\n        <section class=\"ep-actions\" *ngIf=\"id > 0\">\n            <ion-button expand=\"block\" color=\"medium\" (click)=\"route('/dashboard')\">Back</ion-button>\n            <ion-button expand=\"block\" (click)=\"submitForm()\">Submit</ion-button>\n        </section>\n    </div>\n</ion-content>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.AuthService }, { type: i2.DataService }, { type: i3.ApiService }, { type: i4.AlertController }, { type: i5.ActivatedRoute }, { type: i5.Router }, { type: i6.LoadingService }, { type: i7.BackgroundTaskService }, { type: i8.TrackingService }, { type: i9.FpnSubmissionService }, { type: i10.ThermalPrinterService }, { type: i11.OfflineTicketService }, { type: i12.QueueSyncService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NotebookPage, { className: "NotebookPage" }); })();
//# sourceMappingURL=notebook.page.js.map