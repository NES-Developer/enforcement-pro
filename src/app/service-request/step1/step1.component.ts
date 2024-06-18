import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/enforcementpro/api.service';
import { AuthService } from 'src/app/services/enforcementpro/auth.service';
import { DataService } from 'src/app/services/enforcementpro/data.service';
//import * as L from 'leaflet';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component  implements OnInit {

    dynamic_feilds: any[] = [];
    dynamic_feilds_filtered: any[] = [];
    ethnicities: any[] = [];
    officers: any[] = [];
    request_types: any[] = [];
    sr_via: any[] = [];
    sites: any[] = [];
    
    dynamic_form_data: any = {};
    
    selected_request_type: number = 0;
    selected_complaint_option: number = 0;
    selected_officer: number = 0;
    selected_offence_type: number = 0;
    selected_site: any;

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private data: DataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.Init();
    }

    Init() {
        this.auth.checkLoggedIn();

        if (this.data.checkSelectedSite() == false) {
            this.navigate('site');
        }
        else {
            this.selected_site = this.data.getSelectedSite();
        }

        if(this.data.checkSRData() == false) {
            this.getSRData();
        }
        
        this.loadData();
    }

    getDynamicFeild() {
        this.dynamic_form_data = {};
        this.dynamic_feilds_filtered = [];

        // Exit early if selected_request_type is 0
        if (this.selected_request_type === 0) {
            console.log(this.dynamic_form_data); // Log empty object
            return;
        }

        for (let x = 0; x < this.dynamic_feilds.length; x++){

            let dynamic_request_type_id: number = parseInt(this.dynamic_feilds[x]?.request_type_id);
            
            if (dynamic_request_type_id === this.selected_request_type) {
                let dynamic_id: number = this.dynamic_feilds[x]?.id;

                // Populate dynamic_feilds_filtered
                this.dynamic_feilds_filtered.push(this.dynamic_feilds[x]);

                // Populate dynamic_form_data
                this.dynamic_form_data[dynamic_id] = ''; // Initialize with 0 or appropriate default
            }
        }
        console.log(this.dynamic_form_data);
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

    loadData() {
        this.dynamic_feilds = this.data.getDynamicFields();
        this.ethnicities = this.data.getEthnicities();
        this.officers = this.data.getOfficers();
        this.request_types = this.data.getRequestTypes();
        this.sr_via = this.data.getSRVia();
        this.sites = this.data.getSites();
    }

}
