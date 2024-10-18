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
    offenceGroups: OffenceGroup[] = [];

    zones: Zone[] = [];
    sites: Site[] = [];

    offence!: Offence;

    enviro_post: EnviroPost = new EnviroPost();

    constructor(
        private api: ApiService,
        private data:DataService,
        private fpnPage: FPNPage
    ) {
        
    }

    ngOnInit(): void {
        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }

    loadData() {
        let enviro_post =  this.data.getEnviroPost();
        this.offenceGroups = this.data.getOffenceGroup();
        this.offences = this.data.getOffence();
        this.zones = this.data.getZones();
        this.sites = this.data.getSites();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
        let selected_site: Site = this.data.getSelectedSite();
        this.enviro_post.site_id = selected_site.id;

        if (this.offences && this.enviro_post && this.enviro_post.offence_type_id) {
            this.filterOffences();
        }    

        this.getOffenceById(this.enviro_post.offence_id);
    }

    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        this.getOffenceById(this.enviro_post.offence_id);
    }

    resetOffenceAndFilter() {
        this.filterOffences();
        this.enviro_post.offence_id = 0;
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

    getOffenceById(id: number) {        
        let offence = this.data.findOffenceById(id);
        if (offence) {
            this.offence = offence;
            console.log(this.offence);
        }
        this.saveEnviroData();
    }

}
