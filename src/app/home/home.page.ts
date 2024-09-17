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

    user: any = null;
    selected_site: any; // Variable to hold selected site

    sites: any[] = [];


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private http: HttpClient,
        private alertController: AlertController
    ) {
        this.app_log = new AppLog()
    }

    ngOnInit(): void {
        this.init();
    }

    init() {
        this.auth.checkLoggedIn();
        this.user = this.auth.getUser();

        if (this.data.checkSelectedSite() === false) {
            this.navigate('site');
        } 
        
        this.loadData();
    }

    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;
        return url;
    }

    loadData() {

        this.app_log = this.data.getAppLog();
        // Trigger a method every 30 minutes (1800000 milliseconds)
        if(this.data.checkAppLog()) {
            setInterval(() => {
                this.ping();
            }, 1800000);
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
        let user_id = this.auth.getUser().id;
        this.api.getRecentFPNs(user_id).subscribe({
            next: (response) => {
                this.recent_fpns = response.data;
                console.log('Response:', response);
            },
            error: (error) => {
                console.error('Error:', error);
            }
        })
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

    logout(): void {
        let queue = this.data.getEnviroQue();
        if (queue.length == 0) {
            this.auth.logout();
        } else {
            this.presentAlert('Error', 'Found FPNs on Queue,  please submit before logging out.')
        }
    }

    copyUrlFPN (fpn_number: string) {
        let url = this.getFpnImageUrl(fpn_number).toString();
        Clipboard.write({
            string: url
        });
        this.presentAlert('Successful', 'Copied FPN Url to Clipboard')
    }

    async openOtherApp() {
        try {
          const canOpen = await AppLauncher.canOpenUrl({
            url: 'com.example.enforcementproprinter'
          });
    
          if (canOpen.value) {
            await AppLauncher.openUrl({
              url: 'com.example.enforcementproprinter'
            });
          } else {
            console.log('Cannot open app');
            this.presentAlert('Error', 'Cannot find printer app. Navigate manually')
          }
        } catch (error) {
          console.error('Error launching app:', error);
          this.presentAlert('Error', 'Cannot find printer app. Navigate manually')
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

}
