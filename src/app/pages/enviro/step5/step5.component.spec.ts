import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EnviroPost } from '../../../models/enviro';
import { Step5Component } from './step5.component';
import { DataService } from '../../../services/enforcementpro/data.service';
import { GeocodingService } from '../../../services/geocoding.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { LocationService } from '../../../services/location.service';
import { EnviroPage } from '../enviro.page';

describe('Step5Component', () => {
  let component: Step5Component;
  let fixture: ComponentFixture<Step5Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Step5Component ],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        {
          provide: DataService,
          useValue: {
            checkFPNData: () => true,
            getPOIPrefix: () => [],
            getEnviroPost: () => new EnviroPost(),
            getZones: () => [],
            getGoogleKey: () => 'test-key',
            setEnviroPost: () => undefined,
          }
        },
        { provide: GeocodingService, useValue: { suggestPlaces: () => Promise.resolve([]) } },
        { provide: GoogleMapsLoaderService, useValue: { load: () => Promise.resolve() } },
        {
          provide: LocationService,
          useValue: {
            peekLastKnown: () => ({ latitude: '0', longitude: '0' }),
            tryCurrentPosition: () => Promise.resolve(null),
            requireCurrentPosition: () => Promise.reject(new Error('unavailable')),
          }
        },
        { provide: EnviroPage, useValue: { getFPNData() {}, registerPlaceGate() {} } },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Step5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('asks for a confirmed location before the other answers', () => {
    expect(component.continueBlocker()).toContain('Confirm the offence location');
  });

  it('rejects placeholder text after the location is confirmed', () => {
    component.locationLocked = true;
    component.addressVerified = true;
    component.enviro_post.offence_location = 'test';
    component.enviro_post.town_area = 'Easton';
    component.enviro_post.poi = 'Tesco';

    expect(component.continueBlocker()).toContain('real offence address');
  });

  it('allows a manual address when the network is poor and the location is confirmed', () => {
    component.locationLocked = true;
    component.poorNetwork = true;
    component.addressVerified = false;
    component.enviro_post.offence_location = 'Outside the library, Broad Street';
    component.enviro_post.town_area = 'Easton';
    component.enviro_post.poi = 'Central Library';

    expect(component.continueBlocker()).toBe('');
  });
});
