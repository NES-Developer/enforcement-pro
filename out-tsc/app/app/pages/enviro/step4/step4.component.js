import { Component } from '@angular/core';
import { EnviroPost } from 'src/app/models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/api.service";
import * as i2 from "../../../services/enforcementpro/data.service";
import * as i3 from "../enviro.page";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@ionic/angular";
function Step4Component_ion_select_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r1.textOnMachine, " ");
} }
function Step4Component_ion_select_option_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r2.textOnMachine, " ");
} }
export class Step4Component {
    // address_verified_by: AddressVerifiedBy[] = [];
    constructor(api, data, fpnPage) {
        this.api = api;
        this.data = data;
        this.fpnPage = fpnPage;
        this.ethnicities = [];
        this.offence_location_suffix = [];
        this.offence_how = [];
        this.enviro_post = new EnviroPost();
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }
    ngOnInit() {
    }
    loadData() {
        this.offence_location_suffix = this.data.getOffenceLocationSuffix();
        this.offence_how = this.data.getOffenceHow();
        let enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
    }
    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }
    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    }
    static { this.ɵfac = function Step4Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step4Component)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.EnviroPage)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step4Component, selectors: [["app-step4"]], decls: 18, vars: 9, consts: [[1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], ["interface", "action-sheet", "label", "Location *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "action-sheet", "label", "Action *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Language *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Offender reply", "label-placement", "stacked", "fill", "outline", "maxlength", "190", "auto-grow", "true", 3, "ionChange", "ngModelChange", "counter", "ngModel"], ["label", "Description", "label-placement", "stacked", "fill", "outline", "maxlength", "190", "auto-grow", "true", 3, "ionChange", "ngModelChange", "counter", "ngModel"], [3, "value"]], template: function Step4Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4, "Incident");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Offence detail");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-select", 4);
            i0.ɵɵlistener("ionChange", function Step4Component_Template_ion_select_ionChange_7_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step4Component_Template_ion_select_ngModelChange_7_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.location_id, $event) || (ctx.enviro_post.location_id = $event); return $event; });
            i0.ɵɵtemplate(8, Step4Component_ion_select_option_8_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "ion-select", 6);
            i0.ɵɵlistener("ionChange", function Step4Component_Template_ion_select_ionChange_9_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step4Component_Template_ion_select_ngModelChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.action_id, $event) || (ctx.enviro_post.action_id = $event); return $event; });
            i0.ɵɵtemplate(10, Step4Component_ion_select_option_10_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "ion-select", 7);
            i0.ɵɵlistener("ionChange", function Step4Component_Template_ion_select_ionChange_11_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step4Component_Template_ion_select_ngModelChange_11_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.language, $event) || (ctx.enviro_post.language = $event); return $event; });
            i0.ɵɵelementStart(12, "ion-select-option");
            i0.ɵɵtext(13, "English");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "ion-select-option");
            i0.ɵɵtext(15, "Welsh");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "ion-textarea", 8);
            i0.ɵɵlistener("ionChange", function Step4Component_Template_ion_textarea_ionChange_16_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step4Component_Template_ion_textarea_ngModelChange_16_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.offender_reply, $event) || (ctx.enviro_post.offender_reply = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "ion-textarea", 9);
            i0.ɵɵlistener("ionChange", function Step4Component_Template_ion_textarea_ionChange_17_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step4Component_Template_ion_textarea_ngModelChange_17_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.description, $event) || (ctx.enviro_post.description = $event); return $event; });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.location_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.offence_location_suffix);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.action_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.offence_how);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.language);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("counter", true);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.offender_reply);
            i0.ɵɵadvance();
            i0.ɵɵproperty("counter", true);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.description);
        } }, dependencies: [i4.NgForOf, i5.NgControlStatus, i5.MaxLengthValidator, i5.NgModel, i6.IonSelect, i6.IonSelectOption, i6.IonTextarea, i6.SelectValueAccessor, i6.TextValueAccessor], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step4Component, [{
        type: Component,
        args: [{ selector: 'app-step4', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Incident</p>\n      <h2>Offence detail</h2>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Location *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.location_id\">\n      <ion-select-option *ngFor=\"let group of offence_location_suffix\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Action *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.action_id\">\n      <ion-select-option *ngFor=\"let group of offence_how\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Language *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.language\">\n      <ion-select-option>English</ion-select-option>\n      <ion-select-option>Welsh</ion-select-option>\n    </ion-select>\n\n    <ion-textarea label=\"Offender reply\" label-placement=\"stacked\" fill=\"outline\" maxlength=\"190\" [counter]=\"true\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.offender_reply\"></ion-textarea>\n    <ion-textarea label=\"Description\" label-placement=\"stacked\" fill=\"outline\" maxlength=\"190\" [counter]=\"true\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.description\"></ion-textarea>\n  </section>\n</div>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.EnviroPage }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step4Component, { className: "Step4Component" }); })();
//# sourceMappingURL=step4.component.js.map