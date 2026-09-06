
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { OffenceGroup } from '../../models/offence-group';
import { Offence } from '../../models/offence';
import { SiteOffence } from '../../models/site-offence';
import { EnviroPost } from '../../models/enviro';
import { AlertController, Platform } from '@ionic/angular';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
// import { App } from '@capacitor/app';
import { User } from '../../models/user';
import { Observable, Subscriber, timeout } from 'rxjs';

import { App as CapacitorApp } from '@capacitor/app';
import { OnDestroy } from '@angular/core';

import { CapacitorConfig } from '@capacitor/cli';
import { BackgroundTaskService } from '../../services/background-task.service';
import { FpnSubmissionService } from '../../services/fpn-submission.service';
import { PatrolService } from '../../services/patrol.service';
import { TrackingService } from '../../services/tracking.service';
import { ThermalPrinterService } from '../../services/thermal-printer.service';
import { LemoEncourageService } from '../../services/lemo-encourage.service';
import { OfflineTicketService } from '../../services/offline-ticket.service';
import { QueueSyncService } from '../../services/queue-sync.service';
import { enviroStepperStep, findFirstMissingFpnField } from '../../helpers/fpn-core-validation';


@Component({
    selector: 'app-enviro',
    templateUrl: './enviro.page.html',
    styleUrls: ['./enviro.page.scss'],
  })
  export class EnviroPage implements OnInit {

    selected_site: any = null;

     
    appStateListener: any;

    app_log: AppLog;
    map: any;
    currentStep: number = 1;
    readonly stepTitles = [
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
    enviro_post: EnviroPost;
    fpn: any;
    baseUrl: string = 'https://app.enforcementpro.co.uk/';
    id: any;
    isSubmitting: boolean = false;

    user: User;

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private route2: ActivatedRoute,
        private router: Router,
        private loading:LoadingService,
        private platform: Platform,
        private backgroundTasks: BackgroundTaskService,
        private fpnSubmission: FpnSubmissionService,
        private patrol: PatrolService,
        private tracking: TrackingService,
        private printer: ThermalPrinterService,
        private encourage: LemoEncourageService,
        private offlineTicket: OfflineTicketService,
        private queueSync: QueueSyncService


    ) {
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
        this.backgroundTasks.registerSubscription(
            this.platform.backButton.subscribeWithPriority(9999, () => {
                if (this.currentStep > 1) {
                    this.previousStep();
                    return;
                }
                void this.confirmLeave();
            })
        );
    }

    navigate(route: string){
        this.router.navigate([route]);
    }

    route(route: string) {
        this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
    }

    loadData() {
        this.selected_site = this.data.getSelectedSite();
        this.enviro_post = this.data.getEnviroPost();
        this.user = this.data.getUser();
        this.assignOfficerId();
        this.app_log = this.data.getAppLog() || new AppLog();
       
        if (!this.data.checkFPNData()){
            this.getFPNData();
        } 
    }

    getFPNData(): void {
        
        this.api.getFPNData(this.selected_site.id).subscribe({
            next: (data) => {
                this.data.applyFPNData(data);
            },
            error: (error) => {

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please contact support');
                } 
                else if (error.status == 401) {
                    this.presentAlert('Auth Failed', 'Please login again.');
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please place in que, find better reception and try again.');
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

    get stepTitle(): string {
        return this.stepTitles[this.currentStep] ?? '';
    }

    get stepProgress(): number {
        return ((this.currentStep - 1) / 7) * 100;
    }

    get nextStepTitle(): string {
        return this.stepTitles[this.currentStep + 1] ?? '';
    }

    extractOffenceGroups(offences: Offence[]): OffenceGroup[] {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as OffenceGroup);
    }
    
    validationOptions() {
        return { requireZone: this.data.getZones().length > 0 };
    }

    firstMissingField() {
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        return findFirstMissingFpnField(this.enviro_post, this.validationOptions());
    }

    validator(): boolean {
        const gap = this.firstMissingField();
        if (gap && gap.stepperStep <= this.currentStep) {
            this.presentAlert('Wait!', gap.message);
            return false;
        }
        return true;
    }

    submitValidator(): boolean {
        const gap = this.firstMissingField();
        if (gap) {
            this.presentAlert('Wait!', gap.message);
            this.currentStep = gap.stepperStep;
            return false;
        }

        this.assignOfficerId();
        return true;
    }

    coreFpnValidator(): boolean {
        return this.submitValidator();
    }

    private applyResumeStep(parsed: number): void {
        const needed = enviroStepperStep(this.data.getEnviroPost() || this.enviro_post, this.validationOptions());
        if (Number.isFinite(parsed) && parsed > 1) {
            this.currentStep = Math.min(parsed, needed);
            return;
        }
        this.currentStep = needed;
    }

    async printImageFromUrl(imageUrl: string) {
        try {
            await this.printer.printImage(imageUrl);
            console.log("Printing completed successfully");
        } catch (error: any) {
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

    assignOfficerId() 
    {
        if (this.enviro_post.officer_id == 0) {
            if (this.user && this.user.id > 0) {
                this.app_log.user_id = this.user.id.toString();
                this.enviro_post.officer_id = this.user.id;
            } else {
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

                        await this.printPostedTicket(this.fpn || result.response);

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
                .catch((error: any) => {
                    this.loading.hideLoading();
                    this.isSubmitting = false;
                    this.presentAlert('Error', error?.message || 'Unable to submit FPN.');
                });

        }
    }

    refresh() {
        this.loadData();
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['Okay'],
        });
        await alert.present();
    }

    async confirmLeave(): Promise<void> {
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
    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data:image/png;base64, prefix if the plugin requires raw base64
            resolve(base64String.split(',')[1]); 
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    }

    cancel(destination: string = '/dashboard') {
        this.currentStep = 1;

        this.enviro_post = new EnviroPost();
        this.data.setEnviroPost(this.enviro_post);

        this.router.navigate([destination]);
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

    ping() {
        this.tracking.pingNow().catch(() => undefined);
    }

    private async printPostedTicket(payload: any): Promise<void> {
        this.applyPostedTicketIdentity(payload);

        const ticketUrl = this.resolveServerTicketUrl(payload);
        if (ticketUrl) {
            try {
                await this.printer.printImage(ticketUrl);
                return;
            } catch {
                // Server ticket images are often missing on later FPNs. Print locally instead.
            }
        }

        try {
            const printed = await this.offlineTicket.printFor(this.enviro_post);
            if (!printed) {
                this.presentAlert('Print Error', 'Unable to print ticket.');
            }
        } catch (error: any) {
            this.presentAlert('Print Error', error?.message || 'Unable to print ticket.');
        }
    }

    private applyPostedTicketIdentity(payload: any): void {
        const number = String(payload?.fpn_number || payload?.data?.fpn_number || '').trim();
        if (!number) {
            return;
        }

        this.enviro_post.fpn_number = number;
        const barcode = String(payload?.barcode || payload?.data?.barcode || '').trim();
        this.enviro_post.barcode = barcode || this.enviro_post.barcode || number;
    }

    private resolveServerTicketUrl(payload: any): string | null {
        const ticket = payload?.ticket || payload?.ticket_image || payload?.print_ticket || payload?.data?.ticket;
        if (typeof ticket !== 'string' || !ticket.trim()) {
            return null;
        }

        if (ticket.startsWith('http://') || ticket.startsWith('https://')) {
            return ticket;
        }

        const path = ticket.includes('/') ? ticket.replace(/^\//, '') : `uploads/tickets/${ticket}`;
        return `${this.baseUrl}${path}`;
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
                    .catch((error: any) => {
                        this.loading.hideLoading();
                        this.isSubmitting = false;
                        this.presentAlert('Error', error?.message || 'Unable to save FPN.');
                    });

            } else {
                this.loading.hideLoading();
                this.isSubmitting = false;
                this.presentAlert('Error', 'Queue has exceeded 25, please submit. Submit some FPNs on queue to increase space.')
            }
        }
    }

    



}
