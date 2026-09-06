import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppHttpService } from './app-http.service';
import { DataService } from './data.service';
import { EnviroPost } from '../../models/enviro';
import { AppLog } from '../../models/app-log';
import { ZoneDetection } from '../../models/zone-detection';
import { NotebookEntry } from '../../models/notebook-entry';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/app';

    constructor(
        private appHttp: AppHttpService,
        private data: DataService
    ) {}

    postFPN(data: EnviroPost): Observable<any> {
        return from(this.appHttp.request('POST', `${this.baseUrl}/enviro1`, data, {
            timeoutMs: 45000
        }));
    }

    postFPNImage(enviroId: number, image: string): Observable<any> {
        return from(this.appHttp.request('POST', `${this.baseUrl}/enviro/images`, {
            enviro_id: enviroId,
            image
        }, {
            timeoutMs: 45000
        }));
    }

    postNoteBook(data: NotebookEntry): Observable<any> {
        return this.appHttp.post(`${this.baseUrl}/enviro/notebook`, data);
    }

    postTrack(data: AppLog): Observable<any> {
        if (data && Object.prototype.hasOwnProperty.call(data, 'zone_id')) {
            delete (data as any).zone_id;
        }

        return this.appHttp.post(`${this.baseUrl}/user/track`, data);
    }

    zoneDetection(data: ZoneDetection): Observable<any> {
        return this.appHttp.post(`${this.baseUrl}/find/zone`, data);
    }

    getRecentFPNs(_user_id?: number): Observable<any> {
        return this.appHttp.get(`${this.baseUrl}/get-recent-fpn`);
    }

    getFPNData(site_id: number): Observable<any> {
        return this.appHttp.get(`${this.baseUrl}/sites/${site_id}/fpn`, {
            timeoutMs: 20000
        }).pipe(
            tap((response) => {
                const key = response?.data?.google_maps_api_key;
                if (key) {
                    this.data.setGoogleKey(key);
                }
            })
        );
    }

    postLemoChat(body: {
        message: string;
        chat_id?: number | null;
        site_id?: number | null;
        zone_id?: number | null;
        images?: string[];
    }): Observable<any> {
        const payload: Record<string, unknown> = {
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

    getSites(): Observable<any> {
        return this.appHttp.get(`${this.baseUrl}/sites`);
    }

    getOffenceTypes(site_id: number, id: number): Observable<any> {
        return this.appHttp.get(`${this.baseUrl}/sites/${site_id}/offence/${id}/types`);
    }

    get(endpoint: string): Observable<any> {
        return this.appHttp.get(`${this.baseUrl}/${endpoint}`);
    }

    post(endpoint: string, body: any): Observable<any> {
        return this.appHttp.post(`${this.baseUrl}/${endpoint}`, body);
    }

    put(endpoint: string, body: any): Observable<any> {
        return this.appHttp.put(`${this.baseUrl}/${endpoint}`, body);
    }

    delete(endpoint: string): Observable<any> {
        return this.appHttp.delete(`${this.baseUrl}/${endpoint}`);
    }
}
