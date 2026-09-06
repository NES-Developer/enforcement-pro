import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavBarComponent } from './nav-bar.component';
import * as i0 from "@angular/core";
export class NavBarModule {
    static { this.ɵfac = function NavBarModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NavBarModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: NavBarModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, IonicModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NavBarModule, [{
        type: NgModule,
        args: [{
                imports: [CommonModule, IonicModule],
                declarations: [NavBarComponent],
                exports: [NavBarComponent],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NavBarModule, { declarations: [NavBarComponent], imports: [CommonModule, IonicModule], exports: [NavBarComponent] }); })();
//# sourceMappingURL=nav-bar.module.js.map