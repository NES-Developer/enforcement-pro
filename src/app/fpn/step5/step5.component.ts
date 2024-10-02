import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { Weather } from '../../models/weather';
import { Visibility } from '../../models/visibility';
import { POIPrefix } from '../../models/poi-prefix';
import { EnviroPost } from '../../models/enviro';
import { Observable, Subscriber } from 'rxjs';
import * as moment from 'moment';  // Import moment.js for date formatting
import { GeocodingService } from '../../services/geocoding.service';
// import { GoogleMap } from '@capacitor/google-maps';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { UpperCaseWords } from 'src/app/helpers/utils'



@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component  implements OnInit, AfterViewInit {
    @ViewChild('mapContainer', { static: false }) mapRef!: ElementRef<HTMLElement>;
    apiKey: string = '';
    address: string = '';
    map!: L.Map;
    showLeaf=false;
    marker!: L.Marker;
    markersLayer!: L.LayerGroup; 
    weather: Weather[] = [];
    visibility: Visibility[] = [];
    poi_prefix: POIPrefix[] = [];
    enviro_post: EnviroPost = new EnviroPost();
    private accessToken = 'pryBQPsykVwwDlHKRCzuceqEyJjYgmcNXjLk11h0hzFzWdVRDygST2uJMGmWO5Av';

    constructor(
        private api: ApiService,
        private data: DataService,
        private geocodingService: GeocodingService,
        private elementRef: ElementRef,
        private http: HttpClient

    ) {
        const defaultDate = moment().format('YYYY-MM-DDTHH:mm:ss');
        this.enviro_post.offence_datetime = defaultDate;
        this.enviro_post.issue_datetime = defaultDate;
        console.log(this.enviro_post.offence_datetime, this.enviro_post.issue_datetime);
    }
    
    ngOnInit() {
        this.loadData();
    }

    ngAfterViewInit(): void {
        this.loadMap();
      }

    get offenceDateTimeISO(): string {
        return this.enviro_post.offence_datetime ? moment(this.enviro_post.offence_datetime).format('YYYY-MM-DDTHH:mm:ss') : '';
    }

    get issueDateTimeISO(): string {
        return this.enviro_post.issue_datetime ? moment(this.enviro_post.issue_datetime).format('YYYY-MM-DDTHH:mm:ss') : '';
    }

    loadData() {
        this.weather = this.data.getWeather();
        this.visibility = this.data.getVisibility();
        this.poi_prefix = this.data.getPOIPrefix();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.enviro_post.lat = position.latitude;
            this.enviro_post.lng = position.longitude;
        });
    }
    onInputChange(){
        UpperCaseWords(this.enviro_post); 
    }

    saveEnviroData() {
        this.onInputChange();
        const formattedDate = moment(this.enviro_post.offence_datetime).format('YYYY-MM-DD HH:mm');
        const formattedIssueDate = moment(this.enviro_post.issue_datetime).format('YYYY-MM-DD HH:mm');
        this.enviro_post.offence_datetime = formattedDate.toString();
        this.enviro_post.issue_datetime = formattedIssueDate.toString();            
        this.data.setEnviroPost(this.enviro_post);
    }


    onSearch() {
        this.geocodingService.geocode(this.address).subscribe((result) => {
        if (result.length > 0) {
            this.enviro_post.offence_location = this.address;
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
    toggleMap(){
        this.showLeaf=true;
    }

    searchPlace(): void {
        var query = this.enviro_post.offence_location;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    
        // Clear all existing markers before adding a new one
        this.markersLayer.clearLayers();
    
        this.http.get(url).subscribe((results: any) => {
          console.log(results);
          if (results.length > 0) {
            const place = results[0];
            this.map.flyTo([place.lat, place.lon], 15);
    
            const icon = L.icon({
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png',
              popupAnchor: [13, 0],
            });
    
            const marker = L.marker([place.lat, place.lon], { icon }).bindPopup(
              `You searched for: ${place.display_name}`
            );
    
           
            this.markersLayer.addLayer(marker);
    
            // Optionally open the popup immediately
            marker.openPopup();
          } else {
            // alert('Place not found!');
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

        this.markersLayer = L.layerGroup().addTo(this.map);

        this.getCurrentPosition()
        .subscribe((position: any) => {
            this.map.flyTo([position.latitude, position.longitude], 15);
        
            const icon = L.icon({
                iconUrl: 'assets/marker-icon.png',
                shadowUrl: 'assets/marker-shadow.png',
                popupAnchor: [13, 0],
              });
        
            const marker = L.marker([position.latitude, position.longitude], {icon  }).bindPopup('Angular Leaflet');
            this.markersLayer.addLayer(marker);
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
