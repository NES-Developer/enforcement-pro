import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/enforcementpro/auth.service';
import { DataService } from '../services/enforcementpro/data.service';
import { Router } from '@angular/router';
import { Site } from '../models/site';
import { ApiService } from '../services/enforcementpro/api.service';
//import * as L from 'leaflet';

@Component({
  selector: 'app-service-request',
  templateUrl: 'service-request.page.html',
  styleUrls: ['service-request.page.scss']
})
export class ServiceRequestPage implements OnInit {

    map: any;
    selected_site!: Site;

    constructor(
        private auth: AuthService,
        private data: DataService,
        private router: Router,
        private api: ApiService
    ) {
    }


    ngOnInit(): void {
        this.auth.checkLoggedIn();

        this.init();
    }

    init() {
        this.auth.checkLoggedIn();

        if (this.data.checkSelectedSite() == false) {
            this.navigate('site');
        }
        this.selected_site = this.data.getSelectedSite();
        
        if(this.data.checkSRData() == false) {
            this.getSRData();
        }
        
    }

    getSRData(): void {
        this.api.getSRData().subscribe({
          next: (data) => {
            this.data.setSRData(data);
          },
          error: (error) => {
            console.error('Error fetching SR Data:', error);
            // Handle error as needed
          }
        });
    }

    navigate(route: string){
        this.router.navigate([route]);
    }
  

    currentStep: number = 1;

    nextStep() {
        if (this.currentStep < 4) {
        this.currentStep++;
        }
  } 

    previousStep() {
        if (this.currentStep > 1) {
        this.currentStep--;
        }
    }

    submitForm() {
        console.log('Form submitted!');
        // Add form submission logic here
    }

}
