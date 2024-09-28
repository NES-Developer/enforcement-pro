import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FPNPage } from '../fpn.page';
import { Clipboard } from '@capacitor/clipboard';


// import { Filesystem, Directory } from '@capacitor/filesystem';
import { AppLog } from '../../models/app-log';

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
// import { Http } from '@capacitor-community/http';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent  implements OnInit {

    // enviro_post: EnviroPost = new EnviroPost();
    enviro_que: EnviroPost[] = [];
    baseUrl: string = 'https://app.enforcementpro.co.uk/';

    app_log: AppLog;


    constructor(
        private api: ApiService,
        private data:DataService,
        private alertController: AlertController,
        private router: Router,

        // private fpnPage: FPNPage

        // private fpnPage: FPNPage
    ) {
        this.app_log = new AppLog();
    }
    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        this.enviro_que =  this.data.getEnviroQue();
        console.log(this.enviro_que);
    }

    submitFPN(enviro_post: EnviroPost) {
        console.log('Form submitted!');

        let offence = enviro_post.offence_id;
        let offence_group = enviro_post.offence_type_id;

        enviro_post.offence_id = offence_group;
        enviro_post.offence_type_id = offence;

        this.api.postFPN(enviro_post).subscribe({
            next: (response) => {
                console.log('Response:', response);
                // Handle the response here
                if(response.success === false) 
                {
                    let message = response.message + " (Please Edit)";
                    this.presentAlert('Error', message);
                } else {
                    let fpn_number = response.data.fpn_number;
                    this.presentAlert('Success', fpn_number);

                    let fpn = response.data;


                    Clipboard.write({
                        string: fpn.ticket
                    });
                    this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + '. URL has been copied to your clipboard.');
                    this.data.spliceEnviroQue(enviro_post);
                    this.enviro_que = this.data.getEnviroQue();
                }
            },
            error: (error) => {
                if (error == "Http failure response for https??app.enforcementpro.co.uk/api/app/enviro1: 401 OK")
                {
                    this.presentAlert('Error', 'You have been logged out. Navigate to Settings and click Auto-Login button, then naviage back and Submit');
                } else {
                    this.presentAlert('Error', error);
                }
            }
        });
        // Add form submission logic here
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
        // this.fpnPage.route();
        this.router.navigate(['/notebook']);

    }
}
