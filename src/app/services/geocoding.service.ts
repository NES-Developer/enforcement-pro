import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { landmarkName, looksLikeStreetAddress, nearestPlaceName, PlaceCandidate } from '../helpers/nearest-place';
import { isGenericPlaceText } from '../helpers/place-text';
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

export class PlaceLookupError extends Error {
  constructor(message = 'Network is poor.') {
    super(message);
    this.name = 'PlaceLookupError';
  }
}

const NON_LANDMARK_TYPES = new Set([
  'locality',
  'political',
  'country',
  'administrative_area_level_1',
  'administrative_area_level_2',
  'administrative_area_level_3',
  'postal_code',
  'postal_code_prefix',
  'postal_town',
  'route',
  'neighborhood',
  'sublocality',
  'sublocality_level_1',
  'plus_code',
  'street_address',
  'premise',
  'subpremise',
  'floor',
  'room',
  'intersection',
  'geocode',
]);

const LANDMARK_TYPES = [
  'store',
  'supermarket',
  'convenience_store',
  'shopping_mall',
  'department_store',
  'clothing_store',
  'restaurant',
  'cafe',
  'bar',
  'bakery',
  'library',
  'book_store',
  'museum',
  'park',
  'tourist_attraction',
  'school',
  'university',
  'church',
  'mosque',
  'bank',
  'pharmacy',
  'hospital',
  'gym',
  'lodging',
  'gas_station',
  'train_station',
  'bus_station',
  'post_office',
];

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private placesHost: HTMLElement | null = null;

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
    try {
      return await this.resolveAddress(address);
    } catch {
      return null;
    }
  }

  async resolveAddress(address: string): Promise<GeocodeResult | null> {
    const query = (address || '').trim();
    if (!query) {
      return null;
    }

    return this.runGeocode(
      { address: query, region: 'GB', componentRestrictions: { country: 'GB' } },
      { address: query }
    );
  }

  async geocodePlaceId(placeId: string): Promise<GeocodeResult | null> {
    try {
      return await this.resolvePlaceId(placeId);
    } catch {
      return null;
    }
  }

  async resolvePlaceId(placeId: string): Promise<GeocodeResult | null> {
    if (!placeId) {
      return null;
    }

    return this.runGeocode({ placeId }, { place_id: placeId });
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
    try {
      return await this.resolveCoordinates(lat, lng);
    } catch {
      return null;
    }
  }

  async resolveCoordinates(lat: number, lng: number): Promise<GeocodeResult | null> {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return this.runGeocode(
      { location: { lat, lng } },
      { latlng: `${lat},${lng}` }
    );
  }

  async nearestPointOfInterest(lat: number, lng: number, map?: any): Promise<string | null> {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    this.assertOnline();
    await this.ensureMaps();

    const found = await this.nearbyWithNewApi(lat, lng)
      || await this.nearbyWithLegacy(lat, lng, map)
      || await this.poiFromReverseGeocode(lat, lng);
    return found;
  }

  private async nearbyWithNewApi(lat: number, lng: number): Promise<string | null> {
    const google = (window as any).google;
    let places = google?.maps?.places;
    if (!places?.Place?.searchNearby && google?.maps?.importLibrary) {
      try {
        places = await google.maps.importLibrary('places');
      } catch {
        return null;
      }
    }

    const Place = places?.Place;
    if (!Place?.searchNearby) {
      return null;
    }

    const rank = places?.SearchNearbyRankPreference?.DISTANCE || 'DISTANCE';
    for (const radius of [200, 800, 2500, 6000]) {
      try {
        const response: any = await this.limit(Place.searchNearby({
          fields: ['displayName', 'location', 'types'],
          locationRestriction: {
            center: { lat, lng },
            radius,
          },
          includedTypes: LANDMARK_TYPES,
          maxResultCount: 10,
          rankPreference: rank,
          language: 'en-GB',
          region: 'GB',
        }), 6000);
        const name = nearestPlaceName(this.candidatesFromPlaces(response?.places), lat, lng);
        if (name) {
          return name;
        }
      } catch {
        return null;
      }
    }

    return null;
  }

  private async nearbyWithLegacy(lat: number, lng: number, map?: any): Promise<string | null> {
    const google = (window as any).google;
    if (!google?.maps?.places?.PlacesService) {
      return this.nearbyRest(lat, lng);
    }

    const service = new google.maps.places.PlacesService(map || this.ensurePlacesHost());
    for (const radius of [400, 1200, 4000]) {
      const nearby = await this.nearbyRadius(service, lat, lng, radius);
      const name = nearestPlaceName(this.candidatesFromPlaces(nearby), lat, lng);
      if (name) {
        return name;
      }
    }

    const types = ['store', 'restaurant', 'cafe', 'library', 'supermarket', 'park'];
    const batches = await Promise.all(types.map((type) => this.nearbyOnce(service, lat, lng, type)));
    const named = nearestPlaceName(
      batches.flatMap((batch) => this.candidatesFromPlaces(batch.results)),
      lat,
      lng
    );
    if (named || batches.some((batch) => batch.ok)) {
      return named;
    }

    return this.nearbyRest(lat, lng);
  }

  private nearbyRadius(service: any, lat: number, lng: number, radius: number): Promise<any[]> {
    const google = (window as any).google;
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve([]), 6000);
      try {
        service.nearbySearch({
          location: new google.maps.LatLng(lat, lng),
          radius,
        }, (results: any[] | null, status: string) => {
          clearTimeout(timer);
          resolve(this.classifyStatus(status) === 'ok' ? results || [] : []);
        });
      } catch {
        clearTimeout(timer);
        resolve([]);
      }
    });
  }

  private nearbyOnce(service: any, lat: number, lng: number, type: string): Promise<{ ok: boolean; results: any[] }> {
    const google = (window as any).google;
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve({ ok: false, results: [] }), 8000);
      try {
        service.nearbySearch({
          location: new google.maps.LatLng(lat, lng),
          rankBy: google.maps.places.RankBy?.DISTANCE ?? 1,
          type,
        }, (results: any[] | null, status: string) => {
          clearTimeout(timer);
          const kind = this.classifyStatus(status);
          resolve({
            ok: kind !== 'network',
            results: kind === 'ok' ? results || [] : [],
          });
        });
      } catch {
        clearTimeout(timer);
        resolve({ ok: false, results: [] });
      }
    });
  }

  private async poiFromReverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      const results = await this.geocodeResults({ location: { lat, lng } }, { latlng: `${lat},${lng}` });
      return nearestPlaceName(this.candidatesFromGeocode(results), lat, lng);
    } catch {
      return null;
    }
  }

  private candidatesFromPlaces(places: any[] | null | undefined): PlaceCandidate[] {
    return (places || []).flatMap((place) => {
      const types: string[] = Array.isArray(place?.types) ? place.types : [];
      if (types.length && !types.some((type) => !NON_LANDMARK_TYPES.has(type))) {
        return [];
      }

      const display = place?.displayName;
      const name = landmarkName(typeof display === 'string' ? display : display?.text || place?.name);
      const location = place?.location || place?.geometry?.location;
      if (!name) {
        return [];
      }

      return [{
        name,
        lat: this.coordinate(location, 'lat'),
        lng: this.coordinate(location, 'lng'),
      }];
    });
  }

  private candidatesFromGeocode(results: any[]): PlaceCandidate[] {
    const landmarks = new Set(['point_of_interest', 'establishment', ...LANDMARK_TYPES]);
    return (results || []).flatMap((result) => {
      const types: string[] = result?.types || [];
      if (!types.some((type) => landmarks.has(type))) {
        return [];
      }

      const component = (result.address_components || []).find((item: any) =>
        (item.types || []).some((type: string) => type === 'point_of_interest' || type === 'establishment')
      );
      const name = landmarkName(component?.long_name || result?.formatted_address);
      if (!name || looksLikeStreetAddress(name) || isGenericPlaceText(name)) {
        return [];
      }

      const location = result?.geometry?.location;
      return [{
        name,
        lat: this.coordinate(location, 'lat'),
        lng: this.coordinate(location, 'lng'),
      }];
    });
  }

  private coordinate(location: any, axis: 'lat' | 'lng'): number | undefined {
    if (!location) {
      return undefined;
    }
    const direct = location[axis];
    const value = typeof direct === 'function' ? direct.call(location) : Number(direct ?? location[axis === 'lat' ? 'latitude' : 'longitude']);
    return Number.isFinite(value) ? value : undefined;
  }

  private ensurePlacesHost(): HTMLElement {
    if (this.placesHost?.isConnected) {
      return this.placesHost;
    }

    const host = document.createElement('div');
    host.setAttribute('aria-hidden', 'true');
    host.style.cssText = 'position:fixed;left:-9999px;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(host);
    this.placesHost = host;
    return host;
  }

  private async runGeocode(request: Record<string, unknown>, restParams: Record<string, string>): Promise<GeocodeResult | null> {
    const results = await this.geocodeResults(request, restParams);
    return this.fromGeocoderResults(results, results.length ? 'OK' : 'ZERO_RESULTS');
  }

  private async geocodeResults(request: Record<string, unknown>, restParams: Record<string, string>): Promise<any[]> {
    this.assertOnline();
    await this.ensureMaps();
    const google = (window as any).google;
    if (google?.maps?.Geocoder) {
      return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(request, (results: any[] | null, status: string) => {
          const kind = this.classifyStatus(status);
          if (kind === 'network') {
            reject(new PlaceLookupError());
            return;
          }
          resolve(results || []);
        });
      });
    }

    let response: any;
    try {
      response = await CapacitorHttp.get({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
          key: this.data.getGoogleKey(),
          region: 'uk',
          ...restParams
        }
      });
    } catch {
      throw new PlaceLookupError();
    }

    const kind = this.classifyStatus(String(response?.data?.status || ''));
    if (kind === 'network') {
      throw new PlaceLookupError();
    }
    return response?.data?.results || [];
  }

  private assertOnline(): void {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      throw new PlaceLookupError();
    }
  }

  private async ensureMaps(): Promise<void> {
    try {
      await this.mapsLoader.load(this.data.getGoogleKey());
    } catch {
      // REST fallback still works if the JS SDK cannot load.
    }
  }

  private classifyStatus(status: string): 'ok' | 'empty' | 'network' {
    const normalized = String(status || '').toUpperCase();
    if (normalized === 'OK') {
      return 'ok';
    }
    if (normalized === 'ZERO_RESULTS' || normalized === 'NOT_FOUND' || normalized === 'INVALID_REQUEST') {
      return 'empty';
    }
    return 'network';
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

  private limit<T>(work: Promise<T>, ms: number): Promise<T> {
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

  private async nearbyRest(lat: number, lng: number): Promise<string | null> {
    const types = ['store', 'restaurant', 'cafe', 'library', 'supermarket', 'park'];
    const batches = await Promise.all(types.map((type) => this.nearbyRestType(lat, lng, type)));
    return nearestPlaceName(batches.flat(), lat, lng);
  }

  private async nearbyRestType(lat: number, lng: number, type: string): Promise<PlaceCandidate[]> {
    try {
      const response = await CapacitorHttp.get({
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        params: {
          key: this.data.getGoogleKey(),
          location: `${lat},${lng}`,
          rankby: 'distance',
          type,
        }
      });
      if (this.classifyStatus(String(response?.data?.status || '')) !== 'ok') {
        return [];
      }
      return this.candidatesFromPlaces(response?.data?.results);
    } catch {
      return [];
    }
  }

  private async suggestPlacesRest(input: string): Promise<PlaceSuggestion[]> {
    try {
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
    } catch {
      return [];
    }
  }
}
