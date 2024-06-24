import { Injectable } from '@angular/core';
// import { ServiceRequest } from './models/service-request';
import { ServiceRequest } from '../../models/service-request';
import { SiteOffence } from '../../models/site-offence';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { AddressVerifiedBy } from '../../models/address-verified-by';
import { Ethnicity } from '../../models/ethnicity';
import { IDShown } from '../../models/id-shown';
import { OffenceLocationSuffix } from 'src/app/models/offence-location-suffix';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private selected_offence_type: number = 0;

    private live_url: string = 'https://app.enforcementpro.co.uk';
    private dev_url: string = 'https://uat.enforcementpro.co.uk';
    private google_key: string = 'AIzaSyAfk02RCKQgVc4__wbyFgnpraBOhMeK6K4';

    private dynamic_feilds_data: any = {};
    private service_request: ServiceRequest;
    private selected_site: any;

    private site_offences: SiteOffence[] = [];
    private offences: Offence[] = [];
    private selected_offence!: Offence;
    private offence_groups: OffenceGroup[] = [];
    private address_verifed_by: AddressVerifiedBy[] = [];
    private id_shown: IDShown[] = [];
    private offence_location_suffix: OffenceLocationSuffix[] = [];

    private dynamic_feilds: any[] = [];
    private ethnicities: any[] = [];
    private officers: any[] = [];
    private request_types: any[] = [];
    private sr_via: any[] = [];
    private sites: any[] = [];
    private offence_types: any[] = [];
    
    constructor() {
        this.service_request = new ServiceRequest();

        this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): void {
        // Load each data array from localStorage if available
        this.dynamic_feilds = this.loadArrayFromLocalStorage('dynamic_feilds');
        this.site_offences = this.loadArrayFromLocalStorage('site_offences');
        this.offences = this.loadArrayFromLocalStorage('offences');
        this.offence_groups = this.loadArrayFromLocalStorage('offence_groups');
        this.address_verifed_by = this.loadArrayFromLocalStorage('address_verifed_by');
        this.id_shown = this.loadArrayFromLocalStorage('id_shown');
        this.offence_location_suffix = this.loadArrayFromLocalStorage('offence_location_suffix');
        this.ethnicities = this.loadArrayFromLocalStorage('ethnicities');
        this.officers = this.loadArrayFromLocalStorage('officers');
        this.request_types = this.loadArrayFromLocalStorage('request_types');
        this.sr_via = this.loadArrayFromLocalStorage('sr_via');
        this.sites = this.loadArrayFromLocalStorage('sites');
        this.offence_types = this.loadArrayFromLocalStorage('offence_types')

        this.selected_site = this.loadObjectFromLocalStorage('selected_site');
        this.service_request = this.loadObjectFromLocalStorage('service_request');
        this.dynamic_feilds_data = this.loadObjectFromLocalStorage('dynamic_feilds_data')

        // this.selected_site = parseInt(this.loadStringFromLocalStorage('selected_site'));
    }

    private loadStringFromLocalStorage(key: string): string {
        const data = localStorage.getItem(key);
        return data ? data : '';
    }

    private loadObjectFromLocalStorage(key: string): any {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    private loadArrayFromLocalStorage(key: string): any[] {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }


    private saveStringToLocalStorage(key: string, data: string): void {
        localStorage.setItem(key, data);
    }

    private saveObjectToLocalStorage(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    private saveArrayToLocalStorage(key: string, data: any[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }


    setDynamicFeildData(dynamic_feilds_data: any): void {
        this.dynamic_feilds_data = dynamic_feilds_data;
        this.saveObjectToLocalStorage('dynamic_feilds_data', this.dynamic_feilds_data)
    }

    setSelectedSite(selected_site: any): void {
        this.selected_site = selected_site;
        this.saveObjectToLocalStorage('selected_site', this.selected_site);
    }

    setSites(sites: any): void {
        this.sites = sites;
        this.saveArrayToLocalStorage('sites', this.sites);
    }

    setServiceRequest(service_request: ServiceRequest): void {
        this.service_request = service_request;
        this.saveObjectToLocalStorage('service_request', this.service_request);
    }

    setSRData(data: any): void {
        // alert('from db');
        console.log(data);

        this.dynamic_feilds = data.dynamic_fields || [];
        this.saveArrayToLocalStorage('dynamic_feilds', this.dynamic_feilds);

        this.ethnicities = data.ethnicities || [];
        this.saveArrayToLocalStorage('ethnicities', this.ethnicities);

        this.officers = data.officers || [];
        this.saveArrayToLocalStorage('officers', this.officers);

        this.request_types = data.request_types || [];
        this.saveArrayToLocalStorage('request_types', this.request_types);

        this.sr_via = data.sr_via || [];
        this.saveArrayToLocalStorage('sr_via', this.sr_via);

        // this.sites = data.sites;
        // this.saveArrayToLocalStorage('sites', this.sites);
    }

    setSiteOffences(site_offences: SiteOffence[]): void {
        this.site_offences = site_offences || [];
        this.saveArrayToLocalStorage('site_offences', this.site_offences);
    }

    setOffences(offences: Offence[]): void {
        this.offences = offences || [];
        this.saveArrayToLocalStorage('offences', this.offences);
    }

    setOffenceGroups(offence_groups: OffenceGroup[]): void {
        this.offence_groups = offence_groups || [];
        this.saveArrayToLocalStorage('offence_groups', this.offence_groups);
    }

    setAddressVerifiedBy(address_verifed_by: AddressVerifiedBy[]): void {
        this.address_verifed_by = address_verifed_by || [];
        this.saveArrayToLocalStorage('address_verifed_by', this.address_verifed_by);
    }

    setIDShown(id_shown: IDShown[]): void {
        this.id_shown = id_shown || [];
        this.saveArrayToLocalStorage('id_shown', this.id_shown);
    }

    setOffenceLocationSuffix(offence_location_suffix: OffenceLocationSuffix[]): void {
        this.offence_location_suffix = offence_location_suffix || [];
        this.saveArrayToLocalStorage('offence_location_suffix', this.offence_location_suffix);
    }

    setEthnicities(ethnicities: Ethnicity[]): void {
        this.ethnicities = ethnicities || [];
        this.saveArrayToLocalStorage('ethnicities', this.ethnicities);
    }

    setIdShown(id_shown: IDShown[]): void {
        this.id_shown = id_shown || [];
        this.saveArrayToLocalStorage('id_shown', this.id_shown);
    }

    setOffenceType(data: any): void {
        this.offence_types = data.offence_types || [];
        this.saveArrayToLocalStorage('offence_types', this.offence_types);
    }

    checkSelectedSite(): boolean {
        return this.selected_site !== null;
    }

    checkSRData(): boolean {
        return this.ethnicities.length > 0 && this.sites.length > 0 && this.request_types.length > 0;
    }

    checkOffenceType(): boolean {
        return this.offence_types.length > 0;
    }

    checkSites(): boolean {
        return this.sites.length > 0;
    }

    getGoogleKey(): string {
        return this.google_key;
    }

    getUrl(): string {
        return this.dev_url;
    }

    getDynamicFeildData(): any {
        return this.dynamic_feilds_data;
    }

    getSelectedSite(): any {
        return this.selected_site;
    }

    getServiceRequest(): ServiceRequest {
        return this.service_request;
    }

    getSelectedOffenseType(): any {
        return this.selected_offence_type;
    }

    getDynamicFields(): any[] {
        return this.dynamic_feilds;
    }

    getAddressVerifiedBy(): AddressVerifiedBy[] {
        return this.address_verifed_by;
    }

    getIDShown(): IDShown[] {
        return this.id_shown;
    }

    getOffenceLocationSuffix(): OffenceLocationSuffix[] {
        return this.offence_location_suffix;
    }

    getEthnicities(): Ethnicity[] {
        return this.ethnicities;
    }

    getOfficers(): any[] {
        return this.officers;
    }

    getRequestTypes(): any[] {
        return this.request_types;
    }

    getSRVia(): any[] {
        return this.sr_via;
    }

    getSites(): any[] {
        return this.sites;
    }

    getOffenceTypes(): any[] {
        return this.offence_types;
    }

    removeAllData(): void {
        // Clear all private arrays
        this.selected_site = null,

        this.dynamic_feilds = [];
        this.ethnicities = [];
        this.officers = [];
        this.request_types = [];
        this.sr_via = [];
        this.sites = [];
        this.service_request = new ServiceRequest();
        this.address_verifed_by = [];
        this.offences = [];
        this.offence_groups = [];
        this.id_shown = [];
        this.offence_location_suffix = [];

        // Clear localStorage
        localStorage.removeItem('selected_site')
        localStorage.removeItem('dynamic_feilds');
        localStorage.removeItem('ethnicities');
        localStorage.removeItem('officers');
        localStorage.removeItem('request_types');
        localStorage.removeItem('sr_via');
        localStorage.removeItem('sites');
        localStorage.removeItem('service_request');
        localStorage.removeItem('address_verifed_by');
        localStorage.removeItem('offences');
        localStorage.removeItem('offence_groups');
        localStorage.removeItem('id_shown');
        localStorage.removeItem('offence_location_suffix');

        
    }
}
