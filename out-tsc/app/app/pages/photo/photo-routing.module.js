import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PhotoPage } from './photo.page';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: PhotoPage
    }
];
export class PhotoPageRoutingModule {
    static { this.ɵfac = function PhotoPageRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PhotoPageRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PhotoPageRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PhotoPageRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PhotoPageRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
//# sourceMappingURL=photo-routing.module.js.map