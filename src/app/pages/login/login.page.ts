import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { ApiService } from 'src/app/services/enforcementpro/api.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/enforcementpro/data.service';
import { Login } from '../../models/login';


// import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('idInput') idInput!: ElementRef;
    @ViewChild('pinInput') pinInput!: ElementRef;

    login: Login;

    constructor(
        private apiService: ApiService,
        private auth: AuthService,
        private alertController: AlertController,
        private router: Router,

        private data: DataService
        
    ) {
        this.login = new Login();
    }


    ngOnInit() {
        this.auth.checkLoggedIn();
        //alert(this.auth.userLoggedIn());
    }

    onSubmit(event: Event) {
        event.preventDefault(); // Prevent the default form submission
    
        const id = this.idInput.nativeElement.value;
        const pin = this.pinInput.nativeElement.value;
            
        this.auth.login(id, pin).subscribe(
            (response) => {
                
                if(response.error_code) {
                    let message: string = response.message;
                    this.presentAlert("Login Attempt Failed", message)
                } else if (response.access_token !== '' || response.user) {
                    this.login.id = id;
                    this.login.pin = pin;
                    this.data.setLogin(this.login);
                    this.auth.handleLoginResponse(response);
                }
            },
            (error) => {
                this.presentAlert("Login Attempt Failed", error)
            }
        );
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
          header: header,
          message: message,
          buttons: ['Okay'],
        });
        await alert.present();
    }

}
