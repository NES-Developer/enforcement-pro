import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { Offence } from '../../models/offence';
import { Zone } from '../../models/zone';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { FPNPage } from '../fpn.page';
import { OffenceGroup } from '../../models/offence-group';
import { Site } from '../../models/site';
import { ZoneDetection } from '../../models/zone-detection';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component  implements OnInit {

    offences: Offence[] = [];
    filteredOffences: Offence[] = [];
    offenceGroups: OffenceGroup[] = [];

    selected_zone: any;

    zones: Zone[] = [];
    sites: Site[] = [];

    offence!: Offence;

    enviro_post: EnviroPost = new EnviroPost();

    constructor(
        private api: ApiService,
        private data:DataService,
        private fpnPage: FPNPage,
    ) {
        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }

    ngOnInit(): void {
        
    }

    ZoneDetection() {
        let app_log = this.data.getAppLog();
        if (this.data.checkAppLog() ) {

            let zone_detection = new ZoneDetection();
            zone_detection.lat = app_log.lat;
            zone_detection.lng = app_log.lng;
            zone_detection.site_id = app_log.site_id;
            
            this.api.zoneDetection(zone_detection).subscribe({
                next: (response) => {
                    if (response.success === false){

                        this.fpnPage.presentAlert('Error', response.message);
                    } else {

                        app_log.zone_id = response.id;
                        this.selected_zone = response;
                        this.data.setSelectedZone(this.selected_zone);
                        this.data.setAppLog(app_log);
                        this.fpnPage.presentAlert('Yay', 'We found your zone, device settings have been altered.');
                        this.fpnPage.ping();
                    }
                },
            });
        }
        else {

            this.fpnPage.presentAlert('Error', 'App cannot find your location, try again later.');
        }
    }

    loadData() {
        let enviro_post =  this.data.getEnviroPost();
        this.selected_zone = this.data.getSelectedZone();

        // this.enviro_post

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

        // if (this.enviro_post.)

        this.getOffenceById(this.enviro_post.offence_id);
        console.log(0);

    }

    // zoneChange()
    // {
    //     //Nemo
    //     if (this.selected_zone)
    //     {
    //         this.enviro_post.zone_id = this.selected_zone.id;
            // this.saveEnviroData();
    //         this.data.setSelectedZone(this.selected_zone);
    //     }
    // }

    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        this.getOffenceById(this.enviro_post.offence_id);
        // this.saveEnviroData();
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
        }
        this.saveEnviroData();
    }

}
