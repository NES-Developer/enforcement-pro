import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { Login } from '../../models/login';
import { AppLog } from '../../models/app-log';
import * as i0 from "@angular/core";
import * as i1 from "./app-http.service";
import * as i2 from "@angular/router";
import * as i3 from "./data.service";
import * as i4 from "../background-task.service";
import * as i5 from "../location.service";
export class AuthService {
    constructor(appHttp, router, data, backgroundTasks, location) {
        this.appHttp = appHttp;
        this.router = router;
        this.data = data;
        this.backgroundTasks = backgroundTasks;
        this.location = location;
        this.token = '';
        this.selected_site = null;
        this.refreshInFlight = null;
        this.baseUrl = 'https://app.enforcementpro.co.uk/api/app';
        this.user = new User();
        this.login_detail = new Login();
    }
    login(id, pin) {
        const coords = this.location.peekLastKnown();
        return this.appHttp.post(`${this.baseUrl}/login`, {
            id,
            pin,
            lat: coords.latitude,
            lng: coords.longitude
        }, {
            auth: false,
            timeoutMs: 20000
        }).pipe(tap((response) => {
            if (response?.access_token && response?.user) {
                this.storeToken(response.access_token);
                this.storeUser(response.user);
                this.primeLocationAfterLogin();
            }
        }));
    }
    async refreshSession() {
        if (this.refreshInFlight) {
            return this.refreshInFlight;
        }
        this.refreshInFlight = this.performRefresh();
        try {
            return await this.refreshInFlight;
        }
        finally {
            this.refreshInFlight = null;
        }
    }
    autoLogin() {
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
            const hasSite = this.data.checkSites();
            if (this.token == '') {
                this.router.navigate(['/login']);
                return;
            }
            if (hasSite) {
                if (this.selected_site == null) {
                    this.selected_site = this.data.getSelectedSite();
                }
            }
            else {
                this.router.navigate(['/site']);
            }
        }
    }
    handleLoginResponse(response) {
        if (response?.access_token) {
            this.storeToken(response.access_token);
        }
        if (response?.user) {
            this.storeUser(response.user);
        }
        this.router.navigate(['/site']);
    }
    storeToken(token) {
        this.token = token;
        this.data.setToken(this.token);
    }
    storeUser(user) {
        this.user = new User();
        this.user.id = user.id;
        this.user.name = user.name;
        this.user.first_name = user.first_name;
        this.user.last_name = user.last_name;
        this.user.operator_number = user.operator_number;
        this.user.role = user.role;
        this.data.setUser(this.user);
    }
    getToken() {
        return this.data.getToken();
    }
    getUser() {
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
    async performRefresh() {
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
        }
        catch {
            return false;
        }
        return false;
    }
    primeLocationAfterLogin() {
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
    sendLogoutInBackground() {
        const token = this.token || this.data.getToken();
        if (token == '') {
            return;
        }
        const appLog = this.data.getAppLog() || new AppLog();
        this.appHttp.post(`${this.baseUrl}/logout`, {
            lat: appLog.lat || '0',
            lng: appLog.lng || '0',
            device_id: appLog.device_id || '0'
        }, {
            allowRefresh: false,
            timeoutMs: 15000
        }).subscribe({
            next: () => { },
            error: () => { }
        });
    }
    static { this.ɵfac = function AuthService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AuthService)(i0.ɵɵinject(i1.AppHttpService), i0.ɵɵinject(i2.Router), i0.ɵɵinject(i3.DataService), i0.ɵɵinject(i4.BackgroundTaskService), i0.ɵɵinject(i5.LocationService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AuthService, factory: AuthService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AuthService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.AppHttpService }, { type: i2.Router }, { type: i3.DataService }, { type: i4.BackgroundTaskService }, { type: i5.LocationService }], null); })();
//# sourceMappingURL=auth.service.js.map