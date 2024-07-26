import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Router } from '@angular/router'; // Import Router
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { EnviroPost } from '../../models/enviro';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/app';

    holder: any;

    constructor(
        private http: HttpClient,
        private auth: AuthService, // Inject AuthService for token handling
        private data: DataService
    ) {}

    private getHeaders(): HttpHeaders {
        // Create headers with authentication token
        const token = this.auth.getToken();
        return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
        });
    }

    postFPN(data: EnviroPost): Observable<any> {
        const url = `${this.baseUrl}/enviro1`;
        return this.http.post(url, data, { headers: this.getHeaders() });
    }

    getSRData(): Observable<any> {
        const url = `${this.baseUrl}/sr/data`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    getFPNData(site_id: number): Observable<any> {
        const url = `${this.baseUrl}/sites/${site_id}/fpn`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    getSites(): Observable<any> {
        const url = `${this.baseUrl}/sites`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    getOffenceTypes(site_id: number, id: number): Observable<any> {
        const url = `${this.baseUrl}/sites/${site_id}/offence/${id}/types`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    get(endpoint: string): Observable<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return this.http.get(url, { headers: this.getHeaders() });
    }

    post(endpoint: string, body: any): Observable<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return this.http.post(url, body, { headers: this.getHeaders() });
    }

    put(endpoint: string, body: any): Observable<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return this.http.put(url, body, { headers: this.getHeaders() });
    }

    delete(endpoint: string): Observable<any> {
        const url = `${this.baseUrl}/${endpoint}`;
        return this.http.delete(url, { headers: this.getHeaders() });
    }
}
