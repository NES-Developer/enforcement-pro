import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequest } from '../../models/service-request';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';
//import * as L from 'leaflet';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {

    // selected_request_type: number = 0;
    selected_complaint_option: number = 0;
    selected_officer: number = 0;
    selected_offence_type: number = 0;
    selected_site: any;

    service_request: ServiceRequest;
    
    dynamic_form_data: any = {};

    dynamic_feilds: any[] = [];
    dynamic_feilds_filtered: any[] = [];
    ethnicities: any[] = [];
    officers: any[] = [];
    request_types: any[] = [];
    sr_via: any[] = [];
    sites: any[] = [];

    
    
    constructor(
        private api: ApiService,
        private auth: AuthService,
        private data: DataService,
        private router: Router
    ) { 
        this.service_request = new ServiceRequest();

    }

    ngOnInit(): void {
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

    getDynamicFeild(filter: boolean, form: boolean) {
        if (form) {
            this.service_request.dynamic_form_data = {};
        }
        if (filter) {
            this.dynamic_feilds_filtered = [];
        }

        // Exit early if service_request.request_type_id is 0
        if (this.service_request.request_type_id === 0) {
            console.log(this.request_types);
            return;
        }

        for (let x = 0; x < this.dynamic_feilds.length; x++){

            let dynamic_request_type_id: number = parseInt(this.dynamic_feilds[x]?.request_type_id);
            
            
            if (dynamic_request_type_id == this.service_request.request_type_id) {
                let dynamic_id: number = this.dynamic_feilds[x]?.id;

                // Populate dynamic_feilds_filtered
                if (filter) {
                    this.dynamic_feilds_filtered.push(this.dynamic_feilds[x]);
                }

                // Populate dynamic_form_data
                if (form) {
                    this.service_request.dynamic_form_data[dynamic_id] = ''; // Initialize with 0 or appropriate default
                }

            }
        }
        this.storeServiceRequest();
    }

    navigate(route: string){
        this.router.navigate([route]);
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

    storeServiceRequest() {
        this.data.setServiceRequest(this.service_request);
    }

    loadData() {
        this.dynamic_feilds = this.data.getDynamicFields();
        this.ethnicities = this.data.getEthnicities();
        this.officers = this.data.getOfficers();
        this.request_types = this.data.getRequestTypes();
        this.sr_via = this.data.getSRVia();
        this.sites = this.data.getSites();

        let sr_data = this.data.getServiceRequest();
        if (sr_data) {
            this.service_request = sr_data;
            this.service_request.site_id = this.selected_site.id;
            this.getDynamicFeild(true,false);
        }        
    }

}
