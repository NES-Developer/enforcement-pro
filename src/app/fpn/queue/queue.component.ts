import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FPNPage } from '../fpn.page';

import { Filesystem, Directory } from '@capacitor/filesystem';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent  implements OnInit {

    // enviro_post: EnviroPost = new EnviroPost();
    enviro_que: EnviroPost[] = [];
    baseUrl: string = 'https://uat.enforcementpro.co.uk/';


    constructor(
        private api: ApiService,
        private data:DataService,
        private alertController: AlertController,
        private router: Router,

        // private fpnPage: FPNPage

        // private fpnPage: FPNPage
    ) {
        
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

    async downloadImage(ticketUrl: string) {
        try {
            // Fetch the image from the URL using fetch API
            const response = await fetch(ticketUrl);
            const blob = await response.blob();
    
            // Convert the Blob to Base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
    
                // Save the image into 'enforcement-pro tickets' folder in the gallery
                const fileName = `ticket_${new Date().getTime()}.jpg`;
    
                await Filesystem.writeFile({
                    path: `enforcement-pro tickets/${fileName}`,
                    data: base64data.split(',')[1], // Remove the base64 header
                    directory: Directory.External,
                    recursive: true // Ensures the directory is created if it doesn't exist
                });
    
                this.confirmDownloadSuccess(fileName); // Handle success here
            };
    
        } catch (error) {
            console.error('Error downloading image', error);
            this.presentAlert('Error', 'Failed to download the image.');
        }
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
                        console.log('Printing confirmed');
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
