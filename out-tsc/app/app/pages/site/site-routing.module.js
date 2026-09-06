import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SitePage } from './site.page';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: SitePage
    }
];
export class SitePageRoutingModule {
    static { this.ɵfac = function SitePageRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SitePageRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: SitePageRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SitePageRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(SitePageRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
//# sourceMappingURL=site-routing.module.js.map