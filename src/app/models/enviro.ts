import { IonDatetime } from "@ionic/angular";
import { NotebookEntry } from "./notebook-entry";
import moment from 'moment';  // Import moment.js for date formatting

export class EnviroPost {

   fpn_number: string = '';
   barcode: string = '';

   salutation: string = '';
   first_name: string = '';
   last_name: string = '';
   address: string = '';
   town: string = '';
   county: string = 'United Kingdom';
   post_code: string = '';
   phone: string = '';
   date_of_birth: string = '';
   is_bwc_active: string = '';
   proof_of_address: string = '';
   proof_of_id: string = '';
   site_id: number = 0;
   zone_id: number = 0;
   officer_id: number = 0;
   offence_id: number = 0;
   offence_type_id: number = 0;
   language: string = 'English';
   admin_id: number = 0;
   offender_id: number = 0;
   prefix_id: number = 0;
   location_id: number = 0;
   action_id: number = 0;
   // caution: string = '';
   // second_caution: string = '';
   offender_reply: string = '';
   description: string = '';
   description_waste: string = '';
   offence_location: string = '';
   land_type_id: number = 0;
   town_area: string = '';
   poi_prefix_id: number = 0;
   poi: string = '';

   offence_datetime: string = moment().format('YYYY-MM-DDTHH:mm:ss');
   issue_datetime: string = moment().format('YYYY-MM-DDTHH:mm:ss');
   enviro_issued_onspot: string = 'yes';
   is_id_verified: string = '';
   is_address_verified: string = '';
   lat: string = '0';
   lng: string = '0';
   signature: string = '';
   offence_images: string[] = [];
   
    //Notebook Entry Data
    is_fpn_advised: string = '';
    is_fpn_handed: string = '';
    height_in_feet: string = '';
    height_in_inch: string = '';
    gender: string = '';
    ethnicity_id: number = 0;
    caution: string = '';
    second_caution: string = '';
    visibility_id: number = 0;
    weather_id: number = 0;
    witness_name: string = '';
    witness_phone: string = '';
    witness_address: string = '';
    witness_statement: string = '';
    officer_statement: string = '';
    is_witness_available: string = '';
    build: string = '';
    hair: number = 0;
    distance_from_offender: string = '';
    distinguishing_features: string = '';
    have_reason: string = '';
    nearest_bin: string = '';
    were: string = 'no';
    did: string = 'no';
    police_comments: string = '';
    offender_comments: string = '';
    bwv_assest: string = '';
}