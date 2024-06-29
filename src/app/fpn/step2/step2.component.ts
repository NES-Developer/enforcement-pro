import { Component, OnInit } from '@angular/core';
import { AddressVerifiedBy } from '../../models/address-verified-by';
import { Ethnicity } from '../../models/ethnicity';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { IDShown } from '../../models/id-shown';
import { EnviroPost } from '../../models/enviro';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component  implements OnInit {

    ethnicities: Ethnicity[] = [];
    address_verified_by: AddressVerifiedBy[] = [];
    id_shown: IDShown[] = [];

    enviro_post: EnviroPost = new EnviroPost();

    constructor(
        private api: ApiService,
        private data:DataService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    

    loadData() {
        this.address_verified_by = this.data.getAddressVerifiedBy();
        this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}
