import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent  implements OnInit {

    // enviro_post: EnviroPost = new EnviroPost();
    enviro_que: EnviroPost[] = [];


    constructor(
        private api: ApiService,
        private data:DataService,
        private alertController: AlertController,
        private router: Router

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
                    this.data.spliceEnviroQue(enviro_post);
                    this.enviro_que = this.data.getEnviroQue();
                }
            },
            error: (error) => {
                // console.error('Error:', error);
                this.presentAlert('Error', error);

                // Handle the error here
            }
        });
        // Add form submission logic here
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
        this.router.navigate(['/tabs/fpn']);

    }
}
