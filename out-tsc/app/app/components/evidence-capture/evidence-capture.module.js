import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EvidenceCaptureComponent } from './evidence-capture.component';
import * as i0 from "@angular/core";
export class EvidenceCaptureModule {
    static { this.ɵfac = function EvidenceCaptureModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EvidenceCaptureModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: EvidenceCaptureModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule, IonicModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EvidenceCaptureModule, [{
        type: NgModule,
        args: [{
                imports: [CommonModule, IonicModule],
                declarations: [EvidenceCaptureComponent],
                exports: [EvidenceCaptureComponent],
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(EvidenceCaptureModule, { declarations: [EvidenceCaptureComponent], imports: [CommonModule, IonicModule], exports: [EvidenceCaptureComponent] }); })();
//# sourceMappingURL=evidence-capture.module.js.map