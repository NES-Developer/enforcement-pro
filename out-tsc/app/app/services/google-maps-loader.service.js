import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class GoogleMapsLoaderService {
    constructor() {
        this.loadedKey = '';
    }
    load(apiKey) {
        const key = (apiKey || '').trim();
        if (!key) {
            return Promise.reject(new Error('Google Maps API key is missing.'));
        }
        if (window.google?.maps) {
            return Promise.resolve();
        }
        if (this.loaded && this.loadedKey === key) {
            return this.loaded;
        }
        this.loadedKey = key;
        this.loaded = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Google Maps failed to load.'));
            document.head.appendChild(script);
        });
        return this.loaded;
    }
    static { this.ɵfac = function GoogleMapsLoaderService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || GoogleMapsLoaderService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: GoogleMapsLoaderService, factory: GoogleMapsLoaderService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(GoogleMapsLoaderService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=google-maps-loader.service.js.map