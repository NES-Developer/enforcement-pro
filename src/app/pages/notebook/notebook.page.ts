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
import { POIPrefix } from '../../models/poi-prefix';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { SiteOffence } from '../../models/site-offence';
import { Ethnicity } from '../../models/ethnicity';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.page.html',
  styleUrls: ['./notebook.page.scss'],
})

export class NotebookPage implements OnInit {
    
    id: any;
    isSubmitting: boolean = false;
    currentStep: number = 1;
    enviro_post: EnviroPost;
    notebook_entries: NotebookEntry; 
    app_log: AppLog;
    fpn_number: string = "";
    ethnicities: Ethnicity[] = [];
    weather: Weather[] = [];
    visibility: Visibility[] = [];

    builds: Build[] = [];
    hair_colours: HairColour[] = [];

    constructor(
        private auth: AuthService,
        private data: DataService,
        private api: ApiService,
        private alertController: AlertController,
        private route2: ActivatedRoute,
        private router: Router,
        private loading: LoadingService,
    ) 
    {

        this.notebook_entries = new NotebookEntry();
        this.enviro_post = new EnviroPost();

        this.id = this.route2.snapshot.paramMap.get('id');

        if (!this.data.checkFPNData()){
            this.getFPNData();
        }

        this.loadData();

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

            if (this.enviro_post.hair > 0 && this.enviro_post.is_fpn_advised !== '' && this.enviro_post.is_fpn_handed !== '' && this.enviro_post.gender !== '' && this.enviro_post.ethnicity_id > 0)
            {
                this.dettachNotebook(0);
            }
            else{
                
            }

            this.route2.queryParams.subscribe(params => {
                this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
            });


        } else
        {
            // this.notebook_entries = new NotebookEntry();
            // this.enviro_post = new EnviroPost();

            // console.log(this.id);

            // this.notebook_entries.enviro_id = this.id;
            this.notebook_entries.enviro_id = parseInt(this.id);


            this.route2.queryParams.subscribe(params => {
                this.fpn_number = params['fpn_number']; // Fallback to null if not present
            });
        }
        
