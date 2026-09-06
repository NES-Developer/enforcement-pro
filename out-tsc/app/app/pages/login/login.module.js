import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { ApiService } from '../../services/enforcementpro/api.service';
import * as i0 from "@angular/core";
export class LoginPageModule {
    static { this.ɵfac = function LoginPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoginPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: LoginPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [ApiService], imports: [CommonModule,
            FormsModule,
            IonicModule,
            LoginPageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoginPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    LoginPageRoutingModule
                ],
                declarations: [LoginPage],
                providers: [ApiService],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(LoginPageModule, { declarations: [LoginPage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        LoginPageRoutingModule] }); })();
//# sourceMappingURL=login.module.js.map