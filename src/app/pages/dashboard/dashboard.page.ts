

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { AppLog } from '../../models/app-log';
import { HttpClient } from '@angular/common/http';

import { Clipboard } from '@capacitor/clipboard';
import { AlertController, Platform } from '@ionic/angular';
import { Observable, Subscriber, isEmpty } from 'rxjs';

import { LoadingService } from '../../services/loading.service';
import { User } from '../../models/user';

import { App } from '@capacitor/app';
import { Login } from '../../models/login';
import { EnviroPost } from '../../models/enviro';
import { BackgroundTaskService } from '../../services/background-task.service';
import { PatrolService } from '../../services/patrol.service';
import { TrackingService } from '../../services/tracking.service';
import { ThermalPrinterService } from '../../services/thermal-printer.service';

import { App as CapacitorApp } from '@capacitor/app';
import { OnDestroy } from '@angular/core';
import { Site } from '../../models/site';

import { CapacitorConfig } from '@capacitor/cli';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit, OnDestroy {

    private checkLoginTimeoutId: any;
    private refreshIntervalId: any;
    private pingIntervalId: any;
    private checkSelectedSiteTimeoutId: any;

    appStateListener: any;

    app_log: AppLog;
    name: string = '';
    url: string = '';
    token: string = '';

    recent_fpns: any [] = [];

    user: User;
    selected_site: any = null; // Variable to hold selected site

    baseUrl: string = 'https://app.enforcementpro.co.uk/';

    get submittedCount(): number {
        return this.recent_fpns?.length ?? 0;
    }

    get queueCount(): number {
        const queue = this.data.getEnviroQue();
        return Array.isArray(queue) ? queue.length : 0;
    }

    get totalRecordCount(): number {
        return this.submittedCount + this.queueCount;
    }

    get submitRate(): number {
        const total = this.totalRecordCount;
        if (total === 0) {
            return 0;
        }
        return Math.round((this.submittedCount / total) * 100);
    }

    get hasGpsFix(): boolean {
        return this.app_log.lat !== '0' && this.app_log.lng !== '0';
    }

    get gpsSummary(): string {
        if (!this.hasGpsFix) {
            return 'No GPS fix yet';
        }
        return `${this.app_log.lat}, ${this.app_log.lng}`;
    }

    get isOnPatrol(): boolean {
        return this.patrol.isOnPatrol();
    }

    get patrolStatus(): string {
        return this.patrol.getStatusText();
    }

    get patrolHours(): string {
        return this.patrol.getHoursText();
    }


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private http: HttpClient,
        private alertController: AlertController,
        private loading:LoadingService,
        private platform: Platform,
        private backgroundTasks: BackgroundTaskService,
        private patrol: PatrolService,
        private tracking: TrackingService,
        private printer: ThermalPrinterService

    ) {
        this.app_log = new AppLog();
        this.user = new User();

        this.loadData();

        this.platform.ready().then(() => {
            this.blockBackButton();
        });

    }

    loadData() {
        this.user = this.data.getUser();
        this.token = this.data.getToken();
        this.url = this.data.getUrl();
        this.selected_site = this.data.getSelectedSite();
        this.app_log = this.data.getAppLog() || new AppLog();

        this.getRecentFPN();

        // this.selected_site = this.data.getSelectedSite() || null;
        // console.log(this.selected_site);
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
        this.checkSelectedSite();
    }

    blockBackButton() {
        this.backgroundTasks.registerSubscription(
            this.platform.backButton.subscribeWithPriority(9999, () => {})
        );
    }

    async printFoward() {
        try {
          await this.printer.feedPaper();
        } catch (error: any) {
          console.error("Paper feed failed:", error);
          this.presentAlert('Print Error', error?.message || 'Unable to feed printer paper.');
        }
    }

    fpnDuplicate() {
        let enviro_que: EnviroPost[] = this.data.getEnviroQue();
        let counter: number = 0;
        
        for (let i=0; i < this.recent_fpns.length; i++) {
            for (let x=0; x < enviro_que.length; x++) {
                if (
                    this.recent_fpns[i].offender.town == enviro_que[x].town &&
                    this.recent_fpns[i].offender.first_name == enviro_que[x].first_name &&
                    this.recent_fpns[i].offender.last_name == enviro_que[x].last_name &&
                    this.recent_fpns[i].offence_location == enviro_que[x].offence_location,
                    this.recent_fpns[i].offence_id == enviro_que[x].offence_id &&
                    this.recent_fpns[i].zone_id == enviro_que[x].zone_id 
                ) {
                    this.data.spliceEnviroQue(enviro_que[x]);
                    counter++;
                }
            }
        }

        if (counter > 0)
        {
            this.presentAlert('Found', 'Duplicate found, thank you for reporting. We removed it from Queue.');
            this.refresh();
        } else {
            this.presentAlert('Nothing Found', 'No duplicate found, attempt resubmitting.')
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

    private clearTimers() {
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
        if (this.selected_site == null)
        {
            this.selected_site = this.data.getSelectedSite() || null;

            if (this.selected_site == null)
            {
                this.checkLoggedIn();
                this.route('/site');
            }
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


    refresh () {
        this.loadData();
    }

    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;
        return url;
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
        if (this.token !== '') {
            this.tracking.pingNow().catch(() => undefined);
        }
    }

    async startPatrol(): Promise<void> {
        this.patrol.startPatrol(8);

        try {
            await this.tracking.syncTrackingState();
            this.refresh();
            this.presentAlert('Patrol Started', 'Location tracking is now active for your patrol hours.');
        } catch (error: any) {
            this.patrol.endPatrol();
            this.presentAlert('Location Required', error?.message || 'Location permission is required to start patrol.');
        }
    }

    async endPatrol(): Promise<void> {
        this.patrol.endPatrol();
        await this.tracking.stop();
        this.refresh();
        this.presentAlert('Patrol Ended', 'FPN tools are locked until you start patrol again.');
    }

    getRecentFPN() {
        if (this.user.id > 0) {
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

    getFpnImageUrl(fpn_number: string) {
        // Generate the random 0 or 1
        let randomValue = 0; // Generates 0 or 1
        let correctLink: any = this.getRequestTicket(randomValue, fpn_number);
        if (!correctLink) {
            randomValue = 1;
            correctLink = this.getRequestTicket(randomValue, fpn_number);
        }
        const link = `uploads/tickets/EP${randomValue}_${fpn_number}_PRINT_1_fpn.png`;
        return link;
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

    printFPN(fpn: any)
    {
        // console.log(fpn.ticket);
        let ticket_image = this.baseUrl + 'uploads/tickets/' + fpn.ticket;
        this.printImageFromUrl(ticket_image);
    }

    getRequestTicket(randomValue: number, fpn_number: string) {
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

    route(route: string) {
        this.router.navigate([route]);
    }

    logout(): void {
        this.loading.showLoading();
        let queue = this.data.getEnviroQue();
    
        // Check if there are any FPNs with an empty notebook entry
        let outstandingNotebookEntries = this.recent_fpns.some(fpn => this.notebookEntryIsEmpty(fpn));
    
        if (queue.length == 0 && !outstandingNotebookEntries) {
            // Proceed with logout if there are no outstanding notebook entries
            // this.clearTimers();
            this.loading.hideLoading();
            this.auth.logout();
        } else if (outstandingNotebookEntries) {
            this.loading.hideLoading();
            // Alert user to complete all notebook entries before logging out
            this.presentAlert('Error', 'Please complete all outstanding Notebook Entries before logging out.');
          
        } else {
            // Alert user if there are FPNs in the queue
            this.loading.hideLoading();
            this.presentAlert('Error', 'Found FPNs on Queue, please submit before logging out.');
        }
    }
    

    copyFPNNumber (fpn_number: string) {
        Clipboard.write({
            string: fpn_number
        });
        this.presentAlert('Successful', 'Copied FPN Number to Clipboard')
    }

    async presentAlert(header: string, message: string) {
  
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

    notebookEntry(fpn: any) {
        this.router.navigate(['/notebook', fpn.id], { queryParams: { fpn_number: fpn.fpn_number } });

        console.log(fpn.notebook_entry);//notebook_entry
    }

    notebookEntryIsEmpty(fpn: any): boolean {
        return !fpn.notebook_entry || fpn.notebook_entry.length === 0;
    }
      

}