        this.app_log = new AppLog();

    }

    ngOnInit(): void {

        
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

    dettachNotebook(index: number) {
        switch (index) {
            case 0:
                //Inital load enviro data in the notebook entry data
                this.notebook_entries.is_fpn_advised = this.enviro_post.is_fpn_advised;
                this.notebook_entries.is_fpn_handed = this.enviro_post.is_fpn_handed;
                this.notebook_entries.height_in_feet = this.enviro_post.height_in_feet;
                this.notebook_entries.height_in_inch = this.enviro_post.height_in_inch;
                this.notebook_entries.gender = this.enviro_post.gender;
                this.notebook_entries.ethnicity_id = this.enviro_post.ethnicity_id;
                this.notebook_entries.caution = this.enviro_post.caution;
                this.notebook_entries.second_caution = this.enviro_post.second_caution;
                this.notebook_entries.visibility_id = this.enviro_post.visibility_id;;
                this.notebook_entries.weather_id = this.enviro_post.weather_id;;
                this.notebook_entries.witness_name = this.enviro_post.witness_name;
                this.notebook_entries.witness_phone = this.enviro_post.witness_phone;
                this.notebook_entries.witness_address = this.enviro_post.witness_address;
                this.notebook_entries.witness_statement = this.enviro_post.witness_statement;
                this.notebook_entries.officer_statement = this.enviro_post.officer_statement;
                this.notebook_entries.is_witness_available = this.enviro_post.is_witness_available;
                this.notebook_entries.build = this.enviro_post.build;
                this.notebook_entries.hair = this.enviro_post.hair;;
                this.notebook_entries.distance_from_offender = this.enviro_post.distance_from_offender;
                this.notebook_entries.distinguishing_features = this.enviro_post.distinguishing_features;
                this.notebook_entries.have_reason = this.enviro_post.have_reason;
                this.notebook_entries.nearest_bin = this.enviro_post.nearest_bin;
                this.notebook_entries.were = this.enviro_post.were;
                this.notebook_entries.did = this.enviro_post.did;
                this.notebook_entries.police_comments = this.enviro_post.police_comments;
                this.notebook_entries.offender_comments = this.enviro_post.offender_comments;
                this.notebook_entries.bwv_assest = this.enviro_post.bwv_assest;
                break;
            case 1:
                //Move the notebook entry back enviro when its time to submit, Enviro Post only
                this.enviro_post.is_fpn_advised = this.notebook_entries.is_fpn_advised;
                this.enviro_post.is_fpn_handed = this.notebook_entries.is_fpn_handed;
                this.enviro_post.height_in_feet = this.notebook_entries.height_in_feet;
                this.enviro_post.height_in_inch = this.notebook_entries.height_in_inch;
                this.enviro_post.gender = this.notebook_entries.gender;
                this.enviro_post.ethnicity_id = this.notebook_entries.ethnicity_id;
                this.enviro_post.caution = this.notebook_entries.caution;
                this.enviro_post.second_caution = this.notebook_entries.second_caution;
                this.enviro_post.visibility_id = this.notebook_entries.visibility_id;;
                this.enviro_post.weather_id = this.notebook_entries.weather_id;;
                this.enviro_post.witness_name = this.notebook_entries.witness_name;
                this.enviro_post.witness_phone = this.notebook_entries.witness_phone;
                this.enviro_post.witness_address = this.notebook_entries.witness_address;
                this.enviro_post.witness_statement = this.notebook_entries.witness_statement;
                this.enviro_post.officer_statement = this.notebook_entries.officer_statement;
                this.enviro_post.is_witness_available = this.notebook_entries.is_witness_available;
                this.enviro_post.build = this.notebook_entries.build;
                this.enviro_post.hair = this.notebook_entries.hair;;
                this.enviro_post.distance_from_offender = this.notebook_entries.distance_from_offender;
                this.enviro_post.distinguishing_features = this.notebook_entries.distinguishing_features;
                this.enviro_post.have_reason = this.notebook_entries.have_reason;
                this.enviro_post.nearest_bin = this.notebook_entries.nearest_bin;
                this.enviro_post.were = this.notebook_entries.were;
                this.enviro_post.did = this.notebook_entries.did;
                this.enviro_post.police_comments = this.notebook_entries.police_comments;
                this.enviro_post.offender_comments = this.notebook_entries.offender_comments;
                this.enviro_post.bwv_assest = this.notebook_entries.bwv_assest;
                break;

        }
        
    }

    loadData() {
        this.loading.showLoading();

        this.app_log = this.data.getAppLog();
        this.builds = this.data.getBuilds();
        this.hair_colours = this.data.getHairColours();
        this.enviro_post =  this.data.getEnviroPost();
        this.ethnicities = this.data.getEthnicities();
        this.weather = this.data.getWeather();
        this.visibility = this.data.getVisibility();

        this.ping();
        setInterval(() => {
            this.ping();
        }, 60000); // 1 minutes in milliseconds

        this.loading.hideLoading();
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
        
        // console.log(this.enviro_post.notebook_entries);
        return true;
    }

    route(route: string) {
        if (this.id == 0)
        {
            this.enviro_post = new EnviroPost();
            this.data.setEnviroPost(this.enviro_post);
        }

        if (route == "/fpn/queue")
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
            if (this.notebook_entries.hair > 0 && this.notebook_entries.is_fpn_advised !== '' && this.notebook_entries.is_fpn_handed !== '' && this.notebook_entries.gender !== '' && this.notebook_entries.ethnicity_id > 0)
            {
                this.dettachNotebook(1);
                this.data.setEnviroPost(this.enviro_post);
            }
        }
    }

    submitFpn() {
        // alert(1);
        if (this.isSubmitting) {
            return;
        }

        this.saveEnviroData();

        let checker = this.validator();

        if (checker) {

            this.loading.showLoading();

            this.dettachNotebook(1);

            console.log(this.enviro_post, this.notebook_entries);

            this.isSubmitting = true;

            this.api.postFPN(this.enviro_post).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";
                        this.isSubmitting = false;
                        this.loading.hideLoading();

                        this.presentAlert('Error', message);
                    } else {                        
                        let fpn = response.data;    

                        //Check if FPN Number came from app
                        // let enviro_que = this.data.getEnviroQue();
                        // const index = enviro_que.indexOf(this.enviro_post);
                        // console.log(index);
                        // let fpn_numbers_and_barcode = this.data.getFPNNumberOfflinePrinter();
                        // let first_fpn_number = fpn_numbers_and_barcode[index].fpn_number;
                        // if (first_fpn_number = fpn.fpn_number)
                        // {
                        //     this.data.spliceFPNNumberOfflinePrinter(fpn_numbers_and_barcode[index]);
                        // }

                        Clipboard.write({
                            string: fpn.fpn_number
                        });
                        
                        this.data.spliceEnviroQue(this.enviro_post);
                        this.enviro_post = new EnviroPost();
                        this.data.setEnviroPost(this.enviro_post);
                        this.loading.hideLoading();

                        this.presentAlert('Success', 'Successfully posted FPN. FPN Number: ' + fpn.fpn_number + ' has been copied to your clipboard.');

                        this.route('/tabs/fpn');
                    }
                },
                error: (error) => {
                    if (error.message == 'Http failure response for https://app.enforcementpro.co.uk/api/app/enviro1: 0 Unknown Error')
                    {
                        this.presentAlert('Error', 'Please check your internet connection or try again later.')
                    } else {
                        this.presentAlert('Error', error.message)
                    }
                    console.log(error.message);
                }
            });
        }
    }

    submitForm () {
        if (this.isSubmitting) {
            return;
        }//Nemo

        let checker = this.validator();

        if (checker)
        {
            this.isSubmitting = true;

            this.loading.showLoading();

            this.notebook_entries.enviro_id = this.id;
            this.api.postNoteBook(this.notebook_entries).subscribe({
                next: (response) => {
                    console.log('Response:', response);
                    // Handle the response here
                    if(response.success === false) 
                    {
                        let message = response.message + " (Please Edit)";
                        this.isSubmitting = false;
                        this.loading.hideLoading();

                        this.presentAlert('Error', message);
                    } else {
                        this.isSubmitting = false;
                        this.loading.hideLoading();
                        this.route('');
                        // this.router.navigate(['']);


                        this.presentAlert('Success', 'Notebook entry captured');
                        window.location.reload();
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

    async refresh() {
        this.loading.showLoading();
        this.getFPNData();
        this.loading.hideLoading();
        window.location.reload();
    }

    getFPNData(): void {
        this.loading.showLoading();

        let site: any = this.data.getSelectedSite();
        let site_id: number = site.id;
        this.api.getFPNData(site_id).subscribe({
            next: (data) => {
                this.data.removeEnviroLookUps()

                let salutations = data.data.salutations;
                this.data.setSalutations(salutations);

                this.builds = data.data.builds;
                this.data.setBuilds(this.builds);

                this.hair_colours = data.data.hair_colors;//Please leave spelling as is, returned as 'hair_colors' app uses it as 'hair_colours'
                this.data.setHairColors(this.hair_colours);

                let zones = data.data.zones;
                this.data.setZones(zones);

                let offence_how = data.data.offence_how;
                this.data.setOffenceHow(offence_how);

                let offence_location_suffix = data.data.offence_location_suffix;
                this.data.setOffenceLocationSuffix(offence_location_suffix);

                let address_verified_by = data.data.address_verified_via;
                this.data.setAddressVerifiedBy(address_verified_by);

                this.ethnicities = data.data.ethnicities;
                this.data.setEthnicities(this.ethnicities);

                let id_shown = data.data.id_shown;
                this.data.setIdShown(id_shown);

                this.weather = data.data.weathers;
                this.data.setWeather(this.weather);

                this.visibility = data.data.visibility;
                this.data.setVisibility(this.visibility);

                let poi_prefix: POIPrefix[] = data.data.poi_prefix;
                this.data.setPOIPrefix(poi_prefix);

                let site_offence = data.data.site_offences;
                this.data.setSiteOffences(site_offence);

                let offences = this.extractOffence(site_offence);
                this.data.setOffences(offences);

                let offenceGroups = this.extractOffenceGroups(offences);
                this.data.setOffenceGroups(offenceGroups);

                this.loading.hideLoading();


            },
            error: (error) => {
                this.loadData();

                this.loading.hideLoading();

                console.error('Error fetching FPN Data:', error + '. Try see if the backup loader worked.');
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
