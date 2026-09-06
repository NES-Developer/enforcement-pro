import { Component, HostListener, ViewChild, ViewChildren } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { enviroStepperStep } from '../../helpers/fpn-core-validation';
import { bindSignaturePad } from '../../helpers/signature-canvas';
import { EnviroPost } from '../../models/enviro';
import * as i0 from "@angular/core";
import * as i1 from "../../services/lemo-ai.service";
import * as i2 from "../../services/enforcementpro/api.service";
import * as i3 from "../../services/enforcementpro/data.service";
import * as i4 from "@angular/router";
import * as i5 from "@ionic/angular";
import * as i6 from "../../services/geocoding.service";
import * as i7 from "@angular/common";
import * as i8 from "@angular/forms";
import * as i9 from "../../components/nav-bar/nav-bar.component";
import * as i10 from "../../components/evidence-capture/evidence-capture.component";
const _c0 = ["notebookSection"];
const _c1 = ["signatureCanvas"];
function LemoPage_span_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" \u00B7 ", ctx_r1.zoneName, "");
} }
function LemoPage_article_25_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "article", 24)(1, "div", 25)(2, "div")(3, "h3", 26);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 27);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "ion-badge", 28);
    i0.ɵɵtext(8, "In progress");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "div", 29)(10, "ion-button", 30);
    i0.ɵɵlistener("click", function LemoPage_article_25_Template_ion_button_click_10_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.continueInStepper()); });
    i0.ɵɵtext(11, "Continue in FPN form");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.draftTitle);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.draftSummary);
} }
function LemoPage_article_26_ion_badge_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-badge");
    i0.ɵɵtext(1, "Notebook found");
    i0.ɵɵelementEnd();
} }
function LemoPage_article_26_ion_badge_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-badge", 33);
    i0.ɵɵtext(1, "Needs notebook");
    i0.ɵɵelementEnd();
} }
function LemoPage_article_26_ion_button_10_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 30);
    i0.ɵɵlistener("click", function LemoPage_article_26_ion_button_10_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const fpn_r5 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.openIssuedNotebook(fpn_r5)); });
    i0.ɵɵtext(1, " Open notebook ");
    i0.ɵɵelementEnd();
} }
function LemoPage_article_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 24)(1, "div", 25)(2, "div")(3, "h3", 26);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 27);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵtemplate(7, LemoPage_article_26_ion_badge_7_Template, 2, 0, "ion-badge", 10)(8, LemoPage_article_26_ion_badge_8_Template, 2, 0, "ion-badge", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "div", 29);
    i0.ɵɵtemplate(10, LemoPage_article_26_ion_button_10_Template, 2, 0, "ion-button", 32);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const fpn_r5 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(fpn_r5.fpn_number || "Issued FPN");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.issuedSummary(fpn_r5));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.notebookEntryIsEmpty(fpn_r5));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.notebookEntryIsEmpty(fpn_r5));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngIf", ctx_r1.notebookEntryIsEmpty(fpn_r5));
} }
function LemoPage_div_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 34)(1, "h3");
    i0.ɵɵtext(2, "No issued FPN yet");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p");
    i0.ɵɵtext(4, "Posted tickets will preview here. Open the FPN form to continue a notice.");
    i0.ɵɵelementEnd()();
} }
function LemoPage_article_31_div_5_button_1_p_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const card_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(card_r7.legislationTitle);
} }
function LemoPage_article_31_div_5_button_1_p_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const card_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(card_r7.legislation);
} }
function LemoPage_article_31_div_5_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 45);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_5_button_1_Template_button_click_0_listener() { const card_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.useOffence(card_r7)); });
    i0.ɵɵelementStart(1, "p", 8);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "h3");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, LemoPage_article_31_div_5_button_1_p_5_Template, 2, 1, "p", 10)(6, LemoPage_article_31_div_5_button_1_p_6_Template, 2, 1, "p", 10);
    i0.ɵɵelementStart(7, "span");
    i0.ɵɵtext(8, "Use this offence");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const card_r7 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r7.groupName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r7.name);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", card_r7.legislationTitle);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", card_r7.legislation);
} }
function LemoPage_article_31_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 43);
    i0.ɵɵtemplate(1, LemoPage_article_31_div_5_button_1_Template, 9, 4, "button", 44);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const message_r8 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", message_r8.offenceCards);
} }
function LemoPage_article_31_div_6_ion_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 48);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_6_ion_button_1_Template_ion_button_click_0_listener() { const choice_r10 = i0.ɵɵrestoreView(_r9).$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.choose(choice_r10)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const choice_r10 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", choice_r10.label, " ");
} }
function LemoPage_article_31_div_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 46);
    i0.ɵɵtemplate(1, LemoPage_article_31_div_6_ion_button_1_Template, 2, 1, "ion-button", 47);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const message_r8 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", message_r8.choices);
} }
function LemoPage_article_31_div_7_ng_container_1_ion_textarea_1_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-textarea", 55);
    i0.ɵɵtwoWayListener("ngModelChange", function LemoPage_article_31_div_7_ng_container_1_ion_textarea_1_Template_ion_textarea_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r12); const field_r13 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); i0.ɵɵtwoWayBindingSet(ctx_r1.draft[field_r13.key], $event) || (ctx_r1.draft[field_r13.key] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const field_r13 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("label", field_r13.label + (field_r13.required ? " *" : ""));
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft[field_r13.key]);
} }
function LemoPage_article_31_div_7_ng_container_1_ion_input_2_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-input", 56);
    i0.ɵɵtwoWayListener("ngModelChange", function LemoPage_article_31_div_7_ng_container_1_ion_input_2_Template_ion_input_ngModelChange_0_listener($event) { i0.ɵɵrestoreView(_r14); const field_r13 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); i0.ɵɵtwoWayBindingSet(ctx_r1.draft[field_r13.key], $event) || (ctx_r1.draft[field_r13.key] = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("ionInput", function LemoPage_article_31_div_7_ng_container_1_ion_input_2_Template_ion_input_ionInput_0_listener($event) { i0.ɵɵrestoreView(_r14); const field_r13 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(field_r13.key === "offence_location" && ctx_r1.onLocationInput($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const field_r13 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("label", field_r13.label + (field_r13.required ? " *" : ""))("type", field_r13.type);
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.draft[field_r13.key]);
} }
function LemoPage_article_31_div_7_ng_container_1_div_3_button_1_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 59);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_7_ng_container_1_div_3_button_1_Template_button_click_0_listener() { const suggestion_r16 = i0.ɵɵrestoreView(_r15).$implicit; const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.selectLocationSuggestion(suggestion_r16)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const suggestion_r16 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", suggestion_r16.description, " ");
} }
function LemoPage_article_31_div_7_ng_container_1_div_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 57);
    i0.ɵɵtemplate(1, LemoPage_article_31_div_7_ng_container_1_div_3_button_1_Template, 2, 1, "button", 58);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.locationSuggestions);
} }
function LemoPage_article_31_div_7_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainerStart(0);
    i0.ɵɵtemplate(1, LemoPage_article_31_div_7_ng_container_1_ion_textarea_1_Template, 1, 2, "ion-textarea", 52)(2, LemoPage_article_31_div_7_ng_container_1_ion_input_2_Template, 1, 3, "ion-input", 53)(3, LemoPage_article_31_div_7_ng_container_1_div_3_Template, 2, 1, "div", 54);
    i0.ɵɵelementContainerEnd();
} if (rf & 2) {
    const field_r13 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", field_r13.type === "textarea");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", field_r13.type !== "textarea");
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", field_r13.key === "offence_location" && ctx_r1.locationSuggestions.length);
} }
function LemoPage_article_31_div_7_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 49);
    i0.ɵɵtemplate(1, LemoPage_article_31_div_7_ng_container_1_Template, 4, 3, "ng-container", 50);
    i0.ɵɵelementStart(2, "ion-button", 51);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_7_Template_ion_button_click_2_listener() { i0.ɵɵrestoreView(_r11); const message_r8 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.submitFields(message_r8.fields || [])); });
    i0.ɵɵtext(3, "Continue");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const message_r8 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", message_r8.fields);
} }
function LemoPage_article_31_div_8_Template(rf, ctx) { if (rf & 1) {
    const _r17 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 60)(1, "app-evidence-capture", 61);
    i0.ɵɵlistener("photosChanged", function LemoPage_article_31_div_8_Template_app_evidence_capture_photosChanged_1_listener() { i0.ɵɵrestoreView(_r17); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPhotosChanged()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "ion-button", 62);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_8_Template_ion_button_click_2_listener() { i0.ɵɵrestoreView(_r17); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.continueImages()); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("compact", true);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.photoCount < 1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate2(" Continue with ", ctx_r1.photoCount, " photo", ctx_r1.photoCount === 1 ? "" : "s", " ");
} }
function LemoPage_article_31_div_9_img_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 68);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵproperty("src", ctx_r1.enviro_post.signature, i0.ɵɵsanitizeUrl);
} }
function LemoPage_article_31_div_9_canvas_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "canvas", null, 1);
} }
function LemoPage_article_31_div_9_ion_button_6_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ion-button", 51);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_9_ion_button_6_Template_ion_button_click_0_listener() { i0.ɵɵrestoreView(_r19); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.saveSignature()); });
    i0.ɵɵtext(1, "Save");
    i0.ɵɵelementEnd();
} }
function LemoPage_article_31_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 63);
    i0.ɵɵtemplate(1, LemoPage_article_31_div_9_img_1_Template, 1, 1, "img", 64)(2, LemoPage_article_31_div_9_canvas_2_Template, 2, 0, "canvas", 10);
    i0.ɵɵelementStart(3, "div", 65)(4, "ion-button", 66);
    i0.ɵɵlistener("click", function LemoPage_article_31_div_9_Template_ion_button_click_4_listener() { i0.ɵɵrestoreView(_r18); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.clearSignature()); });
    i0.ɵɵtext(5, "Clear");
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(6, LemoPage_article_31_div_9_ion_button_6_Template, 2, 0, "ion-button", 67);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.enviro_post.signature);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", !ctx_r1.enviro_post.signature);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("ngIf", !ctx_r1.enviro_post.signature);
} }
function LemoPage_article_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article", 35)(1, "p", 36);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 37);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵtemplate(5, LemoPage_article_31_div_5_Template, 2, 1, "div", 38)(6, LemoPage_article_31_div_6_Template, 2, 1, "div", 39)(7, LemoPage_article_31_div_7_Template, 4, 1, "div", 40)(8, LemoPage_article_31_div_8_Template, 4, 4, "div", 41)(9, LemoPage_article_31_div_9_Template, 7, 3, "div", 42);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const message_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("is-user", message_r8.role === "user")("is-assistant", message_r8.role === "assistant");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(message_r8.role === "user" ? "You" : "Lemo AI");
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.formattedContent(message_r8.content));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", message_r8.offenceCards == null ? null : message_r8.offenceCards.length);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", (message_r8.choices == null ? null : message_r8.choices.length) && ctx_r1.isActiveMessage(message_r8));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", (message_r8.fields == null ? null : message_r8.fields.length) && ctx_r1.isActiveMessage(message_r8));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", message_r8.showCamera && ctx_r1.isActiveMessage(message_r8));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", message_r8.showSignature && ctx_r1.isActiveMessage(message_r8));
} }
function LemoPage_p_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 69);
    i0.ɵɵtext(1, "Lemo is thinking\u2026");
    i0.ɵɵelementEnd();
} }
function LemoPage_div_34_p_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 74);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate3(" Step ", ctx_r1.lemo.wizardProgress.current, " of ", ctx_r1.lemo.wizardProgress.total, " \u00B7 ", ctx_r1.lemo.wizardProgress.label, " ");
} }
function LemoPage_div_34_Template(rf, ctx) { if (rf & 1) {
    const _r20 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 70);
    i0.ɵɵtemplate(1, LemoPage_div_34_p_1_Template, 2, 3, "p", 71);
    i0.ɵɵelementStart(2, "div", 65)(3, "ion-button", 72);
    i0.ɵɵlistener("click", function LemoPage_div_34_Template_ion_button_click_3_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.goBack()); });
    i0.ɵɵtext(4, "Back");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "ion-button", 73);
    i0.ɵɵlistener("click", function LemoPage_div_34_Template_ion_button_click_5_listener() { i0.ɵɵrestoreView(_r20); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.cancelCreate()); });
    i0.ɵɵtext(6, "Cancel");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngIf", ctx_r1.lemo.wizardStep);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("disabled", !ctx_r1.lemo.wizardStep || ctx_r1.lemo.wizardStep === "zone");
} }
function LemoPage_div_35_Template(rf, ctx) { if (rf & 1) {
    const _r21 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 75)(1, "ion-textarea", 76);
    i0.ɵɵtwoWayListener("ngModelChange", function LemoPage_div_35_Template_ion_textarea_ngModelChange_1_listener($event) { i0.ɵɵrestoreView(_r21); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.composer, $event) || (ctx_r1.composer = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("keydown.enter", function LemoPage_div_35_Template_ion_textarea_keydown_enter_1_listener($event) { i0.ɵɵrestoreView(_r21); const ctx_r1 = i0.ɵɵnextContext(); ctx_r1.send(); return i0.ɵɵresetView($event.preventDefault()); });
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "ion-button", 77);
    i0.ɵɵlistener("click", function LemoPage_div_35_Template_ion_button_click_2_listener() { i0.ɵɵrestoreView(_r21); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.send()); });
    i0.ɵɵtext(3, " Send ");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵpropertyInterpolate("placeholder", ctx_r1.lemo.mode === "research" ? "Describe what you saw" : "Ask about an offence, or create an FPN");
    i0.ɵɵtwoWayProperty("ngModel", ctx_r1.composer);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.lemo.busy || !ctx_r1.composer.trim());
} }
export class LemoPage {
    constructor(lemo, api, data, router, alertController, toastController, geocoding) {
        this.lemo = lemo;
        this.api = api;
        this.data = data;
        this.router = router;
        this.alertController = alertController;
        this.toastController = toastController;
        this.geocoding = geocoding;
        this.draft = {};
        this.composer = '';
        this.enviro_post = new EnviroPost();
        this.recentFpns = [];
        this.locationSuggestions = [];
        this.shouldScroll = false;
        this.suggestTimer = null;
    }
    async ngOnInit() {
        await this.data.waitUntilHydrated();
        this.enviro_post = this.data.getEnviroPost() || new EnviroPost();
        if (!this.data.getSelectedSite()?.id) {
            const alert = await this.alertController.create({
                header: 'Site required',
                message: 'Select a site before using Lemo AI.',
                buttons: ['Okay'],
            });
            await alert.present();
            this.router.navigate(['/site']);
            return;
        }
        if (!this.lemo.messages.length) {
            await this.lemo.start();
        }
        this.loadRecentFpns();
        this.syncDraftFromFields();
        this.shouldScroll = true;
    }
    ionViewWillEnter() {
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.loadRecentFpns();
    }
    ngAfterViewChecked() {
        if (this.shouldScroll) {
            this.shouldScroll = false;
            this.content?.scrollToBottom(250);
        }
        this.bindSignaturePad();
    }
    ngOnDestroy() {
        this.signaturePad?.off();
        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }
    }
    get siteName() {
        return this.data.getSelectedSite()?.name || 'Site';
    }
    get zoneName() {
        return this.data.getSelectedZone()?.name || this.data.findZoneById(this.enviro_post.zone_id)?.name || '';
    }
    get photoCount() {
        return this.lemo.imageCount();
    }
    get hasDraftPreview() {
        const enviro = this.enviro_post;
        return !!(enviro?.offence_id || enviro?.first_name || enviro?.offence_images?.length || enviro?.signature || enviro?.offence_location);
    }
    get draftTitle() {
        const name = [this.enviro_post.salutation, this.enviro_post.first_name, this.enviro_post.last_name]
            .filter(Boolean)
            .join(' ')
            .trim();
        return name || 'FPN in progress';
    }
    get draftSummary() {
        const offence = this.data.findOffenceById(this.enviro_post.offence_id)?.name;
        const location = this.enviro_post.offence_location;
        const photos = this.enviro_post.offence_images?.length
            ? `${this.enviro_post.offence_images.length} photo${this.enviro_post.offence_images.length === 1 ? '' : 's'}`
            : '';
        return [offence, location, photos].filter(Boolean).join(' · ') || 'Continue in the FPN form.';
    }
    isActiveMessage(message) {
        return this.lemo.lastAssistant()?.id === message.id;
    }
    async newChat() {
        if (this.lemo.busy) {
            return;
        }
        this.composer = '';
        this.draft = {};
        await this.lemo.start();
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.shouldScroll = true;
    }
    cancelCreate() {
        this.lemo.requestCancel();
        this.composer = '';
        this.shouldScroll = true;
    }
    goBack() {
        this.lemo.goBack();
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.syncDraftFromFields();
        this.shouldScroll = true;
    }
    continueImages() {
        this.lemo.continueAfterImages();
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.shouldScroll = true;
    }
    onPhotosChanged() {
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    }
    async send() {
        const text = this.composer.trim();
        if (!text || this.lemo.busy || this.lemo.isCreating) {
            return;
        }
        this.composer = '';
        await this.lemo.ask(text);
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.syncDraftFromFields();
        this.shouldScroll = true;
    }
    choose(choice) {
        if (choice?.action === 'queue') {
            this.router.navigate(['/queue']);
            return;
        }
        if (choice?.action === 'notebook') {
            this.openNotebookChoice(choice);
            return;
        }
        if (choice?.action === 'stepper') {
            this.continueInStepper();
            return;
        }
        this.lemo.choose(choice);
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.syncDraftFromFields();
        this.shouldScroll = true;
    }
    issuedSummary(fpn) {
        const offender = [fpn?.offender?.first_name, fpn?.offender?.last_name].filter(Boolean).join(' ').trim();
        const offence = fpn?.offence?.name || fpn?.offence_name || '';
        const location = fpn?.offence_location || '';
        return [offender, offence, location].filter(Boolean).join(' · ') || 'Issued FPN';
    }
    notebookEntryIsEmpty(fpn) {
        return !fpn?.notebook_entry || fpn.notebook_entry.length === 0;
    }
    openIssuedNotebook(fpn) {
        const id = Number(fpn?.id || 0);
        if (!id) {
            return;
        }
        this.router.navigate(['/notebook', id], { queryParams: { fpn_number: fpn.fpn_number || '' } });
    }
    continueInStepper() {
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        if (this.enviro_post) {
            this.data.setEnviroPost(this.enviro_post);
        }
        this.router.navigate(['/enviro'], {
            queryParams: {
                currentStep: enviroStepperStep(this.enviro_post, {
                    requireZone: this.data.getZones().length > 0,
                }),
            },
        });
    }
    useOffence(card) {
        this.lemo.choose({
            id: `use-${card.id}`,
            label: card.name,
            value: card.id,
            action: 'use-offence',
        });
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.shouldScroll = true;
    }
    async submitFields(fields) {
        const missing = fields.find(field => field.required && !String(this.draft[field.key] || '').trim());
        if (missing) {
            await this.presentToast(`${missing.label} is required.`);
            return;
        }
        this.locationSuggestions = [];
        await this.lemo.submitFields(this.draft);
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.shouldScroll = true;
    }
    onLocationInput(event) {
        const value = String(event?.detail?.value || this.draft['offence_location'] || '');
        this.draft['offence_location'] = value;
        if (this.suggestTimer) {
            clearTimeout(this.suggestTimer);
        }
        this.suggestTimer = setTimeout(() => {
            void this.loadLocationSuggestions(value);
        }, 250);
    }
    async selectLocationSuggestion(suggestion) {
        this.locationSuggestions = [];
        const result = await this.geocoding.geocodePlaceId(suggestion.placeId);
        this.draft['offence_location'] = result?.formattedAddress || suggestion.description;
        if (result) {
            this.lemo.applyDraftPatch({
                offence_location: this.draft['offence_location'],
                lat: String(result.lat),
                lng: String(result.lng),
            });
        }
    }
    async loadLocationSuggestions(query) {
        try {
            this.locationSuggestions = await this.geocoding.suggestPlaces(query);
        }
        catch {
            this.locationSuggestions = [];
        }
    }
    saveSignature() {
        if (!this.signaturePad || this.signaturePad.isEmpty()) {
            void this.presentToast('Please sign first, then tap Save.');
            return;
        }
        this.lemo.applyDraftPatch({ signature: this.signaturePad.toDataURL() });
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
        this.lemo.continueAfterSignature();
        this.lastSignatureCanvas = undefined;
        this.shouldScroll = true;
    }
    clearSignature() {
        this.signaturePad?.clear();
        this.lastSignatureCanvas = undefined;
        this.lemo.applyDraftPatch({ signature: '' });
        this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    }
    formattedContent(content) {
        return (content || '').replace(/\*\*/g, '');
    }
    trackMessage(index, message) {
        return message.id;
    }
    loadRecentFpns() {
        const user = this.data.getUser();
        if (!user?.id) {
            this.recentFpns = [];
            return;
        }
        this.api.getRecentFPNs(user.id).subscribe({
            next: (response) => {
                this.recentFpns = Array.isArray(response?.data) ? response.data : [];
            },
            error: () => {
                this.recentFpns = [];
            },
        });
    }
    openNotebookChoice(choice) {
        const postedId = Number(choice.value || this.lemo.lastPosted?.id || 0);
        if (postedId > 0) {
            this.router.navigate(['/notebook', postedId], {
                queryParams: { fpn_number: this.lemo.lastPosted?.fpnNumber || '' },
            });
            return;
        }
        const outstanding = this.recentFpns.filter(fpn => this.notebookEntryIsEmpty(fpn));
        if (outstanding.length === 1) {
            this.openIssuedNotebook(outstanding[0]);
            return;
        }
        if (this.hasDraftPreview) {
            this.continueInStepper();
            return;
        }
        this.notebookSection?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    syncDraftFromFields() {
        const last = this.lemo.lastAssistant();
        const next = { ...this.draft };
        for (const field of last?.fields || []) {
            if (next[field.key] == null) {
                next[field.key] = field.value || '';
            }
        }
        this.draft = next;
    }
    onWindowResize() {
        this.resizeSignaturePad();
    }
    bindSignaturePad() {
        const canvas = this.signatureCanvases?.last?.nativeElement;
        if (!canvas || canvas === this.lastSignatureCanvas) {
            return;
        }
        this.signaturePad = bindSignaturePad(canvas, this.signaturePad);
        this.lastSignatureCanvas = canvas;
    }
    resizeSignaturePad() {
        const canvas = this.signatureCanvases?.last?.nativeElement;
        if (!canvas || !this.signaturePad) {
            return;
        }
        this.signaturePad = bindSignaturePad(canvas, this.signaturePad);
        this.lastSignatureCanvas = canvas;
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2500,
            position: 'top',
        });
        await toast.present();
    }
    static { this.ɵfac = function LemoPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LemoPage)(i0.ɵɵdirectiveInject(i1.LemoAiService), i0.ɵɵdirectiveInject(i2.ApiService), i0.ɵɵdirectiveInject(i3.DataService), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i5.AlertController), i0.ɵɵdirectiveInject(i5.ToastController), i0.ɵɵdirectiveInject(i6.GeocodingService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LemoPage, selectors: [["app-lemo"]], viewQuery: function LemoPage_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(IonContent, 5);
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.content = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.notebookSection = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.signatureCanvases = _t);
        } }, hostBindings: function LemoPage_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function LemoPage_resize_HostBindingHandler() { return ctx.onWindowResize(); }, false, i0.ɵɵresolveWindow);
        } }, decls: 36, vars: 14, consts: [["notebookSection", ""], ["signatureCanvas", ""], [3, "translucent"], [3, "photoCount"], [3, "fullscreen"], [1, "ep-page", "lemo-page"], [1, "ep-hero", "lemo-hero"], [1, "lemo-hero__top"], [1, "ep-kicker"], ["size", "small", "fill", "outline", 3, "click", "disabled"], [4, "ngIf"], [1, "ep-section", "lemo-notebook"], [1, "ep-section__head"], [1, "lemo-notebook__intro"], ["class", "lemo-notebook__item", 4, "ngIf"], ["class", "lemo-notebook__item", 4, "ngFor", "ngForOf"], ["class", "ep-empty lemo-notebook__empty", 4, "ngIf"], ["expand", "block", "fill", "outline", 3, "click"], [1, "lemo-thread"], ["class", "lemo-bubble", 3, "is-user", "is-assistant", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "lemo-busy", 4, "ngIf"], [1, "lemo-footer"], ["class", "lemo-composer lemo-composer--cancel", 4, "ngIf"], ["class", "lemo-composer", 4, "ngIf"], [1, "lemo-notebook__item"], [1, "ep-ticket__top"], [1, "ep-ticket__title"], [1, "ep-ticket__meta"], ["color", "medium"], [1, "ep-ticket__actions"], ["size", "small", 3, "click"], ["color", "warning", 4, "ngIf"], ["size", "small", 3, "click", 4, "ngIf"], ["color", "warning"], [1, "ep-empty", "lemo-notebook__empty"], [1, "lemo-bubble"], [1, "lemo-bubble__role"], [1, "lemo-bubble__text"], ["class", "lemo-cards", 4, "ngIf"], ["class", "lemo-choices", 4, "ngIf"], ["class", "lemo-fields", 4, "ngIf"], ["class", "lemo-camera", 4, "ngIf"], ["class", "lemo-sign", 4, "ngIf"], [1, "lemo-cards"], ["type", "button", "class", "lemo-card", 3, "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "lemo-card", 3, "click"], [1, "lemo-choices"], ["size", "small", "fill", "outline", 3, "click", 4, "ngFor", "ngForOf"], ["size", "small", "fill", "outline", 3, "click"], [1, "lemo-fields"], [4, "ngFor", "ngForOf"], ["expand", "block", 3, "click"], ["label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "label", "ngModel", "ngModelChange", 4, "ngIf"], ["label-placement", "stacked", "fill", "outline", 3, "label", "type", "ngModel", "ngModelChange", "ionInput", 4, "ngIf"], ["class", "place-suggestions", 4, "ngIf"], ["label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "ngModelChange", "label", "ngModel"], ["label-placement", "stacked", "fill", "outline", 3, "ngModelChange", "ionInput", "label", "type", "ngModel"], [1, "place-suggestions"], ["type", "button", "class", "place-suggestions__item", 3, "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "place-suggestions__item", 3, "click"], [1, "lemo-camera"], [3, "photosChanged", "compact"], ["expand", "block", "color", "success", 3, "click", "disabled"], [1, "lemo-sign"], ["class", "lemo-sign__preview", "alt", "Saved signature", 3, "src", 4, "ngIf"], [1, "ep-actions", "ep-actions--split"], ["expand", "block", "color", "medium", 3, "click"], ["expand", "block", 3, "click", 4, "ngIf"], ["alt", "Saved signature", 1, "lemo-sign__preview", 3, "src"], [1, "lemo-busy"], [1, "lemo-composer", "lemo-composer--cancel"], ["class", "lemo-footer__step", 4, "ngIf"], ["expand", "block", "color", "medium", 3, "click", "disabled"], ["expand", "block", "color", "medium", "fill", "outline", 3, "click"], [1, "lemo-footer__step"], [1, "lemo-composer"], ["auto-grow", "true", "rows", "1", "maxlength", "4000", 3, "ngModelChange", "keydown.enter", "ngModel", "placeholder"], [3, "click", "disabled"]], template: function LemoPage_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "ion-header", 2);
            i0.ɵɵelement(1, "app-nav-bar", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "ion-content", 4)(3, "div", 5)(4, "section", 6)(5, "div", 7)(6, "div")(7, "p", 8);
            i0.ɵɵtext(8, "Officer assistant");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "h1");
            i0.ɵɵtext(10, "Lemo AI");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(11, "ion-button", 9);
            i0.ɵɵlistener("click", function LemoPage_Template_ion_button_click_11_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.newChat()); });
            i0.ɵɵtext(12, " New chat ");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "p");
            i0.ɵɵtext(14);
            i0.ɵɵtemplate(15, LemoPage_span_15_Template, 2, 1, "span", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(16, "section", 11, 0)(18, "div", 12)(19, "p", 8);
            i0.ɵɵtext(20, "Evidence notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "h2");
            i0.ɵɵtext(22, "Notebook entry");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(23, "p", 13);
            i0.ɵɵtext(24, "Notebook can wait. Submit the next FPN now, then add notebook later or before logout.");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(25, LemoPage_article_25_Template, 12, 2, "article", 14)(26, LemoPage_article_26_Template, 11, 5, "article", 15)(27, LemoPage_div_27_Template, 5, 0, "div", 16);
            i0.ɵɵelementStart(28, "ion-button", 17);
            i0.ɵɵlistener("click", function LemoPage_Template_ion_button_click_28_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.continueInStepper()); });
            i0.ɵɵtext(29, "Open FPN form");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "div", 18);
            i0.ɵɵtemplate(31, LemoPage_article_31_Template, 10, 11, "article", 19)(32, LemoPage_p_32_Template, 2, 0, "p", 20);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(33, "ion-footer", 21);
            i0.ɵɵtemplate(34, LemoPage_div_34_Template, 7, 2, "div", 22)(35, LemoPage_div_35_Template, 4, 3, "div", 23);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance();
            i0.ɵɵproperty("photoCount", ctx.photoCount);
            i0.ɵɵadvance();
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(9);
            i0.ɵɵproperty("disabled", ctx.lemo.busy);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.siteName);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.zoneName);
            i0.ɵɵadvance(10);
            i0.ɵɵproperty("ngIf", ctx.hasDraftPreview);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.recentFpns);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.hasDraftPreview && !ctx.recentFpns.length);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("ngForOf", ctx.lemo.messages)("ngForTrackBy", ctx.trackMessage);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.lemo.busy);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", ctx.lemo.isCreating);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.lemo.isCreating);
        } }, dependencies: [i7.NgForOf, i7.NgIf, i8.NgControlStatus, i8.MaxLengthValidator, i8.NgModel, i5.IonBadge, i5.IonButton, i5.IonContent, i5.IonFooter, i5.IonHeader, i5.IonInput, i5.IonTextarea, i5.TextValueAccessor, i9.NavBarComponent, i10.EvidenceCaptureComponent], styles: [".lemo-hero[_ngcontent-%COMP%] {\n  margin-bottom: 14px;\n}\n\n.lemo-hero__top[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n.lemo-hero__top[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n}\n\n.lemo-notebook__intro[_ngcontent-%COMP%], \n.lemo-notebook__empty[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  color: var(--ep-slate);\n  font-size: 14px;\n}\n\n.lemo-notebook__item[_ngcontent-%COMP%] {\n  background: var(--ep-paper);\n  border: 1px solid var(--ep-line);\n  border-radius: 14px;\n  padding: 12px;\n  margin-bottom: 10px;\n}\n\n.lemo-thread[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 12px;\n  padding-bottom: 12px;\n}\n\n.lemo-bubble[_ngcontent-%COMP%] {\n  background: var(--ep-card);\n  border: 1px solid var(--ep-line);\n  border-radius: 18px;\n  padding: 14px;\n  box-shadow: var(--ep-shadow);\n}\n\n.lemo-bubble.is-user[_ngcontent-%COMP%] {\n  background: #10232d;\n  color: #fff8e8;\n}\n\n.lemo-bubble.is-user[_ngcontent-%COMP%]   .lemo-bubble__role[_ngcontent-%COMP%], \n.lemo-bubble.is-user[_ngcontent-%COMP%]   .lemo-bubble__text[_ngcontent-%COMP%] {\n  color: #fff8e8;\n}\n\n.lemo-bubble__role[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--ep-brass);\n}\n\n.lemo-bubble__text[_ngcontent-%COMP%] {\n  font-size: 15px;\n  line-height: 1.45;\n  white-space: pre-wrap;\n}\n\n.lemo-choices[_ngcontent-%COMP%], \n.lemo-fields[_ngcontent-%COMP%], \n.lemo-cards[_ngcontent-%COMP%], \n.lemo-camera[_ngcontent-%COMP%], \n.lemo-sign[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n\n.lemo-choices[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.lemo-choices[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  --padding-top: 8px;\n  --padding-bottom: 8px;\n  min-height: 36px;\n  margin: 0;\n}\n\n.lemo-fields[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n\n.lemo-cards[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n\n.lemo-card[_ngcontent-%COMP%] {\n  text-align: left;\n  background: var(--ep-paper);\n  border: 1px solid var(--ep-line);\n  border-radius: 14px;\n  padding: 12px;\n}\n\n.lemo-card[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 4px 0;\n  font-size: 18px;\n}\n\n.lemo-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--ep-slate);\n  font-size: 13px;\n}\n\n.lemo-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: inline-block;\n  margin-top: 8px;\n  color: var(--ep-forest);\n  font-size: 12px;\n  font-weight: 800;\n}\n\n.lemo-sign[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%], \n.lemo-sign__preview[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 160px;\n  background: #fff;\n  border: 1px dashed var(--ep-line);\n  border-radius: 12px;\n}\n\n.lemo-sign__preview[_ngcontent-%COMP%] {\n  object-fit: contain;\n}\n\n.lemo-footer__step[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  color: var(--ep-slate);\n  font-size: 13px;\n  font-weight: 700;\n  text-align: center;\n}\n\n.lemo-busy[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--ep-slate);\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.lemo-footer[_ngcontent-%COMP%] {\n  background: var(--ep-card);\n}\n\n.lemo-composer[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-end;\n  gap: 8px;\n  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));\n}\n\n.lemo-composer[_ngcontent-%COMP%]   ion-textarea[_ngcontent-%COMP%] {\n  flex: 1;\n  --background: var(--ep-paper);\n  --padding-start: 12px;\n  --padding-end: 12px;\n}\n\n.lemo-composer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  min-height: 44px;\n  margin: 0;\n}\n\n.lemo-composer--cancel[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.lemo-composer--cancel[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.lemo-camera[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LemoPage, [{
        type: Component,
        args: [{ selector: 'app-lemo', template: "<ion-header [translucent]=\"true\">\n  <app-nav-bar [photoCount]=\"photoCount\"></app-nav-bar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n  <div class=\"ep-page lemo-page\">\n    <section class=\"ep-hero lemo-hero\">\n      <div class=\"lemo-hero__top\">\n        <div>\n          <p class=\"ep-kicker\">Officer assistant</p>\n          <h1>Lemo AI</h1>\n        </div>\n        <ion-button size=\"small\" fill=\"outline\" [disabled]=\"lemo.busy\" (click)=\"newChat()\">\n          New chat\n        </ion-button>\n      </div>\n      <p>{{ siteName }}<span *ngIf=\"zoneName\"> \u00B7 {{ zoneName }}</span></p>\n    </section>\n\n    <section class=\"ep-section lemo-notebook\" #notebookSection>\n      <div class=\"ep-section__head\">\n        <p class=\"ep-kicker\">Evidence notes</p>\n        <h2>Notebook entry</h2>\n      </div>\n      <p class=\"lemo-notebook__intro\">Notebook can wait. Submit the next FPN now, then add notebook later or before logout.</p>\n\n      <article class=\"lemo-notebook__item\" *ngIf=\"hasDraftPreview\">\n        <div class=\"ep-ticket__top\">\n          <div>\n            <h3 class=\"ep-ticket__title\">{{ draftTitle }}</h3>\n            <p class=\"ep-ticket__meta\">{{ draftSummary }}</p>\n          </div>\n          <ion-badge color=\"medium\">In progress</ion-badge>\n        </div>\n        <div class=\"ep-ticket__actions\">\n          <ion-button size=\"small\" (click)=\"continueInStepper()\">Continue in FPN form</ion-button>\n        </div>\n      </article>\n\n      <article class=\"lemo-notebook__item\" *ngFor=\"let fpn of recentFpns\">\n        <div class=\"ep-ticket__top\">\n          <div>\n            <h3 class=\"ep-ticket__title\">{{ fpn.fpn_number || 'Issued FPN' }}</h3>\n            <p class=\"ep-ticket__meta\">{{ issuedSummary(fpn) }}</p>\n          </div>\n          <ion-badge *ngIf=\"!notebookEntryIsEmpty(fpn)\">Notebook found</ion-badge>\n          <ion-badge *ngIf=\"notebookEntryIsEmpty(fpn)\" color=\"warning\">Needs notebook</ion-badge>\n        </div>\n        <div class=\"ep-ticket__actions\">\n          <ion-button *ngIf=\"notebookEntryIsEmpty(fpn)\" size=\"small\" (click)=\"openIssuedNotebook(fpn)\">\n            Open notebook\n          </ion-button>\n        </div>\n      </article>\n\n      <div class=\"ep-empty lemo-notebook__empty\" *ngIf=\"!hasDraftPreview && !recentFpns.length\">\n        <h3>No issued FPN yet</h3>\n        <p>Posted tickets will preview here. Open the FPN form to continue a notice.</p>\n      </div>\n\n      <ion-button expand=\"block\" fill=\"outline\" (click)=\"continueInStepper()\">Open FPN form</ion-button>\n    </section>\n\n    <div class=\"lemo-thread\">\n      <article\n        class=\"lemo-bubble\"\n        *ngFor=\"let message of lemo.messages; trackBy: trackMessage\"\n        [class.is-user]=\"message.role === 'user'\"\n        [class.is-assistant]=\"message.role === 'assistant'\">\n        <p class=\"lemo-bubble__role\">{{ message.role === 'user' ? 'You' : 'Lemo AI' }}</p>\n        <div class=\"lemo-bubble__text\">{{ formattedContent(message.content) }}</div>\n\n        <div class=\"lemo-cards\" *ngIf=\"message.offenceCards?.length\">\n          <button\n            type=\"button\"\n            class=\"lemo-card\"\n            *ngFor=\"let card of message.offenceCards\"\n            (click)=\"useOffence(card)\">\n            <p class=\"ep-kicker\">{{ card.groupName }}</p>\n            <h3>{{ card.name }}</h3>\n            <p *ngIf=\"card.legislationTitle\">{{ card.legislationTitle }}</p>\n            <p *ngIf=\"card.legislation\">{{ card.legislation }}</p>\n            <span>Use this offence</span>\n          </button>\n        </div>\n\n        <div class=\"lemo-choices\" *ngIf=\"message.choices?.length && isActiveMessage(message)\">\n          <ion-button\n            size=\"small\"\n            fill=\"outline\"\n            *ngFor=\"let choice of message.choices\"\n            (click)=\"choose(choice)\">\n            {{ choice.label }}\n          </ion-button>\n        </div>\n\n        <div class=\"lemo-fields\" *ngIf=\"message.fields?.length && isActiveMessage(message)\">\n          <ng-container *ngFor=\"let field of message.fields\">\n            <ion-textarea\n              *ngIf=\"field.type === 'textarea'\"\n              [label]=\"field.label + (field.required ? ' *' : '')\"\n              label-placement=\"stacked\"\n              fill=\"outline\"\n              auto-grow=\"true\"\n              [(ngModel)]=\"draft[field.key]\">\n            </ion-textarea>\n            <ion-input\n              *ngIf=\"field.type !== 'textarea'\"\n              [label]=\"field.label + (field.required ? ' *' : '')\"\n              label-placement=\"stacked\"\n              fill=\"outline\"\n              [type]=\"field.type\"\n              [(ngModel)]=\"draft[field.key]\"\n              (ionInput)=\"field.key === 'offence_location' && onLocationInput($event)\">\n            </ion-input>\n            <div class=\"place-suggestions\" *ngIf=\"field.key === 'offence_location' && locationSuggestions.length\">\n              <button\n                type=\"button\"\n                class=\"place-suggestions__item\"\n                *ngFor=\"let suggestion of locationSuggestions\"\n                (click)=\"selectLocationSuggestion(suggestion)\">\n                {{ suggestion.description }}\n              </button>\n            </div>\n          </ng-container>\n          <ion-button expand=\"block\" (click)=\"submitFields(message.fields || [])\">Continue</ion-button>\n        </div>\n\n        <div class=\"lemo-camera\" *ngIf=\"message.showCamera && isActiveMessage(message)\">\n          <app-evidence-capture [compact]=\"true\" (photosChanged)=\"onPhotosChanged()\"></app-evidence-capture>\n          <ion-button expand=\"block\" color=\"success\" [disabled]=\"photoCount < 1\" (click)=\"continueImages()\">\n            Continue with {{ photoCount }} photo{{ photoCount === 1 ? '' : 's' }}\n          </ion-button>\n        </div>\n\n        <div class=\"lemo-sign\" *ngIf=\"message.showSignature && isActiveMessage(message)\">\n          <img\n            *ngIf=\"enviro_post.signature\"\n            class=\"lemo-sign__preview\"\n            [src]=\"enviro_post.signature\"\n            alt=\"Saved signature\" />\n          <canvas *ngIf=\"!enviro_post.signature\" #signatureCanvas></canvas>\n          <div class=\"ep-actions ep-actions--split\">\n            <ion-button expand=\"block\" color=\"medium\" (click)=\"clearSignature()\">Clear</ion-button>\n            <ion-button expand=\"block\" *ngIf=\"!enviro_post.signature\" (click)=\"saveSignature()\">Save</ion-button>\n          </div>\n        </div>\n      </article>\n\n      <p class=\"lemo-busy\" *ngIf=\"lemo.busy\">Lemo is thinking\u2026</p>\n    </div>\n  </div>\n</ion-content>\n\n<ion-footer class=\"lemo-footer\">\n  <div class=\"lemo-composer lemo-composer--cancel\" *ngIf=\"lemo.isCreating\">\n    <p class=\"lemo-footer__step\" *ngIf=\"lemo.wizardStep\">\n      Step {{ lemo.wizardProgress.current }} of {{ lemo.wizardProgress.total }} \u00B7 {{ lemo.wizardProgress.label }}\n    </p>\n    <div class=\"ep-actions ep-actions--split\">\n      <ion-button expand=\"block\" color=\"medium\" [disabled]=\"!lemo.wizardStep || lemo.wizardStep === 'zone'\" (click)=\"goBack()\">Back</ion-button>\n      <ion-button expand=\"block\" color=\"medium\" fill=\"outline\" (click)=\"cancelCreate()\">Cancel</ion-button>\n    </div>\n  </div>\n  <div class=\"lemo-composer\" *ngIf=\"!lemo.isCreating\">\n    <ion-textarea\n      [(ngModel)]=\"composer\"\n      auto-grow=\"true\"\n      rows=\"1\"\n      maxlength=\"4000\"\n      placeholder=\"{{ lemo.mode === 'research' ? 'Describe what you saw' : 'Ask about an offence, or create an FPN' }}\"\n      (keydown.enter)=\"send(); $event.preventDefault()\">\n    </ion-textarea>\n    <ion-button [disabled]=\"lemo.busy || !composer.trim()\" (click)=\"send()\">\n      Send\n    </ion-button>\n  </div>\n</ion-footer>\n", styles: [".lemo-hero {\n  margin-bottom: 14px;\n}\n\n.lemo-hero__top {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n.lemo-hero__top ion-button {\n  margin: 0;\n}\n\n.lemo-notebook__intro,\n.lemo-notebook__empty {\n  margin: 0 0 12px;\n  color: var(--ep-slate);\n  font-size: 14px;\n}\n\n.lemo-notebook__item {\n  background: var(--ep-paper);\n  border: 1px solid var(--ep-line);\n  border-radius: 14px;\n  padding: 12px;\n  margin-bottom: 10px;\n}\n\n.lemo-thread {\n  display: grid;\n  gap: 12px;\n  padding-bottom: 12px;\n}\n\n.lemo-bubble {\n  background: var(--ep-card);\n  border: 1px solid var(--ep-line);\n  border-radius: 18px;\n  padding: 14px;\n  box-shadow: var(--ep-shadow);\n}\n\n.lemo-bubble.is-user {\n  background: #10232d;\n  color: #fff8e8;\n}\n\n.lemo-bubble.is-user .lemo-bubble__role,\n.lemo-bubble.is-user .lemo-bubble__text {\n  color: #fff8e8;\n}\n\n.lemo-bubble__role {\n  margin: 0 0 6px;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--ep-brass);\n}\n\n.lemo-bubble__text {\n  font-size: 15px;\n  line-height: 1.45;\n  white-space: pre-wrap;\n}\n\n.lemo-choices,\n.lemo-fields,\n.lemo-cards,\n.lemo-camera,\n.lemo-sign {\n  margin-top: 12px;\n}\n\n.lemo-choices {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.lemo-choices ion-button {\n  --padding-top: 8px;\n  --padding-bottom: 8px;\n  min-height: 36px;\n  margin: 0;\n}\n\n.lemo-fields {\n  display: grid;\n  gap: 10px;\n}\n\n.lemo-cards {\n  display: grid;\n  gap: 10px;\n}\n\n.lemo-card {\n  text-align: left;\n  background: var(--ep-paper);\n  border: 1px solid var(--ep-line);\n  border-radius: 14px;\n  padding: 12px;\n}\n\n.lemo-card h3 {\n  margin: 4px 0;\n  font-size: 18px;\n}\n\n.lemo-card p {\n  margin: 0;\n  color: var(--ep-slate);\n  font-size: 13px;\n}\n\n.lemo-card span {\n  display: inline-block;\n  margin-top: 8px;\n  color: var(--ep-forest);\n  font-size: 12px;\n  font-weight: 800;\n}\n\n.lemo-sign canvas,\n.lemo-sign__preview {\n  display: block;\n  width: 100%;\n  height: 160px;\n  background: #fff;\n  border: 1px dashed var(--ep-line);\n  border-radius: 12px;\n}\n\n.lemo-sign__preview {\n  object-fit: contain;\n}\n\n.lemo-footer__step {\n  margin: 0 0 8px;\n  color: var(--ep-slate);\n  font-size: 13px;\n  font-weight: 700;\n  text-align: center;\n}\n\n.lemo-busy {\n  margin: 0;\n  color: var(--ep-slate);\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.lemo-footer {\n  background: var(--ep-card);\n}\n\n.lemo-composer {\n  display: flex;\n  align-items: flex-end;\n  gap: 8px;\n  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));\n}\n\n.lemo-composer ion-textarea {\n  flex: 1;\n  --background: var(--ep-paper);\n  --padding-start: 12px;\n  --padding-end: 12px;\n}\n\n.lemo-composer ion-button {\n  min-height: 44px;\n  margin: 0;\n}\n\n.lemo-composer--cancel {\n  display: block;\n}\n\n.lemo-composer--cancel ion-button {\n  width: 100%;\n}\n\n.lemo-camera ion-button {\n  margin-top: 12px;\n}\n"] }]
    }], () => [{ type: i1.LemoAiService }, { type: i2.ApiService }, { type: i3.DataService }, { type: i4.Router }, { type: i5.AlertController }, { type: i5.ToastController }, { type: i6.GeocodingService }], { content: [{
            type: ViewChild,
            args: [IonContent]
        }], notebookSection: [{
            type: ViewChild,
            args: ['notebookSection']
        }], signatureCanvases: [{
            type: ViewChildren,
            args: ['signatureCanvas']
        }], onWindowResize: [{
            type: HostListener,
            args: ['window:resize']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LemoPage, { className: "LemoPage" }); })();
//# sourceMappingURL=lemo.page.js.map