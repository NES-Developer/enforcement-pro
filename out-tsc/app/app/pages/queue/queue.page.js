import { Component } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';
import { User } from 'src/app/models/user';
import { enviroStepperStep, findFirstMissingFpnField } from '../../helpers/fpn-core-validation';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/api.service";
import * as i2 from "../../services/enforcementpro/data.service";
import * as i3 from "@ionic/angular";
import * as i4 from "@angular/router";
import * as i5 from "../../services/loading.service";
import * as i6 from "../../services/enforcementpro/auth.service";
import * as i7 from "src/app/Service/ticket.service";
import * as i8 from "@angular/platform-browser";
import * as i9 from "../../services/background-task.service";
import * as i10 from "../../services/fpn-submission.service";
import * as i11 from "../../services/patrol.service";
import * as i12 from "../../services/tracking.service";
import * as i13 from "../../services/thermal-printer.service";
import * as i14 from "../../services/offline-ticket.service";
import * as i15 from "../../services/queue-sync.service";
import * as i16 from "@angular/common";
import * as i17 from "../../components/nav-bar/nav-bar.component";
function QueuePage_div_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "h3");
    i0.ɵɵtext(2, "Queue is clear");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Saved tickets waiting to submit will show here.");
    i0.ɵɵelementEnd()();
} }
function QueuePage_article_13_div_9_div_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26);
    i0.ɵɵelement(1, "img", 27);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const src_r4 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", src_r4, i0.ɵɵsanitizeUrl);
} }
function QueuePage_article_13_div_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 23)(1, "p", 12);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 24);
    i0.ɵɵtemplate(4, QueuePage_article_13_div_9_div_4_Template, 2, 1, "div", 25);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const enviro_post_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", enviro_post_r2.offence_images.length, " photo", enviro_post_r2.offence_images.length === 1 ? "" : "s", " attached.");
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngForOf", enviro_post_r2.offence_images);
} }
function QueuePage_article_13_ion_button_16_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 28);
    i0.ɵɵlistener("click", function QueuePage_article_13_ion_button_16_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const enviro_post_r2 = i0.ɵɵnextContext().$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.generateTicket(enviro_post_r2)); });
    i0.ɵɵtext(1, "Generate ticket");
    i0.ɵɵelementEnd();
} }
function QueuePage_article_13_ion_button_19_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 29);
    i0.ɵɵlistener("click", function QueuePage_article_13_ion_button_19_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const enviro_post_r2 = i0.ɵɵnextContext().$implicit; return i0.ɵɵresetView(enviro_post_r2.html_bool = false); });
    i0.ɵɵtext(1, "Close preview");
    i0.ɵɵelementEnd();
} }
function QueuePage_article_13_div_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 30);
} if (rf & 2) {
    const enviro_post_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("innerHTML", enviro_post_r2.html_string, i0.ɵɵsanitizeHtml);
} }
function QueuePage_article_13_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 9)(1, "div", 10)(2, "div")(3, "h3", 11);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 12);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "ion-button", 13);
    i0.ɵɵlistener("click", function QueuePage_article_13_Template_ion_button_click_7_listener() { const enviro_post_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.editFPN(enviro_post_r2)); });
    i0.ɵɵelement(8, "ion-icon", 14);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(9, QueuePage_article_13_div_9_Template, 5, 3, "div", 15);
    i0.ɵɵelementStart(10, "div", 16)(11, "ion-button", 17);
    i0.ɵɵlistener("click", function QueuePage_article_13_Template_ion_button_click_11_listener() { const enviro_post_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.submitFPN(enviro_post_r2, true)); });
    i0.ɵɵtext(12, "Submit & print");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "ion-button", 17);
    i0.ɵɵlistener("click", function QueuePage_article_13_Template_ion_button_click_13_listener() { const enviro_post_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.submitFPN(enviro_post_r2, false)); });
    i0.ɵɵtext(14, "Submit");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(15, "div", 18);
    i0.ɵɵtemplate(16, QueuePage_article_13_ion_button_16_Template, 2, 0, "ion-button", 19);
    i0.ɵɵelementStart(17, "ion-button", 20);
    i0.ɵɵlistener("click", function QueuePage_article_13_Template_ion_button_click_17_listener() { const enviro_post_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.printOfflineTicket(enviro_post_r2)); });
    i0.ɵɵtext(18, "Print");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(19, QueuePage_article_13_ion_button_19_Template, 2, 0, "ion-button", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(20, QueuePage_article_13_div_20_Template, 1, 1, "div", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const enviro_post_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("", enviro_post_r2.first_name, " ", enviro_post_r2.last_name, "");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.queueStatus(enviro_post_r2));
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", enviro_post_r2.offence_images == null ? null : enviro_post_r2.offence_images.length);
    i0.ɵɵadvance(7);
    i0.ɵɵproperty("ngIf", !enviro_post_r2.html_bool);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("ngIf", enviro_post_r2.html_bool);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", enviro_post_r2.html_bool);
} }
export class QueuePage {
    constructor(api, data, alertController, router, route2, loading, auth, ticket, sanitizer, backgroundTasks, fpnSubmission, patrol, tracking, printer, offlineTicket, queueSync) {
        // this.auth.checkLoggedIn();
        this.api = api;
        this.data = data;
        this.alertController = alertController;
        this.router = router;
        this.route2 = route2;
        this.loading = loading;
        this.auth = auth;
        this.ticket = ticket;
        this.sanitizer = sanitizer;
        this.backgroundTasks = backgroundTasks;
        this.fpnSubmission = fpnSubmission;
        this.patrol = patrol;
        this.tracking = tracking;
        this.printer = printer;
        this.offlineTicket = offlineTicket;
        this.queueSync = queueSync;
        this.currentStep = 1;
        this.enviro_que = [];
        this.enviro_que_addition = []; //xx
        this.baseUrl = 'https://app.enforcementpro.co.uk/';
        this.isSubmitting = false;
        this.html_bool = false; //xx
        this.html_string = ""; //xx
        this.app_log = new AppLog();
        this.user = new User();
        this.loadData();
        this.route2.queryParams.subscribe(params => {
            this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
        });
    }
    async ngOnInit() {
        this.loading.showLoading();
        await this.data.init();
        if (!this.patrol.canUseFpnTools()) {
            this.loading.hideLoading();
            this.presentAlert('Patrol Required', 'Start patrol from the dashboard before using the queue.');
            this.router.navigate(['/dashboard']);
            return;
        }
        this.init();
        this.loading.hideLoading();
    }
    loadData() {
        this.enviro_que = this.data.getEnviroQue();
        this.user = this.data.getUser();
        this.app_log = this.data.getAppLog() || new AppLog();
    }
    init() {
        this.hydrateQueueItems();
        this.ping();
        this.queueSync.start();
        this.backgroundTasks.setInterval(() => {
            this.ping();
            this.queueSync.flush().catch(() => undefined);
        }, 30000); // 30 seconds in milliseconds
    }
    async exportEnviroQue(enviro_post) {
        try {
            const jsonData = JSON.stringify(enviro_post, null, 2);
            const now = new Date();
            const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
                .getHours()
                .toString()
                .padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
            const safeFirstName = (enviro_post.first_name || 'unknown').replace(/\s+/g, '_');
            const safeLastName = (enviro_post.last_name || 'user').replace(/\s+/g, '_');
            const fileName = `${safeFirstName}_${safeLastName}_${timestamp}.json`;
            const folderName = 'FPNs';
            const fullPath = `${folderName}/${fileName}`;
            // ✅ Check if FPNs folder exists
            try {
                await Filesystem.stat({
                    path: folderName,
                    directory: Directory.Documents,
                });
                console.log('📁 FPNs folder exists');
            }
            catch (folderErr) {
                if (folderErr.message?.includes('does not exist')) {
                    console.log('📁 Creating FPNs folder...');
                    await Filesystem.mkdir({
                        path: folderName,
                        directory: Directory.Documents,
                        recursive: true,
                    });
                }
                else {
                    throw folderErr; // rethrow unexpected errors
                }
            }
            // ✅ Write or overwrite the file
            const result = await Filesystem.writeFile({
                path: fullPath,
                data: jsonData,
                directory: Directory.Documents,
                encoding: Encoding.UTF8,
            });
            //   console.log('✅ File saved:', result.uri);
            this.presentAlert('Success', `Saved to Documents/${folderName}`);
            console.log(enviro_post);
        }
        catch (error) {
            //   console.error('❌ Error saving file:', error);
            this.presentAlert('Error', 'Failed to export file: ' + error);
        }
    }
    // postFPNTroubleShoot(enviro_post: EnviroPost)
    // {
    //     this.api
    // }
    refresh() {
        this.loadData();
        this.hydrateQueueItems();
    }
    // Web: Trigger file download in the browser
    downloadFileWeb(data, fileName) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    ping() {
        this.tracking.pingNow().catch(() => undefined);
    }
    route(route) {
        const target = route === '/tabs/fpn' ? '/enviro' : route;
        if (target === '/enviro') {
            this.router.navigate([target], { queryParams: { currentStep: this.currentStep } });
            return;
        }
        this.router.navigate([target]);
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['Okay'],
        });
        await alert.present();
    }
    async printBase64Image(base64Data) {
        try {
            await this.printer.printBase64Image(base64Data);
        }
        catch (error) {
            console.error("Base64 Print failed", error);
        }
    }
    submitFPN(enviro_post, print) {
        if (this.isSubmitting) {
            return;
        }
        const gap = findFirstMissingFpnField(enviro_post, {
            requireZone: this.data.getZones().length > 0,
        });
        if (gap) {
            this.presentAlert('Wait!', gap.message);
            this.editFPN(enviro_post);
            return;
        }
        this.isSubmitting = true;
        this.loading.showLoading();
        if (enviro_post.officer_id == 0) {
            enviro_post.officer_id = this.user.id;
        }
        this.fpnSubmission.submit(enviro_post)
            .then((result) => {
            this.isSubmitting = false;
            this.loading.hideLoading();
            if (result.status === 'posted') {
                let fpn = result.response.data;
                Clipboard.write({
                    string: fpn.fpn_number
                });
                if (print == true && fpn.ticket) {
                    let ticket_image = this.baseUrl + fpn.ticket;
                    this.printImageFromUrl(ticket_image);
                }
                this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + ' has been copied to your clipboard.');
                this.data.spliceEnviroQue(enviro_post);
                this.refresh();
                return;
            }
            if (result.status === 'queued') {
                if (print) {
                    this.offlineTicket.printFor(enviro_post).catch(() => undefined);
                }
                this.queueSync.start();
                this.refresh();
                return;
            }
            this.presentAlert(result.status === 'blocked' ? 'Patrol Required' : 'Error', result.message);
        })
            .catch((error) => {
            this.isSubmitting = false;
            this.loading.hideLoading();
            this.presentAlert('Error', error?.message || 'Unable to submit queued FPN.');
        });
    }
    generateTicket(enviro_post) {
        this.prepareOfflineTicket(enviro_post);
    }
    hydrateQueueItems() {
        this.enviro_que_addition = this.enviro_que.map((enviro_post) => {
            const ticketHtml = this.buildTicketHtml(enviro_post);
            return {
                ...enviro_post,
                ticket_html: ticketHtml,
                html_bool: false,
                html_string: this.sanitizer.bypassSecurityTrustHtml(ticketHtml || ''),
            };
        });
    }
    buildTicketHtml(enviro_post) {
        try {
            const ticket = this.ticket.generateWelcomeTicket(enviro_post);
            return ticket === 'refresh' ? '' : ticket;
        }
        catch {
            return '';
        }
    }
    ticketHtml(enviro_post) {
        if (typeof enviro_post?.ticket_html === 'string' && enviro_post.ticket_html) {
            return enviro_post.ticket_html;
        }
        return null;
    }
    prepareOfflineTicket(enviro_post) {
        let ticket = this.ticketHtml(enviro_post) || this.buildTicketHtml(enviro_post);
        if (!ticket) {
            this.presentAlert('Error', 'Please find Network and get latest data. To regenerate new FPN Numbers');
            return null;
        }
        for (let x = 0; x < this.enviro_que_addition.length; x++) {
            if (this.enviro_que_addition[x] === enviro_post) {
                this.enviro_que_addition[x].ticket_html = ticket;
                this.enviro_que_addition[x].html_bool = true;
                this.enviro_que_addition[x].html_string = this.sanitizer.bypassSecurityTrustHtml(ticket);
            }
            else {
                this.enviro_que_addition[x].html_bool = false;
            }
        }
        return ticket;
    }
    async printOfflineTicket(enviro_post) {
        if (this.isSubmitting) {
            return;
        }
        const ticket = this.ticketHtml(enviro_post) || this.prepareOfflineTicket(enviro_post);
        if (!ticket) {
            return;
        }
        this.isSubmitting = true;
        this.loading.showLoading();
        try {
            await this.offlineTicket.printHtml(ticket);
            this.presentAlert('Success', 'Ticket printed successfully.');
        }
        catch (error) {
            this.presentAlert('Print Error', error?.message || 'Unable to print ticket.');
        }
        finally {
            this.isSubmitting = false;
            this.loading.hideLoading();
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
    async printTicketHtml(ticketHTML) {
        let container = null;
        try {
            // 1. Create a hidden container to render the HTML
            container = document.createElement('div');
            container.style.width = '384px'; // Standard Sunmi 58mm width
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.background = '#ffffff';
            container.style.color = '#000000';
            container.innerHTML = ticketHTML;
            document.body.appendChild(container);
            // 2. Wait a moment for images (QR/Barcode) to render
            await new Promise(resolve => setTimeout(resolve, 500));
            // 3. Convert HTML to Canvas
            const canvas = await html2canvas(container, {
                width: 384,
                scale: 2, // Higher scale for sharper text
                useCORS: true,
                logging: false
            });
            // 4. Convert Canvas to Base64 (Clean)
            const base64Data = canvas.toDataURL('image/png').split(',')[1];
            await this.printer.printBase64Image(base64Data);
            console.log("Receipt printed successfully");
        }
        catch (error) {
            console.error("Printing Error:", error);
            throw error;
        }
        finally {
            if (container?.parentNode) {
                document.body.removeChild(container);
            }
        }
    }
    copyTicketToClipboard(enviro_post) {
        this.isSubmitting = true;
        this.loading.showLoading();
        const element = document.getElementById('html_ticket');
        if (element) {
            toPng(element)
                .then((dataUrl) => {
                console.log(dataUrl.toString());
                Clipboard.write({
                    string: dataUrl.toString()
                });
                for (let x = 0; x < this.enviro_que_addition.length; x++) {
                    if (this.enviro_que_addition[x] == enviro_post) {
                        this.enviro_que_addition[x].html_string = dataUrl.toString();
                    }
                    this.enviro_que_addition[x].html_bool = false;
                }
                this.isSubmitting = false;
                this.loading.hideLoading();
                this.saveBase64Image(dataUrl, 'ticket_offline.png');
                this.presentAlert('Success', 'Ticket image saved successfully.');
            })
                .catch((error) => {
                //Backup
                html2canvas(element).then((canvas) => {
                    const dataUrl = canvas.toDataURL('image/png');
                    console.log('Generated Image URL:', dataUrl);
                    Clipboard.write({
                        string: dataUrl.toString()
                    });
                    this.isSubmitting = false;
                    this.loading.hideLoading();
                    this.saveBase64Image(dataUrl, 'ticket_offline.png');
                    this.presentAlert('Success', 'Ticket image saved successfully.');
                }).catch((error2) => {
                    this.isSubmitting = false;
                    this.loading.hideLoading();
                    console.log(error, error2, error.message, error2.message);
                    this.presentAlert('Error', '2 Error generating image:' + error2.message);
                });
                // console.error('Error generating image:', error);
            });
        }
        else {
            this.isSubmitting = false;
            this.loading.hideLoading();
            this.presentAlert('Error', 'Error element not found');
        }
    }
    async saveBase64Image(base64Data, fileName) {
        try {
            const savedFile = await Filesystem.writeFile({
                path: `Download/${fileName}`, // Path and file name
                data: base64Data, // Base64 string
                directory: Directory.External, // Save to external storage
            });
            console.log('File saved:', savedFile.uri);
            //   alert('Image saved at: ' + savedFile.uri);
            this.presentAlert('Success', 'Image saved at: ' + savedFile.uri);
            return savedFile.uri; // Return the file URI if needed
        }
        catch (error) {
            console.error('Error saving file:', error);
            //   alert('Failed to save image');
            this.presentAlert('Error', 'Failed to save: ' + error);
            throw error; // Re-throw error if further handling is required
        }
    }
    editFPN(enviro_post) {
        const draft = { ...enviro_post };
        delete draft.html_bool;
        delete draft.html_string;
        delete draft.ticket_html;
        this.data.setEnviroPost(draft);
        this.router.navigate(['/enviro'], {
            queryParams: {
                currentStep: enviroStepperStep(draft, {
                    requireZone: this.data.getZones().length > 0,
                }),
            },
        });
    }
    queueStatus(enviro_post) {
        if (enviro_post.enviro_id && enviro_post.offence_images?.length) {
            return `Held — ${enviro_post.offence_images.length} photo(s) still to upload`;
        }
        if (enviro_post.offence_images?.length) {
            return `Ready for submission · ${enviro_post.offence_images.length} photo(s)`;
        }
        return 'Ready for submission';
    }
    static { this.ɵfac = function QueuePage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QueuePage)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.AlertController), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i4.ActivatedRoute), i0.ɵɵdirectiveInject(i5.LoadingService), i0.ɵɵdirectiveInject(i6.AuthService), i0.ɵɵdirectiveInject(i7.TicketService), i0.ɵɵdirectiveInject(i8.DomSanitizer), i0.ɵɵdirectiveInject(i9.BackgroundTaskService), i0.ɵɵdirectiveInject(i10.FpnSubmissionService), i0.ɵɵdirectiveInject(i11.PatrolService), i0.ɵɵdirectiveInject(i12.TrackingService), i0.ɵɵdirectiveInject(i13.ThermalPrinterService), i0.ɵɵdirectiveInject(i14.OfflineTicketService), i0.ɵɵdirectiveInject(i15.QueueSyncService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QueuePage, selectors: [["app-queue"]], decls: 14, vars: 5, consts: [[3, "translucent"], [3, "currentStep"], [3, "fullscreen"], [1, "ep-page"], [1, "ep-page-head"], [1, "ep-kicker"], ["class", "ep-empty", 4, "ngIf"], ["class", "ep-ticket", 4, "ngFor", "ngForOf"], [1, "ep-empty"], [1, "ep-ticket"], [1, "ep-ticket__top"], [1, "ep-ticket__title"], [1, "ep-ticket__meta"], ["fill", "clear", "size", "small", 3, "click"], ["slot", "icon-only", "name", "create-outline"], ["class", "ep-ticket__photos", 4, "ngIf"], [1, "ep-actions", "ep-actions--split"], ["expand", "block", "color", "success", 3, "click"], [1, "ep-ticket__actions", 2, "margin-top", "10px"], ["size", "small", 3, "click", 4, "ngIf"], ["size", "small", "color", "dark", 3, "click"], ["size", "small", "color", "danger", 3, "click", 4, "ngIf"], ["id", "html_ticket", 3, "innerHTML", 4, "ngIf"], [1, "ep-ticket__photos"], [1, "ep-photo-grid"], ["class", "ep-photo-tile", 4, "ngFor", "ngForOf"], [1, "ep-photo-tile"], ["alt", "", 3, "src"], ["size", "small", 3, "click"], ["size", "small", "color", "danger", 3, "click"], ["id", "html_ticket", 3, "innerHTML"]], template: function QueuePage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-header", 0);
            i0.ɵɵelement(1, "ion-router-outlet")(2, "app-nav-bar", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "ion-content", 2)(4, "div", 3)(5, "div", 4)(6, "p", 5);
            i0.ɵɵtext(7, "Pending work");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "h1");
            i0.ɵɵtext(9, "Submission queue");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "p");
            i0.ɵɵtext(11, "Review, generate, print, then send.");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(12, QueuePage_div_12_Template, 5, 0, "div", 6)(13, QueuePage_article_13_Template, 21, 7, "article", 7);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("currentStep", ctx.currentStep);
            i0.ɵɵadvance();
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("ngIf", !(ctx.enviro_que_addition == null ? null : ctx.enviro_que_addition.length));
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.enviro_que_addition);
        } }, dependencies: [i16.NgForOf, i16.NgIf, i3.IonButton, i3.IonContent, i3.IonHeader, i3.IonIcon, i3.IonRouterOutlet, i17.NavBarComponent], styles: ["#html_ticket[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  overflow: auto;\n}\n\n.ep-ticket__photos[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n}\n\n.ep-ticket__photos[_ngcontent-%COMP%]   .ep-photo-grid[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueuePage, [{
        type: Component,
        args: [{ selector: 'app-queue', template: "<ion-header [translucent]=\"true\">\n    <ion-router-outlet></ion-router-outlet>\n    <app-nav-bar [currentStep]=\"currentStep\"></app-nav-bar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n    <div class=\"ep-page\">\n        <div class=\"ep-page-head\">\n            <p class=\"ep-kicker\">Pending work</p>\n            <h1>Submission queue</h1>\n            <p>Review, generate, print, then send.</p>\n        </div>\n\n        <div class=\"ep-empty\" *ngIf=\"!enviro_que_addition?.length\">\n            <h3>Queue is clear</h3>\n            <p>Saved tickets waiting to submit will show here.</p>\n        </div>\n\n        <article class=\"ep-ticket\" *ngFor=\"let enviro_post of enviro_que_addition\">\n            <div class=\"ep-ticket__top\">\n                <div>\n                    <h3 class=\"ep-ticket__title\">{{ enviro_post.first_name }} {{ enviro_post.last_name }}</h3>\n                    <p class=\"ep-ticket__meta\">{{ queueStatus(enviro_post) }}</p>\n                </div>\n                <ion-button fill=\"clear\" size=\"small\" (click)=\"editFPN(enviro_post)\">\n                    <ion-icon slot=\"icon-only\" name=\"create-outline\"></ion-icon>\n                </ion-button>\n            </div>\n\n            <div class=\"ep-ticket__photos\" *ngIf=\"enviro_post.offence_images?.length\">\n                <p class=\"ep-ticket__meta\">{{ enviro_post.offence_images.length }} photo{{ enviro_post.offence_images.length === 1 ? '' : 's' }} attached.</p>\n                <div class=\"ep-photo-grid\">\n                    <div class=\"ep-photo-tile\" *ngFor=\"let src of enviro_post.offence_images\">\n                        <img [src]=\"src\" alt=\"\" />\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"ep-actions ep-actions--split\">\n                <ion-button expand=\"block\" color=\"success\" (click)=\"submitFPN(enviro_post, true)\">Submit & print</ion-button>\n                <ion-button expand=\"block\" color=\"success\" (click)=\"submitFPN(enviro_post, false)\">Submit</ion-button>\n            </div>\n\n            <div class=\"ep-ticket__actions\" style=\"margin-top: 10px;\">\n                <ion-button *ngIf=\"!enviro_post.html_bool\" size=\"small\" (click)=\"generateTicket(enviro_post)\">Generate ticket</ion-button>\n                <ion-button size=\"small\" color=\"dark\" (click)=\"printOfflineTicket(enviro_post)\">Print</ion-button>\n                <ion-button *ngIf=\"enviro_post.html_bool\" size=\"small\" color=\"danger\" (click)=\"enviro_post.html_bool = false\">Close preview</ion-button>\n            </div>\n\n            <div *ngIf=\"enviro_post.html_bool\" id=\"html_ticket\" [innerHTML]=\"enviro_post.html_string\"></div>\n        </article>\n    </div>\n</ion-content>\n", styles: ["#html_ticket {\n  margin-top: 12px;\n  overflow: auto;\n}\n\n.ep-ticket__photos {\n  margin: 0 0 12px;\n}\n\n.ep-ticket__photos .ep-photo-grid {\n  margin-top: 8px;\n}\n"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.AlertController }, { type: i4.Router }, { type: i4.ActivatedRoute }, { type: i5.LoadingService }, { type: i6.AuthService }, { type: i7.TicketService }, { type: i8.DomSanitizer }, { type: i9.BackgroundTaskService }, { type: i10.FpnSubmissionService }, { type: i11.PatrolService }, { type: i12.TrackingService }, { type: i13.ThermalPrinterService }, { type: i14.OfflineTicketService }, { type: i15.QueueSyncService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(QueuePage, { className: "QueuePage" }); })();
//# sourceMappingURL=queue.page.js.map