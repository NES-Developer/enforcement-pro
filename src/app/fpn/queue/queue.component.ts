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
import html2canvas from 'html2canvas';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { FilesystemDirectory } from '@capacitor/filesystem';

// import { Http } from '@capacitor/http';


@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'], 
})
export class QueueComponent  implements OnInit {

    currentStep: number = 1;
    enviro_que: EnviroPost[] = [];
    enviro_que_addition: any[] = [];//xx
    baseUrl: string = 'https://app.enforcementpro.co.uk/';
    app_log: AppLog;
    isSubmitting: boolean = false;

    html_bool: boolean = false;//xx
    html_string: SafeHtml = "";//xx

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

    // async saveDataAsJson() {
    //     if (!Capacitor.isNativePlatform()) {
    //         //   console.warn('Run this on a real device.');
    //         const jsonData = JSON.stringify(this.enviro_que, null, 2);
    //         const fileName = `enviro_que_${new Date().toISOString()}.json`;

    //         this.downloadFileWeb(jsonData, fileName);
    //         this.presentAlert('Success', 'Successfully captured que, please print and navigate to installer.');

    //         return;
    //     }
      
    //     const data = this.enviro_que;
      
    //     const now = new Date();
    //     const timestamp = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
        
    //     const fileName = `enviro_que_${timestamp}.json`;

    //     try {
    //         await Filesystem.writeFile({
    //             path: fileName,
    //             data: JSON.stringify(data),
    //             directory: Directory.Documents, // Or Directory.External for Android
    //             encoding: Encoding.UTF8
    //         });

    //         this.presentAlert('Success', 'Successfully captured que, please print and navigate to installer.');

      
    //     //   console.log(`✅ File saved to Documents/${fileName}`);
    //     } catch (error) {
    //         this.presentAlert('Error', 'Failed to capture image');

    //     //   console.error('❌ Failed to write file:', error);
    //     }
    // }

