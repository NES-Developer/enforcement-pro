import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        DataService,
        {
          provide: Storage,
          useValue: {
            create: () => new Promise(() => undefined)
          }
        }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    service = TestBed.inject(DataService);
    expect(service).toBeTruthy();
  });

  it('exposes the selected site from browser storage before Ionic Storage is ready', () => {
    localStorage.setItem('selected_site', JSON.stringify({ id: 17, name: 'Test Site' }));
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 9, name: 'Officer' }));

    service = TestBed.inject(DataService);

    expect(service.getSelectedSite()?.id).toBe(17);
    expect(service.getToken()).toBe('test-token');
    expect(service.getUser()?.id).toBe(9);
  });

  it('resolves waitUntilHydrated when Ionic Storage never becomes ready', async () => {
    localStorage.setItem('selected_site', JSON.stringify({ id: 4, name: 'Fallback Site' }));
    service = TestBed.inject(DataService);

    await service.waitUntilHydrated();

    expect(service.getSelectedSite()?.id).toBe(4);
  }, 10000);

  it('maps notebook lookups from FPN data including name-only labels', () => {
    service = TestBed.inject(DataService);

    service.applyFPNData({
      data: {
        builds: [{ id: 1, name: 'Slim' }],
        hair_colors: [{ id: 2, name: 'Black' }],
        ethnicities: [{ id: 3, name: 'White British' }],
        weathers: [{ id: 4, name: 'Sunny' }],
        visibility: [{ id: 5, name: 'Clear' }],
        zones: [{ id: 9, name: 'Zone A' }],
        site_offences: [{ id: 1, offence_id: 1, offences: { id: 1, name: 'Litter' } }],
        address_verified_via: [{ id: 1, textOnMachine: 'Passport' }],
        id_shown: [{ id: 1, textOnMachine: 'Driving licence' }],
      }
    });

    expect(service.getBuilds()[0].textOnMachine).toBe('Slim');
    expect(service.getHairColours()[0].textOnMachine).toBe('Black');
    expect(service.getEthnicities()[0].textOnMachine).toBe('White British');
    expect(service.getWeather()[0].textOnMachine).toBe('Sunny');
    expect(service.getVisibility()[0].visibility).toBe('Clear');
    expect(service.getZones()[0].name).toBe('Zone A');
    expect(service.checkFPNData()).toBe(true);
    expect(service.checkNoteBookEntriesData()).toBe(true);
  });

  it('maps alternate notebook lookup keys from FPN data', () => {
    service = TestBed.inject(DataService);

    service.applyFPNData({
      data: {
        offender_builds: [{ id: 1, textOnMachine: 'Heavy' }],
        hair_colours: [{ id: 2, textOnMachine: 'Brown' }],
        ethnicities: [{ id: 3, textOnMachine: 'Asian' }],
        weather: [{ id: 4, textOnMachine: 'Rain' }],
        visibilities: [{ id: 5, visibility: 'Fog' }],
        site_offences: [{ id: 1, offence_id: 1, offences: { id: 1, name: 'Litter' } }],
        address_verified_via: [{ id: 1, textOnMachine: 'Passport' }],
        id_shown: [{ id: 1, textOnMachine: 'Driving licence' }],
      }
    });

    expect(service.getBuilds()[0].textOnMachine).toBe('Heavy');
    expect(service.getHairColours()[0].textOnMachine).toBe('Brown');
    expect(service.getWeather()[0].textOnMachine).toBe('Rain');
    expect(service.getVisibility()[0].visibility).toBe('Fog');
    expect(service.checkNoteBookEntriesData()).toBe(true);
  });

  it('treats FPN data as incomplete when notebook lookups are missing', () => {
    service = TestBed.inject(DataService);

    service.applyFPNData({
      data: {
        ethnicities: [{ id: 3, textOnMachine: 'White British' }],
        site_offences: [{ id: 1, offence_id: 1, offences: { id: 1, name: 'Litter' } }],
        address_verified_via: [{ id: 1, textOnMachine: 'Passport' }],
        id_shown: [{ id: 1, textOnMachine: 'Driving licence' }],
      }
    });

    expect(service.getEthnicities().length).toBe(1);
    expect(service.getBuilds().length).toBe(0);
    expect(service.checkNoteBookEntriesData()).toBe(false);
    expect(service.checkFPNData()).toBe(false);
  });
});
