import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./app-http.service";
import * as i2 from "./data.service";
export class ApiService {
    constructor(appHttp, data) {
        this.appHttp = appHttp;
        this.data = data;
        this.baseUrl = 'https://app.enforcementpro.co.uk/api/app';
    }
    postFPN(data) {
        return from(this.appHttp.request('POST', `${this.baseUrl}/enviro1`, data, {
            timeoutMs: 45000
        }));
    }
    postFPNImage(enviroId, image) {
        return from(this.appHttp.request('POST', `${this.baseUrl}/enviro/images`, {
            enviro_id: enviroId,
            image
        }, {
            timeoutMs: 45000
        }));
    }
    postNoteBook(data) {
        return this.appHttp.post(`${this.baseUrl}/enviro/notebook`, data);
    }
    postTrack(data) {
        if (data && Object.prototype.hasOwnProperty.call(data, 'zone_id')) {
            delete data.zone_id;
        }
        return this.appHttp.post(`${this.baseUrl}/user/track`, data);
    }
    zoneDetection(data) {
        return this.appHttp.post(`${this.baseUrl}/find/zone`, data);
    }
    getRecentFPNs(_user_id) {
        return this.appHttp.get(`${this.baseUrl}/get-recent-fpn`);
    }
    getFPNData(site_id) {
        return this.appHttp.get(`${this.baseUrl}/sites/${site_id}/fpn`, {
            timeoutMs: 20000
        }).pipe(tap((response) => {
            const key = response?.data?.google_maps_api_key;
            if (key) {
                this.data.setGoogleKey(key);
            }
        }));
    }
    postLemoChat(body) {
        const payload = {
            message: body.message,
            chat_id: body.chat_id,
            site_id: body.site_id,
            zone_id: body.zone_id,
        };
        if (body.images?.length) {
            payload['images'] = body.images;
        }
        return this.appHttp.post(`${this.baseUrl}/lemo/chat`, payload, {
            timeoutMs: body.images?.length ? 90000 : 45000
        });
    }
    getSites() {
        return this.appHttp.get(`${this.baseUrl}/sites`);
    }
    getOffenceTypes(site_id, id) {
        return this.appHttp.get(`${this.baseUrl}/sites/${site_id}/offence/${id}/types`);
    }
    get(endpoint) {
        return this.appHttp.get(`${this.baseUrl}/${endpoint}`);
    }
    post(endpoint, body) {
        return this.appHttp.post(`${this.baseUrl}/${endpoint}`, body);
    }
    put(endpoint, body) {
        return this.appHttp.put(`${this.baseUrl}/${endpoint}`, body);
    }
    delete(endpoint) {
        return this.appHttp.delete(`${this.baseUrl}/${endpoint}`);
    }
    static { this.ɵfac = function ApiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ApiService)(i0.ɵɵinject(i1.AppHttpService), i0.ɵɵinject(i2.DataService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ApiService, factory: ApiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ApiService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.AppHttpService }, { type: i2.DataService }], null); })();
//# sourceMappingURL=api.service.js.map