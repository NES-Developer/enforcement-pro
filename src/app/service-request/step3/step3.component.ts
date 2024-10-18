import { Component, ElementRef, OnInit, AfterViewInit, HostListener, ViewChild } from '@angular/core';
// import { GoogleMap } from '@capacitor/google-maps';
// import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps/ngx';

import { DataService } from 'src/app/services/enforcementpro/data.service';
import { Step1Component } from '../step1/step1.component';

import { GeocodingService } from '../../services/geocoding.service';
import * as L from 'leaflet';
import { Observable } from 'rxjs/internal/Observable';
import { Subscriber } from 'rxjs';
import { ServiceRequest } from '../../models/service-request';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component  implements AfterViewInit, OnInit {
    // @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
    @ViewChild('mapContainer', { static: false }) mapRef!: ElementRef<HTMLElement>;
    private accessToken = 'pryBQPsykVwwDlHKRCzuceqEyJjYgmcNXjLk11h0hzFzWdVRDygST2uJMGmWO5Av';

    service_request: ServiceRequest;
    selected_site: any;


    constructor(
        private data: DataService,
        private geocodingService: GeocodingService,
        private elementRef: ElementRef
    ) { 
        this.service_request = new ServiceRequest();
    }

    address: string = '';
    map!: L.Map;
    marker!: L.Marker;

    ngOnInit(): void {
        this.init();
    }


  ngAfterViewInit(): void {
    this.loadMap();
    this.invalidateMapSize();

  }

    init() {
        this.selected_site = this.data.getSelectedSite();
        
        this.loadData();
    }

    loadData() {
        let sr_data = this.data.getServiceRequest();
        if (sr_data) {
            this.service_request = sr_data;
            this.service_request.site_id = this.selected_site.id;
        } 
    }


  onSearch() {
    this.geocodingService.geocode(this.address).subscribe((result) => {
        if (result.length > 0) {
            this.service_request.offence_location = this.address;
            const lat = result[0].lat;
            const lon = result[0].lon;

            if (this.marker) {
                this.marker.setLatLng([lat, lon]);
            } else {
                this.marker = L.marker([lat, lon]).addTo(this.map);
            }

            this.map.setView([lat, lon], 13);
        }
    });
  }


  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: any) => {
            observer.next({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            observer.complete();
            });
        } else {
            observer.error();
        }
    });
  }

    private loadMap(): void {
        this.map = L.map(this.elementRef.nativeElement.querySelector('#map')).setView([51.5074, -0.1278], 12);

        L.tileLayer(
        `https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}.png?access-token=${this.accessToken}`, {
            attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
            maxZoom: 22
        }
        ).addTo(this.map);


        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.map.flyTo([position.latitude, position.longitude], 15);
        
            const icon = L.icon({
                iconUrl: 'https://static.vecteezy.com/system/resources/previews/023/554/762/original/red-map-pointer-icon-on-a-transparent-background-free-png.png',
                shadowUrl: 'assets/marker-shadow.png',
                popupAnchor: [13, 0],
            });
        
            const marker = L.marker([position.latitude, position.longitude], {  }).bindPopup('Angular Leaflet');
            marker.addTo(this.map);
        });

        this.map.whenReady(() => {
            this.map!.invalidateSize();
        });
    }

    private invalidateMapSize(): void {
        if (this.map) {
        setTimeout(() => {
            this.map!.invalidateSize();
        }, 0);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        if (this.map) {
        this.map.invalidateSize();
        }
    }

}
