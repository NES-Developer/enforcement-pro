import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import * as i0 from "@angular/core";
export class DashboardPageModule {
    static { this.ɵfac = function DashboardPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DashboardPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: DashboardPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            NavBarModule,
            DashboardPageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DashboardPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    NavBarModule,
                    DashboardPageRoutingModule
                ],
                declarations: [DashboardPage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(DashboardPageModule, { declarations: [DashboardPage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        NavBarModule,
        DashboardPageRoutingModule] }); })();
//# sourceMappingURL=dashboard.module.js.map