import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotebookPageRoutingModule } from './notebook-routing.module';
import { NotebookPage } from './notebook.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import * as i0 from "@angular/core";
export class NotebookPageModule {
    static { this.ɵfac = function NotebookPageModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NotebookPageModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: NotebookPageModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            IonicModule,
            NavBarModule,
            NotebookPageRoutingModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NotebookPageModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule,
                    NavBarModule,
                    NotebookPageRoutingModule
                ],
                declarations: [NotebookPage]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NotebookPageModule, { declarations: [NotebookPage], imports: [CommonModule,
        FormsModule,
        IonicModule,
        NavBarModule,
        NotebookPageRoutingModule] }); })();
//# sourceMappingURL=notebook.module.js.map