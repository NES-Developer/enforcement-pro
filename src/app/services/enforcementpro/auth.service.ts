import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

import { Injectable } from '@angular/core';

import { Router } from '@angular/router'; // Import Router
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private token: string = '';
    private user: any = null;

    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/app';

    constructor(
        private http: HttpClient,
        private router: Router,
        private data: DataService
        // private alertController: AlertController

    ) {}

    login(id: string, pin: string): Observable<any> {
        const url = `${this.baseUrl}/login`;
        const body = { id, pin };
    
        return this.http.post(url, body, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
          })
        });
      }
    
    handleLoginResponse(response: any): void {
        this.token = response.access_token;
        this.user = response.user;

        this.storeToken();
        this.storeUser();

        this.router.navigateByUrl('').then(() => {
            window.location.reload();
        });
    }

    storeToken() {
        localStorage.setItem('token', this.token);
    }

    storeUser() {
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    getToken() {
        if (this.token === '') {
            let token = localStorage.getItem('token');
            if(token === null) {
                return '';
            }
            this.token = token;
        }
        return this.token;
    }

    getUser() {
        if (!this.user) {
            let userJson = localStorage.getItem('user');
            if (!userJson) {
                return null;
            }
            this.user = JSON.parse(userJson); // Convert JSON string to object
        }
        return this.user;
    }

    checkLoggedIn() {
        if (this.getToken() === '' || this.getUser() === null) {
            this.logout();
        } 
    }
      

    logout() {
        this.token = '';
        this.user = null;

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.data.removeAllData();

        this.router.navigate(['/login']);
    }

   

    

}
