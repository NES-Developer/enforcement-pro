import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

import { Injectable } from '@angular/core';
import { User } from '../../models/user';

import { Router } from '@angular/router'; // Import Router
import { DataService } from './data.service';
import { LoadingService } from '../loading.service';
import { Login } from '../../models/login';
import { AppLog } from '../../models/app-log';
import { BackgroundTaskService } from '../background-task.service';
import { LocationService } from '../location.service';
// import { Site as SiteObj } from '../../models/site';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private token: string = '';
    private login_detail: Login;
    private user: User;
    private selected_site: any = null;

    private baseUrl: string = 'https://app.enforcementpro.co.uk/api/app';

    constructor(
        private http: HttpClient,
        private router: Router,
        private data: DataService,
        private loading:LoadingService,
        private backgroundTasks: BackgroundTaskService,
        private location: LocationService,
        // private alertController: AlertController

    ) {
        this.user = new User();
        this.login_detail = new Login();
        // this.selected_site = new SiteObj();
    }

    login(id: string, pin: string): Observable<any> {
        const url = `${this.baseUrl}/login`;

        return from(this.location.requireCurrentPosition()).pipe(
            switchMap(position => {
                const body = {
                    id,
                    pin,
                    lat: position.latitude,
                    lng: position.longitude
                };

                return this.http.post(url, body, {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json'
                    })
                });
            })
        );
    }

    
    autoLogin() {

        if (this.token == '')
        {
            this.token = this.getToken();
            this.user = this.getUser() ?? new User();

            if (this.token == '')
            {
                this.login_detail = this.data.getLogin();

                if (this.login_detail.id == '' && this.login_detail.pin == '')
                {
                    this.logout();
                } 
                else 
                {
                    this.login(this.login_detail.id, this.login_detail.pin).subscribe(
                        (response: any) => {
                            if (response.access_token !== '') 
                            {
                                this.token = response.access_token;
                                this.user = response.access_user;

                                this.storeToken(this.token);
                                this.storeUser(this.user);

                                // return false;
                            }
                            else 
                            {
                                this.logout();

                                // return false;
                            }
                        },
                        (error) => {
                            this.autoLogin();
                            // this.logout();
                        }
                    );
                }
            }
            // else 
            // {
            //     // return true;
            // }
        }
        //  else 
        //  {
        //     // return true;
        // }
    }

    isLoggedIn()
    {
        if (this.token == '') {

            this.token = this.getToken();

            if (this.token == '') {

                this.login_detail = this.data.getLogin();

                if (this.login_detail.id == '' && this.login_detail.pin == '')
                {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }

        } else {
            return true;
        }
    }


    authChecker() 
    {

        if (this.token !== '')
        {
            // alert(1);
            this.token = this.data.getToken();
            let hasSite: boolean = this.data.checkSites();
            // this.user = this.data.getUser();



            if (this.token == '')
            {
                this.router.navigate(['/login']);
            } else {
                if (hasSite)
                {
                    if (this.selected_site == null)
                    {
                        this.selected_site = this.data.getSelectedSite();
                    }
                }
                else
                {
                    this.router.navigate(['/site']);
                }
            }
            
        }
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

    getToken(): string {
        let token: string = this.data.getToken();

        return token;
    }

    getUser(): User | null {
        let user: any = this.data.getUser();

        return user;
    }

    checkLoggedIn() {
        if (this.data.getToken() === '') {

            this.logout();
        } 

        // this.autoLogin();
    }
      

    async logout() {
        this.sendLogoutInBackground();
        this.backgroundTasks.clearAll();

        this.token = '';
        this.user = new User();

        await this.data.removeAllData();

        this.router.navigate(['/login']);
    }

    private sendLogoutInBackground(): void {
        const token = this.token || this.data.getToken();

        if (token == '') {
            return;
        }

        const appLog: AppLog = this.data.getAppLog() || new AppLog();
        const url = `${this.baseUrl}/logout`;

        const body = {
            lat: appLog.lat || '0',
            lng: appLog.lng || '0',
            device_id: appLog.device_id || '0'
        };

        this.http.post(url, body, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            })
        }).subscribe({
            next: () => {},
            error: () => {}
        });
    }

   

    

}
