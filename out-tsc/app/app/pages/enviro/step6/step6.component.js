import { Component, HostListener, ViewChild } from '@angular/core';
import { bindSignaturePad } from '../../../helpers/signature-canvas';
import { UpperCaseWords } from 'src/app/helpers/utils';
import { EnviroPost } from '../../../models/enviro';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/data.service";
import * as i2 from "../enviro.page";
import * as i3 from "@angular/common";
import * as i4 from "@ionic/angular";
const _c0 = ["canvas"];
function Step6Component_img_112_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 23);
} if (rf & 2) {
    const offence_image_r1 = ctx.$implicit;
    i0.ɵɵproperty("src", offence_image_r1, i0.ɵɵsanitizeUrl);
} }
function Step6Component_h3_133_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3");
    i0.ɵɵtext(1, "Add your digital signature");
    i0.ɵɵelementEnd();
} }
function Step6Component_h3_134_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3");
    i0.ɵɵtext(1, "Your stored digital signature");
    i0.ɵɵelementEnd();
} }
function Step6Component_img_135_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 24);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("src", ctx_r1.enviro_post.signature, i0.ɵɵsanitizeUrl);
} }
function Step6Component_canvas_136_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "canvas", null, 0);
} }
function Step6Component_ion_button_140_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 25);
    i0.ɵɵlistener("click", function Step6Component_ion_button_140_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.save()); });
    i0.ɵɵtext(1, "Save");
    i0.ɵɵelementEnd();
} }
export class Step6Component {
    constructor(data, fpnPage) {
        this.data = data;
        this.fpnPage = fpnPage;
        this.enviro_post = new EnviroPost();
        this.today = Date.now();
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }
    ngOnInit() {
    }
    ngAfterViewChecked() {
        this.bindSignaturePad();
    }
    onWindowResize() {
        this.bindSignaturePad(true);
    }
    clear() {
        this.signaturePad?.clear();
        this.lastCanvas = undefined;
        this.enviro_post.signature = '';
        this.saveEnviroData();
    }
    save() {
        if (!this.signaturePad || this.signaturePad.isEmpty()) {
            this.fpnPage.presentAlert('Wait!', 'Please sign first, then tap Save.');
            return;
        }
        this.enviro_post.signature = this.signaturePad.toDataURL();
        this.lastCanvas = undefined;
        this.saveEnviroData();
    }
    loadData() {
        let enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
        this.selected_site_offence = this.data.findSiteOffence(this.enviro_post.offence_id);
    }
    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }
    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    }
    getNameById(id, from) {
        let name = "";
        switch (from) {
            case "site":
                let site = this.data.getSelectedSite();
                name = site.name;
                break;
            case "zone":
                const zone = this.data.findZoneById(id);
                if (zone) {
                    name = zone.name;
                }
                break;
            case "offence_type":
                const offence_type = this.data.findOffenceGroupId(id);
                if (offence_type) {
                    name = offence_type.englishName;
                }
                break;
            case "offence":
                const offence = this.data.findOffenceById(id);
                if (offence) {
                    name = offence.name;
                }
                break;
        }
        return name;
    }
    bindSignaturePad(force = false) {
        const canvas = this.canvasEl?.nativeElement;
        if (!canvas || (!force && canvas === this.lastCanvas)) {
            return;
        }
        this.signaturePad = bindSignaturePad(canvas, this.signaturePad, 500, 180);
        this.lastCanvas = canvas;
    }
    static { this.ɵfac = function Step6Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step6Component)(i0.ɵɵdirectiveInject(i1.DataService), i0.ɵɵdirectiveInject(i2.EnviroPage)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step6Component, selectors: [["app-step6"]], viewQuery: function Step6Component_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvasEl = _t.first);
        } }, hostBindings: function Step6Component_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function Step6Component_resize_HostBindingHandler() { return ctx.onWindowResize(); }, false, i0.ɵɵresolveWindow);
        } }, decls: 144, vars: 31, consts: [["canvas", ""], [1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], [1, "ep-accord"], ["value", "first"], ["slot", "header"], ["slot", "content"], [1, "ep-review-row"], ["value", "second"], ["value", "place"], ["value", "fourth"], [1, "ep-photo-grid"], ["alt", "", 3, "src", 4, "ngFor", "ngForOf"], ["value", "fifth"], [1, "ep-section", "ep-sig"], [4, "ngIf"], ["class", "ep-sig__preview", "alt", "Saved signature", 3, "src", 4, "ngIf"], [1, "ep-actions", "ep-actions--split", 2, "margin-top", "12px"], ["expand", "block", "color", "medium", 3, "click"], ["expand", "block", 3, "click", 4, "ngIf"], [1, "ep-ticket__meta", 2, "text-align", "center", "margin-top", "10px"], ["alt", "", 3, "src"], ["alt", "Saved signature", 1, "ep-sig__preview", 3, "src"], ["expand", "block", 3, "click"]], template: function Step6Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1)(1, "section", 2)(2, "div", 3)(3, "p", 4);
            i0.ɵɵtext(4, "Review");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Confirmation");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-accordion-group", 5)(8, "ion-accordion", 6)(9, "ion-item", 7)(10, "ion-label");
            i0.ɵɵtext(11, "Offence detail");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "div", 8)(13, "dl")(14, "div", 9)(15, "dt");
            i0.ɵɵtext(16, "Site");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "dd");
            i0.ɵɵtext(18);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div", 9)(20, "dt");
            i0.ɵɵtext(21, "Zone");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "dd");
            i0.ɵɵtext(23);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(24, "div", 9)(25, "dt");
            i0.ɵɵtext(26, "Offence type");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "dd");
            i0.ɵɵtext(28);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(29, "div", 9)(30, "dt");
            i0.ɵɵtext(31, "Offence");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "dd");
            i0.ɵɵtext(33);
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(34, "ion-accordion", 10)(35, "ion-item", 7)(36, "ion-label");
            i0.ɵɵtext(37, "Offender detail");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(38, "div", 8)(39, "dl")(40, "div", 9)(41, "dt");
            i0.ɵɵtext(42, "Full name");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "dd");
            i0.ɵɵtext(44);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "div", 9)(46, "dt");
            i0.ɵɵtext(47, "Address");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "dd");
            i0.ɵɵtext(49);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(50, "div", 9)(51, "dt");
            i0.ɵɵtext(52, "Postal code");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(53, "dd");
            i0.ɵɵtext(54);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(55, "div", 9)(56, "dt");
            i0.ɵɵtext(57, "Date of birth");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(58, "dd");
            i0.ɵɵtext(59);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(60, "div", 9)(61, "dt");
            i0.ɵɵtext(62, "BWC advised");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(63, "dd");
            i0.ɵɵtext(64);
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(65, "ion-accordion", 11)(66, "ion-item", 7)(67, "ion-label");
            i0.ɵɵtext(68, "Location and time");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(69, "div", 8)(70, "dl")(71, "div", 9)(72, "dt");
            i0.ɵɵtext(73, "Offence location");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(74, "dd");
            i0.ɵɵtext(75);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(76, "div", 9)(77, "dt");
            i0.ɵɵtext(78, "POI");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "dd");
            i0.ɵɵtext(80);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(81, "div", 9)(82, "dt");
            i0.ɵɵtext(83, "Proof of address");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(84, "dd");
            i0.ɵɵtext(85);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(86, "div", 9)(87, "dt");
            i0.ɵɵtext(88, "Proof of ID");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(89, "dd");
            i0.ɵɵtext(90);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(91, "div", 9)(92, "dt");
            i0.ɵɵtext(93, "Offence time");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(94, "dd");
            i0.ɵɵtext(95);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(96, "div", 9)(97, "dt");
            i0.ɵɵtext(98, "Issue time");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(99, "dd");
            i0.ɵɵtext(100);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(101, "div", 9)(102, "dt");
            i0.ɵɵtext(103, "Postal FPN");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(104, "dd");
            i0.ɵɵtext(105);
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(106, "ion-accordion", 12)(107, "ion-item", 7)(108, "ion-label");
            i0.ɵɵtext(109, "Offence images");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(110, "div", 8)(111, "div", 13);
            i0.ɵɵtemplate(112, Step6Component_img_112_Template, 1, 1, "img", 14);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(113, "ion-accordion", 15)(114, "ion-item", 7)(115, "ion-label");
            i0.ɵɵtext(116, "Charges");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(117, "div", 8)(118, "dl")(119, "div", 9)(120, "dt");
            i0.ɵɵtext(121, "Reduced");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(122, "dd");
            i0.ɵɵtext(123);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(124, "div", 9)(125, "dt");
            i0.ɵɵtext(126, "Full");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(127, "dd");
            i0.ɵɵtext(128);
            i0.ɵɵelementEnd()()()()()()();
            i0.ɵɵelementStart(129, "section", 16)(130, "div", 3)(131, "p", 4);
            i0.ɵɵtext(132, "Sign-off");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(133, Step6Component_h3_133_Template, 2, 0, "h3", 17)(134, Step6Component_h3_134_Template, 2, 0, "h3", 17);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(135, Step6Component_img_135_Template, 1, 1, "img", 18)(136, Step6Component_canvas_136_Template, 2, 0, "canvas", 17);
            i0.ɵɵelementStart(137, "div", 19)(138, "ion-button", 20);
            i0.ɵɵlistener("click", function Step6Component_Template_ion_button_click_138_listener() { return ctx.clear(); });
            i0.ɵɵtext(139, "Clear");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(140, Step6Component_ion_button_140_Template, 2, 0, "ion-button", 21);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(141, "p", 22);
            i0.ɵɵtext(142);
            i0.ɵɵpipe(143, "date");
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(18);
            i0.ɵɵtextInterpolate(ctx.getNameById(0, "site"));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.getNameById(ctx.enviro_post.zone_id, "zone"));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.getNameById(ctx.enviro_post.offence_type_id, "offence_type"));
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.getNameById(ctx.enviro_post.offence_id, "offence"));
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate2("", ctx.enviro_post.first_name, " ", ctx.enviro_post.last_name, "");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.address);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.post_code);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.date_of_birth);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.is_bwc_active);
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(ctx.enviro_post.offence_location);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.poi);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.proof_of_address);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.proof_of_id);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.offence_datetime);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.issue_datetime);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.enviro_post.fpn_issued === 0 ? "Yes" : "No");
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("ngForOf", ctx.enviro_post.offence_images);
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate2("\u00A3", ctx.selected_site_offence == null ? null : ctx.selected_site_offence.charge_amount_reduced, " if paid within ", ctx.selected_site_offence == null ? null : ctx.selected_site_offence.charge_days_reduced, " days");
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate2("\u00A3", ctx.selected_site_offence == null ? null : ctx.selected_site_offence.charge_amount_full, " if paid within ", ctx.selected_site_offence == null ? null : ctx.selected_site_offence.charge_days_full, " days");
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", !ctx.enviro_post.signature);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.enviro_post.signature);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.enviro_post.signature);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.enviro_post.signature);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngIf", !ctx.enviro_post.signature);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(143, 28, ctx.today, "medium"));
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.IonAccordion, i4.IonAccordionGroup, i4.IonButton, i4.IonItem, i4.IonLabel, i3.DatePipe], styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n\n.ep-sig[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%], \n.ep-sig__preview[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 180px;\n  background: #ece6d6;\n  border-radius: 16px;\n}\n\n.ep-sig__preview[_ngcontent-%COMP%] {\n  object-fit: contain;\n}\n\n.ep-photo-grid[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 80px;\n  object-fit: cover;\n  border-radius: 10px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step6Component, [{
        type: Component,
        args: [{ selector: 'app-step6', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Review</p>\n      <h2>Confirmation</h2>\n    </div>\n\n    <ion-accordion-group class=\"ep-accord\">\n      <ion-accordion value=\"first\">\n        <ion-item slot=\"header\">\n          <ion-label>Offence detail</ion-label>\n        </ion-item>\n        <div slot=\"content\">\n          <dl>\n            <div class=\"ep-review-row\">\n              <dt>Site</dt>\n              <dd>{{ getNameById(0,'site') }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Zone</dt>\n              <dd>{{ getNameById(enviro_post.zone_id, 'zone') }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Offence type</dt>\n              <dd>{{ getNameById(enviro_post.offence_type_id, 'offence_type') }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Offence</dt>\n              <dd>{{ getNameById(enviro_post.offence_id, 'offence') }}</dd>\n            </div>\n          </dl>\n        </div>\n      </ion-accordion>\n\n      <ion-accordion value=\"second\">\n        <ion-item slot=\"header\">\n          <ion-label>Offender detail</ion-label>\n        </ion-item>\n        <div slot=\"content\">\n          <dl>\n            <div class=\"ep-review-row\">\n              <dt>Full name</dt>\n              <dd>{{ enviro_post.first_name }} {{ enviro_post.last_name }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Address</dt>\n              <dd>{{ enviro_post.address }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Postal code</dt>\n              <dd>{{ enviro_post.post_code }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Date of birth</dt>\n              <dd>{{ enviro_post.date_of_birth }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>BWC advised</dt>\n              <dd>{{ enviro_post.is_bwc_active }}</dd>\n            </div>\n          </dl>\n        </div>\n      </ion-accordion>\n\n      <ion-accordion value=\"place\">\n        <ion-item slot=\"header\">\n          <ion-label>Location and time</ion-label>\n        </ion-item>\n        <div slot=\"content\">\n          <dl>\n            <div class=\"ep-review-row\">\n              <dt>Offence location</dt>\n              <dd>{{ enviro_post.offence_location }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>POI</dt>\n              <dd>{{ enviro_post.poi }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Proof of address</dt>\n              <dd>{{ enviro_post.proof_of_address }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Proof of ID</dt>\n              <dd>{{ enviro_post.proof_of_id }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Offence time</dt>\n              <dd>{{ enviro_post.offence_datetime }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Issue time</dt>\n              <dd>{{ enviro_post.issue_datetime }}</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Postal FPN</dt>\n              <dd>{{ enviro_post.fpn_issued === 0 ? 'Yes' : 'No' }}</dd>\n            </div>\n          </dl>\n        </div>\n      </ion-accordion>\n\n      <ion-accordion value=\"fourth\">\n        <ion-item slot=\"header\">\n          <ion-label>Offence images</ion-label>\n        </ion-item>\n        <div slot=\"content\">\n          <div class=\"ep-photo-grid\">\n            <img *ngFor=\"let offence_image of enviro_post.offence_images\" [src]=\"offence_image\" alt=\"\" />\n          </div>\n        </div>\n      </ion-accordion>\n\n      <ion-accordion value=\"fifth\">\n        <ion-item slot=\"header\">\n          <ion-label>Charges</ion-label>\n        </ion-item>\n        <div slot=\"content\">\n          <dl>\n            <div class=\"ep-review-row\">\n              <dt>Reduced</dt>\n              <dd>\u00A3{{ selected_site_offence?.charge_amount_reduced }} if paid within {{ selected_site_offence?.charge_days_reduced }} days</dd>\n            </div>\n            <div class=\"ep-review-row\">\n              <dt>Full</dt>\n              <dd>\u00A3{{ selected_site_offence?.charge_amount_full }} if paid within {{ selected_site_offence?.charge_days_full }} days</dd>\n            </div>\n          </dl>\n        </div>\n      </ion-accordion>\n    </ion-accordion-group>\n  </section>\n\n  <section class=\"ep-section ep-sig\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Sign-off</p>\n      <h3 *ngIf=\"!enviro_post.signature\">Add your digital signature</h3>\n      <h3 *ngIf=\"enviro_post.signature\">Your stored digital signature</h3>\n    </div>\n\n    <img *ngIf=\"enviro_post.signature\" class=\"ep-sig__preview\" [src]=\"enviro_post.signature\" alt=\"Saved signature\" />\n    <canvas *ngIf=\"!enviro_post.signature\" #canvas></canvas>\n\n    <div class=\"ep-actions ep-actions--split\" style=\"margin-top: 12px;\">\n      <ion-button expand=\"block\" color=\"medium\" (click)=\"clear()\">Clear</ion-button>\n      <ion-button expand=\"block\" *ngIf=\"!enviro_post.signature\" (click)=\"save()\">Save</ion-button>\n    </div>\n    <p class=\"ep-ticket__meta\" style=\"text-align:center; margin-top: 10px;\">{{ today | date:'medium' }}</p>\n  </section>\n</div>\n", styles: [":host {\n  display: block;\n}\n\n.ep-sig canvas,\n.ep-sig__preview {\n  display: block;\n  width: 100%;\n  height: 180px;\n  background: #ece6d6;\n  border-radius: 16px;\n}\n\n.ep-sig__preview {\n  object-fit: contain;\n}\n\n.ep-photo-grid img {\n  width: 100%;\n  height: 80px;\n  object-fit: cover;\n  border-radius: 10px;\n}\n"] }]
    }], () => [{ type: i1.DataService }, { type: i2.EnviroPage }], { canvasEl: [{
            type: ViewChild,
            args: ['canvas']
        }], onWindowResize: [{
            type: HostListener,
            args: ['window:resize']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step6Component, { className: "Step6Component" }); })();
//# sourceMappingURL=step6.component.js.map