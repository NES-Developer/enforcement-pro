import { Component, OnInit } from '@angular/core';
import { AddressVerifiedBy } from '../../models/address-verified-by';
import { Ethnicity } from '../../models/ethnicity';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { IDShown } from 'src/app/models/id-shown';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component  implements OnInit {

    ethnicities: Ethnicity[] = [];
    address_verified_by: AddressVerifiedBy[] = [];
    id_shown: IDShown[] = [];

    constructor(
        private api: ApiService,
        private data:DataService
    ) {}

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.ethnicities = this.data.getEthnicities();
        this.address_verified_by = this.data.getAddressVerifiedBy();
        this.id_shown = this.data.getIDShown();
    }

}
