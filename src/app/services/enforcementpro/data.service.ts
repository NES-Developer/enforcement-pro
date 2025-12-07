import { Injectable } from '@angular/core';
// import { ServiceRequest } from './models/service-request';
import { ServiceRequest } from '../../models/service-request';
import { SiteOffence } from '../../models/site-offence';
import { Offence } from '../../models/offence';
import { OffenceGroup } from '../../models/offence-group';
import { AddressVerifiedBy } from '../../models/address-verified-by';
import { Ethnicity } from '../../models/ethnicity';
import { IDShown } from '../../models/id-shown';
import { OffenceLocationSuffix } from '../../models/offence-location-suffix';
import { OffenceHow } from '../../models/offence-how';
import { Weather } from '../../models/weather';
import { Visibility } from '../../models/visibility';
import { POIPrefix } from '../../models/poi-prefix';
import { EnviroPost } from '../../models/enviro';
import { Salutation } from '../../models/salutation';
import { Zone } from '../../models/zone';
import { Site } from '../../models/site';
import { Build } from '../../models/build';
import { HairColour } from '../../models/hair_colour';
import { NotebookEntry } from '../../models/notebook-entry';
import { AppLog } from '../../models/app-log';
import { Login } from '../../models/login';

//Storage
// import { Storage } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';

