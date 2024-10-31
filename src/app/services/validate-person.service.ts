import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidatePersonService {

    private baseUrl: string = 'https://uat.enforcementpro.co.uk/api/verify/idu';

    // private apiUrl = 'https://ws-idu.tracesmart.co.uk/v5.8';
    // private clientId = 'ff8d43cba2ebb1a99fb0cf5f485818221eca6ee4';
    // private clientSecret = '217e15d9b4824c81a0022c929f974c8136dcb3ec'; 
    // private token: string = ''; 

    constructor(private http: HttpClient) {}


    validateIdetity(body: any): Observable<any> {
        const url = `${this.baseUrl}`;
        return this.http.post(url, body);
    }

    
}