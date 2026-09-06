import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingPageRoutingModule } from './setting-routing.module';
import { SettingPage } from './setting.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import * as i0 from "@angular/core";
export class SettingPageModule {
    static { this.ɵfac = function SettingPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SettingPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            NavBarModule,
            SettingPageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    NavBarModule,
                    SettingPageRoutingModule
                ],
                declarations: [SettingPage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SettingPageModule, { declarations: [SettingPage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        NavBarModule,
        SettingPageRoutingModule] }); })();
//# sourceMappingURL=setting.module.js.map