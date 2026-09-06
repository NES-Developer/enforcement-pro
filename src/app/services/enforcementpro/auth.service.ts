import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { User } from '../../models/user';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { AppHttpService } from './app-http.service';
import { Login } from '../../models/login';
import { AppLog } from '../../models/app-log';
import { BackgroundTaskService } from '../background-task.service';
import { LocationService } from '../location.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private token: string = '';
    private login_detail: Login;
    private user: User;
    private selected_site: any = null;
    private refreshInFlight: Promise<boolean> | null = null;

    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/app';

    constructor(
        private appHttp: AppHttpService,
        private router: Router,
        private data: DataService,
        private backgroundTasks: BackgroundTaskService,
        private location: LocationService
    ) {
        this.user = new User();
        this.login_detail = new Login();
    }

    login(id: string, pin: string): Observable<any> {
        const coords = this.location.peekLastKnown();

        return this.appHttp.post(`${this.baseUrl}/login`, {
            id,
            pin,
            lat: coords.latitude,
            lng: coords.longitude
        }, {
            auth: false,
            timeoutMs: 20000
        }).pipe(
            tap((response: any) => {
                if (response?.access_token && response?.user) {
                    this.storeToken(response.access_token);
                    this.storeUser(response.user);
                    this.primeLocationAfterLogin();
                }
            })
        );
    }

    async refreshSession(): Promise<boolean> {
        if (this.refreshInFlight) {
            return this.refreshInFlight;
        }

        this.refreshInFlight = this.performRefresh();

        try {
            return await this.refreshInFlight;
        } finally {
            this.refreshInFlight = null;
        }
    }

    autoLogin(): void {
        this.refreshSession().then((ok) => {
            if (!ok && !this.data.getToken()) {
                this.logout();
            }
        });
    }

    isLoggedIn() {
        if (this.token == '') {
            this.token = this.getToken();

            if (this.token == '') {
                this.login_detail = this.data.getLogin();
                return !(this.login_detail.id == '' && this.login_detail.pin == '');
            }

            return true;
        }

        return true;
    }

    authChecker() {
        if (this.token !== '') {
            this.token = this.data.getToken();
            const hasSite: boolean = this.data.checkSites();

            if (this.token == '') {
                this.router.navigate(['/login']);
                return;
            }

            if (hasSite) {
                if (this.selected_site == null) {
                    this.selected_site = this.data.getSelectedSite();
                }
            } else {
                this.router.navigate(['/site']);
            }
        }
    }

    handleLoginResponse(response: any): void {
        if (response?.access_token) {
            this.storeToken(response.access_token);
        }

        if (response?.user) {
            this.storeUser(response.user);
        }

        this.router.navigate(['/site']);
    }

    storeToken(token: string) {
        this.token = token;
        this.data.setToken(this.token);
    }

    storeUser(user: any) {
        this.user = new User();
        this.user.id = user.id;
        this.user.name = user.name;
        this.user.first_name = user.first_name;
        this.user.last_name = user.last_name;
        this.user.operator_number = user.operator_number;
        this.user.role = user.role;
        this.data.setUser(this.user);
    }

    getToken(): string {
        return this.data.getToken();
    }

    getUser(): User | null {
        return this.data.getUser();
    }

    checkLoggedIn() {
        if (this.data.getToken() === '') {
            this.logout();
        }
    }

    async logout() {
        this.sendLogoutInBackground();
        this.backgroundTasks.clearAll();

        this.token = '';
        this.user = new User();

        await this.data.removeAllData();

        this.router.navigate(['/login']);
    }

    private async performRefresh(): Promise<boolean> {
        const login = this.data.getLogin();

        if (!login?.id || !login?.pin) {
            return false;
        }

        const coords = this.location.peekLastKnown();

        try {
            const response = await CapacitorHttp.post({
                url: `${this.baseUrl}/login`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    id: login.id,
                    pin: login.pin,
                    lat: coords.latitude,
                    lng: coords.longitude
                },
                connectTimeout: 15000,
                readTimeout: 20000
            });

            const payload = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;

            if (response.status >= 200 && response.status < 300 && payload?.access_token && payload?.user) {
                this.storeToken(payload.access_token);
                this.storeUser(payload.user);
                return true;
            }
        } catch {
            return false;
        }

        return false;
    }

    private primeLocationAfterLogin(): void {
        this.location.tryCurrentPosition(6000).then((fix) => {
            if (!fix) {
                return;
            }

            const appLog = this.data.getAppLog() || new AppLog();
            appLog.lat = fix.latitude;
            appLog.lng = fix.longitude;
            this.data.setAppLog(appLog);
        }).catch(() => undefined);
    }

    private sendLogoutInBackground(): void {
        const token = this.token || this.data.getToken();

        if (token == '') {
            return;
        }

        const appLog: AppLog = this.data.getAppLog() || new AppLog();

        this.appHttp.post(`${this.baseUrl}/logout`, {
            lat: appLog.lat || '0',
            lng: appLog.lng || '0',
            device_id: appLog.device_id || '0'
        }, {
            allowRefresh: false,
            timeoutMs: 15000
        }).subscribe({
            next: () => {},
            error: () => {}
        });
    }
}