    loadData() {
        this.enviro_que =  this.data.getEnviroQue();

        //This code below is intended to support Generating of tickets
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

    async exportEnviroQue(enviro_post: any) {
        try {
          const jsonData = JSON.stringify(enviro_post, null, 2);
      
          // 📆 Timestamp for filename
          const now = new Date();
          const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
            .getHours()
            .toString()
            .padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
      
          // 👤 Use first_name + last_name in filename
          const safeFirstName = (enviro_post.first_name || 'unknown').replace(/\s+/g, '_');
          const safeLastName = (enviro_post.last_name || 'user').replace(/\s+/g, '_');
          const fileName = `${safeFirstName}_${safeLastName}_${timestamp}.json`;
      
          const folderName = 'FPNs';
          const fullPath = `${folderName}/${fileName}`;
      
          // ✅ Check if FPNs folder exists
          try {
            await Filesystem.stat({
              path: folderName,
              directory: Directory.Documents,
            });
            console.log('📁 FPNs folder exists');
          } catch (folderErr: any) {
            if (folderErr.message?.includes('does not exist')) {
              console.log('📁 Creating FPNs folder...');
              await Filesystem.mkdir({
                path: folderName,
                directory: Directory.Documents,
                recursive: true,
              });
            } else {
              throw folderErr; // rethrow unexpected errors
            }
          }
      
          // ✅ Write or overwrite the file
          const result = await Filesystem.writeFile({
            path: fullPath,
            data: jsonData,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
      
          console.log('✅ File saved:', result.uri);
          this.presentAlert('Success', `Saved to Documents/${folderName}`);
          console.log(enviro_post);
      
        } catch (error) {
          console.error('❌ Error saving file:', error);
          this.presentAlert('Error', 'Failed to export file: ' + error);
        }
    }
      

    refresh() {
        window.location.reload();
    }
    
    // Web: Trigger file download in the browser
    downloadFileWeb(data: string, fileName: string) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    submitFPN(enviro_post: any) {
        if (this.isSubmitting) {
            return;
        }

        this.isSubmitting = true;
        this.loading.showLoading();

        enviro_post = enviro_post.map((item: any) => {
            const cleaned = { ...item };
            delete cleaned.html_bool;
            delete cleaned.html_string;
            return cleaned;
        });

        this.api.postFPN(enviro_post).subscribe({
            next: (response) => {

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
                // console.log(2, error);

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
            if (this.currentStep ) {
                this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });

            } else {
                this.router.navigate(['']);
            }
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

    generateTicket(enviro_post: EnviroPost) {

        let ticket = this.ticket.generateWelcomeTicket(enviro_post);//Nemo

        for (let x = 0; x<this.enviro_que_addition.length; x++) {
            if (this.enviro_que_addition[x] == enviro_post) {
                this.enviro_que_addition[x].html_bool = true;
                this.enviro_que_addition[x].html_string = ticket;
                // index = x;
            }
            else {
                this.enviro_que_addition[x].html_bool = false;
            }
        }

        Clipboard.write({
            string: ticket
        });
    }

    copyTicketToClipboard(enviro_post: any) {

        this.isSubmitting = true;
        this.loading.showLoading();

        const element = document.getElementById('html_ticket');

        if (element) {
          toPng(element)
            .then((dataUrl) => {
                console.log(dataUrl.toString());
                Clipboard.write({
                    string: dataUrl.toString()
                });


                for (let x = 0; x<this.enviro_que_addition.length; x++) { 
                    if (this.enviro_que_addition[x] == enviro_post) 
                    {
                        this.enviro_que_addition[x].html_string = dataUrl.toString();

                    }
                    this.enviro_que_addition[x].html_bool = false;
                }

                this.isSubmitting = false;
                this.loading.hideLoading();
                this.saveBase64Image(dataUrl, 'ticket_offline.png');
                this.presentAlert('Success', 'Successfully copied Ticket, navigate to Printer');

                // this.presentAlert('Success', 'Successfully copied Ticket, navigate to Printer');
            //   enviro_post.html_string = dataUrl; // Set base64 image as the new html_string
            })
            .catch((error) => {

                //Backup
                html2canvas(element).then((canvas) => {
                    const dataUrl = canvas.toDataURL('image/png');
                    console.log('Generated Image URL:', dataUrl);

                    Clipboard.write({
                        string: dataUrl.toString()
                    });

                    this.isSubmitting = false;
                    this.loading.hideLoading();
                    this.saveBase64Image(dataUrl, 'ticket_offline.png');

                    // this.presentAlert('Success', 'Successfully copied Ticket, navigate to Printer');
                    // Add your clipboard or saving logic here
                }).catch((error2) => {
                    this.isSubmitting = false;
                    this.loading.hideLoading();
                    console.log(error, error2, error.message, error2.message);
                    this.presentAlert('Error', '2 Error generating image:' + error2.message);
                });
                

                // console.error('Error generating image:', error);
            });
        } else {

            this.isSubmitting = false;
            this.loading.hideLoading();
            this.presentAlert('Error', 'Error element not found');

        }
    }

    async saveBase64Image(base64Data: string, fileName: string) {
        try {
          const savedFile = await Filesystem.writeFile({
            path: `Download/${fileName}`, // Path and file name
            data: base64Data, // Base64 string
            directory: Directory.External, // Save to external storage
          });
      
          console.log('File saved:', savedFile.uri);
        //   alert('Image saved at: ' + savedFile.uri);
          this.presentAlert('Success', 'Image saved at: ' + savedFile.uri);

          return savedFile.uri; // Return the file URI if needed
        } catch (error) {
          console.error('Error saving file:', error);
          alert('Failed to save image');
          this.presentAlert('Error', 'Failed to save: ' + error);

          throw error; // Re-throw error if further handling is required
        }
    }

    editFPN(enviro_post: EnviroPost) {
        this.data.setEnviroPost(enviro_post);
        this.router.navigate(['/notebook', 0], { queryParams: { currentStep: this.currentStep } });
    }
}
