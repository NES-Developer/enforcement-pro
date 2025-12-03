import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

import { Injectable } from '@angular/core';
import { User } from '../../models/user';

import { Router } from '@angular/router'; // Import Router
import { DataService } from './data.service';
import { LoadingService } from '../loading.service';
import { Login } from '../../models/login';

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

    private getCurrentPosition(): any {
        return new Observable((observer: Subscriber<any>) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: any) => {
            observer.next({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            observer.complete();
            });
        } else {
            observer.error();
        }
        });
    }

    login(id: string, pin: string): Observable<any> {
        const url = `${this.baseUrl}/login`;

        let lat = 0;
        let lng = 0;

        this.getCurrentPosition()
        .subscribe((position: any) => {
            lat = position.latitude;
            lng = position.longitude;
        });

        const body = { id, pin, lat, lng };
    
        return this.http.post(url, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        });
    }

    
    autoLogin() {
        let login: Login = this.data.getLogin();
      
        this.login(login.id, login.pin).subscribe(
            (response: any) => {
                if (response.access_token !== '' || response.user) {
                    this.storeToken(response.access_token);
                    this.storeUser(response.user);
                }
            },
            (error) => {
                // this.logout();
            }
        );
    }
      
    
    handleLoginResponse(response: any): void {

        this.storeToken(response.access_token);
        this.storeUser(response.user);

        // this.storeToken();
        // console.log(11, response.user, this.user);
        // this.storeUser();

        this.router.navigate(['/site']);
    }

    storeToken(token: string) {
        this.token = token;

        this.data.setToken(this.token)

    }

    storeUser(user: any) {
        this.user = new User();
        this.user.id = user.id;
        this.user.name = user.name;
        this.user.first_name = user.first_name;
        this.user.last_name = user.last_name;
        this.user.operator_number = user.operator_number;
        this.user.role = user.role;

       this.data.setUser(this.user);
    }

    getToken(): String {
        let token: string = this.data.getToken();

        return token;

        // if (this.token === '') {
        //     let token = localStorage.getItem('token');
        //     if(token === null) {
        //         return '';
        //     }
        //     this.token = token;
        // }
        // return this.token;
    }

    getUser(): User | null {
        let user: any = this.data.getUser();

        return user;

        // if (this.user.id == 0) {
        //     let userJson = localStorage.getItem('user');
        //     if (userJson) {
        //         this.user = JSON.parse(userJson); // Convert JSON string to object
        //     }
        //     else {
        //         if (this.getToken() === '')
        //         {
        //             this.logout();
        //         } 
                
        //         return null;
        //     }
        // }
        // return this.user;
    }

    checkLoggedIn() {
        if (this.data.getToken() === '') {

            this.logout();
        } 

        // this.autoLogin();
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
