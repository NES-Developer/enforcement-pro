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
import { BackgroundTaskService } from '../../services/background-task.service';
import { FpnSubmissionService } from '../../services/fpn-submission.service';
import { PatrolService } from '../../services/patrol.service';
import { TrackingService } from '../../services/tracking.service';
import { ThermalPrinterService } from '../../services/thermal-printer.service';
import { OfflineTicketService } from '../../services/offline-ticket.service';
import { QueueSyncService } from '../../services/queue-sync.service';
import { enviroStepperStep, findFirstMissingFpnField } from '../../helpers/fpn-core-validation';

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
        private backgroundTasks: BackgroundTaskService,
        private fpnSubmission: FpnSubmissionService,
        private patrol: PatrolService,
        private tracking: TrackingService,
        private printer: ThermalPrinterService,
        private offlineTicket: OfflineTicketService,
        private queueSync: QueueSyncService
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

        if (!this.patrol.canUseFpnTools()) {
            this.loading.hideLoading();
            this.presentAlert('Patrol Required', 'Start patrol from the dashboard before using the queue.');
            this.router.navigate(['/dashboard']);
            return;
        }

        this.init();

        this.loading.hideLoading();
        
    }

    loadData()
    {
        this.enviro_que =  this.data.getEnviroQue();
        this.user = this.data.getUser();
        this.app_log = this.data.getAppLog() || new AppLog();
    }

    init() {
        this.hydrateQueueItems();

        this.ping();
        this.queueSync.start();
        this.backgroundTasks.setInterval(() => {
            this.ping();
            this.queueSync.flush().catch(() => undefined);
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
        this.hydrateQueueItems();
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
        this.tracking.pingNow().catch(() => undefined);
    }

    route (route: string) {
        const target = route === '/tabs/fpn' ? '/enviro' : route;

        if (target === '/enviro') {
            this.router.navigate([target], { queryParams: { currentStep: this.currentStep } });
            return;
        }

        this.router.navigate([target]);
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
          await this.printer.printBase64Image(base64Data);
        } catch (error) {
          console.error("Base64 Print failed", error);
        }
    }

    submitFPN(enviro_post: any, print: boolean) {

      if (this.isSubmitting) {
        return;
      }

      const gap = findFirstMissingFpnField(enviro_post, {
        requireZone: this.data.getZones().length > 0,
      });
      if (gap) {
        this.presentAlert('Wait!', gap.message);
        this.editFPN(enviro_post);
        return;
      }

      this.isSubmitting = true;
      this.loading.showLoading();

      if (enviro_post.officer_id == 0 )
      {
        enviro_post.officer_id = this.user.id;
      }

      this.fpnSubmission.submit(enviro_post)
        .then((result) => {
            this.isSubmitting = false;
            this.loading.hideLoading();

            if (result.status === 'posted') {
                let fpn = result.response.data;

                Clipboard.write({
                    string: fpn.fpn_number
                });

                if (print == true && fpn.ticket)
                {
                    let ticket_image = this.baseUrl + fpn.ticket;
                    this.printImageFromUrl(ticket_image);
                }

                this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + ' has been copied to your clipboard.');
                this.data.spliceEnviroQue(enviro_post);
                this.refresh();
                return;
            }

            if (result.status === 'queued') {
                if (print) {
                    this.offlineTicket.printFor(enviro_post).catch(() => undefined);
                }
                this.queueSync.start();
                this.refresh();
                return;
            }

            this.presentAlert(result.status === 'blocked' ? 'Patrol Required' : 'Error', result.message);
        })
        .catch((error: any) => {
            this.isSubmitting = false;
            this.loading.hideLoading();
            this.presentAlert('Error', error?.message || 'Unable to submit queued FPN.');
        });
    }
    

    generateTicket(enviro_post: EnviroPost) {
        this.prepareOfflineTicket(enviro_post);
    }

    private hydrateQueueItems() {
        this.enviro_que_addition = this.enviro_que.map((enviro_post) => {
            const ticketHtml = this.buildTicketHtml(enviro_post);
            return {
                ...enviro_post,
                ticket_html: ticketHtml,
                html_bool: false,
                html_string: this.sanitizer.bypassSecurityTrustHtml(ticketHtml || ''),
            };
        });
    }

    private buildTicketHtml(enviro_post: EnviroPost): string {
        try {
            const ticket = this.ticket.generateWelcomeTicket(enviro_post);
            return ticket === 'refresh' ? '' : ticket;
        } catch {
            return '';
        }
    }

    private ticketHtml(enviro_post: any): string | null {
        if (typeof enviro_post?.ticket_html === 'string' && enviro_post.ticket_html) {
            return enviro_post.ticket_html;
        }

        return null;
    }

    private prepareOfflineTicket(enviro_post: any): string | null {
        let ticket = this.ticketHtml(enviro_post) || this.buildTicketHtml(enviro_post);

        if (!ticket) {
            this.presentAlert('Error', 'Please find Network and get latest data. To regenerate new FPN Numbers');
            return null;
        }

        for (let x = 0; x < this.enviro_que_addition.length; x++) {
            if (this.enviro_que_addition[x] === enviro_post) {
                this.enviro_que_addition[x].ticket_html = ticket;
                this.enviro_que_addition[x].html_bool = true;
                this.enviro_que_addition[x].html_string = this.sanitizer.bypassSecurityTrustHtml(ticket);
            } else {
                this.enviro_que_addition[x].html_bool = false;
            }
        }

        return ticket;
    }

    async printOfflineTicket(enviro_post: any) {
        if (this.isSubmitting) {
            return;
        }

        const ticket = this.ticketHtml(enviro_post) || this.prepareOfflineTicket(enviro_post);

        if (!ticket) {
            return;
        }

        this.isSubmitting = true;
        this.loading.showLoading();

        try {
            await this.offlineTicket.printHtml(ticket);
            this.presentAlert('Success', 'Ticket printed successfully.');
        } catch (error: any) {
            this.presentAlert('Print Error', error?.message || 'Unable to print ticket.');
        } finally {
            this.isSubmitting = false;
            this.loading.hideLoading();
        }
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
            await this.printer.printImage(imageUrl);
            console.log("Printing completed successfully");
        } catch (error: any) {
            console.error("Complete Print Error:", error);
            this.presentAlert('Print Error', error?.message || 'Unable to print ticket.');
        }
    }

    async printTicketHtml(ticketHTML: string) {
        let container: HTMLDivElement | null = null;

        try {
          // 1. Create a hidden container to render the HTML
          container = document.createElement('div');
          container.style.width = '384px'; // Standard Sunmi 58mm width
          container.style.position = 'absolute';
          container.style.left = '-9999px';
          container.style.top = '0';
          container.style.background = '#ffffff';
          container.style.color = '#000000';
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
      
          await this.printer.printBase64Image(base64Data);
          
          console.log("Receipt printed successfully");
      
        } catch (error) {
          console.error("Printing Error:", error);
          throw error;
        } finally {
          if (container?.parentNode) {
            document.body.removeChild(container);
          }
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
                this.presentAlert('Success', 'Ticket image saved successfully.');

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

                    this.presentAlert('Success', 'Ticket image saved successfully.');
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
        const draft = { ...enviro_post } as any;
        delete draft.html_bool;
        delete draft.html_string;
        delete draft.ticket_html;

        this.data.setEnviroPost(draft);
        this.router.navigate(['/enviro'], {
            queryParams: {
                currentStep: enviroStepperStep(draft, {
                    requireZone: this.data.getZones().length > 0,
                }),
            },
        });
    }

    queueStatus(enviro_post: EnviroPost): string {
        if (enviro_post.enviro_id && enviro_post.offence_images?.length) {
            return `Held — ${enviro_post.offence_images.length} photo(s) still to upload`;
        }

        if (enviro_post.offence_images?.length) {
            return `Ready for submission · ${enviro_post.offence_images.length} photo(s)`;
        }

        return 'Ready for submission';
    }
}
