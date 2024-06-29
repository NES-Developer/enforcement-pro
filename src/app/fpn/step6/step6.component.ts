import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
// import Signature from "@lemonadejs/signature";
import SignaturePad from 'signature_pad';
import { EnviroPost } from 'src/app/models/enviro';
import { Site } from '../../models/site';
import { Zone } from '../../models/zone';
import { DataService } from 'src/app/services/enforcementpro/data.service';



@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss'],
})
export class Step6Component implements OnInit, AfterViewInit {
    @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
    private signaturePad!: SignaturePad;

    enviro_post: EnviroPost = new EnviroPost();

    siteName: string = "";
    zoneName: string = "";
    offenceTypeName: string = "";
    offenceName: string = "";


    constructor(
        private data: DataService,
    ) { }

    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit() {
        this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
    }

    clear() {
        this.signaturePad.clear();
    }

    save() {
        if (this.signaturePad.isEmpty()) {
            console.log('Please provide a signature first.');
        } else {
            const dataURL = this.signaturePad.toDataURL();
            console.log(dataURL);  // Here you can send the dataURL to your server or save it
        }
    }

    loadData() {
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        let site: Site = this.data.getSelectedSite();
        this.siteName = site.name;
    }

    saveEnviroData() {
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
        }
        return name;
    }

}
