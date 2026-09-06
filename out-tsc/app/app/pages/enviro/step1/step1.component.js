import { Component } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { ZoneDetection } from '../../../models/zone-detection';
import { AppLog } from 'src/app/models/app-log';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/api.service";
import * as i2 from "../../../services/enforcementpro/data.service";
import * as i3 from "../enviro.page";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@ionic/angular";
function Step1Component_ion_select_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const site_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", site_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", site_r1.name, " ");
} }
function Step1Component_ion_select_option_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const zone_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", zone_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", zone_r2.name, " ");
} }
function Step1Component_ion_text_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-text", 15);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r2.zoneStatusMessage);
} }
function Step1Component_ion_select_option_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r4.englishName, " ");
} }
function Step1Component_ion_select_23_ion_select_option_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 14);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const offence_r6 = ctx.$implicit;
    i0.ɵɵproperty("value", offence_r6.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", offence_r6.name, " ");
} }
function Step1Component_ion_select_23_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-select", 16);
    i0.ɵɵlistener("ionChange", function Step1Component_ion_select_23_Template_ion_select_ionChange_0_listener() { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.getOffenceById(ctx_r2.enviro_post.offence_id)); });
    i0.ɵɵtwoWayListener("ngModelChange", function Step1Component_ion_select_23_Template_ion_select_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r2 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r2.enviro_post.offence_id, $event) || (ctx_r2.enviro_post.offence_id = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵtemplate(1, Step1Component_ion_select_23_ion_select_option_1_Template, 2, 2, "ion-select-option", 5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r2.enviro_post.offence_id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r2.filteredOffences);
} }
function Step1Component_section_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 1)(1, "div", 2)(2, "p", 3);
    i0.ɵɵtext(3, "Legislation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "h3");
    i0.ɵɵtext(5, "Legal detail");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "ion-card", 17)(7, "ion-card-header")(8, "ion-card-subtitle");
    i0.ɵɵtext(9, "Offence description");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(10, "ion-card-content");
    i0.ɵɵtext(11);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(12, "ion-card", 17)(13, "ion-card-header")(14, "ion-card-subtitle");
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "ion-card-content");
    i0.ɵɵtext(17);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "ion-card", 17)(19, "ion-card-header")(20, "ion-card-subtitle");
    i0.ɵɵtext(21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "ion-card-content");
    i0.ɵɵtext(23);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(11);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.offence.description, " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", ctx_r2.offence.engLegislation == null ? null : ctx_r2.offence.engLegislation.title, " (English) legislation");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.offence.engLegislation == null ? null : ctx_r2.offence.engLegislation.legislation, " ");
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate1("", ctx_r2.offence.welLegislation == null ? null : ctx_r2.offence.welLegislation.title, " legislation");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.offence.welLegislation == null ? null : ctx_r2.offence.welLegislation.legislation, " ");
} }
export class Step1Component {
    constructor(api, data, fpnPage) {
        this.api = api;
        this.data = data;
        this.fpnPage = fpnPage;
        this.offences = [];
        this.filteredOffences = [];
        this.offenceGroups = [];
        this.selected_site = null;
        this.selected_zone = null;
        this.zones = [];
        this.filteredZones = [];
        this.zoneSearch = '';
        this.sites = [];
        this.zoneStatusMessage = '';
        this.enviro_post = new EnviroPost();
        this.subscriptions = [];
        this.app_log = new AppLog();
        this.loadData();
    }
    async ngOnInit() {
        this.init();
        this.watchZoneSelection();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    init() {
        if (this.selected_site?.id) {
            this.enviro_post.site_id = this.selected_site.id;
        }
        this.applySelectedZoneToForm();
        if (this.offences && this.enviro_post && this.enviro_post.offence_type_id) {
            this.filterOffences();
        }
    }
    ZoneDetection() {
        this.fpnPage.ping();
        let zone_detection = new ZoneDetection();
        zone_detection.lat = this.app_log.lat;
        zone_detection.lng = this.app_log.lng;
        let site = this.data.getSelectedSite();
        zone_detection.site_id = site.id.toString();
        this.api.zoneDetection(zone_detection).subscribe({
            next: (response) => {
                if (response.success === false) {
                    this.data.setZoneDetectionStatus({
                        code: 'not_in_zone',
                        message: response.message || 'You are not in a zone. Please select a zone.',
                        updated_at: new Date().toISOString()
                    });
                    this.fpnPage.presentAlert('Error', response.message);
                }
                else {
                    this.enviro_post.zone_id = Number(response.id);
                    this.saveEnviroData();
                    this.selected_zone = {
                        ...response,
                        id: Number(response.id)
                    };
                    this.data.setSelectedZone(this.selected_zone);
                    this.data.clearZoneDetectionStatus();
                    this.fpnPage.presentAlert('Yay', 'We found your zone, device settings have been altered.');
                }
            },
            error: () => {
                this.data.setZoneDetectionStatus({
                    code: 'network',
                    message: 'Unable to confirm your zone. Please select a zone.',
                    updated_at: new Date().toISOString()
                });
            }
        });
    }
    loadData() {
        this.enviro_post = this.data.getEnviroPost();
        this.selected_site = this.data.getSelectedSite();
        this.selected_zone = this.data.getSelectedZone();
        this.app_log = this.data.getAppLog();
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.offenceGroups = this.data.getOffenceGroup();
        this.offences = this.data.getOffence();
        this.zones = this.data.getZones();
        this.filterZones();
        this.sites = this.data.getSites();
        this.getOffenceById(this.enviro_post.offence_id);
    }
    // zoneChange()
    // {
    //     //Nemo
    //     if (this.selected_zone)
    //     {
    //         this.enviro_post.zone_id = this.selected_zone.id;
    // this.saveEnviroData();
    //         this.data.setSelectedZone(this.selected_zone);
    //     }
    // }
    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        this.getOffenceById(this.enviro_post.offence_id);
        this.saveEnviroData();
    }
    filterZones() {
        const query = this.zoneSearch.trim().toLowerCase();
        if (!query) {
            this.filteredZones = this.zones;
            return;
        }
        this.filteredZones = this.zones.filter(zone => {
            return [
                zone.name,
                zone.town,
                zone.post_code,
                zone.address_line1,
                zone.address_line2
            ].some(value => (value || '').toLowerCase().includes(query));
        });
    }
    resetOffenceAndFilter() {
        this.enviro_post.offence_id = 0;
        this.filterOffences();
    }
    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
        if (this.enviro_post.zone_id > 0) {
            const zone = this.data.findZoneById(Number(this.enviro_post.zone_id));
            if (zone) {
                this.selected_zone = zone;
                this.data.setSelectedZone(zone);
                this.data.clearZoneDetectionStatus();
                this.zoneStatusMessage = '';
            }
        }
    }
    getOffenceById(id) {
        let offence = this.data.findOffenceById(id);
        if (offence) {
            this.offence = offence;
        }
        this.saveEnviroData();
    }
    watchZoneSelection() {
        this.subscriptions.push(this.data.selectedZoneChanges().subscribe(() => this.applySelectedZoneToForm()), this.data.zoneDetectionStatusChanges().subscribe(() => this.applySelectedZoneToForm()));
    }
    applySelectedZoneToForm() {
        this.selected_zone = this.data.getSelectedZone();
        this.zoneStatusMessage = this.getZoneStatusMessage();
        if (!this.enviro_post) {
            return;
        }
        if (this.enviro_post.zone_id <= 0 && this.selected_zone?.id && !this.isOutsideZone() && this.selectedZoneMatchesSite()) {
            this.enviro_post.zone_id = Number(this.selected_zone.id);
            this.data.setEnviroPost(this.enviro_post);
        }
        this.zones = this.data.getZones();
        this.filterZones();
    }
    getZoneStatusMessage() {
        const status = this.data.getZoneDetectionStatus();
        if (status.code === 'idle') {
            return '';
        }
        if (status.code === 'network' && this.data.checkSelectedZone()) {
            return '';
        }
        return status.message;
    }
    isOutsideZone() {
        return this.data.getZoneDetectionStatus().code === 'not_in_zone';
    }
    selectedZoneMatchesSite() {
        if (!this.selected_zone?.site_id || !this.selected_site?.id) {
            return true;
        }
        return this.selected_zone.site_id.toString() === this.selected_site.id.toString();
    }
    static { this.ɵfac = function Step1Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step1Component)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.EnviroPage)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step1Component, selectors: [["app-step1"]], decls: 26, vars: 11, consts: [[1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], ["interface", "action-sheet", "label", "Site *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ngModel", "disabled"], [3, "value", 4, "ngFor", "ngForOf"], ["placeholder", "Search zones", 3, "ngModelChange", "ionInput", "ngModel"], ["interface", "action-sheet", "label", "Zone *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["color", "danger", "class", "zone-status-message", 4, "ngIf"], ["expand", "block", "color", "light", 3, "click"], ["interface", "action-sheet", "label", "Offence group *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Offence *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModel", "ionChange", "ngModelChange", 4, "ngIf"], ["class", "ep-section", 4, "ngIf"], [1, "ep-page-end"], [3, "value"], ["color", "danger", 1, "zone-status-message"], ["interface", "action-sheet", "label", "Offence *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [1, "w-100"]], template: function Step1Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4, "Issue ticket");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Site offence detail");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-select", 4);
            i0.ɵɵtwoWayListener("ngModelChange", function Step1Component_Template_ion_select_ngModelChange_7_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.site_id, $event) || (ctx.enviro_post.site_id = $event); return $event; });
            i0.ɵɵtemplate(8, Step1Component_ion_select_option_8_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "ion-searchbar", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function Step1Component_Template_ion_searchbar_ngModelChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.zoneSearch, $event) || (ctx.zoneSearch = $event); return $event; });
            i0.ɵɵlistener("ionInput", function Step1Component_Template_ion_searchbar_ionInput_9_listener() { return ctx.filterZones(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "ion-select", 7);
            i0.ɵɵlistener("ionChange", function Step1Component_Template_ion_select_ionChange_10_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step1Component_Template_ion_select_ngModelChange_10_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.zone_id, $event) || (ctx.enviro_post.zone_id = $event); return $event; });
            i0.ɵɵtemplate(11, Step1Component_ion_select_option_11_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(12, Step1Component_ion_text_12_Template, 2, 1, "ion-text", 8);
            i0.ɵɵelementStart(13, "ion-button", 9);
            i0.ɵɵlistener("click", function Step1Component_Template_ion_button_click_13_listener() { return ctx.ZoneDetection(); });
            i0.ɵɵtext(14, "Find your zone");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(15, "section", 1)(16, "div", 2)(17, "p", 3);
            i0.ɵɵtext(18, "Offence");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "h3");
            i0.ɵɵtext(20, "What happened");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(21, "ion-select", 10);
            i0.ɵɵlistener("ionChange", function Step1Component_Template_ion_select_ionChange_21_listener() { return ctx.resetOffenceAndFilter(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step1Component_Template_ion_select_ngModelChange_21_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.offence_type_id, $event) || (ctx.enviro_post.offence_type_id = $event); return $event; });
            i0.ɵɵtemplate(22, Step1Component_ion_select_option_22_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(23, Step1Component_ion_select_23_Template, 2, 2, "ion-select", 11);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(24, Step1Component_section_24_Template, 24, 5, "section", 12);
            i0.ɵɵelement(25, "div", 13);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.site_id);
            i0.ɵɵproperty("disabled", true);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.sites);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.zoneSearch);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.zone_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.filteredZones);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.zoneStatusMessage);
            i0.ɵɵadvance(9);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.offence_type_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.offenceGroups);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.filteredOffences.length > 0);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.enviro_post.offence_id > 0);
        } }, dependencies: [i4.NgForOf, i4.NgIf, i5.NgControlStatus, i5.NgModel, i6.IonButton, i6.IonCard, i6.IonCardContent, i6.IonCardHeader, i6.IonCardSubtitle, i6.IonSearchbar, i6.IonSelect, i6.IonSelectOption, i6.IonText, i6.SelectValueAccessor, i6.TextValueAccessor], styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n\nion-card[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step1Component, [{
        type: Component,
        args: [{ selector: 'app-step1', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Issue ticket</p>\n      <h2>Site offence detail</h2>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Site *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"enviro_post.site_id\" [disabled]=\"true\">\n      <ion-select-option *ngFor=\"let site of sites\" [value]=\"site.id\">\n        {{ site.name }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-searchbar\n      [(ngModel)]=\"zoneSearch\"\n      (ionInput)=\"filterZones()\"\n      placeholder=\"Search zones\">\n    </ion-searchbar>\n\n    <ion-select interface=\"action-sheet\" label=\"Zone *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.zone_id\">\n      <ion-select-option *ngFor=\"let zone of filteredZones\" [value]=\"zone.id\">\n        {{ zone.name }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-text color=\"danger\" class=\"zone-status-message\" *ngIf=\"zoneStatusMessage\">{{ zoneStatusMessage }}</ion-text>\n\n    <ion-button expand=\"block\" color=\"light\" (click)=\"ZoneDetection()\">Find your zone</ion-button>\n  </section>\n\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Offence</p>\n      <h3>What happened</h3>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Offence group *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"resetOffenceAndFilter()\" multiple=\"false\" [(ngModel)]=\"enviro_post.offence_type_id\">\n      <ion-select-option *ngFor=\"let group of offenceGroups\" [value]=\"group.id\">\n        {{ group.englishName }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select *ngIf=\"filteredOffences.length > 0\" interface=\"action-sheet\" label=\"Offence *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"getOffenceById(enviro_post.offence_id)\" multiple=\"false\" [(ngModel)]=\"enviro_post.offence_id\">\n      <ion-select-option *ngFor=\"let offence of filteredOffences\" [value]=\"offence.id\">\n        {{ offence.name }}\n      </ion-select-option>\n    </ion-select>\n  </section>\n\n  <section class=\"ep-section\" *ngIf=\"enviro_post.offence_id > 0\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Legislation</p>\n      <h3>Legal detail</h3>\n    </div>\n\n    <ion-card class=\"w-100\">\n      <ion-card-header>\n        <ion-card-subtitle>Offence description</ion-card-subtitle>\n      </ion-card-header>\n      <ion-card-content>\n        {{ offence.description }}\n      </ion-card-content>\n    </ion-card>\n\n    <ion-card class=\"w-100\">\n      <ion-card-header>\n        <ion-card-subtitle>{{ offence.engLegislation?.title }} (English) legislation</ion-card-subtitle>\n      </ion-card-header>\n      <ion-card-content>\n        {{ offence.engLegislation?.legislation }}\n      </ion-card-content>\n    </ion-card>\n\n    <ion-card class=\"w-100\">\n      <ion-card-header>\n        <ion-card-subtitle>{{ offence.welLegislation?.title }} legislation</ion-card-subtitle>\n      </ion-card-header>\n      <ion-card-content>\n        {{ offence.welLegislation?.legislation }}\n      </ion-card-content>\n    </ion-card>\n  </section>\n\n  <div class=\"ep-page-end\"></div>\n</div>\n", styles: [":host {\n  display: block;\n}\n\nion-card {\n  margin: 0 0 12px;\n}\n"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.EnviroPage }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step1Component, { className: "Step1Component" }); })();
//# sourceMappingURL=step1.component.js.map