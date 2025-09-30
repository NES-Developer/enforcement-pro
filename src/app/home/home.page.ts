import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';
import { ApiService } from '../services/enforcementpro/api.service';
import { DataService } from '../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { AppLog } from '../models/app-log';
import { HttpClient } from '@angular/common/http';

import { Clipboard } from '@capacitor/clipboard';
import { AlertController } from '@ionic/angular';
import { isEmpty } from 'rxjs';

import { AppLauncher } from '@capacitor/app-launcher';
import { LoadingService } from '../services/loading.service';
import { User } from '../models/user';

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Login } from '../models/login';
import { EnviroPost } from '../models/enviro';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    app_log: AppLog;
    name: string = '';
    url: string = '';

    recent_fpns: any [] = [];

    user: User;
    selected_site: any; // Variable to hold selected site

    sites: any[] = [];


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private http: HttpClient,
        private alertController: AlertController,
        private loading:LoadingService,
    ) {
        this.auth.checkLoggedIn();

        let user = this.auth.getUser();

        if (user) 
        {
            this.user = user;
        } else {
            this.user = new User();
        }
        console.log(this.user)
        this.app_log = new AppLog();


    }

    ngOnInit(): void {
        let user = this.auth.getUser();
        if (user) 
        {
            this.user = user;
        }
        this.init();
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
        this.auth.checkLoggedIn();

        if (this.data.checkSelectedSite() === false) {
            this.navigate('site');
        } 
        
        this.loadData();
    }

    refresh () {
        if (this.data.checkSelectedSite() === false) {
            this.navigate('site');
        } 

        window.location.reload();
    }

    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;
        return url;
    }

    loadData() {
        this.app_log = this.data.getAppLog();
        // this.user = this.data.getuser

        if(this.data.checkAppLog()) {
            this.ping();
            setInterval(() => {
                this.ping();
            }, 60000); // 1 minutes in milliseconds
        }

        this.getRecentFPN();

        this.selected_site = this.data.getSelectedSite() || null;
        console.log(this.selected_site);
        this.url = this.data.getUrl();
    }

    ping() {
        if (this.data.checkAppLog()) {
            this.api.postTrack(this.app_log).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                },
                error: (error) => {
                    console.error('Error:', error);
                }
            });
        }
    }

    getRecentFPN() {
        this.loading.showLoading();
        let user = this.auth.getUser();
        if (user) {
            this.api.getRecentFPNs(user.id).subscribe({
                next: (response) => {
                    this.recent_fpns = response.data;
                    console.log('Response:', response);
                    this.loading.hideLoading();
                },
                error: (error) => {
                    console.error('Error:', error);
                    this.loading.hideLoading();
                }
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

    navigate(route: string){
        this.router.navigate([route]);
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

    async openOtherApp(index: number) {
        switch (index) {
            case 0:
                try {
                    await AppLauncher.openUrl({
                        url: 'com.example.enforcementproprinter'
                    });
                } catch (error) {
                    // console.error('Error launching app:', error);
                    this.presentAlert('Error', 'Cannot find printer app. Navigate manually')
                }
                break;
            case 1: 
            try {
                  await AppLauncher.openUrl({
                    url: 'com.ahmedelsayed.sunmiprinterutill'
                  });
            } catch (error) {
                // console.error('Error launching app:', error);
                this.presentAlert('Error', 'Cannot find printer app. Navigate manually')
            }
            break;
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
