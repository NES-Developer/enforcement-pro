import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/data.service";
import * as i2 from "./google-maps-loader.service";
export class GeocodingService {
    constructor(data, mapsLoader) {
        this.data = data;
        this.mapsLoader = mapsLoader;
    }
    geocode(address) {
        return from(this.geocodeAddress(address)).pipe(map((result) => result ? [{
                lat: result.lat,
                lon: result.lng,
                display_name: result.formattedAddress
            }] : []));
    }
    async suggestPlaces(query) {
        const input = (query || '').trim();
        if (input.length < 3) {
            return [];
        }
        await this.ensureMaps();
        const google = window.google;
        if (google?.maps?.places?.AutocompleteService) {
            return new Promise((resolve) => {
                const service = new google.maps.places.AutocompleteService();
                service.getPlacePredictions({
                    input,
                    componentRestrictions: { country: 'gb' }
                }, (predictions, status) => {
                    if (status !== 'OK' || !predictions?.length) {
                        resolve([]);
                        return;
                    }
                    resolve(predictions.map((item) => ({
                        description: item.description,
                        placeId: item.place_id
                    })));
                });
            });
        }
        return this.suggestPlacesRest(input);
    }
    async geocodeAddress(address) {
        const query = (address || '').trim();
        if (!query) {
            return null;
        }
        await this.ensureMaps();
        const google = window.google;
        if (google?.maps?.Geocoder) {
            return new Promise((resolve) => {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    address: query,
                    region: 'GB',
                    componentRestrictions: { country: 'GB' }
                }, (results, status) => {
                    resolve(this.fromGeocoderResults(results, status));
                });
            });
        }
        return this.geocodeRest({ address: query });
    }
    async geocodePlaceId(placeId) {
        if (!placeId) {
            return null;
        }
        await this.ensureMaps();
        const google = window.google;
        if (google?.maps?.Geocoder) {
            return new Promise((resolve) => {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ placeId }, (results, status) => {
                    resolve(this.fromGeocoderResults(results, status));
                });
            });
        }
        return this.geocodeRest({ place_id: placeId });
    }
    async reverseGeocode(lat, lng) {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return null;
        }
        await this.ensureMaps();
        const google = window.google;
        if (google?.maps?.Geocoder) {
            return new Promise((resolve) => {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({
                    location: { lat, lng }
                }, (results, status) => {
                    resolve(this.fromGeocoderResults(results, status));
                });
            });
        }
        return this.geocodeRest({ latlng: `${lat},${lng}` });
    }
    async ensureMaps() {
        try {
            await this.mapsLoader.load(this.data.getGoogleKey());
        }
        catch {
            // REST fallback still works if the JS SDK cannot load.
        }
    }
    fromGeocoderResults(results, status) {
        if (status !== 'OK' || !results?.length) {
            return null;
        }
        const place = results[0];
        const location = place.geometry?.location;
        if (!location) {
            return null;
        }
        return {
            lat: typeof location.lat === 'function' ? location.lat() : Number(location.lat),
            lng: typeof location.lng === 'function' ? location.lng() : Number(location.lng),
            formattedAddress: place.formatted_address || '',
            placeId: place.place_id
        };
    }
    async geocodeRest(params) {
        const response = await CapacitorHttp.get({
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            params: {
                key: this.data.getGoogleKey(),
                region: 'uk',
                ...params
            }
        });
        const results = response?.data?.results;
        if (response?.data?.status !== 'OK' || !results?.length) {
            return null;
        }
        const place = results[0];
        return {
            lat: Number(place.geometry?.location?.lat),
            lng: Number(place.geometry?.location?.lng),
            formattedAddress: place.formatted_address || '',
            placeId: place.place_id
        };
    }
    async suggestPlacesRest(input) {
        const response = await CapacitorHttp.get({
            url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
            params: {
                input,
                key: this.data.getGoogleKey(),
                components: 'country:gb'
            }
        });
        const predictions = response?.data?.predictions;
        if (response?.data?.status !== 'OK' || !predictions?.length) {
            return [];
        }
        return predictions.map((item) => ({
            description: item.description,
            placeId: item.place_id
        }));
    }
    static { this.ɵfac = function GeocodingService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GeocodingService)(i0.ɵɵinject(i1.DataService), i0.ɵɵinject(i2.GoogleMapsLoaderService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: GeocodingService, factory: GeocodingService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GeocodingService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.DataService }, { type: i2.GoogleMapsLoaderService }], null); })();
//# sourceMappingURL=geocoding.service.js.map