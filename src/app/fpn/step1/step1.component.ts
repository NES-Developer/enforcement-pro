import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { Offence } from '../../models/offence';
import { Zone } from '../../models/zone';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { FPNPage } from '../fpn.page';
import { OffenceGroup } from '../../models/offence-group';
import { Site } from '../../models/site';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component  implements OnInit {

    offences: Offence[] = [];
    filteredOffences: Offence[] = [];
    zones: Zone[] = [];
    offenceGroups: OffenceGroup[] = [];
    sites: Site[] = [];

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

    loadData() {
        this.offences = this.data.getOffence();
        let enviro_post =  this.data.getEnviroPost();
        this.offenceGroups = this.data.getOffenceGroup();
        this.zones = this.data.getZones();
        this.sites = this.data.getSites();
        console.log(this.zones);
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        let selected_site: Site = this.data.getSelectedSite();
        this.enviro_post.site_id = selected_site.id;
    }

    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        // this.form.get('offence')?.setValue(null); // Reset the offence selection
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}
