import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { registerPlugin } from '@capacitor/core';
import * as i0 from "@angular/core";
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');
export class LocationService {
    constructor() {
        this.lastFix = null;
    }
    peekLastKnown() {
        if (this.lastFix) {
            return this.lastFix;
        }
        return {
            latitude: '0',
            longitude: '0',
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            speed: null,
            heading: null,
            timestamp: 0
        };
    }
    rememberFix(fix) {
        this.lastFix = fix;
    }
    async tryCurrentPosition(timeoutMs = 4000) {
        try {
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: timeoutMs,
                maximumAge: 60000,
                minimumUpdateInterval: 5000
            });
            const fix = this.toFix(position);
            this.lastFix = fix;
            return fix;
        }
        catch {
            return null;
        }
    }
    async requireCurrentPosition() {
        if (this.lastFix && Date.now() - this.lastFix.timestamp < 15000) {
            return this.lastFix;
        }
        await this.requireLocationPermission();
        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 10000,
            minimumUpdateInterval: 5000
        });
        const fix = this.toFix(position);
        this.lastFix = fix;
        return fix;
    }
    async requireLocationPermission() {
        let permission = await Geolocation.checkPermissions().catch(() => null);
        if (!permission || permission.location !== 'granted') {
            permission = await Geolocation.requestPermissions({
                permissions: ['location']
            }).catch(() => null);
        }
        if (!permission || permission.location !== 'granted') {
            throw new Error('Location permission is required to use EnforcementPro.');
        }
    }
    async openSettings() {
        await BackgroundGeolocation.openSettings();
    }
    toFix(position) {
        return {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude ?? null,
            altitudeAccuracy: position.coords.altitudeAccuracy ?? null,
            speed: position.coords.speed ?? null,
            heading: position.coords.heading ?? null,
            timestamp: position.timestamp
        };
    }
    static { this.ɵfac = function LocationService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LocationService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: LocationService, factory: LocationService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LocationService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=location.service.js.map