import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';
import { ApiService } from '../services/enforcementpro/api.service';
import { DataService } from '../services/enforcementpro/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {


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
        
    }

    ngOnInit(): void {
        this.Init();
    }

    Init() {
        this.auth.checkLoggedIn();
        this.user = this.auth.getUser();

        if (this.data.checkSelectedSite() === false) {
            this.navigate('site');
        } 
        
        this.loadData();
    }

    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;
        console.log(url);

        return url;
    }

    loadData() {
        // this.sites = this.data.getSites();
        // console.log(this.sites);
        // alert(1);
        this.selected_site = this.data.getSelectedSite() || null;
        this.url = this.data.getUrl();

        console.log(this.selected_site);
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
