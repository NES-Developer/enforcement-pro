import { Component, OnInit } from '@angular/core';
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
    ethnicities: any[] = [];
    officers: any[] = [];
    request_types: any[] = [];
    sr_via: any[] = [];
    sites: any[] = [];
    
    selected_request_type: number = 0;
    selected_complaint_option: number = 0;
    selected_officer: number = 0;
    selected_offence_type: number = 0;
    selected_site: number = 0;

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private data: DataService
    ) { }

    ngOnInit() {
        if(this.data.checkSRData() !== true) {
            this.getSRData();
        }
        else {
            this.loadData();
        }



    }

    getOffenceTypes() {
        this.api.getOffenceTypes(1,1).subscribe({
            next: (data) => {
              this.data.setOffenceType(data);
              this.loadData();
            },
            error: (error) => {
              console.error('Error fetching SR Data:', error);
              // Handle error as needed
            }
        });
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
        this.selected_site = this.data.getSelectedSite() || 0;
    }

}
