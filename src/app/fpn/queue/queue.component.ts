import { Component, OnInit } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ApiService } from '../../services/enforcementpro/api.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { AppLog } from '../../models/app-log';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LoadingService } from '../../services/loading.service';
import { AuthService } from '../../services/enforcementpro/auth.service';
import { TicketService } from 'src/app/Service/ticket.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

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

        this.auth.checkLoggedIn();

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
        }, 60000); // 1 minutes in milliseconds
    }

    async exportEnviroQue(enviro_post: any) {
        try {
          const jsonData = JSON.stringify(enviro_post, null, 2);
      
          const now = new Date();
          const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
            .getHours()
            .toString()
            .padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
      
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
      
        //   console.log('✅ File saved:', result.uri);
          this.presentAlert('Success', `Saved to Documents/${folderName}`);
          console.log(enviro_post);
      
        } catch (error) {
        //   console.error('❌ Error saving file:', error);
          this.presentAlert('Error', 'Failed to export file: ' + error);
        }
    }


    async clearFPNFolder() {
        const folderName = 'FPNs';
      
        try {
          // List files in FPNs folder
          const listResult = await Filesystem.readdir({
            path: folderName,
            directory: Directory.Documents,
          });
      
          // Accepts both forms: { files: ['file.json', ...] } or { files: [{ name: 'file.json' }, ...] }
          const files =
            Array.isArray(listResult.files) && listResult.files.length > 0
              ? typeof listResult.files[0] === 'string'
                ? listResult.files
                : listResult.files.map((f: any) => f.name)
              : [];
      
          if (files.length === 0) {
            this.presentAlert('Info', 'FPNs folder exists but is already empty.');
            return;
          }
      
          // Delete each file found
          for (const fileName of files) {
            await Filesystem.deleteFile({
              path: `${folderName}/${fileName}`,
              directory: Directory.Documents,
            });
          }
      
          this.presentAlert('Success', 'Troubleshoot Phase 1, a Success.');
        } catch (error: any) {
            if (
                error.message?.toLowerCase().includes('does not exist') ||
                error.message?.toLowerCase().includes('not found')
            ) {
                this.presentAlert('Info', 'FPNs folder does not exist.');
            } else {
                this.presentAlert('Error', 'Failed to clear FPNs folder: ' + error);
            }
        }
    }

    // postFPNTroubleShoot(enviro_post: EnviroPost)
    // {
    //     this.api
    // }
      

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

    submitFPN(enviro_post: any) {

      if (this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;
      this.loading.showLoading();

      this.api.postFPN(enviro_post).subscribe({
          next: (response) => {

              console.log(1, response);

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

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please place in que and report error.');
                } 
                else if (error.status == 401) {
                    this.presentAlert('Wait', 'We are auto-logging you in. Please wait.');
                    this.auth.autoLogin(); 
                    this.submitFPN(enviro_post);
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please place in que, find better reception and try again.');
                } 
                else 
                {
                    this.presentAlert('Error', error.message);
                } 
          }
      });
}
    

    generateTicket(enviro_post: EnviroPost) {


        let ticket = this.ticket.generateWelcomeTicket(enviro_post);
         
        if (ticket == "refresh") {
            this.presentAlert('Error', 'Please find Network and get latest data. To regenerate new FPN Numbers');

        }

        for (let x = 0; x<this.enviro_que_addition.length; x++) {
            if (this.enviro_que_addition[x] == enviro_post) {
                this.enviro_que_addition[x].html_bool = true;
                this.enviro_que_addition[x].html_string = ticket;
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
