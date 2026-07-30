import { Component, OnDestroy, OnInit } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { Offence } from '../../../models/offence';
import { Zone } from '../../../models/zone';
import { DataService } from '../../../services/enforcementpro/data.service';
import { ApiService } from '../../../services/enforcementpro/api.service';
import { OffenceGroup } from '../../../models/offence-group';
import { Site } from '../../../models/site';
import { ZoneDetection } from '../../../models/zone-detection';
import { AppLog } from 'src/app/models/app-log';
import { Subscription } from 'rxjs';
import { EnviroPage } from '../enviro.page';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component  implements OnInit, OnDestroy {

    offences: Offence[] = [];
    filteredOffences: Offence[] = [];
    offenceGroups: OffenceGroup[] = [];

    selected_site: any = null;
    selected_zone: any = null;

    zones: Zone[] = [];
    filteredZones: Zone[] = [];
    zoneSearch: string = '';
    sites: Site[] = [];
    zoneStatusMessage: string = '';

    app_log: AppLog;
    offence!: Offence;

    enviro_post: EnviroPost = new EnviroPost();
    private subscriptions: Subscription[] = [];

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
        this.watchZoneSelection();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    init() {
        if (this.selected_site?.id) {
            this.enviro_post.site_id = this.selected_site.id;
        }

        this.applySelectedZoneToForm();

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

                    this.data.setZoneDetectionStatus({
                        code: 'not_in_zone',
                        message: response.message || 'You are not in a zone. Please select a zone.',
                        updated_at: new Date().toISOString()
                    });
                    this.fpnPage.presentAlert('Error', response.message);
                } else {

                    this.enviro_post.zone_id = Number(response.id);
                    this.saveEnviroData();

                    this.selected_zone = {
                        ...response,
                        id: Number(response.id)
                    };
                    this.data.setSelectedZone(this.selected_zone);
                    this.data.clearZoneDetectionStatus();

                    this.fpnPage.presentAlert('Yay', 'We found your zone, device settings have been altered.');
                }
            },
            error: () => {
                this.data.setZoneDetectionStatus({
                    code: 'network',
                    message: 'Unable to confirm your zone. Please select a zone.',
                    updated_at: new Date().toISOString()
                });
            }
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
        this.filterZones();
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

    filterZones() {
        const query = this.zoneSearch.trim().toLowerCase();

        if (!query) {
            this.filteredZones = this.zones;
            return;
        }

        this.filteredZones = this.zones.filter(zone => {
            return [
                zone.name,
                zone.town,
                zone.post_code,
                zone.address_line1,
                zone.address_line2
            ].some(value => (value || '').toLowerCase().includes(query));
        });
    }

    resetOffenceAndFilter() {
        this.filterOffences();
        this.enviro_post.offence_id = 0;
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);

        if (this.enviro_post.zone_id > 0) {
            const zone = this.data.findZoneById(Number(this.enviro_post.zone_id));

            if (zone) {
                this.selected_zone = zone;
                this.data.setSelectedZone(zone);
                this.data.clearZoneDetectionStatus();
                this.zoneStatusMessage = '';
            }
        }
    }

    getOffenceById(id: number) {        
        let offence = this.data.findOffenceById(id);
        if (offence) {
            this.offence = offence;
        }
        this.saveEnviroData();
    }

    private watchZoneSelection(): void {
        this.subscriptions.push(
            this.data.selectedZoneChanges().subscribe(() => this.applySelectedZoneToForm()),
            this.data.zoneDetectionStatusChanges().subscribe(() => this.applySelectedZoneToForm())
        );
    }

    private applySelectedZoneToForm(): void {
        this.selected_zone = this.data.getSelectedZone();
        this.zoneStatusMessage = this.getZoneStatusMessage();

        if (!this.enviro_post) {
            return;
        }

        if (this.enviro_post.zone_id <= 0 && this.selected_zone?.id && !this.isOutsideZone() && this.selectedZoneMatchesSite()) {
            this.enviro_post.zone_id = Number(this.selected_zone.id);
            this.data.setEnviroPost(this.enviro_post);
        }

        this.zones = this.data.getZones();
        this.filterZones();
    }

    private getZoneStatusMessage(): string {
        const status = this.data.getZoneDetectionStatus();

        if (status.code === 'idle') {
            return '';
        }

        if (status.code === 'network' && this.data.checkSelectedZone()) {
            return '';
        }

        return status.message;
    }

    private isOutsideZone(): boolean {
        return this.data.getZoneDetectionStatus().code === 'not_in_zone';
    }

    private selectedZoneMatchesSite(): boolean {
        if (!this.selected_zone?.site_id || !this.selected_site?.id) {
            return true;
        }

        return this.selected_zone.site_id.toString() === this.selected_site.id.toString();
    }

}
