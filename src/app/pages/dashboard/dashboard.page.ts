

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

import { AppLauncher } from '@capacitor/app-launcher';
import { LoadingService } from '../../services/loading.service';
import { User } from '../../models/user';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Login } from '../../models/login';
import { EnviroPost } from '../../models/enviro';

import { App as CapacitorApp } from '@capacitor/app';
import { OnDestroy } from '@angular/core';
import { Site } from '../../models/site';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit, OnDestroy {

    private checkLoginTimeoutId: any;
    private refreshIntervalId: any;
    private pingIntervalId: any;

    appStateListener: any;

    app_log: AppLog;
    name: string = '';
    url: string = '';
    token: string = '';

    recent_fpns: any [] = [];

    user: User;
    selected_site: any = null; // Variable to hold selected site



    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private http: HttpClient,
        private alertController: AlertController,
        private loading:LoadingService,
        private platform: Platform

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
        this.app_log = this.data.getAppLog();

        this.getRecentFPN();

        // this.selected_site = this.data.getSelectedSite() || null;
        // console.log(this.selected_site);
    }

    async ngOnInit() {
        this.loading.showLoading();

        await this.data.init();
 
        this.init();

        this.loading.hideLoading();
    }

    blockBackButton() {
        this.platform.backButton.subscribeWithPriority(9999, () => {});
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

        this.checkLoginTimeoutId = setTimeout(() => {
            this.checkLoggedIn();
        }, 4000);
        
        this.refreshIntervalId = setTimeout(() => {
            this.refresh();
        }, 5000);

        this.pingIntervalId = setInterval(() => {
            this.refresh();
            this.ping();
        }, 30000);

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
            clearTimeout(this.checkLoginTimeoutId);
            this.checkLoginTimeoutId = null;
        }

        if (this.refreshIntervalId) {
            clearInterval(this.refreshIntervalId);
            this.refreshIntervalId = null;
        }

        if (this.pingIntervalId) {
            clearInterval(this.pingIntervalId);
            this.pingIntervalId = null;
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

            this.getCurrentPosition()
            .subscribe((position: any) => {
                this.app_log.lat = position.latitude;
                this.app_log.lng = position.longitude;
            });

            this.app_log.user_id = this.user.id.toString();
            this.app_log.type = 'ping';

            this.api.postTrack(this.app_log).subscribe({
                next: (response) => {
                    // console.log('Response:', response);
                },
                error: (error) => {
                    // console.error('Error:', error);
                }
            });
        } 
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

    async openOtherApp() {
        try {
            await AppLauncher.openUrl({
                url: 'com.example.enforcementproprinter'
            });
        } catch (error) {
            try {
                await AppLauncher.openUrl({
                    url: 'com.ahmedelsayed.sunmiprinterapp.test'
                });
            }
            catch (error) {
                this.presentAlert('Error', 'Cannot find printer app. Navigate manually')
            }
        }
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