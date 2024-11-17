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
import { TicketService } from 'src/app/Service/ticket.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toPng } from 'html-to-image';

// import * as htmlToImage from 'html-to-image';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent  implements OnInit {

    currentStep: number = 1;
    enviro_que: EnviroPost[] = [];
    enviro_que_addition: any[] = [];
    baseUrl: string = 'https://app.enforcementpro.co.uk/';
    app_log: AppLog;
    isSubmitting: boolean = false;

    // html_bool: boolean = fals;
    // html_string: SafeHtml = "";

    constructor(
        private api: ApiService,
        private data:DataService,
        private alertController: AlertController,
        private router: Router,
        private route2: ActivatedRoute,
        private loading:LoadingService,
        private auth: AuthService,
        private ticket: TicketService,

        private sanitizer: DomSanitizer
    ) {

        this.app_log = new AppLog();

        this.route2.queryParams.subscribe(params => {
            this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
        });

       

        // const rawHtml = ``;
        // this.html_string = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
        // console.log(this.html_string)
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.enviro_que =  this.data.getEnviroQue();
        this.enviro_que_addition = this.enviro_que;
        for (let x=0; x<this.enviro_que.length; x++) {
            const rawHtml = `` // Assuming the raw HTML exists in ``
            this.enviro_que_addition[x] = {
                ...this.enviro_que_addition[x], // Retain existing properties
                html_bool: false, // Add html_bool
                html_string: this.sanitizer.bypassSecurityTrustHtml(rawHtml), // Add or sanitize html_string
            };
        }

        this.ping();
        setInterval(() => {
            this.ping();
        }, 120000); // 2 minutes in milliseconds
    }

    submitFPN(enviro_post: any) {
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
                        string: fpn.fpn_number
                    });

                    this.isSubmitting = false;
                    this.loading.hideLoading();

                    this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + ' has been copied to your clipboard.');
                    this.data.spliceEnviroQue(enviro_post);
                    this.enviro_que = this.data.getEnviroQue();
                }
            },
            error: (error) => {
                this.isSubmitting = false;
                this.loading.hideLoading();

                if (error.message == "Http failure response for https//app.enforcementpro.co.uk/api/app/enviro1: 401 OK")
                {
                    this.presentAlert('Error', 'You have been logged out. Navigate to Settings and click Auto-Login button, then navigate back and Submit');
                }
                else if (error.message == "Http failure response for https//app.enforcementpro.co.uk/api/app/enviro1: 500 OK")
                {
                    this.presentAlert('Error', 'Network Error, Please save to Queue and try again later.');
                } 
                else if (error.message == "Http failure response for https//app.enforcementpro.co.uk/api/app/enviro1: 0 Unknown Error")
                {
                    this.presentAlert('Error', 'You have been logged out. Navigate to Settings and click Auto-Login button, then navigate back and Submit');
                } 
                else 
                {
                    this.presentAlert('Error', error.message);
                }   
            }
        });
    }


    // assignOfficerId(enviro_post: EnviroPost) {
    //     let user = this.auth.getUser();
    //     enviro_post.officer_id = user.id;
    // }

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

    previewTicket(enviro_post: EnviroPost) {
        let ticket = this.ticket.generateWelcomeTicket(enviro_post);

        for (let x = 0; x<this.enviro_que_addition.length; x++) {
            if (this.enviro_que_addition[x] == enviro_post) {
                this.enviro_que_addition[x].html_bool = true;
                this.enviro_que_addition[x].html_string = ticket;
            }
        }
    }

    copyTicketToClipboard(enviro_post: any) {
        const element = document.getElementById('html_ticket');
        if (element) {
          toPng(element)
            .then((dataUrl) => {
                // console.log(dataUrl);
                Clipboard.write({
                    string: dataUrl
                });
                this.presentAlert('Success', 'Successfully copied Ticket, navigate to Printer');
            //   enviro_post.html_string = dataUrl; // Set base64 image as the new html_string
            })
            .catch((error) => {
                console.error('Error generating image:', error);
            });
        } else {
            console.error('Element with id "html_ticket" not found.');
        }
      }

    editFPN(enviro_post: EnviroPost) {
        this.data.setEnviroPost(enviro_post);
        this.router.navigate(['/notebook', 0], { queryParams: { currentStep: this.currentStep } });
    }
}
