import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Router } from '@angular/router'; // Import Router
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

    private baseUrl: string = 'https://uat.enforcementpro.co.uk/api/app';

    constructor(
        private http: HttpClient,
        private auth: AuthService // Inject AuthService for token handling
    ) {}

    private getHeaders(): HttpHeaders {
        // Create headers with authentication token
        const token = this.auth.getToken();
        return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
        });
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
