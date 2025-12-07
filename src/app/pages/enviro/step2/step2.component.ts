import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceRequest } from '../../../models/service-request';
import { ApiService } from '../../../services/enforcementpro/api.service';
import { AuthService } from '../../../services/enforcementpro/auth.service';
import { DataService } from '../../../services/enforcementpro/data.service';
import { OffenceGroup } from '../../../models/offence-group';
import { Offence } from '../../../models/offence';
import { FormGroup } from '@angular/forms';
import { SiteOffence } from '../../../models/site-offence';
import { AddressVerifiedBy } from '../../../models/address-verified-by';
import { IDShown } from 'src/app/models/id-shown';
import { OffenceLocationSuffix } from 'src/app/models/offence-location-suffix';
import { OffenceHow } from 'src/app/models/offence-how'
import { EnviroPost } from '../../../models/enviro';
import { Salutation } from '../../../models/salutation';
import { Zone } from '../../../models/zone'; 
import { UpperCaseWords } from 'src/app/helpers/utils'
import { ValidatePersonService } from 'src/app/services/validate-person.service';
import { AlertController, IonInput } from '@ionic/angular';
import { EnviroPage } from '../enviro.page';

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
  })
  
export class Step2Component implements OnInit {

    form!: FormGroup;
    birthYear: number = 1900;
    birthMonth: number = 1;
    birthDay: number = 1;

    validation_message: string = 'Please provide information and validate details';

    // ethnicities: Ethnicity[] = [];
    offence_how: OffenceHow[] = [];
    offence_location_suffix: OffenceLocationSuffix[] = [];
    address_verified_by: AddressVerifiedBy[] = [];
    site_offence: SiteOffence[] = [];
    offences: Offence[] = [];
    offenceGroups: OffenceGroup[] = [];
    filteredOffences: Offence[] = [];
    id_shown: IDShown[] = [];
    salutations: Salutation[] = [];
    zones: Zone[] = [];
    selectedOffence!: Offence;
    selected_offence_group_id!: number;

    enviro_post: EnviroPost = new EnviroPost();

    alertHeader:string= '';
    alertSubHeader:string=  '';
    alertMessage:string=  '';


    constructor(
        private api: ApiService,
        private data:DataService,
        private fpnPage: EnviroPage,
        private validatePerson:ValidatePersonService,
        private alertController: AlertController
    ) {
        
    }

    ngOnInit(): void {
        if (!this.data.checkFPNData()){
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }
    
    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        // this.form.get('offence')?.setValue(null); // Reset the offence selection
    }

    updateDateOfBirth() {
        if (this.birthYear && this.birthMonth && this.birthDay) {
          if (this.birthMonth > 12 || this.birthDay > 31) {
            console.error('Invalid date: Day cannot be greater than 31 and month cannot be greater than 12.');
            return;
          }
    
          // Format as yyyy/mm/dd and assign to date_of_birth
          const formattedDate = `${this.birthYear.toString().padStart(4, '0')}/${this.birthMonth.toString().padStart(2, '0')}/${this.birthDay.toString().padStart(2, '0')}`;
          this.enviro_post.date_of_birth = formattedDate;
          this.saveEnviroData();
        }
    } 

