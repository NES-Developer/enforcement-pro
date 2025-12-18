import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { Offence } from '../../../models/offence';
import { Zone } from '../../../models/zone';
import { DataService } from '../../../services/enforcementpro/data.service';
import { ApiService } from '../../../services/enforcementpro/api.service';
import { OffenceGroup } from '../../../models/offence-group';
import { Site } from '../../../models/site';
import { ZoneDetection } from '../../../models/zone-detection';
import { AppLog } from 'src/app/models/app-log';
import { Observable, Subscriber } from 'rxjs';
import { EnviroPage } from '../enviro.page';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component  implements OnInit {

    offences: Offence[] = [];
    filteredOffences: Offence[] = [];
    offenceGroups: OffenceGroup[] = [];

    selected_site: any = null;
    selected_zone: any = null;

    zones: Zone[] = [];
    sites: Site[] = [];

    app_log: AppLog;
    offence!: Offence;

    enviro_post: EnviroPost = new EnviroPost();

    constructor(
        private api: ApiService,
        private data:DataService,
        private fpnPage: EnviroPage,
    ) {
        this.app_log = new AppLog();

        this.loadData();
    }

    async ngOnInit() {
        this.init();
    }

    init() {
        this.enviro_post.site_id = this.selected_site.id;
        this.enviro_post.zone_id = this.selected_zone.id;
        this.app_log.zone_id = this.selected_zone.id;
        this.data.setAppLog(this.app_log);

        if (this.offences && this.enviro_post && this.enviro_post.offence_type_id) {
            this.filterOffences();
        }   
    }

    ZoneDetection() {
        this.fpnPage.ping();

        let zone_detection = new ZoneDetection();

        zone_detection.lat = this.app_log.lat;
        zone_detection.lng = this.app_log.lng;

        let site = this.data.getSelectedSite();
        zone_detection.site_id = site.id.toString();

        this.api.zoneDetection(zone_detection).subscribe({
            next: (response) => {
                if (response.success === false){

                    this.fpnPage.presentAlert('Error', response.message);
                } else {

                    this.app_log.zone_id = response.id;
                    this.data.setAppLog(this.app_log);

                    this.enviro_post.zone_id = parseInt(this.app_log.zone_id);
                    this.saveEnviroData();

                    this.selected_zone = response;
                    this.data.setSelectedZone(this.selected_zone);

                    this.fpnPage.presentAlert('Yay', 'We found your zone, device settings have been altered.');
                }
            },
        });
    }

    loadData() {

        this.enviro_post =  this.data.getEnviroPost();
        this.selected_site = this.data.getSelectedSite();
        
        this.selected_zone = this.data.getSelectedZone();
        

        this.app_log = this.data.getAppLog();
        

        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }

        this.offenceGroups = this.data.getOffenceGroup();
        this.offences = this.data.getOffence();
        this.zones = this.data.getZones();
        this.sites = this.data.getSites();

         

        this.getOffenceById(this.enviro_post.offence_id);

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

        
        this.app_log.zone_id = this.enviro_post.zone_id.toString();
        this.data.setAppLog(this.app_log);
    }

    getOffenceById(id: number) {        
        let offence = this.data.findOffenceById(id);
        if (offence) {
            this.offence = offence;
        }
        this.saveEnviroData();
    }

}
