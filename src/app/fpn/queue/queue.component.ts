import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FPNPage } from '../fpn.page';

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
    baseUrl: string = 'https://uat.enforcementpro.co.uk/';

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

                    let ticketUrl: string = this.baseUrl + fpn.ticket;
                    this.downloadImage(ticketUrl);

                    this.data.spliceEnviroQue(enviro_post);
                    this.enviro_que = this.data.getEnviroQue();
                }
            },
            error: (error) => {
                // console.error('Error:', error);
                this.presentAlert('Error', error);
                console.log(error);

                // Handle the error here
            }
        });
        // Add form submission logic here
    }

    downloadFileWeb(base64Data: string, fileName: string) {
        const link = document.createElement('a');
        link.href = `${base64Data}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    async downloadImage(ticketUrl: string) {
        try {
            // Fetch the image from the URL
            const response = await fetch(ticketUrl);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            // Get the image as a Blob
            const blob = await response.blob();
            
            // Convert the Blob to base64 string
            const base64Data = await this.convertBlobToBase64(blob) as string;
            console.log(base64Data);

            const fileName = `ticket_${new Date().getTime()}.png`;
      
            // Save the base64 image to the filesystem
            const savedFile = await Filesystem.writeFile({
              path: `${fileName}.png`,
              data: base64Data,
              directory: Directory.Data,  // You can also use Directory.Documents
            });
            this.downloadFileWeb(base64Data, `${fileName}.png`);
  
      
            console.log('Image saved successfully:', savedFile);
          } catch (error) {
            console.error('Error saving the image:', error);
          }
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
    
    async confirmDownloadSuccess(ticketUrl: string) {
        const alert = await this.alertController.create({
            header: 'Download Ticket',
            message: 'Was the download successful?',
            buttons: [
                {
                    text: 'Retry',
                    handler: () => {
                        this.downloadImage(ticketUrl); // Retry printing
                    }
                },
                {
                    text: 'Close',
                    role: 'cancel',
                    handler: () => {
                        window.location.reload();

                    }
                }
            ]
        });
    
        await alert.present();
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
