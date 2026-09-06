import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './enforcementpro/data.service';
import { GoogleMapsLoaderService } from './google-maps-loader.service';

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  placeId?: string;
}

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(
    private data: DataService,
    private mapsLoader: GoogleMapsLoaderService
  ) {}

  geocode(address: string): Observable<any[]> {
    return from(this.geocodeAddress(address)).pipe(
      map((result) => result ? [{
        lat: result.lat,
        lon: result.lng,
        display_name: result.formattedAddress
      }] : [])
    );
  }

  async suggestPlaces(query: string): Promise<PlaceSuggestion[]> {
    const input = (query || '').trim();
    if (input.length < 3) {
      return [];
    }

    await this.ensureMaps();
    const google = (window as any).google;
    if (google?.maps?.places?.AutocompleteService) {
      return new Promise((resolve) => {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({
          input,
          componentRestrictions: { country: 'gb' }
        }, (predictions: any[] | null, status: string) => {
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

  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    const query = (address || '').trim();
    if (!query) {
      return null;
    }

    await this.ensureMaps();
    const google = (window as any).google;
    if (google?.maps?.Geocoder) {
      return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          address: query,
          region: 'GB',
          componentRestrictions: { country: 'GB' }
        }, (results: any[] | null, status: string) => {
          resolve(this.fromGeocoderResults(results, status));
        });
      });
    }

    return this.geocodeRest({ address: query });
  }

  async geocodePlaceId(placeId: string): Promise<GeocodeResult | null> {
    if (!placeId) {
      return null;
    }

    await this.ensureMaps();
    const google = (window as any).google;
    if (google?.maps?.Geocoder) {
      return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ placeId }, (results: any[] | null, status: string) => {
          resolve(this.fromGeocoderResults(results, status));
        });
      });
    }

    return this.geocodeRest({ place_id: placeId });
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    await this.ensureMaps();
    const google = (window as any).google;
    if (google?.maps?.Geocoder) {
      return new Promise((resolve) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          location: { lat, lng }
        }, (results: any[] | null, status: string) => {
          resolve(this.fromGeocoderResults(results, status));
        });
      });
    }

    return this.geocodeRest({ latlng: `${lat},${lng}` });
  }

  private async ensureMaps(): Promise<void> {
    try {
      await this.mapsLoader.load(this.data.getGoogleKey());
    } catch {
      // REST fallback still works if the JS SDK cannot load.
    }
  }

  private fromGeocoderResults(results: any[] | null, status: string): GeocodeResult | null {
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

  private async geocodeRest(params: Record<string, string>): Promise<GeocodeResult | null> {
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

  private async suggestPlacesRest(input: string): Promise<PlaceSuggestion[]> {
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

    return predictions.map((item: any) => ({
      description: item.description,
      placeId: item.place_id
    }));
  }
}
