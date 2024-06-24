import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { GoogleMap } from '@capacitor/google-maps';
// import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps/ngx';

import { DataService } from 'src/app/services/enforcementpro/data.service';
import { Step1Component } from '../step1/step1.component';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component  implements OnInit {
    // @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
    @ViewChild('mapContainer', { static: false }) mapRef!: ElementRef<HTMLElement>;

    newMap!: GoogleMap;

    apiKey: string = '';

    map: any;

    constructor(
        private data: DataService,
        // private step1: Step1Component,
        // private step2: Step2Component
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.createMap();
    }

    loadData() {
        this.apiKey = this.data.getGoogleKey();
    }

    async createMap() {
        if (!this.mapRef) {
          console.error('Map element reference is not available.');
          return;
        }
    
        try {
          this.newMap = await GoogleMap.create({
            id: 'map',
            element: this.mapRef.nativeElement,
            apiKey: this.apiKey,
            config: {
              center: {
                lat: 33.6,
                lng: -117.9,
              },
              zoom: 8,
            },
          });
        } catch (error) {
          console.error('Error creating the map:', error);
        }
    }


}
