import { Component, ViewChild } from '@angular/core';
import { Login } from '../../models/login';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/api.service";
import * as i2 from "../../services/enforcementpro/auth.service";
import * as i3 from "@ionic/angular";
import * as i4 from "@angular/router";
import * as i5 from "src/app/services/loading.service";
import * as i6 from "src/app/services/enforcementpro/data.service";
import * as i7 from "../../services/app-update.service";
import * as i8 from "@angular/common";
import * as i9 from "@angular/forms";
const _c0 = ["idInput"];
const _c1 = ["pinInput"];
function LoginPage_p_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 17);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.appVersion);
} }
// import { NgForm } from '@angular/forms';
export class LoginPage {
    constructor(apiService, auth, alertController, router, loading, data, platform, appUpdate) {
        this.apiService = apiService;
        this.auth = auth;
        this.alertController = alertController;
        this.router = router;
        this.loading = loading;
        this.data = data;
        this.platform = platform;
        this.appUpdate = appUpdate;
        this.token = '';
        this.appVersion = 'Alpha (1)';
        this.login = new Login();
        this.loadData();
        this.platform.ready().then(() => {
            this.blockBackButton();
        });
    }
    loadData() {
        this.token = this.data.getToken();
    }
    async ngOnInit() {
        this.loading.showLoading();
        await this.data.init();
        await this.refreshAppVersion();
        this.appUpdate.checkAndPromptIfNeeded('login-page').catch(() => undefined);
        this.init();
        this.loading.hideLoading();
    }
    async refreshAppVersion() {
        const current = await this.appUpdate.getInstalledVersion();
        this.appVersion = current.versionCode
            ? `${current.versionName} (${current.versionCode})`
            : current.versionName;
    }
    init() {
        // setTimeout(() => {
        // if (this.token !== '')
        // {
        //     this.router.navigate(['/site']);
        // }
        // }, 5000);
    }
    onSubmit(event) {
        event.preventDefault(); // Prevent the default form submission
        const id = this.idInput.nativeElement.value;
        const pin = this.pinInput.nativeElement.value;
        this.auth.login(id, pin).subscribe((response) => {
            if (response.error_code) {
                let message = response.message;
                this.presentAlert("Login Attempt Failed", message);
            }
            else if (response.access_token !== '' || response.user) {
                this.login.id = id;
                this.login.pin = pin;
                this.data.setLogin(this.login);
                this.auth.handleLoginResponse(response);
            }
        }, (error) => {
            this.presentAlert("Login Attempt Failed", "Server Error: " + error.message);
        });
    }
    blockBackButton() {
        this.platform.backButton.subscribeWithPriority(9999, () => { });
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: ['Okay'],
        });
        await alert.present();
    }
    static { this.ɵfac = function LoginPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginPage)(i0.ɵɵdirectiveInject(i1.ApiService), i0.ɵɵdirectiveInject(i2.AuthService), i0.ɵɵdirectiveInject(i3.AlertController), i0.ɵɵdirectiveInject(i4.Router), i0.ɵɵdirectiveInject(i5.LoadingService), i0.ɵɵdirectiveInject(i6.DataService), i0.ɵɵdirectiveInject(i3.Platform), i0.ɵɵdirectiveInject(i7.AppUpdateService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoginPage, selectors: [["app-login"]], viewQuery: function LoginPage_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.idInput = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pinInput = _t.first);
        } }, decls: 24, vars: 2, consts: [["idInput", ""], ["pinInput", ""], [3, "fullscreen"], [1, "ep-login"], [1, "ep-login__mark"], ["src", "assets/ic_app_logo.png", "alt", "Enforcement Pro"], [1, "ep-kicker"], [1, "ep-login__title"], [1, "ep-login__sub"], [1, "ep-login__card"], [1, "signin-form", 3, "submit"], [1, "form-group"], ["type", "number", "name", "id", "placeholder", "Officer ID", "required", "", 1, "form-control"], ["name", "pin", "id", "pin-field", "type", "number", "placeholder", "PIN", "required", "", 1, "form-control"], ["type", "submit", 1, "btn", "btn-primary"], [1, "ep-login__foot"], ["class", "ep-login__version", 4, "ngIf"], [1, "ep-login__version"]], template: function LoginPage_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "ion-content", 2)(1, "div", 3)(2, "div", 4);
            i0.ɵɵelement(3, "img", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "p", 6);
            i0.ɵɵtext(5, "Officer access");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "h1", 7);
            i0.ɵɵtext(7, "Enforcement Pro");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "p", 8);
            i0.ɵɵtext(9, "Sign in to start your duty.");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div", 9)(11, "form", 10);
            i0.ɵɵlistener("submit", function LoginPage_Template_form_submit_11_listener($event) { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.onSubmit($event)); });
            i0.ɵɵelementStart(12, "div", 11);
            i0.ɵɵelement(13, "input", 12, 0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "div", 11);
            i0.ɵɵelement(16, "input", 13, 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(18, "div", 11)(19, "button", 14);
            i0.ɵɵtext(20, "Sign in");
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelementStart(21, "p", 15);
            i0.ɵɵtext(22, "National Enforcement Solutions");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(23, LoginPage_p_23_Template, 2, 1, "p", 16);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(23);
            i0.ɵɵproperty("ngIf", ctx.appVersion);
        } }, dependencies: [i8.NgIf, i9.ɵNgNoValidate, i9.NgControlStatusGroup, i9.NgForm, i3.IonContent], styles: ["ion-content[_ngcontent-%COMP%] {\n  --background: #0c1b23;\n}\n\n.ep-login__version[_ngcontent-%COMP%] {\n  margin: 10px 0 0;\n  color: rgba(255, 248, 232, 0.55);\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginPage, [{
        type: Component,
        args: [{ selector: 'app-login', template: "<ion-content [fullscreen]=\"true\">\n  <div class=\"ep-login\">\n    <div class=\"ep-login__mark\">\n      <img src=\"assets/ic_app_logo.png\" alt=\"Enforcement Pro\" />\n    </div>\n    <p class=\"ep-kicker\">Officer access</p>\n    <h1 class=\"ep-login__title\">Enforcement Pro</h1>\n    <p class=\"ep-login__sub\">Sign in to start your duty.</p>\n\n    <div class=\"ep-login__card\">\n      <form (submit)=\"onSubmit($event)\" class=\"signin-form\">\n        <div class=\"form-group\">\n          <input #idInput type=\"number\" name=\"id\" class=\"form-control\" placeholder=\"Officer ID\" required>\n        </div>\n        <div class=\"form-group\">\n          <input #pinInput name=\"pin\" id=\"pin-field\" type=\"number\" class=\"form-control\" placeholder=\"PIN\" required>\n        </div>\n        <div class=\"form-group\">\n          <button type=\"submit\" class=\"btn btn-primary\">Sign in</button>\n        </div>\n      </form>\n    </div>\n\n    <p class=\"ep-login__foot\">National Enforcement Solutions</p>\n    <p class=\"ep-login__version\" *ngIf=\"appVersion\">{{ appVersion }}</p>\n  </div>\n</ion-content>\n", styles: ["ion-content {\n  --background: #0c1b23;\n}\n\n.ep-login__version {\n  margin: 10px 0 0;\n  color: rgba(255, 248, 232, 0.55);\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n}\n"] }]
    }], () => [{ type: i1.ApiService }, { type: i2.AuthService }, { type: i3.AlertController }, { type: i4.Router }, { type: i5.LoadingService }, { type: i6.DataService }, { type: i3.Platform }, { type: i7.AppUpdateService }], { idInput: [{
            type: ViewChild,
            args: ['idInput']
        }], pinInput: [{
            type: ViewChild,
            args: ['pinInput']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoginPage, { className: "LoginPage" }); })();
//# sourceMappingURL=login.page.js.map