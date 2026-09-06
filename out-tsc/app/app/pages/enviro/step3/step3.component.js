import { Component } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/api.service";
import * as i2 from "../../../services/enforcementpro/data.service";
import * as i3 from "../enviro.page";
import * as i4 from "@angular/common";
import * as i5 from "@angular/forms";
import * as i6 from "@ionic/angular";
function Step3Component_ion_select_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 7);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r1.textOnMachine, " ");
} }
function Step3Component_ion_select_option_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 7);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r2.textOnMachine, " ");
} }
export class Step3Component {
    constructor(api, data, fpnPage) {
        this.api = api;
        this.data = data;
        this.fpnPage = fpnPage;
        this.ethnicities = [];
        this.address_verified_by = [];
        this.id_shown = [];
        this.enviro_post = new EnviroPost();
        this.compareIds = (option, selected) => {
            if (option === selected) {
                return true;
            }
            if (option == null || selected == null || option === '' || selected === '') {
                return false;
            }
            return String(option) === String(selected);
        };
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }
    ngOnInit() {
    }
    loadData() {
        this.address_verified_by = this.data.getAddressVerifiedBy();
        this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
            this.enviro_post.proof_of_address = this.asSelectId(this.enviro_post.proof_of_address);
            this.enviro_post.proof_of_id = this.asSelectId(this.enviro_post.proof_of_id);
        }
    }
    asSelectId(value) {
        if (value === '' || value === null || value === undefined) {
            return '';
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : value;
    }
    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }
    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    }
    static { this.ɵfac = function Step3Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step3Component)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.EnviroPage)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step3Component, selectors: [["app-step3"]], decls: 11, vars: 6, consts: [[1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], ["interface", "action-sheet", "label", "Proof of address *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "compareWith", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "action-sheet", "label", "Proof of ID *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "compareWith", "ngModel"], [3, "value"]], template: function Step3Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4, "Checks");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Validation details");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-select", 4);
            i0.ɵɵlistener("ionChange", function Step3Component_Template_ion_select_ionChange_7_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step3Component_Template_ion_select_ngModelChange_7_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.proof_of_address, $event) || (ctx.enviro_post.proof_of_address = $event); return $event; });
            i0.ɵɵtemplate(8, Step3Component_ion_select_option_8_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "ion-select", 6);
            i0.ɵɵlistener("ionChange", function Step3Component_Template_ion_select_ionChange_9_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step3Component_Template_ion_select_ngModelChange_9_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.proof_of_id, $event) || (ctx.enviro_post.proof_of_id = $event); return $event; });
            i0.ɵɵtemplate(10, Step3Component_ion_select_option_10_Template, 2, 2, "ion-select-option", 5);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵproperty("compareWith", ctx.compareIds);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.proof_of_address);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.address_verified_by);
            i0.ɵɵadvance();
            i0.ɵɵproperty("compareWith", ctx.compareIds);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.proof_of_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.id_shown);
        } }, dependencies: [i4.NgForOf, i5.NgControlStatus, i5.NgModel, i6.IonSelect, i6.IonSelectOption, i6.SelectValueAccessor], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step3Component, [{
        type: Component,
        args: [{ selector: 'app-step3', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Checks</p>\n      <h2>Validation details</h2>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Proof of address *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [compareWith]=\"compareIds\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.proof_of_address\">\n      <ion-select-option *ngFor=\"let group of address_verified_by\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Proof of ID *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [compareWith]=\"compareIds\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.proof_of_id\">\n      <ion-select-option *ngFor=\"let group of id_shown\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n  </section>\n</div>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.EnviroPage }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step3Component, { className: "Step3Component" }); })();
//# sourceMappingURL=step3.component.js.map