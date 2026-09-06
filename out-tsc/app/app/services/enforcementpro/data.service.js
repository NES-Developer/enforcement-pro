import { Injectable } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { NotebookEntry } from '../../models/notebook-entry';
import { AppLog } from '../../models/app-log';
import { Login } from '../../models/login';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import * as i0 from "@angular/core";
import * as i1 from "@ionic/storage-angular";
export class DataService {
    constructor(storage) {
        this.storage = storage;
        this._ready = false;
        this._initPromise = null;
        this.storageInitTimeoutMs = 4000;
        this.hydrationTimeoutMs = 8000;
        this.last_fpn_id = 0;
        this.live_url = 'https://app.enforcementpro.co.uk';
        this.dev_url = 'https://app.enforcementpro.co.uk';
        this.google_key = 'AIzaSyArU_KfqFdnmzBy7Rl0KcMJ4JjCQX65kTI';
        this.api_app_version = '';
        this.api_app_url = 'https://drive.google.com/file/d/15KLQYvY5-qyyTNBI4WlGiDpPZ6m9yLns/view';
        this.token = '';
        this.user = {};
        this.patrol_session = null;
        this.zone_detection_status = this.emptyZoneDetectionStatus();
        this.posted_fpn_count = 0;
        this.enviro_que = [];
        this.site_offences = [];
        this.offence_how = [];
        this.offences = [];
        this.offence_groups = [];
        this.address_verifed_by = [];
        this.id_shown = [];
        this.offence_location_suffix = [];
        this.weather = [];
        this.visibility = [];
        this.poi_prefix = [];
        this.zones = [];
        this.salutations = [];
        this.builds = [];
        this.hair_colours = [];
        // private notebook: NotebookEntry[] = [];
        this.ethnicities = [];
        this.sites = [];
        this.offence_types = [];
        this.fpn_number_offline_printer = [];
        this.tracking_queue = [];
        this.selectedZoneSubject = new BehaviorSubject(null);
        this.zoneDetectionStatusSubject = new BehaviorSubject(this.zone_detection_status);
        /* ------------------------ Config FUNCTIONS ------------------------ */
        this.lastStorageWarning = null;
        this.enviro_post = new EnviroPost();
        this.app_log = new AppLog();
        this.patrol_session = null;
        this.login = new Login();
        this.hydrateSessionFromBrowserStorage();
        this.dataHydrated = this.bootstrap();
    }
    async init() {
        if (this._ready) {
            return;
        }
        if (!this._initPromise) {
            this._initPromise = this.createStorage();
        }
        await this._initPromise;
    }
    async waitUntilHydrated() {
        try {
            await this.withTimeout(this.dataHydrated, this.hydrationTimeoutMs);
        }
        catch (error) {
            console.warn('Storage hydration timed out; using browser storage.', error);
            this.hydrateSessionFromBrowserStorage();
        }
    }
    async bootstrap() {
        try {
            await this.init();
            await this.withTimeout(this.loadFromLocalStorage(), this.hydrationTimeoutMs);
        }
        catch (error) {
            console.warn('Storage hydration failed; using browser storage.', error);
            this.hydrateSessionFromBrowserStorage();
        }
    }
    async createStorage() {
        const createPromise = this.storage.create();
        try {
            this._storage = await this.withTimeout(createPromise, this.storageInitTimeoutMs);
        }
        catch (error) {
            console.warn('Ionic Storage init timed out; continuing with localStorage.', error);
            createPromise.then((storage) => {
                this._storage = storage;
            }).catch(() => undefined);
        }
        finally {
            this._ready = true;
        }
    }
    async loadFromLocalStorage() {
        this.selected_site = await this.loadObjectFromLocalStorage('selected_site') ?? this.selected_site;
        this.selected_zone = await this.loadObjectFromLocalStorage('selected_zone') ?? this.selected_zone;
        this.selectedZoneSubject.next(this.selected_zone);
        this.login = await this.loadObjectFromLocalStorage('login') ?? this.login;
        this.user = await this.loadObjectFromLocalStorage('user') ?? this.user ?? {};
        this.token = (await this.loadStringFromLocalStorage('token')) || this.token || '';
        // Load each data array from localStorage if available
        this.weather = await this.loadArrayFromLocalStorage('weather');
        this.visibility = await this.loadArrayFromLocalStorage('visibility');
        this.poi_prefix = await this.loadArrayFromLocalStorage('poi_prefix');
        this.zones = await this.loadArrayFromLocalStorage('zones');
        this.salutations = await this.loadArrayFromLocalStorage('salutations');
        this.builds = await this.loadArrayFromLocalStorage('builds');
        this.hair_colours = await this.loadArrayFromLocalStorage('hair_colours');
        this.enviro_que = await this.loadArrayFromLocalStorage('enviro_que');
        this.site_offences = await this.loadArrayFromLocalStorage('site_offences');
        this.offence_how = await this.loadArrayFromLocalStorage('offence_how');
        this.offences = await this.loadArrayFromLocalStorage('offences');
        this.offence_groups = await this.loadArrayFromLocalStorage('offence_groups');
        this.address_verifed_by = await this.loadArrayFromLocalStorage('address_verifed_by');
        this.id_shown = await this.loadArrayFromLocalStorage('id_shown');
        this.offence_location_suffix = await this.loadArrayFromLocalStorage('offence_location_suffix');
        this.ethnicities = await this.loadArrayFromLocalStorage('ethnicities');
        this.sites = await this.loadArrayFromLocalStorage('sites');
        this.offence_types = await this.loadArrayFromLocalStorage('offence_types');
        this.fpn_number_offline_printer = await this.loadArrayFromLocalStorage('fpn_number_offline_printer');
        this.tracking_queue = await this.loadArrayFromLocalStorage('tracking_queue');
        this.enviro_post = await this.loadObjectFromLocalStorage('enviro_post') ?? this.enviro_post;
        this.app_log = await this.loadObjectFromLocalStorage('app_log') ?? this.app_log;
        this.removeAppLogZoneId(this.app_log);
        this.patrol_session = await this.loadObjectFromLocalStorage('patrol_session') ?? this.patrol_session;
        this.zone_detection_status = await this.loadObjectFromLocalStorage('zone_detection_status') || this.emptyZoneDetectionStatus();
        this.zoneDetectionStatusSubject.next(this.zone_detection_status);
        this.posted_fpn_count = Number(await this.loadStringFromLocalStorage('posted_fpn_count')) || 0;
        this.api_app_version = await this.loadStringFromLocalStorage('api_app_version');
        this.api_app_url = await this.loadStringFromLocalStorage('api_app_url');
        this.last_fpn_id = await this.loadIntFromLocalStorage('last_fpn_id');
        const storedGoogleKey = await this.loadStringFromLocalStorage('google_key');
        if (storedGoogleKey) {
            this.google_key = storedGoogleKey;
        }
    }
    /* ------------------------ LOAD FUNCTIONS ------------------------ */
    async loadIntFromLocalStorage(key) {
        await this.init();
        const storage = this._storage;
        let val = null;
        if (storage) {
            val = await storage.get(key);
        }
        if (val === null || val === undefined) {
            // fallback to browser localStorage
            val = localStorage.getItem(key);
        }
        if (val === null || val === undefined || val === '')
            return 0;
        const num = parseInt(val, 10);
        return Number.isNaN(num) ? 0 : num;
    }
    async loadStringFromLocalStorage(key) {
        await this.init();
        const storage = this._storage;
        let val = null;
        if (storage) {
            val = await storage.get(key);
        }
        if (val === null || val === undefined) {
            val = localStorage.getItem(key);
        }
        return val ?? '';
    }
    async loadObjectFromLocalStorage(key) {
        await this.init();
        const storage = this._storage;
        let raw = null;
        if (storage) {
            raw = await storage.get(key);
        }
        if (!raw) {
            raw = localStorage.getItem(key);
        }
        if (!raw)
            return null;
        try {
            // If Ionic stored a real object already, just return it
            if (typeof raw === 'object') {
                return raw;
            }
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    async loadArrayFromLocalStorage(key) {
        await this.init();
        const storage = this._storage;
        let raw = null;
        if (storage) {
            raw = await storage.get(key);
        }
        if (!raw) {
            raw = localStorage.getItem(key);
        }
        if (!raw)
            return [];
        try {
            if (Array.isArray(raw)) {
                return raw;
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    }
    /* ------------------------ SAVE FUNCTIONS ------------------------ */
    async saveIntToLocalStorage(key, data) {
        await this.init();
        const storage = this._storage;
        const str = data.toString();
        if (storage) {
            await storage.set(key, str);
        }
        // best-effort browser mirror
        this.safeSetLocalStorage(key, str);
    }
    async saveStringToLocalStorage(key, data) {
        await this.init();
        const storage = this._storage;
        const value = data ?? '';
        if (storage) {
            await storage.set(key, value);
        }
        this.safeSetLocalStorage(key, value);
    }
    async saveObjectToLocalStorage(key, data) {
        await this.init();
        const storage = this._storage;
        const json = JSON.stringify(data);
        if (storage) {
            await storage.set(key, data); // you can store object directly in Ionic
        }
        // localStorage only understands strings
        this.safeSetLocalStorage(key, json);
    }
    async saveArrayToLocalStorage(key, data) {
        await this.init();
        const storage = this._storage;
        const json = JSON.stringify(data);
        if (storage) {
            await storage.set(key, data); // store array directly
        }
        this.safeSetLocalStorage(key, json);
    }
    safeSetLocalStorage(key, value) {
        try {
            if (value === null || value === undefined) {
                localStorage.removeItem(key);
            }
            else {
                localStorage.setItem(key, value);
            }
        }
        catch (e) {
            this.lastStorageWarning = 'Device storage is full. Queued FPNs may be lost if you close the app.';
            console.warn('localStorage set failed for key:', key, e);
        }
    }
    consumeStorageWarning() {
        const warning = this.lastStorageWarning;
        this.lastStorageWarning = null;
        return warning;
    }
    setLastFpnId(last_fpn_id) {
        this.last_fpn_id = last_fpn_id;
        this.saveIntToLocalStorage('last_fpn_id', this.last_fpn_id);
    }
    setApiAppVersion(api_app_version) {
        this.api_app_version = api_app_version;
        this.saveStringToLocalStorage('api_app_version', this.api_app_version);
    }
    setApiAppUrl(api_app_url) {
        this.api_app_url = api_app_url;
        this.saveStringToLocalStorage('api_app_url', this.api_app_url);
    }
    setEnviroPost(enviro_post) {
        this.enviro_post = enviro_post;
        this.saveObjectToLocalStorage('enviro_post', this.enviro_post);
    }
    setAppLog(app_log) {
        this.removeAppLogZoneId(app_log);
        this.app_log = app_log;
        this.saveObjectToLocalStorage('app_log', this.app_log);
    }
    setPatrolSession(patrol_session) {
        this.patrol_session = patrol_session;
        this.saveObjectToLocalStorage('patrol_session', this.patrol_session);
    }
    setTrackingQueue(tracking_queue) {
        this.tracking_queue = tracking_queue || [];
        this.saveArrayToLocalStorage('tracking_queue', this.tracking_queue);
    }
    pushTrackingQueue(app_log) {
        this.removeAppLogZoneId(app_log);
        this.tracking_queue.push(app_log);
        if (this.tracking_queue.length > 250) {
            this.tracking_queue = this.tracking_queue.slice(this.tracking_queue.length - 250);
        }
        this.saveArrayToLocalStorage('tracking_queue', this.tracking_queue);
    }
    setSelectedSite(selected_site) {
        this.selected_site = selected_site;
        this.saveObjectToLocalStorage('selected_site', this.selected_site);
    }
    setSelectedZone(selected_zone) {
        this.selected_zone = selected_zone;
        this.saveObjectToLocalStorage('selected_zone', this.selected_zone);
        this.selectedZoneSubject.next(this.selected_zone);
        const selectedZoneId = Number(this.selected_zone?.id);
        if (selectedZoneId > 0 && !this.zones.some(zone => Number(zone.id) === selectedZoneId)) {
            this.zones = [this.selected_zone, ...this.zones];
            this.saveArrayToLocalStorage('zones', this.zones);
        }
    }
    setZoneDetectionStatus(status) {
        this.zone_detection_status = {
            code: status.code,
            message: status.message || '',
            updated_at: status.updated_at || new Date().toISOString()
        };
        this.saveObjectToLocalStorage('zone_detection_status', this.zone_detection_status);
        this.zoneDetectionStatusSubject.next(this.zone_detection_status);
    }
    clearZoneDetectionStatus() {
        this.setZoneDetectionStatus(this.emptyZoneDetectionStatus());
    }
    setLogin(login) {
        // this.token = token;
        // this.saveObjectToLocalStorage('user', this.token);
        // this.user = user;
        // this.saveObjectToLocalStorage('user', this.user);
        this.login = login;
        this.saveObjectToLocalStorage('login', this.login);
    }
    setUser(user) {
        this.user = user;
        this.saveObjectToLocalStorage('user', this.user);
    }
    setToken(token) {
        this.token = token;
        this.saveStringToLocalStorage('token', this.token);
    }
    setSites(sites) {
        this.sites = sites;
        this.saveArrayToLocalStorage('sites', this.sites);
    }
    applyFPNData(data) {
        const payload = this.fpnPayload(data);
        this.removeEnviroLookUps();
        this.setSalutations(payload.salutations);
        this.setFPNNumberOfflinePrinter(payload.fpn_number_offline_printer);
        this.setBuilds(this.firstLookupArray(payload.builds, payload.offender_builds));
        this.setHairColors(this.firstLookupArray(payload.hair_colors, payload.hair_colours));
        this.setZones(payload.zones);
        this.setOffenceHow(payload.offence_how);
        this.setOffenceLocationSuffix(payload.offence_location_suffix);
        this.setAddressVerifiedBy(payload.address_verified_via);
        this.setEthnicities(payload.ethnicities);
        this.setIdShown(payload.id_shown);
        this.setWeather(this.firstLookupArray(payload.weathers, payload.weather));
        this.setVisibility(this.firstLookupArray(payload.visibility, payload.visibilities));
        this.setPOIPrefix(payload.poi_prefix);
        const siteOffences = this.asLookupArray(payload.site_offences);
        this.setSiteOffences(siteOffences);
        const offences = this.extractOffencesFromSiteOffences(siteOffences);
        this.setOffences(offences);
        this.setOffenceGroups(this.extractOffenceGroupsFromOffences(offences));
    }
    setSalutations(salutations) {
        this.salutations = this.asLookupArray(salutations);
        this.saveArrayToLocalStorage('salutations', this.salutations);
    }
    setBuilds(builds) {
        this.builds = this.normalizeMachineLookups(builds);
        this.saveArrayToLocalStorage('builds', this.builds);
    }
    setHairColors(hair_colours) {
        this.hair_colours = this.normalizeMachineLookups(hair_colours);
        this.saveArrayToLocalStorage('hair_colours', this.hair_colours);
    }
    setSiteOffences(site_offences) {
        this.site_offences = site_offences || [];
        this.saveArrayToLocalStorage('site_offences', this.site_offences);
    }
    setFPNNumberOfflinePrinter(fpn_number_offline_printer) {
        const existing = this.fpn_number_offline_printer || [];
        const seen = new Set(existing.map((item) => item?.fpn_number).filter(Boolean));
        for (const item of fpn_number_offline_printer || []) {
            if (item?.fpn_number && !seen.has(item.fpn_number)) {
                existing.push(item);
                seen.add(item.fpn_number);
            }
        }
        this.fpn_number_offline_printer = existing;
        this.saveArrayToLocalStorage('fpn_number_offline_printer', this.fpn_number_offline_printer);
    }
    setEnviroQue(enviro_que) {
        this.enviro_que = enviro_que || [];
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }
    setOffenceHow(offence_how) {
        this.offence_how = this.normalizeMachineLookups(offence_how);
        this.saveArrayToLocalStorage('offence_how', this.offence_how);
    }
    setOffences(offences) {
        this.offences = offences || [];
        this.saveArrayToLocalStorage('offences', this.offences);
    }
    setOffenceGroups(offence_groups) {
        this.offence_groups = offence_groups || [];
        this.saveArrayToLocalStorage('offence_groups', this.offence_groups);
    }
    setAddressVerifiedBy(address_verifed_by) {
        this.address_verifed_by = this.normalizeMachineLookups(address_verifed_by);
        this.saveArrayToLocalStorage('address_verifed_by', this.address_verifed_by);
    }
    setIDShown(id_shown) {
        this.id_shown = id_shown || [];
        this.saveArrayToLocalStorage('id_shown', this.id_shown);
    }
    setWeather(weather) {
        this.weather = this.normalizeMachineLookups(weather);
        this.saveArrayToLocalStorage('weather', this.weather);
    }
    setVisibility(visibility) {
        this.visibility = this.normalizeVisibilityLookups(visibility);
        this.saveArrayToLocalStorage('visibility', this.visibility);
    }
    setPOIPrefix(poi_prefix) {
        this.poi_prefix = this.normalizeMachineLookups(poi_prefix);
        this.saveArrayToLocalStorage('poi_prefix', this.poi_prefix);
    }
    setZones(zone) {
        this.zones = this.asLookupArray(zone);
        this.saveArrayToLocalStorage('zones', this.zones);
    }
    setOffenceLocationSuffix(offence_location_suffix) {
        this.offence_location_suffix = this.normalizeMachineLookups(offence_location_suffix);
        this.saveArrayToLocalStorage('offence_location_suffix', this.offence_location_suffix);
    }
    setEthnicities(ethnicities) {
        this.ethnicities = this.normalizeMachineLookups(ethnicities);
        this.saveArrayToLocalStorage('ethnicities', this.ethnicities);
    }
    setIdShown(id_shown) {
        this.id_shown = this.normalizeMachineLookups(id_shown);
        this.saveArrayToLocalStorage('id_shown', this.id_shown);
    }
    setOffenceType(data) {
        this.offence_types = data.offence_types || [];
        this.saveArrayToLocalStorage('offence_types', this.offence_types);
    }
    pushEnviroQue() {
        this.enviro_que.push(this.enviro_post);
        this.enviro_post = new EnviroPost();
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
        this.saveObjectToLocalStorage('enviro_post', this.enviro_post);
    }
    pushEnviroQueItem(enviro_post) {
        this.enviro_que.push(enviro_post);
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }
    spliceEnviroQue(enviro_post) {
        let index = this.enviro_que.indexOf(enviro_post);
        if (index < 0 && enviro_post?.local_id) {
            index = this.enviro_que.findIndex(item => item.local_id === enviro_post.local_id);
        }
        if (index < 0 && enviro_post?.enviro_id) {
            index = this.enviro_que.findIndex(item => item.enviro_id === enviro_post.enviro_id);
        }
        if (index > -1) {
            this.enviro_que.splice(index, 1);
        }
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }
    spliceOffenceImageEnviroPost(enviro_image) {
        const index = this.enviro_post.offence_images.indexOf(enviro_image);
        if (index > -1) {
            this.enviro_post.offence_images.splice(index, 1);
        }
        this.saveObjectToLocalStorage('enviro_post', this.enviro_post);
    }
    spliceOffenceImageEnviroQue(enviro_data) {
        this.spliceEnviroQue(enviro_data);
        let delete_image = enviro_data.offence_images[enviro_data.offence_images.length - 1];
        const index = enviro_data.offence_images.indexOf(delete_image);
        if (index > -1) {
            enviro_data.offence_images.splice(index, 1);
        }
        this.enviro_que.push(enviro_data);
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
        return enviro_data;
    }
    spliceFPNNumberOfflinePrinter(fpn_number_and_barcode) {
        const index = this.fpn_number_offline_printer.findIndex((item) => item === fpn_number_and_barcode
            || (item?.fpn_number && item.fpn_number === fpn_number_and_barcode?.fpn_number));
        if (index > -1) {
            this.fpn_number_offline_printer.splice(index, 1);
        }
        this.saveArrayToLocalStorage('fpn_number_offline_printer', this.fpn_number_offline_printer);
    }
    takeFPNNumberOfflinePrinter() {
        const next = this.fpn_number_offline_printer[0] || null;
        if (next) {
            this.spliceFPNNumberOfflinePrinter(next);
        }
        return next;
    }
    addFpnNumberAndBarcodeQue(fpn_number, barcode, index) {
        this.enviro_que[index].fpn_number = fpn_number;
        this.enviro_que[index].barcode = barcode;
    }
    checkApiAppVersion() {
        return this.api_app_version !== '';
    }
    checkApiAppVersionAndUrl() {
        return this.api_app_version !== '' && this.api_app_url !== '';
    }
    checkNoteBookEntriesData() {
        return this.builds.length > 0
            && this.hair_colours.length > 0
            && this.ethnicities.length > 0
            && this.weather.length > 0
            && this.visibility.length > 0;
    }
    checkSelectedSite() {
        return !!this.selected_site?.id;
    }
    checkSelectedZone() {
        return !!this.selected_zone?.id;
    }
    checkLogin() {
        return this.login !== null;
    }
    checkOffenceType() {
        return this.offence_types.length > 0;
    }
    checkSites() {
        return this.sites.length > 0;
    }
    checkFPNData() {
        return this.ethnicities.length > 0
            && this.site_offences.length > 0
            && this.address_verifed_by.length > 0
            && this.id_shown.length > 0
            && this.checkNoteBookEntriesData();
    }
    checkAppLog() {
        return this.app_log !== null && this.app_log.lat !== null && this.app_log.lng !== null;
    }
    getLastFpnId() {
        return this.last_fpn_id;
    }
    getGoogleKey() {
        return this.google_key;
    }
    setGoogleKey(google_key) {
        const key = (google_key || '').trim();
        if (!key || key === this.google_key) {
            return;
        }
        this.google_key = key;
        this.saveStringToLocalStorage('google_key', this.google_key);
    }
    getApiAppUrl() {
        return this.api_app_url;
    }
    getApiAppVersion() {
        return this.api_app_version;
    }
    getUrl() {
        return this.dev_url;
    }
    getSalutations() {
        return this.salutations;
    }
    getBuilds() {
        return this.builds;
    }
    getHairColours() {
        return this.hair_colours;
    }
    getEnviroPost() {
        if (!this.enviro_post) {
            this.enviro_post = new EnviroPost();
        }
        if (!this.enviro_post.notebook_entries) {
            this.enviro_post.notebook_entries = new NotebookEntry();
        }
        if (!Array.isArray(this.enviro_post.offence_images)) {
            this.enviro_post.offence_images = [];
        }
        return this.enviro_post;
    }
    getPostedFpnCount() {
        return this.posted_fpn_count;
    }
    incrementPostedFpnCount() {
        this.posted_fpn_count += 1;
        this.saveStringToLocalStorage('posted_fpn_count', String(this.posted_fpn_count));
        return this.posted_fpn_count;
    }
    resetPostedFpnCount() {
        this.posted_fpn_count = 0;
        this.saveStringToLocalStorage('posted_fpn_count', '0');
    }
    getAppLog() {
        if (!this.app_log) {
            this.app_log = new AppLog();
        }
        this.removeAppLogZoneId(this.app_log);
        return this.app_log;
    }
    getZoneDetectionStatus() {
        return this.zone_detection_status || this.emptyZoneDetectionStatus();
    }
    selectedZoneChanges() {
        return this.selectedZoneSubject.asObservable();
    }
    zoneDetectionStatusChanges() {
        return this.zoneDetectionStatusSubject.asObservable();
    }
    getPatrolSession() {
        return this.patrol_session;
    }
    getTrackingQueue() {
        return this.tracking_queue;
    }
    getSelectedSite() {
        return this.selected_site;
    }
    getSelectedZone() {
        return this.selected_zone;
    }
    getLogin() {
        return this.login;
    }
    getToken() {
        return this.token;
    }
    getUser() {
        return this.user;
    }
    getAddressVerifiedBy() {
        return this.address_verifed_by;
    }
    getIDShown() {
        return this.id_shown;
    }
    getOffenceHow() {
        return this.offence_how;
    }
    getSiteOffence() {
        return this.site_offences;
    }
    getEnviroQue() {
        return this.enviro_que;
    }
    getFPNNumberOfflinePrinter() {
        return this.fpn_number_offline_printer;
    }
    getOffence() {
        return this.offences;
    }
    getOffenceGroup() {
        return this.offence_groups;
    }
    getOffenceLocationSuffix() {
        return this.offence_location_suffix;
    }
    getEthnicities() {
        return this.ethnicities;
    }
    getWeather() {
        return this.weather;
    }
    getVisibility() {
        return this.visibility;
    }
    getPOIPrefix() {
        return this.poi_prefix;
    }
    getZones() {
        return this.zones;
    }
    getSites() {
        return this.sites;
    }
    getOffenceTypes() {
        return this.offence_types;
    }
    findZoneById(id) {
        return this.zones.find(z => z.id === id);
    }
    findOffenceGroupId(id) {
        return this.offence_groups.find(z => z.id === id);
    }
    findOffenceById(id) {
        return this.offences.find(z => z.id === id);
    }
    findSiteOffence(offence_id) {
        return this.site_offences.find(z => z.offence_id === offence_id);
    }
    updateEnviroInQue(old_enviro, new_enviro) {
        let index = this.enviro_que.indexOf(old_enviro);
        if (index < 0 && old_enviro?.local_id) {
            index = this.enviro_que.findIndex(item => item.local_id === old_enviro.local_id);
        }
        if (index < 0 && old_enviro?.enviro_id) {
            index = this.enviro_que.findIndex(item => item.enviro_id === old_enviro.enviro_id);
        }
        if (index > -1) {
            this.enviro_que[index] = new_enviro;
        }
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }
    persistEnviroQue() {
        this.saveArrayToLocalStorage('enviro_que', this.enviro_que);
    }
    removeEnviroLookUps() {
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
    async removeAllData() {
        // Clear all private arrays
        this.token = '';
        this.selected_site = null;
        this.selected_zone = null;
        this.ethnicities = [];
        this.sites = [];
        this.enviro_post = new EnviroPost();
        this.app_log = new AppLog();
        this.patrol_session = null;
        this.login = new Login();
        this.user = new User();
        this.zone_detection_status = this.emptyZoneDetectionStatus();
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
        this.tracking_queue = [];
        this.selectedZoneSubject.next(this.selected_zone);
        this.zoneDetectionStatusSubject.next(this.zone_detection_status);
        this.zones = [];
        await this.clearSessionData();
    }
    async clearSessionData() {
        localStorage.clear();
        sessionStorage.clear();
        await this._storage?.clear();
    }
    emptyZoneDetectionStatus() {
        return {
            code: 'idle',
            message: '',
            updated_at: ''
        };
    }
    removeAppLogZoneId(app_log) {
        if (app_log && Object.prototype.hasOwnProperty.call(app_log, 'zone_id')) {
            delete app_log.zone_id;
        }
    }
    hydrateSessionFromBrowserStorage() {
        this.selected_site = this.readBrowserObject('selected_site') ?? this.selected_site;
        this.selected_zone = this.readBrowserObject('selected_zone') ?? this.selected_zone;
        this.selectedZoneSubject.next(this.selected_zone);
        this.login = this.readBrowserObject('login') ?? this.login;
        this.user = this.readBrowserObject('user') ?? this.user ?? {};
        this.token = this.readBrowserString('token') || this.token || '';
        this.builds = this.normalizeMachineLookups(this.readBrowserArray('builds') ?? this.builds);
        this.hair_colours = this.normalizeMachineLookups(this.readBrowserArray('hair_colours') ?? this.hair_colours);
        this.ethnicities = this.normalizeMachineLookups(this.readBrowserArray('ethnicities') ?? this.ethnicities);
        this.weather = this.normalizeMachineLookups(this.readBrowserArray('weather') ?? this.weather);
        this.visibility = this.normalizeVisibilityLookups(this.readBrowserArray('visibility') ?? this.visibility);
        this.zones = this.readBrowserArray('zones') ?? this.zones;
        this.sites = this.readBrowserArray('sites') ?? this.sites;
        this.site_offences = this.readBrowserArray('site_offences') ?? this.site_offences;
        this.address_verifed_by = this.normalizeMachineLookups(this.readBrowserArray('address_verifed_by') ?? this.address_verifed_by);
        this.id_shown = this.normalizeMachineLookups(this.readBrowserArray('id_shown') ?? this.id_shown);
    }
    fpnPayload(data) {
        if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
            return data.data;
        }
        return data || {};
    }
    firstLookupArray(...candidates) {
        for (const candidate of candidates) {
            if (Array.isArray(candidate) && candidate.length > 0) {
                return candidate;
            }
        }
        for (const candidate of candidates) {
            if (Array.isArray(candidate)) {
                return candidate;
            }
        }
        return [];
    }
    asLookupArray(value) {
        return Array.isArray(value) ? value : [];
    }
    normalizeMachineLookups(items) {
        return this.asLookupArray(items).map((item) => {
            if (!item || typeof item !== 'object') {
                return item;
            }
            const label = item.textOnMachine || item.name || item.visibility || item.title || '';
            return {
                ...item,
                textOnMachine: item.textOnMachine || label,
                name: item.name || label,
            };
        });
    }
    normalizeVisibilityLookups(items) {
        return this.asLookupArray(items).map((item) => {
            if (!item || typeof item !== 'object') {
                return item;
            }
            const label = item.visibility || item.name || item.textOnMachine || '';
            return {
                ...item,
                visibility: item.visibility || label,
                name: item.name || label,
                textOnMachine: item.textOnMachine || label,
            };
        });
    }
    extractOffencesFromSiteOffences(siteOffences) {
        const offences = this.asLookupArray(siteOffences)
            .map((item) => item?.offences || item?.offence)
            .filter((offence) => !!offence?.id);
        return Array.from(new Set(offences.map((offence) => offence.id)))
            .map((id) => offences.find((offence) => offence.id === id));
    }
    extractOffenceGroupsFromOffences(offences) {
        const groups = this.asLookupArray(offences)
            .map((offence) => offence?.offenceGroup)
            .filter((group) => !!group?.id);
        return Array.from(new Set(groups.map((group) => group.id)))
            .map((id) => groups.find((group) => group.id === id));
    }
    readBrowserArray(key) {
        const value = this.readBrowserObject(key);
        return Array.isArray(value) ? value : null;
    }
    readBrowserObject(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) {
                return null;
            }
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    }
    readBrowserString(key) {
        try {
            return localStorage.getItem(key) ?? '';
        }
        catch {
            return '';
        }
    }
    withTimeout(promise, ms) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
            promise.then((value) => {
                clearTimeout(timer);
                resolve(value);
            }, (error) => {
                clearTimeout(timer);
                reject(error);
            });
        });
    }
    static { this.ɵfac = function DataService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DataService)(i0.ɵɵinject(i1.Storage)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: DataService, factory: DataService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DataService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.Storage }], null); })();
//# sourceMappingURL=data.service.js.map