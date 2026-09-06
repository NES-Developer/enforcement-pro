import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QueuePageRoutingModule } from './queue-routing.module';
import { QueuePage } from './queue.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import * as i0 from "@angular/core";
export class QueuePageModule {
    static { this.ɵfac = function QueuePageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QueuePageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: QueuePageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            NavBarModule,
            QueuePageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueuePageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    NavBarModule,
                    QueuePageRoutingModule
                ],
                declarations: [QueuePage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(QueuePageModule, { declarations: [QueuePage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        NavBarModule,
        QueuePageRoutingModule] }); })();
//# sourceMappingURL=queue.module.js.map