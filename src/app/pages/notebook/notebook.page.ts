import { Component, OnInit } from '@angular/core';
import { Build } from '../../models/build';
import { EnviroPost } from '../../models/enviro';
import { HairColour } from '../../models/hair_colour';
import { DataService } from '../../services/enforcementpro/data.service';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { NotebookEntry } from '../../models/notebook-entry';


@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.page.html',
  styleUrls: ['./notebook.page.scss'],
})
export class NotebookPage implements OnInit {
    id: any;

    enviro_post: EnviroPost;
    notebook_entries: NotebookEntry; 
    app_log: AppLog;
    fpn_number: string = "";

    builds: Build[] = [];
    hair_colours: HairColour[] = [];

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private route2: ActivatedRoute,
        private router: Router,
    ) 
    {
        this.id = this.route2.snapshot.paramMap.get('id');

        console.log(this.id);
        if (this.id == 0)
        {
            let enviro_post = this.data.getEnviroPost();
            if (enviro_post) 
            {
                this.enviro_post = enviro_post;
            } 
            else 
            {
                this.enviro_post = new EnviroPost();
            }

            if (this.enviro_post.notebook_entries == undefined || this.enviro_post.notebook_entries == null) 
            {
                this.enviro_post.notebook_entries = new NotebookEntry();
                this.notebook_entries = new NotebookEntry();
            }
            else{
                this.notebook_entries = this.enviro_post.notebook_entries;
            }
        } else
        {
            this.notebook_entries = new NotebookEntry();
            this.enviro_post = new EnviroPost();
        }

        this.route2.queryParams.subscribe(params => {
            this.fpn_number = params['fpn_number']; // Fallback to null if not present
            // console.log(1,fpn_number);
          });
        
        this.app_log = new AppLog();

     }

    ngOnInit() {
        this.loadData();
    }

    ping() {
        if (this.data.checkAppLog()) {
            this.api.postTrack(this.app_log).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    
                },
                error: (error) => {
                    console.error('Error:', error);
                }
            });
        }
    }

    loadData() {
        this.builds = this.data.getBuilds();
        this.hair_colours = this.data.getHairColours();
        let enviro_post =  this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }

        // if (this.id > 0)
        // {
            
        // }

        this.ping();
        if(this.data.checkAppLog()) {
            setInterval(() => {
            }, 120000); // 2 minutes in milliseconds
        }
    }

    validator(): boolean {
        if (!this.notebook_entries.is_fpn_advised) {
            this.presentAlert('Wait!', 'Please provide if FPN is adviced.');
            return false;
        }
        if (!this.notebook_entries.is_fpn_handed) {
            this.presentAlert('Wait!', 'Please provide if FPN is handed.');
            return false;
        }
        if (this.notebook_entries.hair == 0) {
            this.presentAlert('Wait!', 'Please provide hair details.');
            return false;
        }
        if (this.notebook_entries.were == '') {
            this.presentAlert('Wait!', 'Please provide were details.');
            return false;
        }

        if (this.notebook_entries.did == '') {
            this.presentAlert('Wait!', 'Please provide did details.');
            return false;
        }
        console.log(this.enviro_post.notebook_entries);
        return true;
    }

    route(route: string) {
        if (this.id == 0)
        {
            this.enviro_post = new EnviroPost();
            this.data.setEnviroPost(this.enviro_post);
        }
        this.router.navigate([route]);
    }

    saveEnviroData() {
        if (this.id == 0) 
        {
            if (this.enviro_post.notebook_entries.hair !== 0 && this.enviro_post.notebook_entries.did !== ''  && this.enviro_post.notebook_entries.were !== '' && this.enviro_post.notebook_entries.is_fpn_advised !== '' && this.enviro_post.notebook_entries.is_fpn_handed !== '')
            {
                this.enviro_post.notebook_entries = this.notebook_entries;
                this.data.setEnviroPost(this.enviro_post);
            }
        }
    }

    submitFpn() {
        let checker = this.validator();

        if (checker) {

            this.offenceSwitcherForserver(this.enviro_post);

            this.api.postFPN(this.enviro_post).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        this.offenceSwitcherForserver(this.enviro_post);
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
                        this.data.spliceEnviroQue(this.enviro_post);
                        this.route('/tabs/fpn');
                    }
                }
            });
        }
    }

    submitForm () {
        let checker = this.validator();
        if (checker)
        {
            this.notebook_entries.enviro_id = this.id;
            this.api.postNoteBook(this.notebook_entries).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";
                        this.presentAlert('Error', message);
                    } else {
                        // let fpn_number = response.data.fpn_number;
                        this.presentAlert('Success', 'Notebook entry captured');
    
                        // let fpn = response.data;

                        // Clipboard.write({
                        //     string: fpn.ticket
                        // });
                        // this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + '. URL has been copied to your clipboard.');
                        // this.data.spliceEnviroQue(this.enviro_post);
                        this.route('');
                    }
                }
            });
        }
    }

    offenceSwitcherForserver(enviro_post: EnviroPost) {
        let offence = enviro_post.offence_id;
        let offence_group = enviro_post.offence_type_id;

        enviro_post.offence_id = offence_group;
        enviro_post.offence_type_id = offence;
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
                            // this.router.navigate(['/tabs/fpn']);
                        }
                    }
                }
            ],
        });
        await alert.present();
    }

}
