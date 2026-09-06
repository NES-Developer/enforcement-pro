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
import { Weather } from '../../models/weather';
import { Visibility } from '../../models/visibility';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { SiteOffence } from '../../models/site-offence';
import { Ethnicity } from '../../models/ethnicity';
import { LoadingService } from '../../services/loading.service';
import { User } from 'src/app/models/user';
import { CapacitorConfig } from '@capacitor/cli';
import { BackgroundTaskService } from '../../services/background-task.service';
import { TrackingService } from '../../services/tracking.service';
import { FpnSubmissionService } from '../../services/fpn-submission.service';
import { ThermalPrinterService } from '../../services/thermal-printer.service';
import { OfflineTicketService } from '../../services/offline-ticket.service';
import { QueueSyncService } from '../../services/queue-sync.service';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.page.html',
  styleUrls: ['./notebook.page.scss'],
})

export class NotebookPage implements OnInit {
    
    fpn_number: string = "";

    id: any;
    isSubmitting: boolean = false;
    currentStep: number = 1;
    enviro_post: EnviroPost;
    notebook_entries: NotebookEntry; 
    app_log: AppLog;
    user: User;

    baseUrl: string = 'https://app.enforcementpro.co.uk/';

    get ethnicities(): Ethnicity[] {
        return this.data.getEthnicities() || [];
    }

    get weather(): Weather[] {
        return this.data.getWeather() || [];
    }

    get visibility(): Visibility[] {
        return this.data.getVisibility() || [];
    }

    get builds(): Build[] {
        return this.data.getBuilds() || [];
    }

