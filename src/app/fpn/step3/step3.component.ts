import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { OffenceLocationSuffix } from '../../models/offence-location-suffix';
import { OffenceHow } from '../../models/offence-how';
import { EnviroPost } from 'src/app/models/enviro';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component  implements OnInit {

    ethnicities: Location[] = [];
    offence_location_suffix: OffenceLocationSuffix[] = [];
    offence_how: OffenceHow[] = [];
    enviro_post: EnviroPost = new EnviroPost();
    // address_verified_by: AddressVerifiedBy[] = [];

    constructor(
        private api: ApiService,
        private data: DataService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        // this.ethnicities = this.data.getEthnicities();
        // this.address_verified_by = this.data.getAddressVerifiedBy();
        this.offence_location_suffix = this.data.getOffenceLocationSuffix();
        this.offence_how = this.data.getOffenceHow();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}
