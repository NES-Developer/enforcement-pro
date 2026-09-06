import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LemoPage } from './lemo.page';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: LemoPage
    }
];
export class LemoPageRoutingModule {
    static { this.ɵfac = function LemoPageRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LemoPageRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: LemoPageRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LemoPageRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(LemoPageRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
//# sourceMappingURL=lemo-routing.module.js.map