    get hair_colours(): HairColour[] {
        return this.data.getHairColours() || [];
    }

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private route2: ActivatedRoute,
        private router: Router,
        private loading: LoadingService,
        private backgroundTasks: BackgroundTaskService,
        private tracking: TrackingService,
        private fpnSubmission: FpnSubmissionService,
        private printer: ThermalPrinterService,
        private offlineTicket: OfflineTicketService,
        private queueSync: QueueSyncService,
    ) 
    {

        this.user = new User();
        this.enviro_post = new EnviroPost();
        this.enviro_post.notebook_entries = new NotebookEntry();
        this.notebook_entries = new NotebookEntry();
        this.app_log = new AppLog();

        this.loadData();

        this.id = this.route2.snapshot.paramMap.get('id');

        if (this.id == 0)
        {
            if (this.enviro_post.notebook_entries !== undefined || this.enviro_post.notebook_entries !== null) 
            {
                this.notebook_entries = this.enviro_post.notebook_entries;
            }

            this.route2.queryParams.subscribe(params => {
                this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
            });

        } else
        {
            this.route2.queryParams.subscribe(params => {
                this.fpn_number = params['fpn_number']; // Fallback to null if not present
            });
        }
        
     }

    async ngOnInit() {
        await this.data.init();
        this.init();
    
    }

    ping() {
        this.tracking.pingNow().catch(() => undefined);
    }

    init()
    {
        this.backgroundTasks.setInterval(() => {
            this.refresh();
        }, 5000);

        this.backgroundTasks.setInterval(() => {
            this.ping();
        }, 30000);
    }

    loadData() {
        this.app_log = this.data.getAppLog() || new AppLog();
        this.enviro_post =  this.data.getEnviroPost();
        this.user = this.data.getUser();                

        if (!this.data.checkFPNData()){
            this.getFPNData();
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
        if (this.notebook_entries.gender == '') {
            this.presentAlert('Wait!', 'Please provide offender Gender.');
            return false;
        }
        if (this.notebook_entries.visibility_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Visibility.');
            return false;
        }
        if (this.notebook_entries.weather_id <= 0) {
            this.presentAlert('Wait!', 'Please provide Weather.');
            return false;
        }
        if (this.notebook_entries.ethnicity_id <= 0) {
            this.presentAlert('Wait!', 'Please provide offender Ethnicity.');
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

        if (route == "/queue")
        {
            this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
        } 
        else
        {
            this.router.navigate([route]);
        }
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

    async printImageFromUrl(imageUrl: string) {
        try {
            await this.printer.printImage(imageUrl);
            console.log("Printing completed successfully");
        } catch (error: any) {
            console.error("Complete Print Error:", error);
            this.presentAlert('Print Error', error?.message || 'Unable to print ticket.');
        }
    }

    submitFpn(print: boolean) {
        if (this.isSubmitting) {
            return;
        }

        let checker = this.validator();

        if (checker) {

            this.isSubmitting = true;
            this.loading.showLoading();

            this.fpnSubmission.submit(this.enviro_post)
                .then((result) => {
                    this.loading.hideLoading();
                    this.isSubmitting = false;

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

                        this.data.spliceEnviroQue(this.enviro_post);
                        this.enviro_post = new EnviroPost();
                        this.data.setEnviroPost(this.enviro_post);
                        this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + '. FPN number has been copied to your clipboard.');

                        this.route('/dashboard');
                        return;
                    }

                    if (result.status === 'queued') {
                        if (print && !result.message.includes('already uploading')) {
                            this.offlineTicket.printFor(this.enviro_post).catch(() => undefined);
                        }
                        this.queueSync.start();
                        this.presentAlert('Queued', result.message);
                        this.route('/queue');
                        return;
                    }

                    this.presentAlert(result.status === 'blocked' ? 'Patrol Required' : 'Error', result.message);
                })
                .catch((error: any) => {
                    this.loading.hideLoading();
                    this.isSubmitting = false;
                    this.presentAlert('Error', error?.message || 'Unable to submit FPN.');
                });
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

    submitForm () {
        if (this.isSubmitting) {
            return;
        }

        let checker = this.validator();

        if (checker)
        {
            this.isSubmitting = true;
            this.loading.showLoading();

            this.notebook_entries.enviro_id = this.id;
            this.api.postNoteBook(this.notebook_entries).subscribe({
                next: (response) => {
                    this.loading.showLoading();

                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";
                        this.isSubmitting = false;
                        this.presentAlert('Error', message);
                    } else {
                        this.isSubmitting = false;
                        this.presentAlert('Success', 'Notebook entry captured');
                        this.route('/dashboard');
                        
                    }
                }, error: (error) => {

                    this.loading.hideLoading();

                    if (error.status == 500)
                    {
                        this.presentAlert('Server Error', 'Please place in que and report error.');
                    } 
                    else if (error.status == 401) {
                        this.presentAlert('Auth Failed', 'Please login again.');
                    } 
                    else if (error.status == 0)
                    {
                        
                        this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');

                    } 
                    else 
                    {
                        this.presentAlert('Error', error.message);
                    }   
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
            
        });
        await alert.present();
    }

    refresh() {
        // this.loading.showLoading();
        this.loadData();
        // this.loading.hideLoading();
        // window.location.reload();
    }

    getFPNData(): void {
        let site: any = this.data.getSelectedSite();
        let site_id: number = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                this.data.applyFPNData(data);
            },
            error: (error) => {
                // this.loadData();

                if (error.status == 500)
                {
                    this.presentAlert('Server Error', 'Please report error.');
                } 
                else if (error.status == 0)
                {
                    this.presentAlert('Network Error', 'No internet connection. Please find better reception and try again.');
                } 
                else 
                {
                    this.presentAlert('Error', error.message);
                }             
            }
        });
    }

    extractOffence(site_offences: SiteOffence[]): Offence[] {
        const groups = site_offences.map(site_offence => site_offence.offences);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as Offence);
    }

    extractOffenceGroups(offences: Offence[]): OffenceGroup[] {
        const groups = offences.map(offence => offence.offenceGroup);
        return Array.from(new Set(groups.map(group => group.id)))
          .map(id => groups.find(group => group.id === id) as OffenceGroup);
    }

}
