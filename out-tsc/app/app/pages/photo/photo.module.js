import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotoPageRoutingModule } from './photo-routing.module';
import { PhotoPage } from './photo.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import { EvidenceCaptureModule } from '../../components/evidence-capture/evidence-capture.module';
import * as i0 from "@angular/core";
export class PhotoPageModule {
    static { this.ɵfac = function PhotoPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PhotoPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PhotoPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            NavBarModule,
            EvidenceCaptureModule,
            PhotoPageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PhotoPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    NavBarModule,
                    EvidenceCaptureModule,
                    PhotoPageRoutingModule
                ],
                declarations: [PhotoPage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(PhotoPageModule, { declarations: [PhotoPage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        NavBarModule,
        EvidenceCaptureModule,
        PhotoPageRoutingModule] }); })();
//# sourceMappingURL=photo.module.js.map