import { EnviroPageRoutingModule } from './enviro-routing.module';
import { EnviroPage } from './enviro.page';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { FPNPage } from '../../fpn.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
// import { SignaturePadModule } from '@lemonadejs/signature';
// import SignaturePadModule from '@lemonadejs/signature';
import { Step1Component } from '../enviro/step1/step1.component';
import { Step2Component } from '../enviro/step2/step2.component';
import { Step3Component } from '../enviro/step3/step3.component';
import { Step4Component } from '../enviro/step4/step4.component';
import { Step5Component } from '../enviro/step5/step5.component';
import { Step6Component } from '../enviro/step6/step6.component';
import { Step7Component } from '../enviro/step7/step7.component';
import { StepEvidenceComponent } from '../enviro/step-evidence/step-evidence.component';
import { EvidenceCaptureModule } from '../../components/evidence-capture/evidence-capture.module';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@ionic/angular";
import * as i3 from "@angular/router";
import * as i4 from "../../components/nav-bar/nav-bar.component";
export class EnviroPageModule {
    static { this.ɵfac = function EnviroPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EnviroPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: EnviroPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            EnviroPageRoutingModule,
            NavBarModule,
            EvidenceCaptureModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EnviroPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    EnviroPageRoutingModule,
                    NavBarModule,
                    EvidenceCaptureModule
                ],
                declarations: [
                    EnviroPage,
                    Step1Component,
                    Step2Component,
                    Step3Component,
                    Step4Component,
                    Step5Component,
                    StepEvidenceComponent,
                    Step6Component,
                    Step7Component,
                ]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(EnviroPageModule, { declarations: [EnviroPage,
        Step1Component,
        Step2Component,
        Step3Component,
        Step4Component,
        Step5Component,
        StepEvidenceComponent,
        Step6Component,
        Step7Component], imports: [CommonModule,
        FormsModule,
        IonicModule,
        EnviroPageRoutingModule,
        NavBarModule,
        EvidenceCaptureModule] }); })();
i0.ɵɵsetComponentScope(EnviroPage, [i1.NgIf, i1.NgSwitch, i1.NgSwitchCase, i2.IonButton, i2.IonContent, i2.IonFooter, i2.IonHeader, i2.IonIcon, i2.IonRouterOutlet, i3.RouterOutlet, i4.NavBarComponent, Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    StepEvidenceComponent,
    Step6Component,
    Step7Component], []);
//# sourceMappingURL=enviro.module.js.map