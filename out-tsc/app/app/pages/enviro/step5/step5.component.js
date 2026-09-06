import { Component, ViewChild } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { Observable } from 'rxjs';
import moment from 'moment';
import { UpperCaseWords } from 'src/app/helpers/utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/data.service";
import * as i2 from "../../../services/geocoding.service";
import * as i3 from "../../../services/google-maps-loader.service";
import * as i4 from "@ionic/angular";
import * as i5 from "../enviro.page";
import * as i6 from "@angular/common";
import * as i7 from "@angular/forms";
const _c0 = ["locationInput"];
const _c1 = (a0, a1) => ({ "showLeaf": a0, "hiddenLeaf": a1 });
const _c2 = () => ({ weekday: "short", month: "long", day: "2-digit" });
const _c3 = () => ({ hour: "2-digit", minute: "2-digit" });
const _c4 = (a0, a1) => ({ date: a0, time: a1 });
function Step5Component_div_17_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function Step5Component_div_17_button_1_Template_button_click_0_listener() { const suggestion_r3 = i0.ɵɵrestoreView(_r2).$implicit; const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.selectSuggestion(suggestion_r3)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const suggestion_r3 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", suggestion_r3.description, " ");
} }
function Step5Component_div_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 20);
    i0.ɵɵtemplate(1, Step5Component_div_17_button_1_Template, 2, 1, "button", 21);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r3.suggestions);
} }
function Step5Component_ion_select_option_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r5.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r5.textOnMachine, " ");
} }
function Step5Component_ng_container_34_ng_template_5_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-datetime", 27);
    i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_ng_container_34_ng_template_5_Template_ion_datetime_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r3 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r3.enviro_post.offence_datetime, $event) || (ctx_r3.enviro_post.offence_datetime = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ionChange", function Step5Component_ng_container_34_ng_template_5_Template_ion_datetime_ionChange_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.saveEnviroData()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r3.enviro_post.offence_datetime);
    i0.ɵɵproperty("formatOptions", i0.ɵɵpureFunction2(4, _c4, i0.ɵɵpureFunction0(2, _c2), i0.ɵɵpureFunction0(3, _c3)));
} }
function Step5Component_ng_container_34_ng_template_10_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-datetime", 28);
    i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_ng_container_34_ng_template_10_Template_ion_datetime_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r7); const ctx_r3 = i0.ɵɵnextContext(2); i0.ɵɵtwoWayBindingSet(ctx_r3.enviro_post.issue_datetime, $event) || (ctx_r3.enviro_post.issue_datetime = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ionChange", function Step5Component_ng_container_34_ng_template_10_Template_ion_datetime_ionChange_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r3 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r3.saveEnviroData()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r3 = i0.ɵɵnextContext(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r3.enviro_post.issue_datetime);
    i0.ɵɵproperty("formatOptions", i0.ɵɵpureFunction2(4, _c4, i0.ɵɵpureFunction0(2, _c2), i0.ɵɵpureFunction0(3, _c3)));
} }
function Step5Component_ng_container_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "p", 4);
    i0.ɵɵtext(2, "Offence datetime");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(3, "ion-datetime-button", 23);
    i0.ɵɵelementStart(4, "ion-modal", 24);
    i0.ɵɵtemplate(5, Step5Component_ng_container_34_ng_template_5_Template, 1, 7, "ng-template");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 25);
    i0.ɵɵtext(7, "Issue datetime");
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "ion-datetime-button", 26);
    i0.ɵɵelementStart(9, "ion-modal", 24);
    i0.ɵɵtemplate(10, Step5Component_ng_container_34_ng_template_10_Template, 1, 7, "ng-template");
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("keepContentsMounted", true);
    i0.ɵɵadvance(5);
    i0.ɵɵproperty("keepContentsMounted", true);
} }
export class Step5Component {
    constructor(data, geocodingService, mapsLoader, elementRef, alertController, fpnPage) {
        this.data = data;
        this.geocodingService = geocodingService;
        this.mapsLoader = mapsLoader;
        this.elementRef = elementRef;
        this.alertController = alertController;
        this.fpnPage = fpnPage;
        this.poi_prefix = [];
        this.enviro_post = new EnviroPost();
        this.suggestions = [];
        this.showLeaf = false;
        this.searching = false;
        this.suggestTimer = null;
        this.alertHeader = '';
        this.alertSubHeader = '';
        this.alertMessage = '';
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }
    ngOnInit() {
        setTimeout(() => {
            this.locationInput?.setFocus();
        }, 300);
    }
    ngAfterViewInit() {
        void this.loadMap();
    }
    ngOnDestroy() {
        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }
        if (this.clickListener) {
            this.clickListener.remove();
        }
    }
    loadData() {
        this.poi_prefix = this.data.getPOIPrefix();
        const enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
        this.getCurrentPosition().subscribe((position) => {
            if (!this.hasMappedLocation()) {
                this.enviro_post.lat = String(position.latitude);
                this.enviro_post.lng = String(position.longitude);
            }
            void this.centerMap(Number(this.enviro_post.lat), Number(this.enviro_post.lng));
        });
        const defaultDate = moment().format('YYYY-MM-DDTHH:mm:ss');
        if (!this.enviro_post.offence_datetime) {
            this.enviro_post.offence_datetime = defaultDate;
        }
        if (!this.enviro_post.issue_datetime) {
            this.enviro_post.issue_datetime = defaultDate;
        }
        if (this.enviro_post.fpn_issued !== 0 && this.enviro_post.fpn_issued !== 1) {
            this.enviro_post.fpn_issued = 0;
        }
    }
    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }
    saveEnviroData() {
        this.onInputChange();
        this.enviro_post.offence_datetime = moment(this.enviro_post.offence_datetime)
            .format('YYYY-MM-DDTHH:mm:ss');
        this.enviro_post.issue_datetime = moment(this.enviro_post.issue_datetime)
            .format('YYYY-MM-DDTHH:mm:ss');
        this.data.setEnviroPost(this.enviro_post);
    }
    onLocationInput(event) {
        const value = String(event?.detail?.value || this.enviro_post.offence_location || '');
        this.enviro_post.offence_location = value;
        this.saveEnviroData();
        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }
        this.suggestTimer = setTimeout(() => {
            void this.loadSuggestions(value);
        }, 250);
    }
    async selectSuggestion(suggestion) {
        this.suggestions = [];
        const result = await this.geocodingService.geocodePlaceId(suggestion.placeId);
        if (!result) {
            return;
        }
        this.enviro_post.offence_location = result.formattedAddress || suggestion.description;
        this.applyCoordinates(result.lat, result.lng);
        this.showLeaf = true;
        await this.centerMap(result.lat, result.lng, true);
        this.saveEnviroData();
    }
    async toggleMap() {
        if (!this.enviro_post.offence_location) {
            this.alertHeader = 'Wait';
            this.alertSubHeader = 'Location missing';
            this.alertMessage = 'Please enter a location before searching.';
            await this.showAlert();
            this.showLeaf = false;
            return;
        }
        this.showLeaf = true;
        this.searching = true;
        try {
            const result = await this.geocodingService.geocodeAddress(this.enviro_post.offence_location);
            if (!result) {
                this.alertHeader = 'Not found';
                this.alertSubHeader = 'Google Maps';
                this.alertMessage = 'That offence location could not be found. Try a street, town, or postcode.';
                await this.showAlert();
                return;
            }
            this.enviro_post.offence_location = result.formattedAddress || this.enviro_post.offence_location;
            this.applyCoordinates(result.lat, result.lng);
            await this.centerMap(result.lat, result.lng, true);
            this.saveEnviroData();
        }
        finally {
            this.searching = false;
        }
    }
    async loadSuggestions(query) {
        try {
            this.suggestions = await this.geocodingService.suggestPlaces(query);
        }
        catch {
            this.suggestions = [];
        }
    }
    applyCoordinates(lat, lng) {
        this.enviro_post.lat = String(lat);
        this.enviro_post.lng = String(lng);
    }
    hasMappedLocation() {
        const lat = Number(this.enviro_post.lat);
        const lng = Number(this.enviro_post.lng);
        return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
    }
    getCurrentPosition() {
        return new Observable((observer) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    observer.next({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    observer.complete();
                });
            }
            else {
                observer.error();
            }
        });
    }
    async loadMap() {
        await this.mapsLoader.load(this.data.getGoogleKey());
        const google = window.google;
        const el = this.elementRef.nativeElement.querySelector('#map');
        if (!google?.maps || !el) {
            return;
        }
        const lat = this.hasMappedLocation() ? Number(this.enviro_post.lat) : 51.5074;
        const lng = this.hasMappedLocation() ? Number(this.enviro_post.lng) : -0.1278;
        this.map = new google.maps.Map(el, {
            center: { lat, lng },
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });
        this.marker = new google.maps.Marker({
            map: this.map,
            position: { lat, lng },
            draggable: true,
        });
        this.clickListener = this.map.addListener('click', async (event) => {
            const clickedLat = event.latLng.lat();
            const clickedLng = event.latLng.lng();
            this.applyCoordinates(clickedLat, clickedLng);
            this.marker.setPosition({ lat: clickedLat, lng: clickedLng });
            const result = await this.geocodingService.reverseGeocode(clickedLat, clickedLng);
            if (result?.formattedAddress) {
                this.enviro_post.offence_location = result.formattedAddress;
            }
            this.saveEnviroData();
        });
        this.marker.addListener('dragend', async () => {
            const position = this.marker.getPosition();
            const draggedLat = position.lat();
            const draggedLng = position.lng();
            this.applyCoordinates(draggedLat, draggedLng);
            const result = await this.geocodingService.reverseGeocode(draggedLat, draggedLng);
            if (result?.formattedAddress) {
                this.enviro_post.offence_location = result.formattedAddress;
            }
            this.saveEnviroData();
        });
    }
    async centerMap(lat, lng, reveal = false) {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return;
        }
        if (reveal) {
            this.showLeaf = true;
        }
        if (!this.map) {
            return;
        }
        const google = window.google;
        const position = { lat, lng };
        this.marker?.setPosition(position);
        this.map.setCenter(position);
        this.map.setZoom(16);
        setTimeout(() => {
            google?.maps?.event?.trigger(this.map, 'resize');
            this.map.setCenter(position);
        }, 80);
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
    static { this.ɵfac = function Step5Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step5Component)(i0.ɵɵdirectiveInject(i1.DataService), i0.ɵɵdirectiveInject(i2.GeocodingService), i0.ɵɵdirectiveInject(i3.GoogleMapsLoaderService), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i4.AlertController), i0.ɵɵdirectiveInject(i5.EnviroPage)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step5Component, selectors: [["app-step5"]], viewQuery: function Step5Component_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.locationInput = _t.first);
        } }, decls: 35, vars: 22, consts: [["locationInput", ""], [1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], ["interface", "action-sheet", "label", "Send FPN by postal *", "label-placement", "stacked", "fill", "outline", 3, "ionChange", "ngModelChange", "ngModel"], [3, "value"], [3, "ngClass"], ["id", "map-container"], ["id", "map"], ["label", "Offence location *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionInput", "ionChange", "ngModelChange", "ngModel"], ["class", "place-suggestions", 4, "ngIf"], ["expand", "block", 1, "location-search", 3, "click", "disabled"], ["interface", "action-sheet", "label", "Type of land *", "label-placement", "stacked", "fill", "outline", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Town / ward", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "POI *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "POI prefix", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "action-sheet", "label", "Manually override issue and offence timestamp?", "label-placement", "stacked", "fill", "outline", 3, "ngModelChange", "ionChange", "ngModel"], [4, "ngIf"], [1, "place-suggestions"], ["type", "button", "class", "place-suggestions__item", 3, "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "place-suggestions__item", 3, "click"], ["datetime", "offenceDatetime"], [3, "keepContentsMounted"], [1, "ep-kicker", 2, "margin-top", "14px"], ["datetime", "issueDatetime"], ["id", "offenceDatetime", "presentation", "date-time", 3, "ngModelChange", "ionChange", "ngModel", "formatOptions"], ["id", "issueDatetime", "presentation", "date-time", 3, "ngModelChange", "ionChange", "ngModel", "formatOptions"]], template: function Step5Component_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div", 1)(1, "section", 2)(2, "div", 3)(3, "p", 4);
            i0.ɵɵtext(4, "Where");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Enviro detail");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-select", 5);
            i0.ɵɵlistener("ionChange", function Step5Component_Template_ion_select_ionChange_7_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_select_ngModelChange_7_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.fpn_issued, $event) || (ctx.enviro_post.fpn_issued = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵelementStart(8, "ion-select-option", 6);
            i0.ɵɵtext(9, "Yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "ion-select-option", 6);
            i0.ɵɵtext(11, "No");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "ion-content", 7)(13, "div", 8);
            i0.ɵɵelement(14, "div", 9);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "ion-input", 10, 0);
            i0.ɵɵlistener("ionInput", function Step5Component_Template_ion_input_ionInput_15_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onLocationInput($event)); })("ionChange", function Step5Component_Template_ion_input_ionChange_15_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_input_ngModelChange_15_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.offence_location, $event) || (ctx.enviro_post.offence_location = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(17, Step5Component_div_17_Template, 2, 1, "div", 11);
            i0.ɵɵelementStart(18, "ion-button", 12);
            i0.ɵɵlistener("click", function Step5Component_Template_ion_button_click_18_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.toggleMap()); });
            i0.ɵɵtext(19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "ion-select", 13);
            i0.ɵɵlistener("ionChange", function Step5Component_Template_ion_select_ionChange_20_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_select_ngModelChange_20_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.land_type_id, $event) || (ctx.enviro_post.land_type_id = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵelementStart(21, "ion-select-option", 6);
            i0.ɵɵtext(22, "Public");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "ion-select-option", 6);
            i0.ɵɵtext(24, "Private");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(25, "ion-input", 14);
            i0.ɵɵlistener("ionChange", function Step5Component_Template_ion_input_ionChange_25_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_input_ngModelChange_25_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.town_area, $event) || (ctx.enviro_post.town_area = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "ion-input", 15);
            i0.ɵɵlistener("ionChange", function Step5Component_Template_ion_input_ionChange_26_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_input_ngModelChange_26_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.poi, $event) || (ctx.enviro_post.poi = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "ion-select", 16);
            i0.ɵɵlistener("ionChange", function Step5Component_Template_ion_select_ionChange_27_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_select_ngModelChange_27_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.poi_prefix_id, $event) || (ctx.enviro_post.poi_prefix_id = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵtemplate(28, Step5Component_ion_select_option_28_Template, 2, 2, "ion-select-option", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "ion-select", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function Step5Component_Template_ion_select_ngModelChange_29_listener($event) { i0.ɵɵrestoreView(_r1); i0.ɵɵtwoWayBindingSet(ctx.enviro_post.manual_time, $event) || (ctx.enviro_post.manual_time = $event); return i0.ɵɵresetView($event); });
            i0.ɵɵlistener("ionChange", function Step5Component_Template_ion_select_ionChange_29_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.saveEnviroData()); });
            i0.ɵɵelementStart(30, "ion-select-option", 6);
            i0.ɵɵtext(31, "Yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "ion-select-option", 6);
            i0.ɵɵtext(33, "No");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(34, Step5Component_ng_container_34_Template, 11, 2, "ng-container", 19);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.fpn_issued);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", 0);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction2(19, _c1, ctx.showLeaf, !ctx.showLeaf));
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.offence_location);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.suggestions.length);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", ctx.searching);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.searching ? "Searching\u2026" : "Search location", " ");
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.land_type_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", 1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", 2);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.town_area);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.poi);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.poi_prefix_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.poi_prefix);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.manual_time);
            i0.ɵɵadvance();
            i0.ɵɵproperty("value", true);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("value", false);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.enviro_post.manual_time);
        } }, dependencies: [i6.NgClass, i6.NgForOf, i6.NgIf, i7.NgControlStatus, i7.MaxLengthValidator, i7.NgModel, i4.IonButton, i4.IonContent, i4.IonDatetime, i4.IonDatetimeButton, i4.IonInput, i4.IonSelect, i4.IonSelectOption, i4.IonModal, i4.SelectValueAccessor, i4.TextValueAccessor], styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n\nion-content.showLeaf[_ngcontent-%COMP%], \nion-content.hiddenLeaf[_ngcontent-%COMP%] {\n  --background: transparent;\n}\n\n.place-suggestions[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 4px;\n  margin: 6px 0 10px;\n}\n\n.place-suggestions__item[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: left;\n  border: 1px solid var(--ep-line);\n  background: var(--ep-paper);\n  border-radius: 12px;\n  padding: 10px 12px;\n  font-size: 14px;\n  color: inherit;\n}\n\n.location-search[_ngcontent-%COMP%] {\n  margin: 8px 0 20px;\n}\n\nion-datetime-button[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step5Component, [{
        type: Component,
        args: [{ selector: 'app-step5', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Where</p>\n      <h2>Enviro detail</h2>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Send FPN by postal *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.fpn_issued\">\n      <ion-select-option [value]=\"0\">Yes</ion-select-option>\n      <ion-select-option [value]=\"1\">No</ion-select-option>\n    </ion-select>\n\n    <ion-content [ngClass]=\"{ 'showLeaf': showLeaf, 'hiddenLeaf': !showLeaf }\">\n      <div id=\"map-container\">\n        <div id=\"map\"></div>\n      </div>\n    </ion-content>\n\n    <ion-input\n      #locationInput\n      label=\"Offence location *\"\n      label-placement=\"stacked\"\n      fill=\"outline\"\n      type=\"text\"\n      maxlength=\"250\"\n      (ionInput)=\"onLocationInput($event)\"\n      (ionChange)=\"saveEnviroData()\"\n      [(ngModel)]=\"enviro_post.offence_location\">\n    </ion-input>\n    <div class=\"place-suggestions\" *ngIf=\"suggestions.length\">\n      <button type=\"button\" class=\"place-suggestions__item\" *ngFor=\"let suggestion of suggestions\" (click)=\"selectSuggestion(suggestion)\">\n        {{ suggestion.description }}\n      </button>\n    </div>\n    <ion-button expand=\"block\" class=\"location-search\" [disabled]=\"searching\" (click)=\"toggleMap()\">\n      {{ searching ? 'Searching\u2026' : 'Search location' }}\n    </ion-button>\n\n    <ion-select interface=\"action-sheet\" label=\"Type of land *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.land_type_id\">\n      <ion-select-option [value]=\"1\">Public</ion-select-option>\n      <ion-select-option [value]=\"2\">Private</ion-select-option>\n    </ion-select>\n\n    <ion-input label=\"Town / ward\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.town_area\"></ion-input>\n    <ion-input label=\"POI *\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.poi\"></ion-input>\n\n    <ion-select interface=\"action-sheet\" label=\"POI prefix\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.poi_prefix_id\">\n      <ion-select-option *ngFor=\"let group of poi_prefix\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Manually override issue and offence timestamp?\" label-placement=\"stacked\" fill=\"outline\" [(ngModel)]=\"enviro_post.manual_time\" (ionChange)=\"saveEnviroData()\">\n      <ion-select-option [value]=\"true\">Yes</ion-select-option>\n      <ion-select-option [value]=\"false\">No</ion-select-option>\n    </ion-select>\n\n    <ng-container *ngIf=\"enviro_post.manual_time\">\n      <p class=\"ep-kicker\">Offence datetime</p>\n      <ion-datetime-button datetime=\"offenceDatetime\"></ion-datetime-button>\n      <ion-modal [keepContentsMounted]=\"true\">\n        <ng-template>\n          <ion-datetime\n            id=\"offenceDatetime\"\n            presentation=\"date-time\"\n            [(ngModel)]=\"enviro_post.offence_datetime\"\n            (ionChange)=\"saveEnviroData()\"\n            [formatOptions]=\"{\n              date: { weekday: 'short', month: 'long', day: '2-digit' },\n              time: { hour: '2-digit', minute: '2-digit' }\n            }\"\n          ></ion-datetime>\n        </ng-template>\n      </ion-modal>\n\n      <p class=\"ep-kicker\" style=\"margin-top: 14px;\">Issue datetime</p>\n      <ion-datetime-button datetime=\"issueDatetime\"></ion-datetime-button>\n      <ion-modal [keepContentsMounted]=\"true\">\n        <ng-template>\n          <ion-datetime\n            id=\"issueDatetime\"\n            presentation=\"date-time\"\n            [(ngModel)]=\"enviro_post.issue_datetime\"\n            (ionChange)=\"saveEnviroData()\"\n            [formatOptions]=\"{\n              date: { weekday: 'short', month: 'long', day: '2-digit' },\n              time: { hour: '2-digit', minute: '2-digit' }\n            }\"\n          ></ion-datetime>\n        </ng-template>\n      </ion-modal>\n    </ng-container>\n  </section>\n</div>\n", styles: [":host {\n  display: block;\n}\n\nion-content.showLeaf,\nion-content.hiddenLeaf {\n  --background: transparent;\n}\n\n.place-suggestions {\n  display: grid;\n  gap: 4px;\n  margin: 6px 0 10px;\n}\n\n.place-suggestions__item {\n  width: 100%;\n  text-align: left;\n  border: 1px solid var(--ep-line);\n  background: var(--ep-paper);\n  border-radius: 12px;\n  padding: 10px 12px;\n  font-size: 14px;\n  color: inherit;\n}\n\n.location-search {\n  margin: 8px 0 20px;\n}\n\nion-datetime-button {\n  margin-bottom: 8px;\n}\n"] }]
    }], () => [{ type: i1.DataService }, { type: i2.GeocodingService }, { type: i3.GoogleMapsLoaderService }, { type: i0.ElementRef }, { type: i4.AlertController }, { type: i5.EnviroPage }], { locationInput: [{
            type: ViewChild,
            args: ['locationInput', { static: false }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step5Component, { className: "Step5Component" }); })();
//# sourceMappingURL=step5.component.js.map