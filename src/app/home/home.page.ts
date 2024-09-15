import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';
import { ApiService } from '../services/enforcementpro/api.service';
import { DataService } from '../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { AppLog } from '../models/app-log';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

    app_log: AppLog;
    name: string = '';
    url: string = '';


    user: any = null;
    selected_site: any; // Variable to hold selected site

    sites: any[] = [];


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router
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

    onSiteChange() {
        this.data.setSelectedSite(this.selected_site);
    }

    navigate(route: string){
        this.router.navigate([route]);
    }

    logout(): void {
        this.auth.logout();
    }

}
