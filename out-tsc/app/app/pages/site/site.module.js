import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SitePageRoutingModule } from './site-routing.module';
import { SitePage } from './site.page';
import * as i0 from "@angular/core";
export class SitePageModule {
    static { this.ɵfac = function SitePageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SitePageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SitePageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            SitePageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SitePageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    SitePageRoutingModule
                ],
                declarations: [SitePage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SitePageModule, { declarations: [SitePage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        SitePageRoutingModule] }); })();
//# sourceMappingURL=site.module.js.map