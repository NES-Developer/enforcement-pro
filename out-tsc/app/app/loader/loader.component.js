import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
function LoaderComponent_div_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1)(1, "div", 2);
    i0.ɵɵelement(2, "img", 3)(3, "img", 4);
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5, "Working\u2026");
    i0.ɵɵelementEnd()()();
} }
export class LoaderComponent {
    constructor() {
        this.loading$ = new BehaviorSubject(true);
    }
    ngOnInit() {
        // Simulate a delay to remove the loader after loading is complete
        setTimeout(() => {
            this.loading$.next(false); // Update loading state to false after some condition
        }, 3000); // Adjust loader delay as needed
    }
    static { this.ɵfac = function LoaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoaderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoaderComponent, selectors: [["app-loader"]], decls: 2, vars: 3, consts: [["class", "cover", 4, "ngIf"], [1, "cover"], [1, "ep-loader"], ["src", "../../assets/ic_app_logo.png", "alt", "Enforcement Pro", 1, "ep-loader__logo"], ["src", "../../assets/loader.gif", "alt", "", 1, "ep-loader__spin"]], template: function LoaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵtemplate(0, LoaderComponent_div_0_Template, 6, 0, "div", 0);
            i0.ɵɵpipe(1, "async");
        } if (rf & 2) {
            i0.ɵɵproperty("ngIf", i0.ɵɵpipeBind1(1, 1, ctx.loading$));
        } }, dependencies: [i1.NgIf, i1.AsyncPipe], styles: [".cover[_ngcontent-%COMP%] {\n  background: rgba(16, 35, 45, 0.42);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  position: fixed;\n  inset: 0;\n  backdrop-filter: blur(12px);\n}\n\n.ep-loader[_ngcontent-%COMP%] {\n  width: 180px;\n  padding: 22px 16px 16px;\n  border-radius: 22px;\n  background: #fffdf7;\n  text-align: center;\n  box-shadow: 0 18px 40px rgba(16, 35, 45, 0.18);\n}\n\n.ep-loader__logo[_ngcontent-%COMP%] {\n  height: 56px;\n  margin-bottom: 10px;\n}\n\n.ep-loader__spin[_ngcontent-%COMP%] {\n  height: 42px;\n}\n\n.ep-loader[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  font-weight: 700;\n  color: #10232d;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoaderComponent, [{
        type: Component,
        args: [{ selector: 'app-loader', template: "<div class=\"cover\" *ngIf=\"loading$ | async\">\n  <div class=\"ep-loader\">\n    <img class=\"ep-loader__logo\" src=\"../../assets/ic_app_logo.png\" alt=\"Enforcement Pro\">\n    <img class=\"ep-loader__spin\" src=\"../../assets/loader.gif\" alt=\"\">\n    <p>Working\u2026</p>\n  </div>\n</div>\n", styles: [".cover {\n  background: rgba(16, 35, 45, 0.42);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1000000;\n  position: fixed;\n  inset: 0;\n  backdrop-filter: blur(12px);\n}\n\n.ep-loader {\n  width: 180px;\n  padding: 22px 16px 16px;\n  border-radius: 22px;\n  background: #fffdf7;\n  text-align: center;\n  box-shadow: 0 18px 40px rgba(16, 35, 45, 0.18);\n}\n\n.ep-loader__logo {\n  height: 56px;\n  margin-bottom: 10px;\n}\n\n.ep-loader__spin {\n  height: 42px;\n}\n\n.ep-loader p {\n  margin: 8px 0 0;\n  font-weight: 700;\n  color: #10232d;\n}\n"] }]
    }], () => [], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoaderComponent, { className: "LoaderComponent" }); })();
//# sourceMappingURL=loader.component.js.map