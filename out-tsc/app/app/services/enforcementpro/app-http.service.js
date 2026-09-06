import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { from } from 'rxjs';
import { AuthService } from './auth.service';
import * as i0 from "@angular/core";
import * as i1 from "./data.service";
export class AppHttpService {
    constructor(data, injector) {
        this.data = data;
        this.injector = injector;
    }
    get(url, options = {}) {
        return from(this.request('GET', url, undefined, options));
    }
    post(url, data = {}, options = {}) {
        return from(this.request('POST', url, data, options));
    }
    put(url, data = {}, options = {}) {
        return from(this.request('PUT', url, data, options));
    }
    delete(url, options = {}) {
        return from(this.request('DELETE', url, undefined, options));
    }
    async request(method, url, data, options = {}, isRetry = false) {
        const timeoutMs = options.timeoutMs ?? 30000;
        const useAuth = options.auth !== false;
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (useAuth) {
            const token = this.data.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        try {
            const response = await CapacitorHttp.request({
                method,
                url,
                headers,
                data: method === 'GET' ? undefined : data,
                connectTimeout: Math.min(timeoutMs, 30000),
                readTimeout: timeoutMs
            });
            const payload = this.parseNativeData(response.data);
            if (response.status >= 200 && response.status < 300) {
                return payload;
            }
            if (response.status === 401
                && useAuth
                && options.allowRefresh !== false
                && !isRetry
                && !this.isLoginUrl(url)) {
                const refreshed = await this.auth().refreshSession();
                if (refreshed) {
                    return this.request(method, url, data, options, true);
                }
            }
            throw this.toHttpLikeError(url, response.status, payload);
        }
        catch (error) {
            if (typeof error?.status === 'number') {
                throw error;
            }
            throw this.toHttpLikeError(url, 0, {
                message: error?.message || 'Could not reach the server.'
            });
        }
    }
    auth() {
        return this.injector.get(AuthService);
    }
    isLoginUrl(url) {
        return url.includes('/login');
    }
    parseNativeData(data) {
        if (typeof data !== 'string') {
            return data;
        }
        try {
            return JSON.parse(data);
        }
        catch {
            return { message: data };
        }
    }
    toHttpLikeError(url, status, payload) {
        const statusText = status === 0 ? 'Unknown Error' : 'Error';
        const serverMessage = payload?.message || payload?.error;
        const message = typeof serverMessage === 'string' && serverMessage.trim()
            ? serverMessage
            : `Http failure response for ${url}: ${status} ${statusText}`;
        const error = new Error(message);
        error.status = status;
        error.statusText = statusText;
        error.url = url;
        error.error = payload;
        return error;
    }
    static { this.ɵfac = function AppHttpService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppHttpService)(i0.ɵɵinject(i1.DataService), i0.ɵɵinject(i0.Injector)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: AppHttpService, factory: AppHttpService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppHttpService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.DataService }, { type: i0.Injector }], null); })();
//# sourceMappingURL=app-http.service.js.map