import { User } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class DataService {

    // private _storage: Storage | null = null;
    private _storage!: Storage;

    private _ready = false;


    private last_fpn_id: number = 0;



    private live_url: string = 'https://app.enforcementpro.co.uk';
    private dev_url: string = 'https://app.enforcementpro.co.uk';
    private google_key: string = 'AIzaSyAfk02RCKQgVc4__wbyFgnpraBOhMeK6K4';
    private api_app_version: string = '';
    private api_app_url: string = 'https://drive.google.com/file/d/15KLQYvY5-qyyTNBI4WlGiDpPZ6m9yLns/view';

    private token: string = '';
    private user: any = {};

    private dynamic_feilds_data: any = {};
    private enviro_post: EnviroPost;
    private service_request: ServiceRequest;
    private app_log: AppLog;
    private login: Login;
    private selected_site: any;
    private selected_zone: any;

    private enviro_que: EnviroPost[] = [];
    private site_offences: SiteOffence[] = [];
    private offence_how: OffenceHow[] = [];
    private offences: Offence[] = [];
    private selected_offence!: Offence;
    private offence_groups: OffenceGroup[] = [];
    private address_verifed_by: AddressVerifiedBy[] = [];
    private id_shown: IDShown[] = [];
    private offence_location_suffix: OffenceLocationSuffix[] = [];
    private weather: Weather[] = [];
    private visibility: Visibility[] = [];
    private poi_prefix: POIPrefix[] = [];
    private zones: Zone[] = [];
    private salutations: Salutation[] = [];
    private builds: Build[] = [];
    private hair_colours: HairColour[] = [];
    // private notebook: NotebookEntry[] = [];

    private dynamic_feilds: any[] = [];
    private ethnicities: any[] = [];
    private officers: any[] = [];
    private request_types: any[] = [];
    private sr_via: any[] = [];
    private sites: any[] = [];
    private offence_types: any[] = [];

    private fpn_number_offline_printer: any[] = [];
    
    constructor(
        private storage: Storage
    ) {
        
        this.init();

        this.service_request = new ServiceRequest();
        this.enviro_post = new EnviroPost();
        this.app_log = new AppLog();
        this.login = new Login();

        this.loadFromLocalStorage();
    }

    async init() {
        if (this._ready) return;

        // IMPORTANT: initialize storage
        const storage = await this.storage.create();
        this._storage = storage;
        this._ready = true;
    }

    private async loadFromLocalStorage() {
        // Load each data array from localStorage if available
        this.weather = await this.loadArrayFromLocalStorage('weather');
        this.visibility = await this.loadArrayFromLocalStorage('visibility');
        this.poi_prefix = await this.loadArrayFromLocalStorage('poi_prefix');
        this.zones = await this.loadArrayFromLocalStorage('zones');
        this.salutations = await this.loadArrayFromLocalStorage('salutations');
        this.builds = await this.loadArrayFromLocalStorage('builds');
        this.hair_colours = await this.loadArrayFromLocalStorage('hair_colours');        
        this.dynamic_feilds = await this.loadArrayFromLocalStorage('dynamic_feilds');
        this.enviro_que = await this.loadArrayFromLocalStorage('enviro_que');
        this.site_offences = await this.loadArrayFromLocalStorage('site_offences');
        this.offence_how = await this.loadArrayFromLocalStorage('offence_how');
        this.offences = await this.loadArrayFromLocalStorage('offences');
        this.offence_groups = await this.loadArrayFromLocalStorage('offence_groups');
        this.address_verifed_by = await this.loadArrayFromLocalStorage('address_verifed_by');
        this.id_shown = await this.loadArrayFromLocalStorage('id_shown');
        this.offence_location_suffix = await this.loadArrayFromLocalStorage('offence_location_suffix');
        this.ethnicities = await this.loadArrayFromLocalStorage('ethnicities');
        this.officers = await this.loadArrayFromLocalStorage('officers');
        this.request_types = await this.loadArrayFromLocalStorage('request_types');
        this.sr_via = await this.loadArrayFromLocalStorage('sr_via');
        this.sites = await this.loadArrayFromLocalStorage('sites');
        this.offence_types = await this.loadArrayFromLocalStorage('offence_types');
        this.fpn_number_offline_printer = await this.loadArrayFromLocalStorage('fpn_number_offline_printer');

        this.selected_site = await this.loadObjectFromLocalStorage('selected_site');
        this.selected_zone = await this.loadObjectFromLocalStorage('selected_zone');
        this.login = await this.loadObjectFromLocalStorage('login');
        this.service_request = await this.loadObjectFromLocalStorage('service_request');
        this.dynamic_feilds_data = await this.loadObjectFromLocalStorage('dynamic_feilds_data');
        this.enviro_post = await this.loadObjectFromLocalStorage('enviro_post');
        this.app_log = await this.loadObjectFromLocalStorage('app_log');

        this.user = await this.loadObjectFromLocalStorage('user');
        this.token = await this.loadStringFromLocalStorage('token');

        this.api_app_version = await this.loadStringFromLocalStorage('api_app_version');
        this.api_app_url = await this.loadStringFromLocalStorage('api_app_url');
        this.last_fpn_id = await this.loadIntFromLocalStorage('last_fpn_id');
    }

    /* ------------------------ LOAD FUNCTIONS ------------------------ */

    private async loadIntFromLocalStorage(key: string) {
        await this.init();

        const storage = this._storage;
        let val: any = null;

        if (storage) {
            val = await storage.get(key);
        }

        if (val === null || val === undefined) {
            // fallback to browser localStorage
            val = localStorage.getItem(key);
        }

        if (val === null || val === undefined || val === '') return 0;

        const num = parseInt(val, 10);
        return Number.isNaN(num) ? 0 : num;
    }

    private async loadStringFromLocalStorage(key: string): Promise<string> {
        await this.init();

        const storage = this._storage;
        let val: any = null;

        if (storage) {
            val = await storage.get(key);
        }

        if (val === null || val === undefined) {
            val = localStorage.getItem(key);
        }

        return val ?? '';
    }

    private async loadObjectFromLocalStorage(key: string): Promise<any> {
        await this.init();

        const storage = this._storage;
        let raw: any = null;

        if (storage) {
            raw = await storage.get(key);
        }

        if (!raw) {
            raw = localStorage.getItem(key);
        }
        if (!raw) return null;

        try {
            // If Ionic stored a real object already, just return it
            if (typeof raw === 'object') {
                return raw;
            }

            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    private async loadArrayFromLocalStorage(key: string): Promise<any[]> {
        await this.init();

        const storage = this._storage;
        let raw: any = null;

        if (storage) {
            raw = await storage.get(key);
        }

        if (!raw) {
            raw = localStorage.getItem(key);
        }
        if (!raw) return [];

        try {
            if (Array.isArray(raw)) {
                return raw;
            }

            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    /* ------------------------ SAVE FUNCTIONS ------------------------ */

    private async saveIntToLocalStorage(key: string, data: number) {
        await this.init();

        const storage = this._storage;
        const str = data.toString();

        if (storage) {
            await storage.set(key, str);
        }

        // best-effort browser mirror
        this.safeSetLocalStorage(key, str);
    }

    private async saveStringToLocalStorage(key: string, data: string) {
        await this.init();

        const storage = this._storage;
        const value = data ?? '';

        if (storage) {
            await storage.set(key, value);
        }

        this.safeSetLocalStorage(key, value);
    }

    private async saveObjectToLocalStorage(key: string, data: any) {
        await this.init();

        const storage = this._storage;
        const json = JSON.stringify(data);

        if (storage) {
            await storage.set(key, data); // you can store object directly in Ionic
        }

        // localStorage only understands strings
        this.safeSetLocalStorage(key, json);
    }

    private async saveArrayToLocalStorage(key: string, data: any[]) {
        await this.init();

        const storage = this._storage;
        const json = JSON.stringify(data);

        if (storage) {
            await storage.set(key, data); // store array directly
        }

        this.safeSetLocalStorage(key, json);
    }


    /* ------------------------ Config FUNCTIONS ------------------------ */

    private safeSetLocalStorage(key: string, value: string | null | undefined) {
        try {
            if (value === null || value === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            // QuotaExceededError or other localStorage problems
            console.warn('localStorage set failed for key:', key, e);
        }
    }
    



    
    setLastFpnId(last_fpn_id: number): void {
        this.last_fpn_id = last_fpn_id;
        this.saveIntToLocalStorage('last_fpn_id', this.last_fpn_id);
    }

    setApiAppVersion(api_app_version: string): void {
        this.api_app_version = api_app_version;
        this.saveStringToLocalStorage('api_app_version', this.api_app_version);
    }


    setApiAppUrl(api_app_url: string): void {
        this.api_app_url = api_app_url;
        this.saveStringToLocalStorage('api_app_url', this.api_app_url);
    }

    setDynamicFeildData(dynamic_feilds_data: any): void {
        this.dynamic_feilds_data = dynamic_feilds_data;
        this.saveObjectToLocalStorage('dynamic_feilds_data', this.dynamic_feilds_data);
    }

    setEnviroPost(enviro_post: EnviroPost): void {
        this.enviro_post = enviro_post;
        this.saveObjectToLocalStorage('enviro_post', this.enviro_post);
    }

    setAppLog(app_log: AppLog): void {
        this.app_log = app_log;
        this.saveObjectToLocalStorage('app_log', this.app_log);
    }

    setSelectedSite(selected_site: any): void {
        this.selected_site = selected_site;
        this.saveObjectToLocalStorage('selected_site', this.selected_site);
    }

    setSelectedZone(selected_zone: any): void {
        this.selected_zone = selected_zone;
        this.saveObjectToLocalStorage('selected_zone', this.selected_zone);
    }

    setLogin(login: any): void {

        // this.token = token;
        // this.saveObjectToLocalStorage('user', this.token);

        // this.user = user;
        // this.saveObjectToLocalStorage('user', this.user);

        this.login = login;
        this.saveObjectToLocalStorage('login', this.login);

    }

    setUser(user: User): void {
        this.user = user;
        this.saveObjectToLocalStorage('user', this.user);
    }

    setToken(token: string): void {
        this.token = token;
        this.saveStringToLocalStorage('token', this.token);
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
        // console.log(data);

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

    

    setSalutations(salutations: Salutation[]): void {
        this.salutations = salutations;
        this.saveArrayToLocalStorage('salutations', this.salutations);
    }

    setBuilds(builds: Build[]): void {
        this.builds = builds;
        this.saveArrayToLocalStorage('builds', this.builds);
    }

    setHairColors(hair_colours: HairColour[]): void {
        this.hair_colours = hair_colours;
        this.saveArrayToLocalStorage('hair_colours', this.hair_colours);
    }

    setSiteOffences(site_offences: SiteOffence[]): void {
        this.site_offences = site_offences || [];
        this.saveArrayToLocalStorage('site_offences', this.site_offences);
    }

    setFPNNumberOfflinePrinter(fpn_number_offline_printer: any[]): void {
        this.fpn_number_offline_printer = fpn_number_offline_printer || [];
        this.saveArrayToLocalStorage('fpn_number_offline_printer', this.fpn_number_offline_printer);
    }

    setEnviroQue(enviro_que: EnviroPost[]): void {
        this.enviro_que = enviro_que || [];
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }

    setOffenceHow(offence_how: OffenceHow[]): void {
        this.offence_how = offence_how || [];
        this.saveArrayToLocalStorage('offence_how', this.offence_how);
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


    setWeather(weather: Weather[]): void {
        this.weather = weather;
        this.saveArrayToLocalStorage('weather', this.weather);
    }


    setVisibility(visibility: Visibility[]): void {
        this.visibility = visibility;
        this.saveArrayToLocalStorage('visibility', this.visibility);
    }


    setPOIPrefix(poi_prefix: POIPrefix[]): void {
        this.poi_prefix = poi_prefix;
        this.saveArrayToLocalStorage('poi_prefix', this.poi_prefix);
    }

    setZones(zone: Zone[]): void {
        this.zones = zone;
        this.saveArrayToLocalStorage('zones', this.zones);
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

    pushEnviroQue(): void {
        this.enviro_que.push(this.enviro_post);
        this.enviro_post = new EnviroPost();

        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
        this.saveObjectToLocalStorage('enviro_post', this.enviro_post);

    }

    spliceEnviroQue(enviro_post: EnviroPost): void {
        const index = this.enviro_que.indexOf(enviro_post);
        if (index > -1) {
          this.enviro_que.splice(index, 1);
        }
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }

    spliceOffenceImageEnviroPost(enviro_image: string): void {
        const index = this.enviro_post.offence_images.indexOf(enviro_image);
        if (index > -1) {
          this.enviro_post.offence_images.splice(index, 1);
        }
        this.saveObjectToLocalStorage('enviro_post', this.enviro_post);
    }

    spliceFPNNumberOfflinePrinter(fpn_number_and_barcode: any): void {
        const index = this.fpn_number_offline_printer.indexOf(fpn_number_and_barcode);
        if (index > -1) {
            this.fpn_number_offline_printer.indexOf(index, 1);
        }
        this.saveArrayToLocalStorage('fpn_number_offline_printer', this.fpn_number_offline_printer)

    }

    addFpnNumberAndBarcodeQue(fpn_number: string, barcode: string, index: number): void {
        this.enviro_que[index].fpn_number = fpn_number;
        this.enviro_que[index].barcode = barcode;
    }

    checkApiAppVersion(): boolean {
        return this.api_app_version !== '';
    }

    checkApiAppVersionAndUrl(): boolean {
        return this.api_app_version !== '' && this.api_app_url !== '';
    }

    checkNoteBookEntriesData(): boolean {
        return this.builds.length > 0 && this.hair_colours.length > 0;
    }
      
    checkSelectedSite(): boolean {
        return this.selected_site?.id !== null;
    }

    checkSelectedZone(): boolean {
        return this.selected_zone !== null;
    }

    checkLogin(): boolean {
        return this.login !== null;
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

    checkFPNData(): boolean {
        return this.ethnicities.length > 0 && this.site_offences.length > 0 && this.address_verifed_by.length > 0 && this.id_shown.length > 0;
    }

    checkAppLog(): boolean {
        return this.app_log !== null && this.app_log.lat !== null && this.app_log.lng !== null;
    }

    getLastFpnId(): number {
        return this.last_fpn_id;
    }

    getGoogleKey(): string {
        return this.google_key;
    }

    getApiAppUrl(): string {
        return this.api_app_url;
    }

    getApiAppVersion(): string {
        return this.api_app_version;
    }

    getUrl(): string {
        return this.dev_url;
    }

    getSalutations(): Salutation[] {
        return this.salutations;
    }

    getBuilds(): Build[] {
        return this.builds;
    }

    getHairColours(): HairColour[] {
        return this.hair_colours;
    }

    getDynamicFeildData(): any {
        return this.dynamic_feilds_data;
    }

    getEnviroPost(): EnviroPost {
        return this.enviro_post;
    }

    getAppLog(): AppLog {
        return this.app_log;
    }

    getSelectedSite(): Site {
        return this.selected_site;
    }

    getSelectedZone(): Zone {
        return this.selected_zone;
    }

    getLogin(): Login {
        return this.login;
    }

    getToken(): string {
        return this.token;
    }

    getUser(): any {
        return this.user;
    }

    getServiceRequest(): ServiceRequest {
        return this.service_request;
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

    getOffenceHow(): OffenceHow[] {
        return this.offence_how;
    }

    getSiteOffence(): SiteOffence[] {
        return this.site_offences;
    }

    getEnviroQue(): EnviroPost[] {
        return this.enviro_que;
    }

    getFPNNumberOfflinePrinter(): any[] {
        return this.fpn_number_offline_printer;
    }

    getOffence(): Offence[] {
        return this.offences;
    }

    getOffenceGroup(): OffenceGroup[] {
        return this.offence_groups;
    }

    getOffenceLocationSuffix(): OffenceLocationSuffix[] {
        return this.offence_location_suffix;
    }

    getEthnicities(): Ethnicity[] {
        return this.ethnicities;
    }

    getWeather(): Weather[] {
        return this.weather;
    }

    getVisibility(): Visibility[] {
        return this.visibility;
    }

    getPOIPrefix(): POIPrefix[] {
        return this.poi_prefix;
    }

    getZones(): Zone[] {
        return this.zones;
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

    findZoneById(id: number): Zone | undefined {
        return this.zones.find(z => z.id === id);
    }

    findOffenceGroupId(id: number): OffenceGroup | undefined {
        return this.offence_groups.find(z => z.id === id);
    }

    findOffenceById(id: number): Offence | undefined {
        return this.offences.find(z => z.id === id);
    }

    findSiteOffence(offence_id: number): SiteOffence | undefined {
        return this.site_offences.find(z => z.offence_id === offence_id);
    }

    updateEnviroInQue(old_enviro: EnviroPost, new_enviro: EnviroPost)
    {
        const index = this.enviro_que.indexOf(old_enviro);
        if (index > -1) {
            this.enviro_que[index] = new_enviro
        }
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }

    removeEnviroLookUps(): void {

        this.salutations = []; 
        this.builds = []; 
        this.hair_colours = []; 
        this.zones = []; 
        this.offence_how = []; 
        this.offence_location_suffix = []; 
        this.address_verifed_by = []; 
        this.ethnicities = []; 
        this.id_shown = []; 
        this.weather = []; 
        this.visibility = []; 
        this.poi_prefix = []; 
        this.site_offences = []; 
        this.offence_groups = []; 
        this.offences = [];
        this.zones = [];
        this.offence_types = [];

        // now clear everything from Ionic Storage

        this.setSalutations(this.salutations);
        this.setBuilds(this.builds);
        this.setHairColors(this.hair_colours);
        this.setZones(this.zones);
        this.setOffenceHow(this.offence_how);
        this.setOffenceLocationSuffix(this.offence_location_suffix);
        this.setAddressVerifiedBy(this.address_verifed_by);
        this.setEthnicities(this.ethnicities);
        this.setIDShown(this.id_shown);
        this.setWeather(this.weather);
        this.setVisibility(this.visibility);
        this.setPOIPrefix(this.poi_prefix);
        this.setSiteOffences(this.site_offences);
        this.setOffenceGroups(this.offence_groups);
        this.setOffences(this.offences);
        this.setZones(this.zones);
        this.setOffenceType(this.offence_types);

    }

    removeAllData(): void {
        // Clear all private arrays
        this.selected_site = null;
        this.selected_zone = null;

        this.dynamic_feilds = [];
        this.ethnicities = [];
        this.officers = [];
        this.request_types = [];
        this.sr_via = [];
        this.sites = [];
        this.service_request = new ServiceRequest();
        this.enviro_post = new EnviroPost();
        this.app_log = new AppLog();
        this.login = new Login();

        this.enviro_que = [];
        this.address_verifed_by = [];
        this.offences = [];
        this.offence_groups = [];
        this.id_shown = [];
        this.offence_location_suffix = [];
        this.offence_how = [];
        this.offence_types = [];
        this.salutations = [];
        this.builds = [];
        this.hair_colours = [];

        this.zones = [];

        // this.wipeIonicStorage();

        // Clear localStorage
        this.setSelectedSite(this.selected_site);
        this.setLogin(this.login);
        this.setDynamicFeildData(this.dynamic_feilds);
        this.setSites(this.sites);
        this.setServiceRequest(this.service_request);
        this.setOffenceType(this.offence_types);
        this.setAppLog(this.app_log);
        this.setEnviroPost(this.enviro_post);
        this.setEnviroQue(this.enviro_que);
        this.setSalutations(this.salutations);
        this.setBuilds(this.builds);
        this.setHairColors(this.hair_colours);
        this.setZones(this.zones);
        this.setOffenceHow(this.offence_how);
        this.setOffenceLocationSuffix(this.offence_location_suffix);
        this.setAddressVerifiedBy(this.address_verifed_by);
        this.setEthnicities(this.ethnicities);
        this.setIDShown(this.id_shown);
        this.setWeather(this.weather);
        this.setVisibility(this.visibility);
        this.setPOIPrefix(this.poi_prefix);
        this.setSiteOffences(this.site_offences);
        this.setOffenceGroups(this.offence_groups);
        this.setOffences(this.offences);
        this.setZones(this.zones);
    }

    // async wipeIonicStorage()
    // {
    //     // now clear everything from Ionic Storage
    //     await this._storage?.clear();
    // }
}
