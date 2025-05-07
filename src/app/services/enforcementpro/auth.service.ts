import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

import { Injectable } from '@angular/core';
import { User } from '../../models/user';

import { Router } from '@angular/router'; // Import Router
import { DataService } from './data.service';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private token: string = '';
    
    private user: User;

    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/app';

    constructor(
        private http: HttpClient,
        private router: Router,
        private data: DataService,
        private loading:LoadingService,
        // private alertController: AlertController

    ) {
        this.user = new User();
    }

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
        this.storeToken(response.access_token);
        console.log(11, response.user, this.user);
        this.storeUser(response.user);

        this.router.navigateByUrl('').then(() => {
            window.location.reload();
        });
    }

    storeToken(token: string) {
        this.token = token;
        localStorage.setItem('token', this.token);
    }

    storeUser(user: any) {
        this.user = new User();
        this.user.id = user.id;
        this.user.name = user.name;
        this.user.first_name = user.first_name;
        this.user.last_name = user.last_name;
        this.user.operator_number = user.operator_number;
        this.user.role = user.role;
        // console.log(111, this.user);
        localStorage.setItem('user', JSON.stringify(this.user));
    }

    getToken(): String {
        if (this.token === '') {
            let token = localStorage.getItem('token');
            if(token === null) {
                return '';
            }
            this.token = token;
        }
        return this.token;
    }

    getUser(): User | null {
        if (this.user.id == 0) {
            let userJson = localStorage.getItem('user');
            if (userJson) {
                this.user = JSON.parse(userJson); // Convert JSON string to object
            }
            else {
                if (this.getToken() === '')
                {
                    this.logout();
                } 
                
                return null;
            }
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
        this.user = new User();

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        this.data.removeAllData();

        this.router.navigate(['/login']);
    }

   

    

}
