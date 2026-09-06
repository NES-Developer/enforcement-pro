import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private loaded?: Promise<void>;
  private loadedKey = '';

  load(apiKey: string): Promise<void> {
    const key = (apiKey || '').trim();
    if (!key) {
      return Promise.reject(new Error('Google Maps API key is missing.'));
    }

    if ((window as any).google?.maps) {
      return Promise.resolve();
    }

    if (this.loaded && this.loadedKey === key) {
      return this.loaded;
    }

    this.loadedKey = key;
    this.loaded = new Promise<void>((resolve, reject) => {
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
}
