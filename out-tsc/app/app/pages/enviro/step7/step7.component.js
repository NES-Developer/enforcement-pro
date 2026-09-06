import { Component } from '@angular/core';
import { NotebookEntry } from '../../../models/notebook-entry';
import { EnviroPost } from '../../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/data.service";
import * as i2 from "../enviro.page";
import * as i3 from "@angular/common";
import * as i4 from "@angular/forms";
import * as i5 from "@ionic/angular";
function Step7Component_ion_select_option_21_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r1 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r1.textOnMachine, " ");
} }
function Step7Component_ion_select_option_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r2 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r2.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r2.textOnMachine, " ");
} }
function Step7Component_ion_select_option_44_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r3 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r3.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r3.textOnMachine, " ");
} }
function Step7Component_ion_select_option_49_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r4 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r4.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r4.visibility, " ");
} }
function Step7Component_ion_select_option_51_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const group_r5 = ctx.$implicit;
    i0.ɵɵproperty("value", group_r5.id);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", group_r5.textOnMachine, " ");
} }
function Step7Component_ng_container_57_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵelementStart(1, "div", 6)(2, "ion-input", 29);
    i0.ɵɵlistener("ionChange", function Step7Component_ng_container_57_Template_ion_input_ionChange_2_listener() { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r6.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_ng_container_57_Template_ion_input_ngModelChange_2_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r6.enviro_post.notebook_entries.witness_name, $event) || (ctx_r6.enviro_post.notebook_entries.witness_name = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ion-input", 30);
    i0.ɵɵlistener("ionChange", function Step7Component_ng_container_57_Template_ion_input_ionChange_3_listener() { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r6.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_ng_container_57_Template_ion_input_ngModelChange_3_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r6.enviro_post.notebook_entries.witness_phone, $event) || (ctx_r6.enviro_post.notebook_entries.witness_phone = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(4, "ion-input", 31);
    i0.ɵɵlistener("ionChange", function Step7Component_ng_container_57_Template_ion_input_ionChange_4_listener() { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r6.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_ng_container_57_Template_ion_input_ngModelChange_4_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r6.enviro_post.notebook_entries.witness_address, $event) || (ctx_r6.enviro_post.notebook_entries.witness_address = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "ion-textarea", 32);
    i0.ɵɵlistener("ionChange", function Step7Component_ng_container_57_Template_ion_textarea_ionChange_5_listener() { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r6.saveEnviroData()); });
    i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_ng_container_57_Template_ion_textarea_ngModelChange_5_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r6 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r6.enviro_post.notebook_entries.witness_statement, $event) || (ctx_r6.enviro_post.notebook_entries.witness_statement = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const ctx_r6 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r6.enviro_post.notebook_entries.witness_name);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r6.enviro_post.notebook_entries.witness_phone);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r6.enviro_post.notebook_entries.witness_address);
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("ngModel", ctx_r6.enviro_post.notebook_entries.witness_statement);
} }
export class Step7Component {
    get ethnicities() {
        return this.data.getEthnicities() || [];
    }
    get weather() {
        return this.data.getWeather() || [];
    }
    get visibility() {
        return this.data.getVisibility() || [];
    }
    get builds() {
        return this.data.getBuilds() || [];
    }
    get hair_colours() {
        return this.data.getHairColours() || [];
    }
    constructor(data, fpnPage) {
        this.data = data;
        this.fpnPage = fpnPage;
        // enviro_post: EnviroPost;
        this.enviro_post = new EnviroPost();
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.enviro_post = this.data.getEnviroPost() || new EnviroPost();
        if (!this.enviro_post.notebook_entries) {
            this.enviro_post.notebook_entries = new NotebookEntry();
        }
    }
    ngOnInit() {
    }
    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }
    saveEnviroData() {
        this.onInputChange();
        if (!this.enviro_post.notebook_entries) {
            this.enviro_post.notebook_entries = new NotebookEntry();
        }
        this.data.setEnviroPost(this.enviro_post);
    }
    static { this.ɵfac = function Step7Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step7Component)(i0.ɵɵdirectiveInject(i1.DataService), i0.ɵɵdirectiveInject(i2.EnviroPage)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step7Component, selectors: [["app-step7"]], decls: 60, vars: 26, consts: [[1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], ["interface", "action-sheet", "label", "Is FPN advised *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], ["interface", "action-sheet", "label", "Is FPN handed *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], [1, "ep-field-row"], ["label", "Height in feet", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Height in inch", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["interface", "action-sheet", "label", "Build", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "action-sheet", "label", "Hair colours *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Distance from offender", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Distinguishing features", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Nearest bin", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Offender comments", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Police comments", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "BWC asset", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ngModelChange", "ionChange", "ngModel"], ["interface", "action-sheet", "label", "Gender *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Ethnicity *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Caution 1", "label-placement", "stacked", "fill", "outline", "type", "time", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Caution 2", "label-placement", "stacked", "fill", "outline", "type", "time", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Visibility *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Weather *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Is witness available?", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [4, "ngIf"], ["label", "Officer statement", "label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "ionChange", "ngModelChange", "ngModel"], [1, "ep-page-end"], [3, "value"], ["label", "Witness name", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Witness phone", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Witness address", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Witness statement", "label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "ionChange", "ngModelChange", "ngModel"]], template: function Step7Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4, "Field notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Notebook entries");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-select", 4);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_7_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.is_fpn_advised, $event) || (ctx.enviro_post.notebook_entries.is_fpn_advised = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_7_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementStart(8, "ion-select-option");
            i0.ɵɵtext(9, "yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "ion-select-option");
            i0.ɵɵtext(11, "no");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "ion-select", 5);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.is_fpn_handed, $event) || (ctx.enviro_post.notebook_entries.is_fpn_handed = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_12_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementStart(13, "ion-select-option");
            i0.ɵɵtext(14, "yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "ion-select-option");
            i0.ɵɵtext(16, "no");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 6)(18, "ion-input", 7);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_18_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.height_in_feet, $event) || (ctx.enviro_post.notebook_entries.height_in_feet = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_18_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "ion-input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_19_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.height_in_inch, $event) || (ctx.enviro_post.notebook_entries.height_in_inch = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_19_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "ion-select", 9);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_20_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.build, $event) || (ctx.enviro_post.notebook_entries.build = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_20_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtemplate(21, Step7Component_ion_select_option_21_Template, 2, 2, "ion-select-option", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "ion-select", 11);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_22_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.hair, $event) || (ctx.enviro_post.notebook_entries.hair = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_22_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtemplate(23, Step7Component_ion_select_option_23_Template, 2, 2, "ion-select-option", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "ion-input", 12);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_24_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.distance_from_offender, $event) || (ctx.enviro_post.notebook_entries.distance_from_offender = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_24_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "ion-input", 13);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_25_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.distinguishing_features, $event) || (ctx.enviro_post.notebook_entries.distinguishing_features = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_25_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "ion-input", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_26_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.nearest_bin, $event) || (ctx.enviro_post.notebook_entries.nearest_bin = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_26_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(27, "ion-input", 15);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_27_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.offender_comments, $event) || (ctx.enviro_post.notebook_entries.offender_comments = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_27_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "ion-input", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_28_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.police_comments, $event) || (ctx.enviro_post.notebook_entries.police_comments = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_28_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(29, "ion-input", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_29_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.bwv_assest, $event) || (ctx.enviro_post.notebook_entries.bwv_assest = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_29_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "section", 1)(31, "div", 2)(32, "p", 3);
            i0.ɵɵtext(33, "Extra");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "h3");
            i0.ɵɵtext(35, "FPN details");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(36, "ion-select", 18);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_36_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_36_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.gender, $event) || (ctx.enviro_post.notebook_entries.gender = $event); return $event; });
            i0.ɵɵelementStart(37, "ion-select-option");
            i0.ɵɵtext(38, "Male");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "ion-select-option");
            i0.ɵɵtext(40, "Female");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(41, "ion-select-option");
            i0.ɵɵtext(42, "Other");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(43, "ion-select", 19);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_43_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_43_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.ethnicity_id, $event) || (ctx.enviro_post.notebook_entries.ethnicity_id = $event); return $event; });
            i0.ɵɵtemplate(44, Step7Component_ion_select_option_44_Template, 2, 2, "ion-select-option", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(45, "div", 6)(46, "ion-input", 20);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_46_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_46_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.caution, $event) || (ctx.enviro_post.notebook_entries.caution = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(47, "ion-input", 21);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_input_ionChange_47_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_input_ngModelChange_47_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.second_caution, $event) || (ctx.enviro_post.notebook_entries.second_caution = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(48, "ion-select", 22);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_48_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_48_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.visibility_id, $event) || (ctx.enviro_post.notebook_entries.visibility_id = $event); return $event; });
            i0.ɵɵtemplate(49, Step7Component_ion_select_option_49_Template, 2, 2, "ion-select-option", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "ion-select", 23);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_50_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_50_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.weather_id, $event) || (ctx.enviro_post.notebook_entries.weather_id = $event); return $event; });
            i0.ɵɵtemplate(51, Step7Component_ion_select_option_51_Template, 2, 2, "ion-select-option", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "ion-select", 24);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_select_ionChange_52_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_select_ngModelChange_52_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.is_witness_available, $event) || (ctx.enviro_post.notebook_entries.is_witness_available = $event); return $event; });
            i0.ɵɵelementStart(53, "ion-select-option");
            i0.ɵɵtext(54, "Yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(55, "ion-select-option");
            i0.ɵɵtext(56, "No");
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(57, Step7Component_ng_container_57_Template, 6, 4, "ng-container", 25);
            i0.ɵɵelementStart(58, "ion-textarea", 26);
            i0.ɵɵlistener("ionChange", function Step7Component_Template_ion_textarea_ionChange_58_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step7Component_Template_ion_textarea_ngModelChange_58_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.notebook_entries.officer_statement, $event) || (ctx.enviro_post.notebook_entries.officer_statement = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(59, "div", 27);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.is_fpn_advised);
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.is_fpn_handed);
            i0.ɵɵadvance(6);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.height_in_feet);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.height_in_inch);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.build);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.builds);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.hair);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.hair_colours);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.distance_from_offender);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.distinguishing_features);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.nearest_bin);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.offender_comments);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.police_comments);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.bwv_assest);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.gender);
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.ethnicity_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.ethnicities);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.caution);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.second_caution);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.visibility_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.visibility);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.weather_id);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.weather);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.is_witness_available);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("ngIf", ctx.enviro_post.notebook_entries.is_witness_available === "Yes");
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.notebook_entries.officer_statement);
        } }, dependencies: [i3.NgForOf, i3.NgIf, i4.NgControlStatus, i4.MaxLengthValidator, i4.NgModel, i5.IonInput, i5.IonSelect, i5.IonSelectOption, i5.IonTextarea, i5.SelectValueAccessor, i5.TextValueAccessor], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step7Component, [{
        type: Component,
        args: [{ selector: 'app-step7', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Field notes</p>\n      <h2>Notebook entries</h2>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Is FPN advised *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"enviro_post.notebook_entries.is_fpn_advised\" (ionChange)=\"saveEnviroData()\">\n      <ion-select-option>yes</ion-select-option>\n      <ion-select-option>no</ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Is FPN handed *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"enviro_post.notebook_entries.is_fpn_handed\" (ionChange)=\"saveEnviroData()\">\n      <ion-select-option>yes</ion-select-option>\n      <ion-select-option>no</ion-select-option>\n    </ion-select>\n\n    <div class=\"ep-field-row\">\n      <ion-input label=\"Height in feet\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.height_in_feet\" (ionChange)=\"saveEnviroData()\"></ion-input>\n      <ion-input label=\"Height in inch\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.height_in_inch\" (ionChange)=\"saveEnviroData()\"></ion-input>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Build\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"enviro_post.notebook_entries.build\" (ionChange)=\"saveEnviroData()\">\n      <ion-select-option *ngFor=\"let group of builds\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Hair colours *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" [(ngModel)]=\"enviro_post.notebook_entries.hair\" (ionChange)=\"saveEnviroData()\">\n      <ion-select-option *ngFor=\"let group of hair_colours\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-input label=\"Distance from offender\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.distance_from_offender\" (ionChange)=\"saveEnviroData()\"></ion-input>\n    <ion-input label=\"Distinguishing features\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.distinguishing_features\" (ionChange)=\"saveEnviroData()\"></ion-input>\n    <ion-input label=\"Nearest bin\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.nearest_bin\" (ionChange)=\"saveEnviroData()\"></ion-input>\n    <ion-input label=\"Offender comments\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.offender_comments\" (ionChange)=\"saveEnviroData()\"></ion-input>\n    <ion-input label=\"Police comments\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.police_comments\" (ionChange)=\"saveEnviroData()\"></ion-input>\n    <ion-input label=\"BWC asset\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" [(ngModel)]=\"enviro_post.notebook_entries.bwv_assest\" (ionChange)=\"saveEnviroData()\"></ion-input>\n  </section>\n\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Extra</p>\n      <h3>FPN details</h3>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Gender *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"saveEnviroData()\" multiple=\"false\" [(ngModel)]=\"enviro_post.notebook_entries.gender\">\n      <ion-select-option>Male</ion-select-option>\n      <ion-select-option>Female</ion-select-option>\n      <ion-select-option>Other</ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Ethnicity *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.ethnicity_id\">\n      <ion-select-option *ngFor=\"let group of ethnicities\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <div class=\"ep-field-row\">\n      <ion-input label=\"Caution 1\" label-placement=\"stacked\" fill=\"outline\" type=\"time\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.caution\"></ion-input>\n      <ion-input label=\"Caution 2\" label-placement=\"stacked\" fill=\"outline\" type=\"time\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.second_caution\"></ion-input>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Visibility *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.visibility_id\">\n      <ion-select-option *ngFor=\"let group of visibility\" [value]=\"group.id\">\n        {{ group.visibility }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Weather *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.weather_id\">\n      <ion-select-option *ngFor=\"let group of weather\" [value]=\"group.id\">\n        {{ group.textOnMachine }}\n      </ion-select-option>\n    </ion-select>\n\n    <ion-select interface=\"action-sheet\" label=\"Is witness available?\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.is_witness_available\">\n      <ion-select-option>Yes</ion-select-option>\n      <ion-select-option>No</ion-select-option>\n    </ion-select>\n\n    <ng-container *ngIf=\"enviro_post.notebook_entries.is_witness_available === 'Yes'\">\n      <div class=\"ep-field-row\">\n        <ion-input label=\"Witness name\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.witness_name\"></ion-input>\n        <ion-input label=\"Witness phone\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.witness_phone\"></ion-input>\n      </div>\n      <ion-input label=\"Witness address\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.witness_address\"></ion-input>\n      <ion-textarea label=\"Witness statement\" label-placement=\"stacked\" fill=\"outline\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.witness_statement\"></ion-textarea>\n    </ng-container>\n\n    <ion-textarea label=\"Officer statement\" label-placement=\"stacked\" fill=\"outline\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.notebook_entries.officer_statement\"></ion-textarea>\n  </section>\n\n  <div class=\"ep-page-end\"></div>\n</div>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.DataService }, { type: i2.EnviroPage }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step7Component, { className: "Step7Component" }); })();
//# sourceMappingURL=step7.component.js.map