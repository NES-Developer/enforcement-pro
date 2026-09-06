import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EvidenceCaptureModule } from '../../components/evidence-capture/evidence-capture.module';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import { LemoPageRoutingModule } from './lemo-routing.module';
import { LemoPage } from './lemo.page';
import * as i0 from "@angular/core";
export class LemoPageModule {
    static { this.ɵfac = function LemoPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LemoPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: LemoPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            NavBarModule,
            EvidenceCaptureModule,
            LemoPageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LemoPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    NavBarModule,
                    EvidenceCaptureModule,
                    LemoPageRoutingModule
                ],
                declarations: [LemoPage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(LemoPageModule, { declarations: [LemoPage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        NavBarModule,
        EvidenceCaptureModule,
        LemoPageRoutingModule] }); })();
//# sourceMappingURL=lemo.module.js.map