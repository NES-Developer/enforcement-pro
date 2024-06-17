import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private selected_offence_type: number = 0;

    private live_url: string = 'https://app.enforcementpro.co.uk';
    private dev_url: string = 'https://uat.enforcementpro.co.uk';

    private selected_site: any;

    private dynamic_feilds: any[] = [];
    private ethnicities: any[] = [];
    private officers: any[] = [];
    private request_types: any[] = [];
    private sr_via: any[] = [];
    private sites: any[] = [];
    private offence_types: any[] = [];
    
    constructor() {
        this.loadFromLocalStorage();
    }

    private loadFromLocalStorage(): void {
        // Load each data array from localStorage if available
        this.dynamic_feilds = this.loadArrayFromLocalStorage('dynamic_feilds');
        this.ethnicities = this.loadArrayFromLocalStorage('ethnicities');
        this.officers = this.loadArrayFromLocalStorage('officers');
        this.request_types = this.loadArrayFromLocalStorage('request_types');
        this.sr_via = this.loadArrayFromLocalStorage('sr_via');
        this.sites = this.loadArrayFromLocalStorage('sites');
        this.offence_types = this.loadArrayFromLocalStorage('offence_types')

        this.selected_site = this.loadObjectFromLocalStorage('selected_site');

        // this.selected_site = parseInt(this.loadStringFromLocalStorage('selected_site'));
    }

    private loadStringFromLocalStorage(key: string): string {
        const data = localStorage.getItem(key);
        return data ? data : '';
    }

    private loadObjectFromLocalStorage(key: string): string {
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

    private saveObjectToLocalStorage(key: string, data: string): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    private saveArrayToLocalStorage(key: string, data: any[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }



    setSelectedSite(selected_site: any): void {
        this.selected_site = selected_site;
        this.saveObjectToLocalStorage('selected_site', this.selected_site);
    }

    setSites(sites: any): void {
        this.sites = sites;
        this.saveArrayToLocalStorage('sites', this.sites);
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

    checkSites(): boolean {
        return this.sites.length > 0;
    }

    getUrl(): string {
        return this.dev_url;
    }

    getSelectedSite(): any {
        return this.selected_site;
    }

    getSelectedOffenseType(): any {
        return this.selected_offence_type;
    }

    getDynamicFields(): any[] {
        return this.dynamic_feilds;
    }

    getEthnicities(): any[] {
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

        // Clear localStorage
        localStorage.removeItem('selected_site')
        localStorage.removeItem('dynamic_feilds');
        localStorage.removeItem('ethnicities');
        localStorage.removeItem('officers');
        localStorage.removeItem('request_types');
        localStorage.removeItem('sr_via');
        localStorage.removeItem('sites');
    }
}
