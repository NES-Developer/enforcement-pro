import { NotebookEntry } from "./notebook-entry";
import moment from 'moment'; // Import moment.js for date formatting
export class EnviroPost {
    constructor() {
        this.local_id = '';
        this.enviro_id = 0;
        this.fpn_number = '';
        this.barcode = '';
        this.salutation = '';
        this.first_name = '';
        this.last_name = '';
        this.address = '';
        this.town = '';
        this.county = 'United Kingdom';
        this.post_code = '';
        this.date_of_birth = '';
        this.phone = '';
        this.email = '';
        // ethnicity_id: number = 0;
        // gender: string = '';
        this.is_bwc_active = '';
        this.proof_of_address = '';
        this.proof_of_id = '';
        // ref_no: string = '';
        this.site_id = 0;
        this.zone_id = 0;
        this.officer_id = 0;
        this.offence_id = 0;
        this.offence_type_id = 0;
        this.language = 'English';
        this.admin_id = 0;
        this.offender_id = 0;
        this.prefix_id = 0;
        this.location_id = 0;
        this.action_id = 0;
        // caution: string = '';
        // second_caution: string = '';
        this.offender_reply = '';
        this.description = '';
        this.description_waste = '';
        this.offence_location = '';
        this.land_type_id = 0;
        this.town_area = '';
        this.poi_prefix_id = 0;
        this.poi = '';
        // visibility_id: number = 0;
        // weather_id: number = 0;
        this.manual_time = false;
        this.offence_datetime = moment().format('YYYY-MM-DDTHH:mm:ss');
        this.issue_datetime = moment().format('YYYY-MM-DDTHH:mm:ss');
        this.fpn_issued = 0;
        this.is_id_verified = '';
        this.is_address_verified = '';
        this.lat = '0';
        this.lng = '0';
        // is_witness_available: string = '';
        // witness_name: string = '';
        // witness_phone: string = '';
        // witness_address: string = '';
        // witness_statement: string = '';
        // officer_statement: string = '';
        this.signature = '';
        this.offence_images = [];
        this.notebook_entries = new NotebookEntry();
    }
}
//# sourceMappingURL=enviro.js.map