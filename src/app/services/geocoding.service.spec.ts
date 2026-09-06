import { TestBed } from '@angular/core/testing';

import { GeocodingService } from './geocoding.service';
import { DataService } from './enforcementpro/data.service';
import { GoogleMapsLoaderService } from './google-maps-loader.service';

describe('GeocodingService', () => {
  let service: GeocodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeocodingService,
        { provide: DataService, useValue: { getGoogleKey: () => 'test-key' } },
        { provide: GoogleMapsLoaderService, useValue: { load: async () => undefined } },
      ]
    });
    service = TestBed.inject(GeocodingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
