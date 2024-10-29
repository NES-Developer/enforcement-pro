import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidatePersonService {
  private apiUrl = 'https://ws-idu.tracesmart.co.uk/v5.8';
  private clientId = 'ff8d43cba2ebb1a99fb0cf5f485818221eca6ee4';
  private clientSecret = '217e15d9b4824c81a0022c929f974c8136dcb3ec'; 
  private token: string = ''; 

  constructor(private http: HttpClient) {}

  // Method to request Bearer token
  generateBearerToken(): Observable<any> {
    const url = `${this.apiUrl}/oauth/token`;

    // Create request body
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret
    };

    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make POST request to get the token
    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        // Extract token from the response
        this.token = response.access_token;
        return response;
      })
    );
  }
  makeAuthenticatedRequest(endpoint: string, params: any = {}): Observable<any> {
    const url = `${this.apiUrl}${endpoint}`;
  
    // Set headers with the Bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  
    // Add query parameters to URL
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;
  
    return this.http.get<any>(fullUrl, { headers });
  }

  // Method to make an authenticated POST request
  makeAuthenticatedPostRequest(endpoint: string, data: any): Observable<any> {
    const url = `${this.apiUrl}${endpoint}`;

    // Set headers with the Bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, data, { headers });
  }
}