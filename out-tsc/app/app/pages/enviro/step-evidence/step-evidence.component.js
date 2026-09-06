import { Component } from '@angular/core';
import { EnviroPost } from '../../../models/enviro';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/enforcementpro/data.service";
import * as i2 from "../../../components/evidence-capture/evidence-capture.component";
export class StepEvidenceComponent {
    constructor(data) {
        this.data = data;
        this.enviro_post = new EnviroPost();
    }
    ngOnInit() {
        this.enviro_post = this.data.getEnviroPost() || new EnviroPost();
    }
    static { this.ɵfac = function StepEvidenceComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StepEvidenceComponent)(i0.ɵɵdirectiveInject(i1.DataService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StepEvidenceComponent, selectors: [["app-step-evidence"]], decls: 10, vars: 0, consts: [[1, "ep-page"], [1, "ep-section"], [1, "ep-section__head"], [1, "ep-kicker"]], template: function StepEvidenceComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "section", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4, "Evidence");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h2");
            i0.ɵɵtext(6, "Offence images");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "p");
            i0.ɵɵtext(8, "Take at least one photo of the offence before you confirm this FPN.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(9, "app-evidence-capture");
            i0.ɵɵelementEnd();
        } }, dependencies: [i2.EvidenceCaptureComponent], styles: ["[_nghost-%COMP%] {\n  display: block;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StepEvidenceComponent, [{
        type: Component,
        args: [{ selector: 'app-step-evidence', template: "<div class=\"ep-page\">\n  <section class=\"ep-section\">\n    <div class=\"ep-section__head\">\n      <p class=\"ep-kicker\">Evidence</p>\n      <h2>Offence images</h2>\n    </div>\n    <p>Take at least one photo of the offence before you confirm this FPN.</p>\n  </section>\n\n  <app-evidence-capture></app-evidence-capture>\n</div>\n", styles: [":host {\n  display: block;\n}\n"] }]
    }], () => [{ type: i1.DataService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StepEvidenceComponent, { className: "StepEvidenceComponent" }); })();
//# sourceMappingURL=step-evidence.component.js.map