    ValidatePerson(){

        if(this.enviro_post.first_name =="" && this.enviro_post.last_name ==""){
            this.alertHeader= 'Missing Field';
            this.alertSubHeader=  'Value required';
            this.alertMessage=  'First Name and surname is requred';

            this.showAlert();
            return;
        }


        if(this.enviro_post.address ==""){
            this.alertHeader= 'Missing Field';
            this.alertSubHeader=  'Value required';
            this.alertMessage=  'Address is required';

            this.showAlert();
            return;
        }

        if(this.enviro_post.date_of_birth  ==""){
            this.alertHeader= 'Missing Field';
            this.alertSubHeader=  'Value required';
            this.alertMessage=  'Date of birth is required';

            this.showAlert();
            return;
        }

        if(this.enviro_post.post_code  ==""){
            this.alertHeader= 'Missing Field';
            this.alertSubHeader=  'Value required';
            this.alertMessage=  'Postal code is required';

            this.showAlert();
            return;
        }
        if(this.enviro_post.town ==""){
            this.alertHeader= 'Missing Field';
            this.alertSubHeader=  'Value required';
            this.alertMessage=  'Town  is required';

            this.showAlert();
            return;
        }

        var offenderData = {
            "forename": this.enviro_post.first_name,
            "surname": this.enviro_post.last_name,
            "dob": this.formatDateForRequest(this.enviro_post.date_of_birth),
            "address1": this.enviro_post.address,
            "address2": this.enviro_post.town,
            "postcode": this.enviro_post.post_code
        };

        this.validatePerson.validateIdetity(offenderData)
            .subscribe(data => {
                console.log(data);

                if (data?.Summary?.ResultText == "PASS")
                {
                    if (data?.Address) {
                        if (data.Address.DOB !== "0000-00-00" || data.Address.DOB !== null)
                        {
                            this.enviro_post.date_of_birth = data.Address.DOB ? this.formatDateForDisplay(data.Address.DOB) : '';
                            this.populateDateOfBirth();

                            this.alertHeader = 'Success';
                            this.alertSubHeader = 'Information Validated';
                            this.alertMessage = 'Offenders Information Has Been Validated';

                            const forename = this.capitalizeSentence(data.Address.Forename || '');
                            const middleName = this.capitalizeSentence(data.Address.MiddleName || '');
                            this.enviro_post.first_name = `${forename} ${middleName}`.trim();
                            this.enviro_post.last_name = this.capitalizeSentence(data.Address.Surname || '');

                            if (data.Address.AddressFound && data.Address.CleanedAddress) {
                                const address1 = this.capitalizeSentence(data.Address.CleanedAddress.Address1 || '');
                                const address2 = this.capitalizeSentence(data.Address.CleanedAddress.Address2 || '');
                                this.validation_message = 'Validated Address: ' + address1 + ', ' + address2 + ', ' + data.Address.CleanedAddress.Postcode;
                            }
                             else {
                                this.alertHeader = 'Invalid';
                                this.alertSubHeader = 'Information Incorrect';
                                this.alertMessage = 'Offenders Information Has Been Found False, Please request correct details.';
                            }
                        }
                        else {
                            this.alertHeader = 'Invalid';
                            this.alertSubHeader = 'Date of Birth Incorrect';
                            this.alertMessage = 'Offenders Date of Birth Has Been Found False, Please request correct details. ';
                        }
                    } else {
                        this.alertHeader = 'Invalid';
                    this.alertSubHeader = 'Address Incorrect';
                    this.alertMessage = 'Offenders Address Has Been Found False, Please request correct details.';
                    }
                        
                } else {
                    this.alertHeader = 'Invalid';
                    this.alertSubHeader = 'Information Incorrect';
                    this.alertMessage = 'Offenders Information Has Been Found False, Please request correct details. Some information were found Incorrect';
                }

                this.showAlert();
            });

       
    }

    // Helper function to capitalize the first letter of each sentence
    capitalizeSentence(text: string): string {
        return text.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/g, match => match.toUpperCase());
    }

   // Helper function to format date for display as YYYY/MM/DD
    formatDateForDisplay(date: string): string {
        return date.replace(/-/g, '/');
    }

    // Helper function to format date for request as YYYY-MM-DD
    formatDateForRequest(date: string): string {
        return date.replace(/\//g, '-');
    }


    populateDateOfBirth() { 
        if (this.enviro_post.date_of_birth) {
        const [year, month, day] = this.enviro_post.date_of_birth.split('/');

        this.birthYear = +year;
        this.birthMonth = +month;
        this.birthDay = +day;
        }
    }


    async showAlert() {
        const alert = await this.alertController.create({
          header: this.alertHeader,
          subHeader: this.alertSubHeader,
          message: this.alertMessage,
          buttons: ['OK']
        });
    
        await alert.present();
      }
    loadData() {
        this.offence_how = this.data.getOffenceHow();
        this.offence_location_suffix = this.data.getOffenceLocationSuffix();
        this.address_verified_by = this.data.getAddressVerifiedBy();
        // this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let enviro_post =  this.data.getEnviroPost();
        this.salutations = this.data.getSalutations();
        console.log(this.zones);
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
        this.populateDateOfBirth();
    } 

    onInputChange(){
        UpperCaseWords(this.enviro_post); 
    }

    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    } 

}



