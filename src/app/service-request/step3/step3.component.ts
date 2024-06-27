import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
// import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps/ngx';

import { DataService } from 'src/app/services/enforcementpro/data.service';
import { Step1Component } from '../step1/step1.component';

import { GeocodingService } from '../../services/geocoding.service';
import * as L from 'leaflet';
import { Observable } from 'rxjs/internal/Observable';
import { Subscriber } from 'rxjs';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
})
export class Step3Component  implements AfterViewInit {
    // @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
    @ViewChild('mapContainer', { static: false }) mapRef!: ElementRef<HTMLElement>;

    newMap!: GoogleMap;

    apiKey: string = '';

    // map: any;

    constructor(
        private data: DataService,
        private geocodingService: GeocodingService
        // private step1: Step1Component,
        // private step2: Step2Component
    ) { }

    address: string = '';
    map!: L.Map;
    marker!: L.Marker;


  ngAfterViewInit(): void {
    this.loadMap();
    // this.map = L.map('map').setView([51.505, -0.09], 13);

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; OpenStreetMap contributors',
    // }).addTo(this.map);
  }

  onSearch() {
    this.geocodingService.geocode(this.address).subscribe((result) => {
      if (result.length > 0) {
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
    this.map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZmluZGluZy1uZW1vIiwiYSI6ImNseHdkMHJyZDBzYXcybHF6cnY0d3RkNXkifQ.9PE145Fu7ndjWSnj3fyHLw',
      //pk.eyJ1IjoiZmluZGluZy1uZW1vIiwiYSI6ImNseHdkMHJyZDBzYXcybHF6cnY0d3RkNXkifQ.9PE145Fu7ndjWSnj3fyHLw
    }).addTo(this.map);

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
  }

}
