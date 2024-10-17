import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FPNPage } from '../fpn.page';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/enforcementpro/auth.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent  implements OnInit {

    currentStep: number = 1;
    enviro_que: EnviroPost[] = [];
    baseUrl: string = 'https://app.enforcementpro.co.uk/';
    app_log: AppLog;
    isSubmitting: boolean = false;

    constructor(
        private api: ApiService,
        private data:DataService,
        private alertController: AlertController,
        private router: Router,
        private route2: ActivatedRoute,
        private loading:LoadingService,
        private auth: AuthService
    ) {
        this.app_log = new AppLog();

        this.route2.queryParams.subscribe(params => {
            this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
        });
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.enviro_que =  this.data.getEnviroQue();
        this.ping();
        setInterval(() => {
            this.ping();
        }, 120000); // 2 minutes in milliseconds
    }

    submitFPN(enviro_post: EnviroPost) {
        if (this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;
        this.loading.showLoading();

        this.api.postFPN(enviro_post).subscribe({
            next: (response) => {
                // Handle the response here
                if(response.success === false) 
                {
                    let message = response.message + " (Please Edit)";
                    
                    this.isSubmitting = false;
                    this.loading.hideLoading();

                    this.presentAlert('Error', message);
                } else {
                    let fpn_number = response.data.fpn_number;
                    this.presentAlert('Success', fpn_number);

                    let fpn = response.data;

                    Clipboard.write({
                        string: fpn.ticket
                    });

                    this.isSubmitting = false;
                    this.loading.hideLoading();

                    this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + '. URL has been copied to your clipboard.');
                    this.data.spliceEnviroQue(enviro_post);
                    this.enviro_que = this.data.getEnviroQue();
                }
            },
            error: (error) => {
                this.isSubmitting = false;
                this.loading.hideLoading();

                if (error.message == "Http failure response for https//app.enforcementpro.co.uk/api/app/enviro1: 401 OK")
                {
                    this.presentAlert('Error', 'You have been logged out. Navigate to Settings and click Auto-Login button, then naviage back and Submit');
                }
                else if (error.message == "Http failure response for https//app.enforcementpro.co.uk/api/app/enviro1: 0 Unknown Error")
                {
                    this.presentAlert('Error', 'You have been logged out. Navigate to Settings and click Auto-Login button, then naviage back and Submit');
                } 
                else {
                    this.presentAlert('Error', error.message);
                }  
            }
        });
    }

    assignOfficerId(enviro_post: EnviroPost) {
        let user = this.auth.getUser();
        enviro_post.officer_id = user.id;
    }

    // Helper function to convert blob to base64
    convertBlobToBase64(blob: Blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
    }

    ping() {
        this.api.postTrack(this.app_log).subscribe({
            next: (response) => {
                console.log('Response:', response);
                
            },
            error: (error) => {
                console.error('Error:', error);
            }
        });
    }

    route (route: string) {
        if (route == "/tabs/fpn")
        {
            this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
        } 
        else
        {
            this.router.navigate([route]);
        }
    }

    async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
          header: header,
          message: message,
          buttons: ['Okay'],
        });
        await alert.present();
    }

    editFPN(enviro_post: EnviroPost) {
        this.data.setEnviroPost(enviro_post);
        this.router.navigate(['/notebook', 0], { queryParams: { currentStep: this.currentStep } });
    }
}
