import { AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { bindSignaturePad } from '../../../helpers/signature-canvas';
import { UpperCaseWords } from 'src/app/helpers/utils';
import { EnviroPost } from '../../../models/enviro';
import { Site } from '../../../models/site';
import { Zone } from '../../../models/zone';
import { DataService } from '../../../services/enforcementpro/data.service';
import { OffenceGroup } from '../../../models/offence-group';
import { Offence } from '../../../models/offence';
import { SiteOffence } from 'src/app/models/site-offence';
import { EnviroPage } from '../enviro.page';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss'],
})
export class Step6Component implements OnInit, AfterViewChecked {
    @ViewChild('canvas') canvasEl?: ElementRef<HTMLCanvasElement>;
    private signaturePad?: SignaturePad;
    private lastCanvas?: HTMLCanvasElement;

    enviro_post: EnviroPost = new EnviroPost();
    selected_site_offence: SiteOffence | undefined;

    today: number = Date.now();


    constructor(
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

    ngAfterViewChecked() {
        this.bindSignaturePad();
    }

    @HostListener('window:resize')
    onWindowResize() {
        this.bindSignaturePad(true);
    }

    clear() {
        this.signaturePad?.clear();
        this.lastCanvas = undefined;
        this.enviro_post.signature = '';
        this.saveEnviroData();
    }

    save() {
        if (!this.signaturePad || this.signaturePad.isEmpty()) {
            return;
        }

        this.enviro_post.signature = this.signaturePad.toDataURL();
        this.lastCanvas = undefined;
        this.saveEnviroData();
    }

    loadData() {
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        this.selected_site_offence = this.data.findSiteOffence(this.enviro_post.offence_id);
    }
    onInputChange(){
        UpperCaseWords(this.enviro_post); 
    }

    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    }

    getNameById(id: number, from: string): string {
        let name: string = "";
        switch (from) {
            case "site":
                let site: Site = this.data.getSelectedSite();
                name = site.name;
                break;
            case "zone":
                const zone: Zone | undefined = this.data.findZoneById(id);
                if (zone) {
                    name = zone.name;
                }
                break;
            case "offence_type":
                const offence_type: OffenceGroup | undefined = this.data.findOffenceGroupId(id);
                if (offence_type) {
                    name = offence_type.englishName
                }
                break;
            case "offence":
                const offence: Offence | undefined = this.data.findOffenceById(id);
                if (offence) {
                    name = offence.name;
                }
                break;
        }
        return name;
    }

    private bindSignaturePad(force = false) {
        const canvas = this.canvasEl?.nativeElement;
        if (!canvas || (!force && canvas === this.lastCanvas)) {
            return;
        }

        this.signaturePad = bindSignaturePad(canvas, this.signaturePad, 500, 180);
        this.lastCanvas = canvas;
    }

}
