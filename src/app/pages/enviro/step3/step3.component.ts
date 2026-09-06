import { Component, OnInit } from '@angular/core';
import { AddressVerifiedBy } from '../../../models/address-verified-by';
import { Ethnicity } from '../../../models/ethnicity';
import { ApiService } from '../../../services/enforcementpro/api.service';
import { DataService } from '../../../services/enforcementpro/data.service';
import { IDShown } from '../../../models/id-shown';
import { EnviroPost } from '../../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils'
import { EnviroPage } from '../enviro.page';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component  implements OnInit {

    ethnicities: Ethnicity[] = [];
    address_verified_by: AddressVerifiedBy[] = [];
    id_shown: IDShown[] = [];

    enviro_post: EnviroPost = new EnviroPost();

    constructor(
        private api: ApiService,
        private data: DataService,
        private fpnPage: EnviroPage
        
    ) {
        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }

    ngOnInit() {

    }

    loadData() {
        this.address_verified_by = this.data.getAddressVerifiedBy();
        this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
            this.enviro_post.proof_of_address = this.asSelectId(this.enviro_post.proof_of_address);
            this.enviro_post.proof_of_id = this.asSelectId(this.enviro_post.proof_of_id);
        }
    }

    compareIds = (option: any, selected: any): boolean => {
        if (option === selected) {
            return true;
        }
        if (option == null || selected == null || option === '' || selected === '') {
            return false;
        }
        return String(option) === String(selected);
    };

    private asSelectId(value: unknown): any {
        if (value === '' || value === null || value === undefined) {
            return '';
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : value;
    }

    onInputChange(){
        UpperCaseWords(this.enviro_post); 
    }

    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    } 

}
