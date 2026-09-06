import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnviroPage } from './enviro.page';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: EnviroPage
    },
    // {
    //   path: 'fpn/photo',
    //   component: PhotoComponent,
    // },
];
export class EnviroPageRoutingModule {
    static { this.ɵfac = function EnviroPageRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EnviroPageRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: EnviroPageRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forChild(routes), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EnviroPageRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forChild(routes)],
                exports: [RouterModule],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(EnviroPageRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
//# sourceMappingURL=enviro-routing.module.js.map