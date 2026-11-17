import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataService } from '../../../services/enforcementpro/data.service';
import { POIPrefix } from '../../../models/poi-prefix';
import { EnviroPost } from '../../../models/enviro';
import { Zone } from '../../../models/zone';
import { AlertController, IonInput } from '@ionic/angular';
import moment from 'moment';
import { GeocodingService, PlaceLookupError, PlaceSuggestion } from '../../../services/geocoding.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { LocationService } from '../../../services/location.service';
import { UpperCaseWords } from 'src/app/helpers/utils';
import { isGenericPlaceText } from '../../../helpers/place-text';
import { matchZoneName } from '../../../helpers/zone-match';
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
    zones: Zone[] = [];
    filteredZones: Zone[] = [];
    townSearch = '';
    searching = false;
    resolvingLocation = false;
    locationLocked = false;
    poorNetwork = false;
    addressVerified = false;
    mapUnavailable = false;
    statusMessage = '';
    locationHint = '';

    private map: any;
    private marker: any;
    private suggestTimer: ReturnType<typeof setTimeout> | null = null;
    private clickListener: any;
    private dragListener: any;
    private verifiedAddress = '';
    private suppressLocationInput = false;
    private detailsOpened = false;
    private deviceLat: number | null = null;
    private deviceLng: number | null = null;
    private followDevice = true;
    private locateToken = 0;
    private destroyed = false;

    alertHeader = '';
    alertSubHeader = '';
    alertMessage = '';

    constructor(
        private data: DataService,
        private geocodingService: GeocodingService,
        private mapsLoader: GoogleMapsLoaderService,
        private location: LocationService,
        private elementRef: ElementRef,
        private alertController: AlertController,
        private fpnPage: EnviroPage,
        private changeDetector: ChangeDetectorRef
    ) {
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }

    get showDetails(): boolean {
        return this.locationLocked || this.poorNetwork || this.detailsOpened;
    }

    ngOnInit() {
        this.fpnPage.registerPlaceGate(this);
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            this.markPoorNetwork();
        }
        void this.locateOnLoad();
        if (!this.locationLocked) {
            setTimeout(() => this.locationInput?.setFocus(), 300);
        }
    }

    ngAfterViewInit(): void {
        void this.loadMap();
    }

    ngOnDestroy(): void {
        this.destroyed = true;
        this.fpnPage.registerPlaceGate(null);
        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }
        this.clickListener?.remove();
        this.dragListener?.remove();
    }

    @HostListener('window:offline')
    onOffline(): void {
        this.markPoorNetwork();
        this.refreshView();
    }

    loadData() {
        this.poi_prefix = this.data.getPOIPrefix();
        const enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        this.zones = [...this.data.getZones()].sort((a, b) => a.name.localeCompare(b.name));
        this.alignTownToZone();
        this.filterZones();
        this.restoreConfirmedPlace();

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
        const verifiedAddress = this.addressVerified ? this.verifiedAddress : '';
        this.onInputChange();

        if (verifiedAddress) {
            this.enviro_post.offence_location = verifiedAddress;
        }

        this.enviro_post.offence_datetime = moment(this.enviro_post.offence_datetime)
            .format('YYYY-MM-DDTHH:mm:ss');

        this.enviro_post.issue_datetime = moment(this.enviro_post.issue_datetime)
            .format('YYYY-MM-DDTHH:mm:ss');

        this.data.setEnviroPost(this.enviro_post);
    }

    onLocationInput(event: any) {
        if (this.locationLocked || this.suppressLocationInput || this.resolvingLocation) {
            return;
        }

        const value = String(event?.detail?.value ?? '');
        this.enviro_post.offence_location = value;
        this.addressVerified = value.trim() !== '' && value.trim() === this.verifiedAddress;
        this.saveEnviroData();

        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }

        this.suggestTimer = setTimeout(() => {
            void this.loadSuggestions(value);
        }, 250);
    }

    filterZones() {
        const query = this.townSearch.trim().toLowerCase();
        const selected = this.enviro_post.town_area.trim().toLowerCase();
        this.filteredZones = this.zones.filter((zone) => {
            if (selected && zone.name.trim().toLowerCase() === selected) {
                return true;
            }
            if (!query) {
                return true;
            }
            return [
                zone.name,
                zone.town,
                zone.post_code,
                zone.address_line1,
                zone.address_line2
            ].some((value) => (value || '').toLowerCase().includes(query));
        });
    }

    async selectSuggestion(suggestion: PlaceSuggestion) {
        if (this.locationLocked) {
            return;
        }

        this.suggestions = [];
        this.useChosenPin();
        this.resolvingLocation = true;
        this.statusMessage = 'Getting the address…';
        this.refreshView();
        try {
            const result = await this.withTimeout(this.geocodingService.resolvePlaceId(suggestion.placeId));
            if (!result) {
                await this.showNotice('Not found', 'That place could not be opened. Try another result or search again.');
                return;
            }

            this.applyCoordinates(result.lat, result.lng);
            this.setVerifiedAddress(result.formattedAddress || suggestion.description);
            this.clearPoorNetwork();
            await this.centerMap(result.lat, result.lng);
        } catch (error) {
            this.handleLookupFailure(error, 'That place could not be loaded. Type the offence location if the network is poor.');
        } finally {
            this.finishResolving();
        }
    }

    async searchLocation() {
        if (this.locationLocked || this.searching) {
            return;
        }

        const query = this.enviro_post.offence_location.trim();
        if (!query) {
            await this.showNotice('Wait', 'Enter a location before searching.');
            return;
        }
        if (isGenericPlaceText(query)) {
            await this.showNotice('Real address needed', 'Placeholder text such as "test" is not accepted. Search a street, town, or postcode.');
            return;
        }

        this.searching = true;
        this.useChosenPin();
        this.resolvingLocation = true;
        this.statusMessage = 'Searching for that address…';
        this.suggestions = [];
        this.refreshView();
        try {
            const result = await this.withTimeout(this.geocodingService.resolveAddress(query));
            if (!result) {
                this.addressVerified = false;
                await this.showNotice('Not found', 'That offence location could not be found. Try a street, town, or postcode.');
                return;
            }

            this.applyCoordinates(result.lat, result.lng);
            this.setVerifiedAddress(result.formattedAddress || query);
            this.clearPoorNetwork();
            await this.centerMap(result.lat, result.lng);
        } catch (error) {
            this.handleLookupFailure(error, 'There is no network to check this address. Type the offence location, town / ward, and point of interest yourself.');
        } finally {
            this.searching = false;
            this.finishResolving();
        }
    }

    async setCurrentLocation() {
        if (this.locationLocked || this.resolvingLocation) {
            return;
        }

        this.useChosenPin();
        this.resolvingLocation = true;
        this.statusMessage = 'Getting your location…';
        this.refreshView();
        try {
            const position = await this.readFreshPosition();
            if (!position) {
                this.locationHint = 'Current location is unavailable. Search for the address, or type it if the network is poor.';
                if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                    this.markPoorNetwork();
                }
                await this.showNotice('Location unavailable', 'The current pin could not be read. Search for the address, or type it if the network is poor.');
                return;
            }

            this.deviceLat = position.lat;
            this.deviceLng = position.lng;
            this.marker?.setPosition(position);
            this.statusMessage = 'Getting the address…';
            this.refreshView();
            await this.writeAddressFromCoordinates(position.lat, position.lng, false);
        } finally {
            this.finishResolving();
        }
    }

    clearLocation() {
        if (this.locationLocked) {
            return;
        }

        this.suppressLocationInput = true;
        this.enviro_post.offence_location = '';
        this.suggestions = [];
        this.addressVerified = false;
        this.verifiedAddress = '';
        this.saveEnviroData();
        setTimeout(() => {
            this.suppressLocationInput = false;
        }, 300);
    }

    async confirmLocation() {
        if (this.locationLocked || this.resolvingLocation) {
            return;
        }

        const location = this.enviro_post.offence_location.trim();
        if (!location || isGenericPlaceText(location)) {
            await this.showNotice('Real address needed', 'Enter a real offence address. Placeholder text such as "test" is not accepted.');
            return;
        }

        this.resolvingLocation = true;
        this.statusMessage = 'Confirming this location…';
        this.refreshView();
        try {
            if (!this.poorNetwork && !this.addressVerified) {
                const found = await this.verifyTypedAddress(location);
                if (!found) {
                    return;
                }
            }

            await this.preloadPlaceDetails();
            this.locationLocked = true;
            this.detailsOpened = true;
            this.suggestions = [];
            this.applyMapLock();
            this.saveEnviroData();
            this.refreshView();
            setTimeout(() => {
                this.elementRef.nativeElement.querySelector('.place-details')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
        } finally {
            this.finishResolving();
        }
    }

    changeLocation() {
        this.locationLocked = false;
        this.applyMapLock();
        this.refreshView();
        setTimeout(() => this.locationInput?.setFocus(), 200);
    }

    continueBlocker(): string {
        if (!this.locationLocked) {
            return 'Confirm the offence location before continuing.';
        }
        if (this.isBlank(this.enviro_post.offence_location) || isGenericPlaceText(this.enviro_post.offence_location)) {
            return 'Enter a real offence address. Placeholder text such as "test" is not accepted.';
        }
        if (!this.poorNetwork && !this.addressVerified) {
            return 'Search the offence location so it is a valid address, or set it to your current location.';
        }
        if (this.isBlank(this.enviro_post.town_area) || isGenericPlaceText(this.enviro_post.town_area)) {
            return 'Select the town / ward. It is required.';
        }
        if (this.zones.length && !this.townMatchesZone(this.enviro_post.town_area)) {
            return 'Select a town / ward from the list.';
        }
        if (this.isBlank(this.enviro_post.poi) || isGenericPlaceText(this.enviro_post.poi)) {
            return 'Enter a real point of interest, such as the nearest shop, library, or business.';
        }
        return '';
    }

    private async locateOnLoad(): Promise<void> {
        const token = this.locateToken;
        this.followDevice = this.isBlank(this.enviro_post.offence_location);
        const needsAddress = this.followDevice;
        if (needsAddress) {
            this.resolvingLocation = true;
            this.statusMessage = 'Getting your location…';
            this.refreshView();
        }

        const last = this.location.peekLastKnown();
        if (this.isRealCoordinate(last.latitude, last.longitude)) {
            this.rememberDevice(Number(last.latitude), Number(last.longitude));
        }

        const fresh = await this.readFreshPosition();
        if (token !== this.locateToken) {
            return;
        }
        if (fresh) {
            this.rememberDevice(fresh.lat, fresh.lng);
        } else if (this.deviceLat === null) {
            this.locationHint = 'Current location is unavailable. Search for the address, or type it if the network is poor.';
        }

        const center = this.mapCenter();
        if (center) {
            await this.centerMap(center.lat, center.lng);
        }

        if (needsAddress && this.deviceLat !== null && this.deviceLng !== null && token === this.locateToken) {
            this.statusMessage = 'Getting the address…';
            this.refreshView();
            await this.writeAddressFromCoordinates(this.deviceLat, this.deviceLng, true, token);
        }

        if (needsAddress && token === this.locateToken) {
            this.finishResolving();
        }
    }

    private rememberDevice(lat: number, lng: number): void {
        this.deviceLat = lat;
        this.deviceLng = lng;
        if (!this.followDevice) {
            return;
        }
        this.applyCoordinates(lat, lng);
        void this.centerMap(lat, lng);
    }

    private useChosenPin(): void {
        this.followDevice = false;
        this.locateToken += 1;
    }

    private mapCenter(): { lat: number; lng: number } | null {
        if (this.hasMappedLocation()) {
            return { lat: Number(this.enviro_post.lat), lng: Number(this.enviro_post.lng) };
        }
        if (this.deviceLat !== null && this.deviceLng !== null) {
            return { lat: this.deviceLat, lng: this.deviceLng };
        }
        return null;
    }

    private async readFreshPosition(): Promise<{ lat: number; lng: number } | null> {
        const fresh = await this.location.tryCurrentPosition(12000);
        if (fresh && this.isRealCoordinate(fresh.latitude, fresh.longitude)) {
            return { lat: Number(fresh.latitude), lng: Number(fresh.longitude) };
        }

        try {
            const required = await this.location.requireCurrentPosition();
            if (this.isRealCoordinate(required.latitude, required.longitude)) {
                return { lat: Number(required.latitude), lng: Number(required.longitude) };
            }
        } catch {
            return null;
        }

        return null;
    }

    private async verifyTypedAddress(query: string): Promise<boolean> {
        try {
            const result = await this.withTimeout(this.geocodingService.resolveAddress(query));
            if (!result) {
                await this.showNotice('Not found', 'That offence location is not a valid address. Search again, or set it to your current location.');
                return false;
            }

            this.applyCoordinates(result.lat, result.lng);
            this.setVerifiedAddress(result.formattedAddress || query);
            this.clearPoorNetwork();
            await this.centerMap(result.lat, result.lng);
            return true;
        } catch (error) {
            if (error instanceof PlaceLookupError) {
                this.markPoorNetwork();
                await this.showNotice('Poor network', 'There is no network to check this address. You can still confirm it and fill in the town and point of interest yourself.');
                return true;
            }
            return false;
        }
    }

    private async writeAddressFromCoordinates(lat: number, lng: number, silent: boolean, token = this.locateToken): Promise<boolean> {
        if (token !== this.locateToken) {
            return false;
        }
        this.applyCoordinates(lat, lng);
        await this.centerMap(lat, lng);
        try {
            const result = await this.withTimeout(this.geocodingService.resolveCoordinates(lat, lng));
            if (token !== this.locateToken) {
                return false;
            }
            if (!result?.formattedAddress) {
                if (!silent) {
                    await this.showNotice('Not found', 'No address was found for that pin. Search, or type the address if you have no signal.');
                }
                return false;
            }

            this.setVerifiedAddress(result.formattedAddress);
            this.clearPoorNetwork();
            return true;
        } catch (error) {
            if (error instanceof PlaceLookupError) {
                this.markPoorNetwork();
                if (!silent) {
                    await this.showNotice('Poor network', 'The address could not be loaded. Type the offence location, town / ward, and point of interest. They still need to be real details.');
                }
            }
            return false;
        }
    }

    private async preloadPlaceDetails(): Promise<void> {
        const lat = Number(this.enviro_post.lat);
        const lng = Number(this.enviro_post.lng);
        const town = matchZoneName(this.zones, lat, lng, Number(this.enviro_post.zone_id));
        if (town) {
            this.enviro_post.town_area = town;
            this.alignTownToZone();
            this.filterZones();
        }

        if (!this.isRealCoordinate(lat, lng)) {
            return;
        }

        try {
            this.statusMessage = 'Finding the nearest landmark…';
            this.refreshView();
            const poi = await this.withTimeout(this.geocodingService.nearestPointOfInterest(lat, lng, this.map), 20000);
            if (poi) {
                this.enviro_post.poi = poi;
                this.clearPoorNetwork();
                this.refreshView();
            }
        } catch (error) {
            if (error instanceof PlaceLookupError) {
                this.markPoorNetwork();
            }
        }
    }

    private handleLookupFailure(error: unknown, message: string): void {
        if (error instanceof PlaceLookupError) {
            this.markPoorNetwork();
            void this.showNotice('Poor network', message);
        }
    }

    private restoreConfirmedPlace(): void {
        const location = this.enviro_post.offence_location.trim();
        const town = this.enviro_post.town_area.trim();
        const poi = this.enviro_post.poi.trim();
        const complete = !!location && !!town && !!poi
            && !isGenericPlaceText(location)
            && !isGenericPlaceText(town)
            && !isGenericPlaceText(poi);
        if (!complete) {
            return;
        }

        this.locationLocked = true;
        this.detailsOpened = true;
        this.addressVerified = true;
        this.verifiedAddress = location;
    }

    private alignTownToZone(): void {
        const current = this.enviro_post.town_area.trim().toLowerCase();
        if (!current) {
            return;
        }
        const match = this.zones.find((zone) => zone.name.trim().toLowerCase() === current);
        if (match) {
            this.enviro_post.town_area = match.name;
        }
    }

    private townMatchesZone(value: string): boolean {
        const current = value.trim().toLowerCase();
        return this.zones.some((zone) => zone.name.trim().toLowerCase() === current);
    }

    private setVerifiedAddress(address: string): void {
        this.suppressLocationInput = true;
        this.verifiedAddress = address.trim();
        this.addressVerified = true;
        this.enviro_post.offence_location = this.verifiedAddress;
        this.suggestions = [];
        this.saveEnviroData();
        setTimeout(() => {
            this.suppressLocationInput = false;
        }, 400);
    }

    private markPoorNetwork(): void {
        this.poorNetwork = true;
        this.detailsOpened = true;
    }

    private clearPoorNetwork(): void {
        this.poorNetwork = false;
    }

    private finishResolving(): void {
        this.resolvingLocation = false;
        this.statusMessage = '';
        this.refreshView();
    }

    private refreshView(): void {
        if (!this.destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    private async loadSuggestions(query: string) {
        if (this.locationLocked) {
            this.suggestions = [];
            return;
        }
        try {
            this.suggestions = await this.geocodingService.suggestPlaces(query);
        } catch {
            this.suggestions = [];
        }
        this.refreshView();
    }

    private applyCoordinates(lat: number, lng: number) {
        this.enviro_post.lat = String(lat);
        this.enviro_post.lng = String(lng);
    }

    private hasMappedLocation(): boolean {
        return this.isRealCoordinate(this.enviro_post.lat, this.enviro_post.lng);
    }

    private isRealCoordinate(lat: unknown, lng: unknown): boolean {
        const latitude = Number(lat);
        const longitude = Number(lng);
        return Number.isFinite(latitude) && Number.isFinite(longitude) && !(latitude === 0 && longitude === 0);
    }

    private isBlank(value: unknown): boolean {
        return String(value ?? '').trim() === '';
    }

    private async loadMap(): Promise<void> {
        try {
            await this.mapsLoader.load(this.data.getGoogleKey());
        } catch {
            this.mapUnavailable = true;
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                this.markPoorNetwork();
            }
            this.refreshView();
            return;
        }

        const google = (window as any).google;
        const el = this.elementRef.nativeElement.querySelector('#map');
        if (!google?.maps || !el) {
            this.mapUnavailable = true;
            this.refreshView();
            return;
        }

        const center = this.mapCenter() || { lat: 51.5074, lng: -0.1278 };
        this.map = new google.maps.Map(el, {
            center,
            zoom: 16,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            clickableIcons: false,
            gestureHandling: 'greedy',
        });

        this.marker = new google.maps.Marker({
            map: this.map,
            position: center,
            draggable: !this.locationLocked,
        });

        this.clickListener = this.map.addListener('click', (event: any) => {
            if (this.locationLocked || !event?.latLng) {
                return;
            }
            void this.onMapPicked(event.latLng.lat(), event.latLng.lng());
        });

        this.dragListener = this.marker.addListener('dragend', () => {
            if (this.locationLocked) {
                return;
            }
            const position = this.marker.getPosition();
            if (!position) {
                return;
            }
            void this.onMapPicked(position.lat(), position.lng());
        });

        this.applyMapLock();
        setTimeout(() => {
            google.maps?.event?.trigger(this.map, 'resize');
            this.map.setCenter(this.mapCenter() || center);
        }, 80);
    }

    private async onMapPicked(lat: number, lng: number): Promise<void> {
        if (this.locationLocked) {
            return;
        }

        this.marker?.setPosition({ lat, lng });
        this.useChosenPin();
        this.resolvingLocation = true;
        this.statusMessage = 'Getting the address…';
        this.refreshView();
        try {
            await this.writeAddressFromCoordinates(lat, lng, false);
        } finally {
            this.finishResolving();
        }
    }

    private applyMapLock(): void {
        this.marker?.setDraggable(!this.locationLocked);
    }

    private async centerMap(lat: number, lng: number): Promise<void> {
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || !this.map) {
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

    private withTimeout<T>(work: Promise<T>, ms = 12000): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => reject(new PlaceLookupError()), ms);
            work.then(
                (value) => {
                    clearTimeout(timer);
                    resolve(value);
                },
                (error) => {
                    clearTimeout(timer);
                    reject(error);
                }
            );
        });
    }

    private async showNotice(header: string, message: string) {
        this.alertHeader = header;
        this.alertSubHeader = '';
        this.alertMessage = message;
        await this.showAlert();
    }

    async showAlert() {
        const alert = await this.alertController.create({
            header: this.alertHeader,
            subHeader: this.alertSubHeader,
            message: this.alertMessage,
            buttons: ['OK']
        });

        await alert.present();
        await alert.onDidDismiss();
    }
}
