import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../../services/enforcementpro/data.service';
import { POIPrefix } from '../../../models/poi-prefix';
import { EnviroPost } from '../../../models/enviro';
import { Observable, Subscriber } from 'rxjs';
import { AlertController, IonInput } from '@ionic/angular';
import moment from 'moment';
import { GeocodingService, PlaceSuggestion } from '../../../services/geocoding.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { UpperCaseWords } from 'src/app/helpers/utils';
import { EnviroPage } from '../enviro.page';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('locationInput', { static: false }) locationInput: IonInput | any;
    poi_prefix: POIPrefix[] = [];
    enviro_post: EnviroPost = new EnviroPost();
    suggestions: PlaceSuggestion[] = [];
    showLeaf = false;
    searching = false;

    private map: any;
    private marker: any;
    private suggestTimer: ReturnType<typeof setTimeout> | null = null;
    private clickListener: any;

    alertHeader = '';
    alertSubHeader = '';
    alertMessage = '';

    constructor(
        private data: DataService,
        private geocodingService: GeocodingService,
        private mapsLoader: GoogleMapsLoaderService,
        private elementRef: ElementRef,
        private alertController: AlertController,
        private fpnPage: EnviroPage
    ) {
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }

    ngOnInit() {
        setTimeout(() => {
            this.locationInput?.setFocus();
        }, 300);
    }

    ngAfterViewInit(): void {
        void this.loadMap();
    }

    ngOnDestroy(): void {
        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }
        if (this.clickListener) {
            this.clickListener.remove();
        }
    }

    loadData() {
        this.poi_prefix = this.data.getPOIPrefix();
        const enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        this.getCurrentPosition().subscribe((position: any) => {
            if (!this.hasMappedLocation()) {
                this.enviro_post.lat = String(position.latitude);
                this.enviro_post.lng = String(position.longitude);
            }
            void this.centerMap(Number(this.enviro_post.lat), Number(this.enviro_post.lng));
        });

        const defaultDate = moment().format('YYYY-MM-DDTHH:mm:ss');
        if (!this.enviro_post.offence_datetime) {
            this.enviro_post.offence_datetime = defaultDate;
        }
        if (!this.enviro_post.issue_datetime) {
            this.enviro_post.issue_datetime = defaultDate;
        }

        if (this.enviro_post.fpn_issued !== 0 && this.enviro_post.fpn_issued !== 1) {
            this.enviro_post.fpn_issued = 0;
        }
    }

    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }

    saveEnviroData() {
        this.onInputChange();

        this.enviro_post.offence_datetime = moment(this.enviro_post.offence_datetime)
            .format('YYYY-MM-DDTHH:mm:ss');

        this.enviro_post.issue_datetime = moment(this.enviro_post.issue_datetime)
            .format('YYYY-MM-DDTHH:mm:ss');

        this.data.setEnviroPost(this.enviro_post);
    }

    onLocationInput(event: any) {
        const value = String(event?.detail?.value || this.enviro_post.offence_location || '');
        this.enviro_post.offence_location = value;
        this.saveEnviroData();

        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }

        this.suggestTimer = setTimeout(() => {
            void this.loadSuggestions(value);
        }, 250);
    }

    async selectSuggestion(suggestion: PlaceSuggestion) {
        this.suggestions = [];
        const result = await this.geocodingService.geocodePlaceId(suggestion.placeId);
        if (!result) {
            return;
        }

        this.enviro_post.offence_location = result.formattedAddress || suggestion.description;
        this.applyCoordinates(result.lat, result.lng);
        this.showLeaf = true;
        await this.centerMap(result.lat, result.lng, true);
        this.saveEnviroData();
    }

    async toggleMap() {
        if (!this.enviro_post.offence_location) {
            this.alertHeader = 'Wait';
            this.alertSubHeader = 'Location missing';
            this.alertMessage = 'Please enter a location before searching.';
            await this.showAlert();
            this.showLeaf = false;
            return;
        }

        this.showLeaf = true;
        this.searching = true;
        try {
            const result = await this.geocodingService.geocodeAddress(this.enviro_post.offence_location);
            if (!result) {
                this.alertHeader = 'Not found';
                this.alertSubHeader = 'Google Maps';
                this.alertMessage = 'That offence location could not be found. Try a street, town, or postcode.';
                await this.showAlert();
                return;
            }

            this.enviro_post.offence_location = result.formattedAddress || this.enviro_post.offence_location;
            this.applyCoordinates(result.lat, result.lng);
            await this.centerMap(result.lat, result.lng, true);
            this.saveEnviroData();
        } finally {
            this.searching = false;
        }
    }

    private async loadSuggestions(query: string) {
        try {
            this.suggestions = await this.geocodingService.suggestPlaces(query);
        } catch {
            this.suggestions = [];
        }
    }

    private applyCoordinates(lat: number, lng: number) {
        this.enviro_post.lat = String(lat);
        this.enviro_post.lng = String(lng);
    }

    private hasMappedLocation(): boolean {
        const lat = Number(this.enviro_post.lat);
        const lng = Number(this.enviro_post.lng);
        return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
    }

    private getCurrentPosition(): Observable<any> {
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

    private async loadMap(): Promise<void> {
        await this.mapsLoader.load(this.data.getGoogleKey());
        const google = (window as any).google;
        const el = this.elementRef.nativeElement.querySelector('#map');
        if (!google?.maps || !el) {
            return;
        }

        const lat = this.hasMappedLocation() ? Number(this.enviro_post.lat) : 51.5074;
        const lng = this.hasMappedLocation() ? Number(this.enviro_post.lng) : -0.1278;

        this.map = new google.maps.Map(el, {
            center: { lat, lng },
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        this.marker = new google.maps.Marker({
            map: this.map,
            position: { lat, lng },
            draggable: true,
        });

        this.clickListener = this.map.addListener('click', async (event: any) => {
            const clickedLat = event.latLng.lat();
            const clickedLng = event.latLng.lng();
            this.applyCoordinates(clickedLat, clickedLng);
            this.marker.setPosition({ lat: clickedLat, lng: clickedLng });
            const result = await this.geocodingService.reverseGeocode(clickedLat, clickedLng);
            if (result?.formattedAddress) {
                this.enviro_post.offence_location = result.formattedAddress;
            }
            this.saveEnviroData();
        });

        this.marker.addListener('dragend', async () => {
            const position = this.marker.getPosition();
            const draggedLat = position.lat();
            const draggedLng = position.lng();
            this.applyCoordinates(draggedLat, draggedLng);
            const result = await this.geocodingService.reverseGeocode(draggedLat, draggedLng);
            if (result?.formattedAddress) {
                this.enviro_post.offence_location = result.formattedAddress;
            }
            this.saveEnviroData();
        });
    }

    private async centerMap(lat: number, lng: number, reveal = false): Promise<void> {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return;
        }

        if (reveal) {
            this.showLeaf = true;
        }

        if (!this.map) {
            return;
        }

        const google = (window as any).google;
        const position = { lat, lng };
        this.marker?.setPosition(position);
        this.map.setCenter(position);
        this.map.setZoom(16);

        setTimeout(() => {
            google?.maps?.event?.trigger(this.map, 'resize');
            this.map.setCenter(position);
        }, 80);
    }

    async showAlert() {
        const alert = await this.alertController.create({
            header: this.alertHeader,
            subHeader: this.alertSubHeader,
            message: this.alertMessage,
            buttons: ['OK']
        });

        await alert.present();
    }
}
