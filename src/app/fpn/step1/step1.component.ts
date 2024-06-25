import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequest } from '../../models/service-request';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { OffenceGroup } from '../../models/offence-group';
import { Offence } from '../../models/offence';
import { FormGroup } from '@angular/forms';
import { SiteOffence } from '../../models/site-offence';
import { Ethnicity } from 'src/app/models/ethnicity';
import { AddressVerifiedBy } from 'src/app/models/address-verified-by';
import { IDShown } from 'src/app/models/id-shown';
import { OffenceLocationSuffix } from 'src/app/models/offence-location-suffix';
import { OffenceHow } from 'src/app/models/offence-how';
import { Weather } from 'src/app/models/weather';
import { Visibility } from 'src/app/models/visibility';
import { POIPrefix } from 'src/app/models/poi-prefix';

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss'],
  })
  
export class Step1Component implements OnInit {

    form!: FormGroup;

    ethnicities: Ethnicity[] = [];
    offence_how: OffenceHow[] = [];
    offence_location_suffix: OffenceLocationSuffix[] = [];
    address_verified_by: AddressVerifiedBy[] = [];
    site_offence: SiteOffence[] = [];
    offences: Offence[] = [];
    offenceGroups: OffenceGroup[] = [];
    filteredOffences: Offence[] = [];
    id_shown: IDShown[] = [];
    selectedOffence!: Offence;
    selected_offence_group_id!: number;


    constructor(
        private api: ApiService,
        private data:DataService
    ) {}

    ngOnInit(): void {
        this.getFPNData();
    }

    getFPNData(): void {
        let site: any = this.data.getSelectedSite();
        let site_id: number = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                console.log(data.data);

                this.offence_how = data.data.offence_how;
                this.data.setOffenceHow(this.offence_how);

                this.offence_location_suffix = data.data.offence_location_suffix;
                this.data.setOffenceLocationSuffix(this.offence_location_suffix);

                this.address_verified_by = data.data.address_verified_via;
                this.data.setAddressVerifiedBy(this.address_verified_by);

                this.ethnicities = data.data.ethnicities;
                this.data.setEthnicities(this.ethnicities);

                this.id_shown = data.data.id_shown;
                this.data.setIdShown(this.id_shown);

                let weather: Weather[] = data.data.weathers;
                this.data.setWeather(weather);

                let visibility: Visibility[] = data.data.visibility;
                this.data.setVisibility(visibility);

                let poi_prefix: POIPrefix[] = data.data.poi_prefix;
                this.data.setPOIPrefix(poi_prefix);

                this.site_offence = data.data.site_offences;
                this.data.setSiteOffences(this.site_offence);

                this.offences = this.extractOffence(this.site_offence);
                this.data.setOffences(this.offences);

                this.offenceGroups = this.extractOffenceGroups(this.offences);
                this.data.setOffenceGroups(this.offenceGroups);

                this.loadData();
            },
            error: (error) => {
                console.error('Error fetching SR Data:', error);
                // Handle error as needed
            }
        });
    }

    extractOffence(site_offences: SiteOffence[]): Offence[] {
        const groups = site_offences.map(site_offence => site_offence.offences);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as Offence);
    }

    extractOffenceGroups(offences: Offence[]): OffenceGroup[] {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as OffenceGroup);
      }
    
      filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.selected_offence_group_id);
        // this.form.get('offence')?.setValue(null); // Reset the offence selection
      }



        loadData() {

        }

}



