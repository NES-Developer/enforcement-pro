import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
// import Signature from "@lemonadejs/signature";
import SignaturePad from 'signature_pad';
import { EnviroPost } from 'src/app/models/enviro';
import { DataService } from 'src/app/services/enforcementpro/data.service';



@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, AfterViewInit {
    @ViewChild('canvas') canvasEl!: ElementRef<HTMLCanvasElement>;
    private signaturePad!: SignaturePad;

    enviro_post: EnviroPost = new EnviroPost();


    constructor(
        private data: DataService,
    ) { }

    ngOnInit() {

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
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

}
