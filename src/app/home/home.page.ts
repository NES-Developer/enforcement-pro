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


import { EnviroPost } from '../models/enviro';
import { Login } from '../models/login';


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

    enviro_que: EnviroPost[] = [];


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private http: HttpClient,
        private alertController: AlertController,
        private loading:LoadingService,
    ) {
        if (!this.auth.loggedInCheck())
        {
            this.autoLogin();
        }

        this.loading.showLoading();
        
        let user = this.auth.getUser();

        if (user) 
        {
            this.user = user;
        } else {
            this.user = new User();
        }

        this.app_log = new AppLog();
    }

    ngOnInit(): void {
   
        this.init();

    }

    init() {

        if (this.data.checkSelectedSite() === false) {
            this.navigate('site');
        } 
        
        this.loadData();
    }

    fpnDuplicate() {
        let enviro_que = this.data.getEnviroQue();
        let counter: number = 0;
        
        for (let i=0; i < this.recent_fpns.length; i++) {
            for (let x=0; x < enviro_que.length; x++) {
                console.log(
                    this.recent_fpns[i] , this.enviro_que[x] , 
                    this.recent_fpns[i].offence_id , this.enviro_que[x].offence_id, 
                );
                console.log(
                    this.recent_fpns[i].offender.ethnicity == this.enviro_que[x].ethnicity_id ,
                    this.recent_fpns[i].offender.first_name == this.enviro_que[x].first_name ,
                    this.recent_fpns[i].offender.last_name == this.enviro_que[x].last_name ,
                    this.recent_fpns[i].offender.gender == this.enviro_que[x].gender ,
                    this.recent_fpns[i].offence_location == this.enviro_que[x].offence_location,
                    this.recent_fpns[i].lng == this.enviro_que[x].lng.toString(),
                    this.recent_fpns[i].zone_id == this.enviro_que[x].zone_id 
                    );
                if (
                    this.recent_fpns[i].offender.town == this.enviro_que[x].town &&
                    this.recent_fpns[i].offender.first_name == this.enviro_que[x].first_name &&
                    this.recent_fpns[i].offender.last_name == this.enviro_que[x].last_name &&
                    // this.recent_fpns[i].offender.gender == this.enviro_que[x].gender &&
                    this.recent_fpns[i].offence_location == this.enviro_que[x].offence_location,
                    // this.recent_fpns[i].lng == this.enviro_que[x].lng.toString() &&
                    this.recent_fpns[i].offence_id == this.enviro_que[x].offence_id &&
                    this.recent_fpns[i].zone_id == this.enviro_que[x].zone_id 
                ) {
                    this.data.spliceEnviroQue(this.enviro_que[x]);
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

    autoLogin() {
        let login: Login = this.data.getLogin();

        this.auth.login(login.id, login.pin).subscribe(
            (response) => {
                console.log(1,response)
                if (response.access_token !== '' || response.user) {

                    this.auth.storeToken(response.access_token);
                    this.auth.storeUser(response.user);

                } else {
                    // let message: string = response.message;
                    this.presentAlert("Login Attempt Failed", response.message)
                } 
            },
            (error) => {
                this.presentAlert("Login Attempt Failed", "Please Logout and Login again. " + error.message)
            }
        );
    }

    loadData() {
        this.app_log = this.data.getAppLog();
        this.enviro_que = this.data.getEnviroQue();

        if(this.data.checkAppLog()) {
            this.ping();
            setInterval(() => {
                this.ping();
            }, 60000); // 1 minutes in milliseconds
        }

        this.getRecentFPN();

        this.selected_site = this.data.getSelectedSite() || null;
        this.url = this.data.getUrl();

        this.loading.hideLoading();

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
        let user = this.auth.getUser();
        if (user) {
            this.api.getRecentFPNs(user.id).subscribe({
                next: (response) => {
                    this.recent_fpns = response.data;
                    console.log(this.recent_fpns);
                    // Sort the array by created_at in descending order (newest first)
                    this.recent_fpns.sort((a, b) => {
                        // Convert the created_at strings to Date objects for comparison
                        const dateA = new Date(a.created_at);
                        const dateB = new Date(b.created_at);

                        // Subtracting dates gives a timestamp difference.
                        // For descending order (newest first), subtract dateA from dateB.
                        return dateB.getTime() - dateA.getTime();
                    });
                },
                error: (error) => {         
                    this.presentAlert(error.status, error.message);

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
