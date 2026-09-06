import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AppHttpService } from './app-http.service';
import { DataService } from './data.service';
import { BackgroundTaskService } from '../background-task.service';
import { LocationService } from '../location.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AppHttpService, useValue: { post: () => ({ subscribe: () => undefined }) } },
        { provide: Router, useValue: { navigate: () => undefined } },
        { provide: DataService, useValue: { getToken: () => '', getLogin: () => ({ id: '', pin: '' }), getUser: () => null, setToken: () => undefined, setUser: () => undefined, getAppLog: () => ({}), setAppLog: () => undefined, removeAllData: async () => undefined, checkSites: () => false, getSelectedSite: () => null } },
        { provide: BackgroundTaskService, useValue: { clearAll: () => undefined } },
        { provide: LocationService, useValue: { peekLastKnown: () => ({ latitude: '0', longitude: '0' }), tryCurrentPosition: async () => null } }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
