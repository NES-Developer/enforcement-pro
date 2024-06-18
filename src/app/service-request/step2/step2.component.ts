import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { GoogleMap } from '@capacitor/google-maps';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component  implements OnInit {
    // @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
    @ViewChild('mapContainer', { static: false }) mapRef!: ElementRef<HTMLElement>;

    newMap!: GoogleMap;

    apiKey = 'YOUR_API_KEY_HERE';

    map: any;

    constructor() { }

    ngOnInit() {
        // this.createMap();
    }

    ngAfterViewInit() {
        this.createMap();
      }

    async createMap() {
        if (!this.mapRef) {
          console.error('Map element reference is not available.');
          return;
        }
    
        try {
          this.newMap = await GoogleMap.create({
            id: 'my-cool-map',
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
