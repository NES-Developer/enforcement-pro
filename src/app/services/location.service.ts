import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { registerPlugin } from '@capacitor/core';
import type { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

export interface LocationFix {
    latitude: string;
    longitude: string;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    speed: number | null;
    heading: number | null;
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private lastFix: LocationFix | null = null;

    peekLastKnown(): LocationFix {
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

    rememberFix(fix: LocationFix): void {
        this.lastFix = fix;
    }

    async tryCurrentPosition(timeoutMs = 4000): Promise<LocationFix | null> {
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
        } catch {
            return null;
        }
    }

    async requireCurrentPosition(): Promise<LocationFix> {
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

    async requireLocationPermission(): Promise<void> {
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

    async openSettings(): Promise<void> {
        await BackgroundGeolocation.openSettings();
    }

    private toFix(position: any): LocationFix {
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
}
