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
import { AddressVerifiedBy } from '../../models/address-verified-by';
import { IDShown } from 'src/app/models/id-shown';
import { OffenceLocationSuffix } from 'src/app/models/offence-location-suffix';
import { OffenceHow } from 'src/app/models/offence-how'
import { EnviroPost } from '../../models/enviro';
import { FPNPage } from '../fpn.page';
import { Salutation } from '../../models/salutation';
import { Zone } from '../../models/zone';

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
  })
  
export class Step2Component implements OnInit {

    form!: FormGroup;
    birthYear: number = 1900;
    birthMonth: number = 1;
    birthDay: number = 1;

    ethnicities: Ethnicity[] = [];
    offence_how: OffenceHow[] = [];
    offence_location_suffix: OffenceLocationSuffix[] = [];
    address_verified_by: AddressVerifiedBy[] = [];
    site_offence: SiteOffence[] = [];
    offences: Offence[] = [];
    offenceGroups: OffenceGroup[] = [];
    filteredOffences: Offence[] = [];
    id_shown: IDShown[] = [];
    salutations: Salutation[] = [];
    zones: Zone[] = [];
    selectedOffence!: Offence;
    selected_offence_group_id!: number;

    enviro_post: EnviroPost = new EnviroPost();


    constructor(
        private api: ApiService,
        private data:DataService,
        private fpnComponent: FPNPage
    ) {
    }

    ngOnInit(): void {
        if (!this.data.checkFPNData()){
            this.fpnComponent.getFPNData();
        }
        this.loadData();
    }
    
    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        // this.form.get('offence')?.setValue(null); // Reset the offence selection
    }

    updateDateOfBirth() {
        // Validate the inputs before combining
        if (this.birthYear && this.birthMonth && this.birthDay) {
          if (this.birthMonth > 12 || this.birthDay > 31) {
            console.error('Invalid date: Day cannot be greater than 31 and month cannot be greater than 12.');
            return;
          }
    
          // Format as yyyy/mm/dd and assign to date_of_birth
          const formattedDate = `${this.birthYear.toString().padStart(4, '0')}/${this.birthMonth.toString().padStart(2, '0')}/${this.birthDay.toString().padStart(2, '0')}`;
          this.enviro_post.date_of_birth = formattedDate;
          this.data.setEnviroPost(this.enviro_post);
        }
    }

    // Method to populate the inputs with the existing date_of_birth when the page loads
    populateDateOfBirth() {
        if (this.enviro_post.date_of_birth) {
        // Split the date_of_birth (assuming it's in yyyy/mm/dd format)
        const [year, month, day] = this.enviro_post.date_of_birth.split('/');

        // Assign the split values to the respective inputs
        this.birthYear = +year;
        this.birthMonth = +month;
        this.birthDay = +day;
        }
    }

    loadData() {
        this.offence_how = this.data.getOffenceHow();
        this.offence_location_suffix = this.data.getOffenceLocationSuffix();
        this.address_verified_by = this.data.getAddressVerifiedBy();
        this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let enviro_post =  this.data.getEnviroPost();
        this.salutations = this.data.getSalutations();
        console.log(this.zones);
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
        this.populateDateOfBirth();
    }
 
    saveEnviroData() {
        this.enviro_post.first_name = this.capitalizeWords(this.enviro_post.first_name);
        this.enviro_post.last_name = this.capitalizeWords(this.enviro_post.last_name);
        this.data.setEnviroPost(this.enviro_post);
    } 

    capitalizeWords(name: string): string {
        if (!name) return '';
        return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      }
}



