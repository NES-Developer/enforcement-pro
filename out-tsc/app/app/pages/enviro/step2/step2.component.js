import { Component } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import { UpperCaseWords } from 'src/app/helpers/utils';
import { formatDateOfBirth, isValidDateOfBirth, parseDateOfBirth } from '../../../helpers/fpn-core-validation';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/api.service";
import * as i2 from "../../../services/enforcementpro/data.service";
import * as i3 from "../enviro.page";
import * as i4 from "src/app/services/validate-person.service";
import * as i5 from "@ionic/angular";
import * as i6 from "@angular/common";
import * as i7 from "@angular/forms";
function Step2Component_ion_select_option_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ion-select-option");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const salutation_r1 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", salutation_r1.title, " ");
} }
function Step2Component_p_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 23);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.validation_message);
} }
export class Step2Component {
    constructor(api, data, fpnPage, validatePerson, alertController) {
        this.api = api;
        this.data = data;
        this.fpnPage = fpnPage;
        this.validatePerson = validatePerson;
        this.alertController = alertController;
        this.birthYear = null;
        this.birthMonth = null;
        this.birthDay = null;
        this.validation_message = 'Please provide information and validate details';
        // ethnicities: Ethnicity[] = [];
        this.offence_how = [];
        this.offence_location_suffix = [];
        this.address_verified_by = [];
        this.site_offence = [];
        this.offences = [];
        this.offenceGroups = [];
        this.filteredOffences = [];
        this.id_shown = [];
        this.salutations = [];
        this.zones = [];
        this.enviro_post = new EnviroPost();
        this.alertHeader = '';
        this.alertSubHeader = '';
        this.alertMessage = '';
    }
    ngOnInit() {
        if (!this.data.checkFPNData()) {
            this.fpnPage.getFPNData();
        }
        this.loadData();
    }
    filterOffences() {
        this.filteredOffences = this.offences.filter(offence => offence.group === this.enviro_post.offence_type_id);
        // this.form.get('offence')?.setValue(null); // Reset the offence selection
    }
    updateDateOfBirth() {
        if (!this.birthYear || !this.birthMonth || !this.birthDay) {
            return;
        }
        const formattedDate = formatDateOfBirth(this.birthYear, this.birthMonth, this.birthDay);
        if (!formattedDate) {
            this.enviro_post.date_of_birth = '';
            return;
        }
        this.enviro_post.date_of_birth = formattedDate;
        this.saveEnviroData();
    }
    ValidatePerson() {
        if (this.enviro_post.first_name == "" && this.enviro_post.last_name == "") {
            this.alertHeader = 'Missing Field';
            this.alertSubHeader = 'Value required';
            this.alertMessage = 'First Name and surname is requred';
            this.showAlert();
            return;
        }
        if (this.enviro_post.address == "") {
            this.alertHeader = 'Missing Field';
            this.alertSubHeader = 'Value required';
            this.alertMessage = 'Address is required';
            this.showAlert();
            return;
        }
        if (this.enviro_post.date_of_birth == "") {
            this.alertHeader = 'Missing Field';
            this.alertSubHeader = 'Value required';
            this.alertMessage = 'Date of birth is required';
            this.showAlert();
            return;
        }
        if (this.enviro_post.post_code == "") {
            this.alertHeader = 'Missing Field';
            this.alertSubHeader = 'Value required';
            this.alertMessage = 'Postal code is required';
            this.showAlert();
            return;
        }
        if (this.enviro_post.town == "") {
            this.alertHeader = 'Missing Field';
            this.alertSubHeader = 'Value required';
            this.alertMessage = 'Town  is required';
            this.showAlert();
            return;
        }
        var offenderData = {
            "forename": this.enviro_post.first_name,
            "surname": this.enviro_post.last_name,
            "dob": this.formatDateForRequest(this.enviro_post.date_of_birth),
            "address1": this.enviro_post.address,
            "address2": this.enviro_post.town,
            "postcode": this.enviro_post.post_code
        };
        this.validatePerson.validateIdetity(offenderData)
            .subscribe({
            next: (data) => {
                if (data?.Summary?.ResultText == "PASS") {
                    if (data?.Address) {
                        const dob = data.Address.DOB;
                        if (dob && dob !== "0000-00-00") {
                            const displayDob = this.formatDateForDisplay(dob);
                            this.enviro_post.date_of_birth = isValidDateOfBirth(displayDob) ? displayDob : this.enviro_post.date_of_birth;
                            this.populateDateOfBirth();
                            this.alertHeader = 'Success';
                            this.alertSubHeader = 'Information Validated';
                            this.alertMessage = 'Offenders Information Has Been Validated';
                            const forename = this.capitalizeSentence(data.Address.Forename || '');
                            const middleName = this.capitalizeSentence(data.Address.MiddleName || '');
                            this.enviro_post.first_name = `${forename} ${middleName}`.trim();
                            this.enviro_post.last_name = this.capitalizeSentence(data.Address.Surname || '');
                            if (data.Address.AddressFound && data.Address.CleanedAddress) {
                                const address1 = this.capitalizeSentence(data.Address.CleanedAddress.Address1 || '');
                                const address2 = this.capitalizeSentence(data.Address.CleanedAddress.Address2 || '');
                                this.validation_message = 'Validated Address: ' + address1 + ', ' + address2 + ', ' + data.Address.CleanedAddress.Postcode;
                            }
                            else {
                                this.alertHeader = 'Invalid';
                                this.alertSubHeader = 'Information Incorrect';
                                this.alertMessage = 'Offenders Information Has Been Found False, Please request correct details.';
                            }
                        }
                        else {
                            this.alertHeader = 'Invalid';
                            this.alertSubHeader = 'Date of Birth Incorrect';
                            this.alertMessage = 'Offenders Date of Birth Has Been Found False, Please request correct details. ';
                        }
                    }
                    else {
                        this.alertHeader = 'Invalid';
                        this.alertSubHeader = 'Address Incorrect';
                        this.alertMessage = 'Offenders Address Has Been Found False, Please request correct details.';
                    }
                }
                else {
                    this.alertHeader = 'Invalid';
                    this.alertSubHeader = 'Information Incorrect';
                    this.alertMessage = 'Offenders Information Has Been Found False, Please request correct details. Some information were found Incorrect';
                }
                this.saveEnviroData();
                this.showAlert();
            },
            error: () => {
                this.alertHeader = 'Error';
                this.alertSubHeader = 'Validation failed';
                this.alertMessage = 'Could not validate these details. Check the connection and try again.';
                this.showAlert();
            }
        });
    }
    // Helper function to capitalize the first letter of each sentence
    capitalizeSentence(text) {
        return text.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/g, match => match.toUpperCase());
    }
    // Helper function to format date for display as YYYY/MM/DD
    formatDateForDisplay(date) {
        return date.replace(/-/g, '/');
    }
    // Helper function to format date for request as YYYY-MM-DD
    formatDateForRequest(date) {
        return date.replace(/\//g, '-');
    }
    populateDateOfBirth() {
        const parts = parseDateOfBirth(this.enviro_post.date_of_birth);
        if (!parts) {
            this.birthYear = null;
            this.birthMonth = null;
            this.birthDay = null;
            return;
        }
        this.birthYear = Number(parts.year);
        this.birthMonth = Number(parts.month);
        this.birthDay = Number(parts.day);
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
    loadData() {
        this.offence_how = this.data.getOffenceHow();
        this.offence_location_suffix = this.data.getOffenceLocationSuffix();
        this.address_verified_by = this.data.getAddressVerifiedBy();
        // this.ethnicities = this.data.getEthnicities();
        this.id_shown = this.data.getIDShown();
        let enviro_post = this.data.getEnviroPost();
        this.salutations = this.data.getSalutations();
        console.log(this.zones);
        if (enviro_post !== null) {
            this.enviro_post = enviro_post;
        }
        this.populateDateOfBirth();
    }
    onInputChange() {
        UpperCaseWords(this.enviro_post);
    }
    saveEnviroData() {
        this.onInputChange();
        this.data.setEnviroPost(this.enviro_post);
    }
    static { this.ɵfac = function Step2Component_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || Step2Component)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.DataService), i0.ɵɵdirectiveInject(i3.EnviroPage), i0.ɵɵdirectiveInject(i4.ValidatePersonService), i0.ɵɵdirectiveInject(i5.AlertController)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: Step2Component, selectors: [["app-step2"]], decls: 45, vars: 15, consts: [[1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"], ["interface", "action-sheet", "label", "Title *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [4, "ngFor", "ngForOf"], [1, "ep-field-row"], ["label", "Forename *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Surname *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Address *", "label-placement", "stacked", "fill", "outline", "auto-grow", "true", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Town *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Country *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", "disabled", "true", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Postal code *", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "250", 2, "text-transform", "uppercase", 3, "ionChange", "ngModelChange", "ngModel"], [1, "ep-field-row", 2, "grid-template-columns", "1fr 1fr 1.2fr"], ["label", "Day", "label-placement", "stacked", "fill", "outline", "type", "number", "min", "1", "max", "31", "placeholder", "DD", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Month", "label-placement", "stacked", "fill", "outline", "type", "number", "min", "1", "max", "12", "placeholder", "MM", 3, "ngModelChange", "ionChange", "ngModel"], ["label", "Year", "label-placement", "stacked", "fill", "outline", "type", "number", "min", "1900", "max", "2099", "placeholder", "YYYY", 3, "ngModelChange", "ionChange", "ngModel"], ["class", "ep-note", 4, "ngIf"], ["expand", "block", 1, "validate-search", 3, "click"], ["label", "Email address", "label-placement", "stacked", "fill", "outline", "type", "email", "maxlength", "250", 3, "ionChange", "ngModelChange", "ngModel"], ["label", "Mobile no.", "label-placement", "stacked", "fill", "outline", "type", "text", "maxlength", "100", 3, "ionChange", "ngModelChange", "ngModel"], ["interface", "action-sheet", "label", "Did you activate BWC *", "label-placement", "stacked", "fill", "outline", "multiple", "false", 3, "ionChange", "ngModelChange", "ngModel"], [1, "ep-page-end"], [1, "ep-note"]], template: function Step2Component_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4, "Person");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Offender detail");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "ion-select", 4);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_select_ionChange_7_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_select_ngModelChange_7_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.salutation, $event) || (ctx.enviro_post.salutation = $event); return $event; });
            i0.ɵɵtemplate(8, Step2Component_ion_select_option_8_Template, 2, 1, "ion-select-option", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "div", 6)(10, "ion-input", 7);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_10_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_10_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.first_name, $event) || (ctx.enviro_post.first_name = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "ion-input", 8);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_11_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_11_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.last_name, $event) || (ctx.enviro_post.last_name = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(12, "ion-textarea", 9);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_textarea_ionChange_12_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_textarea_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.address, $event) || (ctx.enviro_post.address = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "ion-input", 10);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_13_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_13_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.town, $event) || (ctx.enviro_post.town = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div", 6)(15, "ion-input", 11);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_15_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_15_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.county, $event) || (ctx.enviro_post.county = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "ion-input", 12);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_16_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_16_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.post_code, $event) || (ctx.enviro_post.post_code = $event); return $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "section", 1)(18, "div", 2)(19, "p", 3);
            i0.ɵɵtext(20, "Identity");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(21, "h3");
            i0.ɵɵtext(22, "Date of birth");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(23, "div", 13)(24, "ion-input", 14);
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_24_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.birthDay, $event) || (ctx.birthDay = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_24_listener() { return ctx.updateDateOfBirth(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "ion-input", 15);
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_25_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.birthMonth, $event) || (ctx.birthMonth = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_25_listener() { return ctx.updateDateOfBirth(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "ion-input", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_26_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.birthYear, $event) || (ctx.birthYear = $event); return $event; });
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_26_listener() { return ctx.updateDateOfBirth(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵtemplate(27, Step2Component_p_27_Template, 2, 1, "p", 17);
            i0.ɵɵelementStart(28, "ion-button", 18);
            i0.ɵɵlistener("click", function Step2Component_Template_ion_button_click_28_listener() { return ctx.ValidatePerson(); });
            i0.ɵɵtext(29, "Validate personal details");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(30, "section", 1)(31, "div", 2)(32, "p", 3);
            i0.ɵɵtext(33, "Contact");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(34, "h3");
            i0.ɵɵtext(35, "How to reach them");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(36, "div", 6)(37, "ion-input", 19);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_37_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_37_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.email, $event) || (ctx.enviro_post.email = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(38, "ion-input", 20);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_input_ionChange_38_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_input_ngModelChange_38_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.phone, $event) || (ctx.enviro_post.phone = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "ion-select", 21);
            i0.ɵɵlistener("ionChange", function Step2Component_Template_ion_select_ionChange_39_listener() { return ctx.saveEnviroData(); });
            i0.ɵɵtwoWayListener("ngModelChange", function Step2Component_Template_ion_select_ngModelChange_39_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.enviro_post.is_bwc_active, $event) || (ctx.enviro_post.is_bwc_active = $event); return $event; });
            i0.ɵɵelementStart(40, "ion-select-option");
            i0.ɵɵtext(41, "Yes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "ion-select-option");
            i0.ɵɵtext(43, "No");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelement(44, "div", 22);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.salutation);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngForOf", ctx.salutations);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.first_name);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.last_name);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.address);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.town);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.county);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.post_code);
            i0.ɵɵadvance(8);
            i0.ɵɵtwoWayProperty("ngModel", ctx.birthDay);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.birthMonth);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.birthYear);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.validation_message);
            i0.ɵɵadvance(10);
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.email);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.phone);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.enviro_post.is_bwc_active);
        } }, dependencies: [i6.NgForOf, i6.NgIf, i7.NgControlStatus, i7.MaxLengthValidator, i7.NgModel, i5.IonButton, i5.IonInput, i5.IonSelect, i5.IonSelectOption, i5.IonTextarea, i5.NumericValueAccessor, i5.SelectValueAccessor, i5.TextValueAccessor, i5.IonMinValidator, i5.IonMaxValidator], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(Step2Component, [{
        type: Component,
        args: [{ selector: 'app-step2', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Person</p>\n      <h2>Offender detail</h2>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Title *\" label-placement=\"stacked\" fill=\"outline\" multiple=\"false\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.salutation\">\n      <ion-select-option *ngFor=\"let salutation of salutations\">\n        {{ salutation.title }}\n      </ion-select-option>\n    </ion-select>\n\n    <div class=\"ep-field-row\">\n      <ion-input label=\"Forename *\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.first_name\"></ion-input>\n      <ion-input label=\"Surname *\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.last_name\"></ion-input>\n    </div>\n\n    <ion-textarea label=\"Address *\" label-placement=\"stacked\" fill=\"outline\" auto-grow=\"true\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.address\"></ion-textarea>\n    <ion-input label=\"Town *\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.town\"></ion-input>\n\n    <div class=\"ep-field-row\">\n      <ion-input label=\"Country *\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.county\" disabled=\"true\"></ion-input>\n      <ion-input label=\"Postal code *\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.post_code\" style=\"text-transform:uppercase\"></ion-input>\n    </div>\n  </section>\n\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Identity</p>\n      <h3>Date of birth</h3>\n    </div>\n\n    <div class=\"ep-field-row\" style=\"grid-template-columns: 1fr 1fr 1.2fr;\">\n      <ion-input label=\"Day\" label-placement=\"stacked\" fill=\"outline\" type=\"number\" min=\"1\" max=\"31\" [(ngModel)]=\"birthDay\" (ionChange)=\"updateDateOfBirth()\" placeholder=\"DD\"></ion-input>\n      <ion-input label=\"Month\" label-placement=\"stacked\" fill=\"outline\" type=\"number\" min=\"1\" max=\"12\" [(ngModel)]=\"birthMonth\" (ionChange)=\"updateDateOfBirth()\" placeholder=\"MM\"></ion-input>\n      <ion-input label=\"Year\" label-placement=\"stacked\" fill=\"outline\" type=\"number\" min=\"1900\" max=\"2099\" [(ngModel)]=\"birthYear\" (ionChange)=\"updateDateOfBirth()\" placeholder=\"YYYY\"></ion-input>\n    </div>\n\n    <p class=\"ep-note\" *ngIf=\"validation_message\">{{ validation_message }}</p>\n    <ion-button expand=\"block\" class=\"validate-search\" (click)=\"ValidatePerson();\">Validate personal details</ion-button>\n  </section>\n\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Contact</p>\n      <h3>How to reach them</h3>\n    </div>\n\n    <div class=\"ep-field-row\">\n      <ion-input label=\"Email address\" label-placement=\"stacked\" fill=\"outline\" type=\"email\" maxlength=\"250\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.email\"></ion-input>\n      <ion-input label=\"Mobile no.\" label-placement=\"stacked\" fill=\"outline\" type=\"text\" maxlength=\"100\" (ionChange)=\"saveEnviroData()\" [(ngModel)]=\"enviro_post.phone\"></ion-input>\n    </div>\n\n    <ion-select interface=\"action-sheet\" label=\"Did you activate BWC *\" label-placement=\"stacked\" fill=\"outline\" (ionChange)=\"saveEnviroData()\" multiple=\"false\" [(ngModel)]=\"enviro_post.is_bwc_active\">\n      <ion-select-option>Yes</ion-select-option>\n      <ion-select-option>No</ion-select-option>\n    </ion-select>\n  </section>\n\n  <div class=\"ep-page-end\"></div>\n</div>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.EnviroPage }, { type: i4.ValidatePersonService }, { type: i5.AlertController }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(Step2Component, { className: "Step2Component" }); })();
//# sourceMappingURL=step2.component.js.map