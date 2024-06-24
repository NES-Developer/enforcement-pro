import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component  implements OnInit {

    ethnicities: Location[] = [];
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
    }

}
