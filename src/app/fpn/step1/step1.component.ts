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
import { Salutation } from '../../models/Salutation';

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
    salutations: Salutation[] = [];
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

    loadData() {
        this.offence_how = this.data.getOffenceHow();
        this.offence_location_suffix = this.data.getOffenceLocationSuffix();
        this.address_verified_by = this.data.getAddressVerifiedBy();
        this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let weather = this.data.getWeather();
        let visibility = this.data.getVisibility();
        let poi_prefix = this.data.getPOIPrefix();
        this.site_offence = this.data.getSiteOffence();
        this.offences = this.data.getOffence();
        this.offenceGroups = this.data.getOffenceGroup();
        let enviro_post =  this.data.getEnviroPost();
        this.salutations = this.data.getSalutations();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}



