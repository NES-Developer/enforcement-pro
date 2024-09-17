import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-site',
  templateUrl: './site.page.html',
  styleUrls: ['./site.page.scss'],
})
export class SitePage implements OnInit {

    sites: any[] = [];
    user: any = null;
    selected_site: any; // Variable to hold selected site
    search_site: string = '';
    url: string = '';
    filteredSites: any[] = [];
    searchQuery: string = '';


    constructor(
        private auth: AuthService,
        private api: ApiService,
        private data: DataService,
        private router: Router,
        private alertController: AlertController
    ) {
        
    }
    ngOnInit(): void {
        this.init();      
    }

    logout(): void {
        let queue = this.data.getEnviroQue();
        if (queue.length == 0) {
            this.auth.logout();
        } else {
            this.presentAlert('Error', 'Found FPNs on Queue,  please submit before logging out.')
        }
    }

    init() {
        this.auth.checkLoggedIn();
        this.user = this.auth.getUser();

        if (this.data.checkSites() === false) {
            this.getSites();
        } 
        
        this.loadData();
    }

    getSites(): void {
        this.api.getSites().subscribe({
            next: (data) => {
                this.data.setSites(data.data);
                this.loadData();
            },
            error: (error) => {
                console.error('Error fetching sites Data:', error);
                this.presentAlert("Error", error.error.message)
                // Handle error as needed
            }
        });
    }

    loadData() {
        this.sites = this.data.getSites();
        this.selected_site = this.data.getSelectedSite() || null;
        this.url = this.data.getUrl();
    }

    getImageUrl(prefix: string) { 
        let url: string = this.url + '/' + prefix;

        return url;
    }

    setSite(site_id: any) {
        this.selected_site = this.sites.find((site) => site.id === site_id);
        // console.log(this.selected_site);

        // console.log(site);
        this.data.setSelectedSite(this.selected_site);
        this.router.navigate(['']);
    }

    navigate(route: string){
        this.router.navigate([route]);
    }

    filterSites() {
        this.filteredSites = this.sites.filter(site => {
            return site.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
    }

    async presentAlert(header: string, message: string) {
        let button_title: string = 'Ok';
        let message_display: string = 'Please Click Okay.';
        if (header == "Error") {
            message_display = message + ". Please attempt to logout and log back in.";
        }
        const alert = await this.alertController.create({
            header: header,
            message: message_display,
            buttons: [
                {
                    text: button_title
                }
            ],
        });
        await alert.present();
    }

}
