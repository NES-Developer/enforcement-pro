import { ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
// import { GoogleMap } from '@capacitor/google-maps';
import { Step1Component } from '../step1/step1.component';


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequest } from '../../models/service-request';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component  implements OnInit {
    
  
    service_request: ServiceRequest;
    selected_site: any;

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private data: DataService,
        private router: Router
    ) { 
        this.service_request = new ServiceRequest();

    }

    ngOnInit(): void {
        // this.createMap();
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
        
        this.loadData();
    }

    getSRData(): void {
        this.api.getSRData().subscribe({
          next: (data) => {
            this.data.setSRData(data);
            this.loadData();
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

    ngAfterViewInit() {
    }

    storeServiceRequest() {
        this.data.setServiceRequest(this.service_request);
    }

    loadData() {
        let sr_data = this.data.getServiceRequest();
        if (sr_data) {
            this.service_request = sr_data;
            this.service_request.site_id = this.selected_site.id;
        }    
    }



}
