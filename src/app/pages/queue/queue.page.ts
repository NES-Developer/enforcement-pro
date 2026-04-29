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
import { User } from 'src/app/models/user';
import { CapacitorConfig } from '@capacitor/cli';
// import { SunmiPrinter } from '@kduma-autoid/capacitor-sunmi-printer';
import { SunmiPrinter, AlignmentModeEnum } from '@kduma-autoid/capacitor-sunmi-printer';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { BackgroundTaskService } from '../../services/background-task.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.page.html',
  styleUrls: ['./queue.page.scss'],
})
export class QueuePage implements OnInit {



    currentStep: number = 1;
    enviro_que: EnviroPost[] = [];
    enviro_que_addition: any[] = [];//xx
    baseUrl: string = 'https://app.enforcementpro.co.uk/';
    app_log: AppLog;
    isSubmitting: boolean = false;

    user: User;
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
        private sanitizer: DomSanitizer,
        private backgroundTasks: BackgroundTaskService
    ) {

        // this.auth.checkLoggedIn();

        this.app_log = new AppLog();
        this.user = new User();

        this.loadData();

        this.route2.queryParams.subscribe(params => {
            this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
        });

    }

    async ngOnInit() {

        this.loading.showLoading();

        await this.data.init();

        this.init();

        this.loading.hideLoading();
        
    }

    loadData()
    {
        this.enviro_que =  this.data.getEnviroQue();
        this.user = this.data.getUser();
        this.app_log = this.data.getAppLog();
    }

    init() {
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
        this.backgroundTasks.setInterval(() => {
            this.ping();
        }, 30000); // 30 seconds in milliseconds
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




    // postFPNTroubleShoot(enviro_post: EnviroPost)
    // {
    //     this.api
    // }
      

    refresh() {
        
        this.loadData();

        this.enviro_que = this.data.getEnviroQue();
        this.enviro_que_addition = this.enviro_que;
        for (let x=0; x<this.enviro_que.length; x++) {
            const rawHtml = `` // Assuming the raw HTML exists in ``
            this.enviro_que_addition[x] = {
                ...this.enviro_que_addition[x], // Retain existing properties
                html_bool: false, // Add html_bool
                html_string: this.sanitizer.bypassSecurityTrustHtml(rawHtml), // Add or sanitize html_string
            };
        }
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
                // console.log('Response:', response);
                
            },
            error: (error) => {
                // console.error('Error:', error);
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

    async printBase64Image(base64Data: string) {
        try {
          // Strip the data:image/png;base64, prefix if it exists
          const cleanBase64 = base64Data.includes(',') 
            ? base64Data.split(',')[1] 
            : base64Data;
      
          await SunmiPrinter.printerInit();
          
          // Using 'bitmap' as required by the interface
          await SunmiPrinter.printBitmap({
            bitmap: cleanBase64
          });
      
          await SunmiPrinter.lineWrap({ lines: 3 });
        } catch (error) {
          console.error("Base64 Print failed", error);
        }
    }

    submitFPN(enviro_post: any, print: boolean) {

      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;
      this.loading.showLoading();

      //last validation before submission
      if (enviro_post.officer_id == 0 )
      {
        enviro_post.officer_id = this.user.id;
      }

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

                    if (print == true)
                    {
                        let ticket_image = this.baseUrl + fpn.ticket;
                        this.printImageFromUrl(ticket_image);
                    }
                    
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
                    this.presentAlert('Auth Failed', 'Server has logged you off. Please Auto Login.');
                    // this.authFail(enviro_post); 
                    // this.submitFPN(enviro_post);
                } 
                else if (error.status == 0)
                {
                    if (enviro_post.offence_images.length > 1)
                    {
                        this.presentAlert('Processing', 'please Wait! Network error, we are compressing your image');
                        
                        enviro_post = this.data.spliceOffenceImageEnviroQue(enviro_post)
                        
                        this.submitFPN(enviro_post, print);


                    } else if (enviro_post.offence_images.length == 1) {
                        this.presentAlert('Network Error', 'No internet connection. Please place in que, find better reception and try again.');

                    }
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

    // Helper function to convert Blob to Base64 string
    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data:image/png;base64, prefix if the plugin requires raw base64
            resolve(base64String.split(',')[1]); 
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    }

    async printImageFromUrl(imageUrl: string) {
        try {
            // 1. Initialize the printer
            await SunmiPrinter.printerInit();
            console.log("Printer initialized...");
    
            // 2. Fetch the image via Native HTTP (Bypasses CORS)
            // We use 'arraybuffer' to get the raw binary data of the image
            const options = {
                url: imageUrl,
                responseType: 'arraybuffer' as const
            };
    
            const response: HttpResponse = await CapacitorHttp.get(options);
    
            if (response.status !== 200) {
                throw new Error(`Failed to download image. Status: ${response.status}`);
            }
    
            // 3. Convert ArrayBuffer to Base64 for the Image object
            // This allows us to load the image into a canvas for resizing
            const base64String = response.data; // CapacitorHttp returns base64 for arraybuffer
            const dataUrl = `data:image/png;base64,${base64String}`;
    
            // 4. Load the image into a hidden HTML Image element
            const img = new Image();
            img.src = dataUrl;
    
            await new Promise((resolve, reject) => {
                img.onload = () => resolve(true);
                img.onerror = (err) => reject(new Error("Canvas failed to load native image data"));
            });
    
            // 5. Setup Canvas for Resizing (Strict 384px for Sunmi 58mm)
            const canvas = document.createElement('canvas');
            const TARGET_WIDTH = 384; 
            const scaleFactor = TARGET_WIDTH / img.width;
            
            canvas.width = TARGET_WIDTH;
            canvas.height = img.height * scaleFactor;
    
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not create 2D Canvas context");
    
            // Use high-quality image smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
    
            // 6. Draw/Resize the image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
            // 7. Extract the final clean Base64 (No prefix)
            const finalBase64 = canvas.toDataURL('image/png').split(',')[1];
    
            // 8. Execute Printing
            await SunmiPrinter.setAlignment({ 
                alignment: AlignmentModeEnum.CENTER 
            });
    
            await SunmiPrinter.printBitmap({
                bitmap: finalBase64
            });
    
            // Feed paper so the user can tear it off
            await SunmiPrinter.lineWrap({ lines: 4 });
            
            console.log("Printing completed successfully");
    
        } catch (error: any) {
            console.error("Complete Print Error:", error);
            // alert("Print Error: " + (error.message || "Unknown error"));
        }
    }

    async printTicketHtml(ticketHTML: string) {
        try {
          // 1. Create a hidden container to render the HTML
          const container = document.createElement('div');
          container.style.width = '384px'; // Standard Sunmi 58mm width
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.top = '0';
          container.innerHTML = ticketHTML;
          document.body.appendChild(container);
      
          // 2. Wait a moment for images (QR/Barcode) to render
          await new Promise(resolve => setTimeout(resolve, 500));
      
          // 3. Convert HTML to Canvas
          const canvas = await html2canvas(container, {
            width: 384,
            scale: 2, // Higher scale for sharper text
            useCORS: true,
            logging: false
          });
      
          // 4. Convert Canvas to Base64 (Clean)
          const base64Data = canvas.toDataURL('image/png').split(',')[1];
      
          // 5. Cleanup the DOM
          document.body.removeChild(container);
      
          // 6. Print to Sunmi
          await SunmiPrinter.printerInit();
          await SunmiPrinter.setAlignment({ 
            alignment: AlignmentModeEnum.CENTER 
          });
        //   await SunmiPrinter.setAlignment({ alignment: 1 }); // Center
          
          await SunmiPrinter.printBitmap({
            bitmap: base64Data
          });
      
          // Feed enough paper to tear off
          await SunmiPrinter.lineWrap({ lines: 4 });
          
          console.log("Receipt printed successfully");
      
        } catch (error) {
          console.error("Printing Error:", error);
        }
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
        //   alert('Failed to save image');
          this.presentAlert('Error', 'Failed to save: ' + error);

          throw error; // Re-throw error if further handling is required
        }
    }

    editFPN(enviro_post: EnviroPost) {
        this.data.setEnviroPost(enviro_post);
        this.router.navigate(['/notebook', 0], { queryParams: { currentStep: this.currentStep } });
    }
}
