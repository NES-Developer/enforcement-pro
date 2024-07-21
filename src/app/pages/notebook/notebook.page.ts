import { Component, OnInit } from '@angular/core';
import { Build } from '../../models/build';
import { EnviroPost } from '../../models/enviro';
import { HairColour } from '../../models/hair_colour';
import { DataService } from '../../services/enforcementpro/data.service';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.page.html',
  styleUrls: ['./notebook.page.scss'],
})
export class NotebookPage implements OnInit {

    enviro_post: EnviroPost = new EnviroPost();

    // notebook_entries: NotebookEntry = new NotebookEntry();
    builds: Build[] = [];
    hair_colours: HairColour[] = [];

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private router: Router        
    ) 
    { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.builds = this.data.getBuilds();
        this.hair_colours = this.data.getHairColours();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }

    validator(): boolean {

        return true;
    }

    route():void {
        this.enviro_post = new EnviroPost();
        this.data.setEnviroPost(this.enviro_post);
        this.router.navigate(['/tabs/fpn']);
    }

    submitForm() {

        let checker = this.validator();

        if (checker) {
            this.api.postFPN(this.enviro_post).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";
                        this.presentAlert('Error', message);
                    } else {
                        let fpn_number = response.data.fpn_number;
                        this.data.spliceEnviroQue(this.enviro_post);
                        this.enviro_post = new EnviroPost();
                        this.data.setEnviroPost(this.enviro_post);
                        this.presentAlert('Success', fpn_number);

                    }
                },
                error: (error) => {
                    console.error('Error:', error);
                    this.presentAlert('Error', error);
    
                    // Handle the error here
                }
            });
        }
    }


    async presentAlert(header: string, message: string) {
        let button_title: string = 'Ok';
        if (header == "Success") {
            button_title = "Finish"
        }
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: button_title,
                    handler: () => {
                        if (header == "Success") {
                            
                            this.router.navigate(['/tabs/fpn']);
                        }
                    }
                }
            ],
        });
        await alert.present();
    }

}
