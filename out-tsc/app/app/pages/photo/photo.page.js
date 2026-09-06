import { Component } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/data.service";
import * as i2 from "@angular/router";
import * as i3 from "@ionic/angular";
import * as i4 from "../../services/patrol.service";
import * as i5 from "../../components/nav-bar/nav-bar.component";
import * as i6 from "../../components/evidence-capture/evidence-capture.component";
export class PhotoPage {
    constructor(data, router, alertController, route2, patrol) {
        this.data = data;
        this.router = router;
        this.alertController = alertController;
        this.route2 = route2;
        this.patrol = patrol;
        this.currentStep = 1;
        this.enviro_post = new EnviroPost();
        this.route2.queryParams.subscribe(params => {
            this.currentStep = parseInt(params['currentStep']) || 1;
        });
    }
    ngOnInit() {
        if (!this.patrol.canUseFpnTools()) {
            this.presentAlert('Patrol Required', 'Start patrol from the dashboard before using the camera.');
            this.router.navigate(['/dashboard']);
            return;
        }
        this.loadData();
    }
    ionViewWillEnter() {
        this.loadData();
    }
    loadData() {
        const enviroPost = this.data.getEnviroPost();
        if (enviroPost) {
            this.enviro_post = enviroPost;
        }
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Okay'],
        });
        await alert.present();
    }
    static { this.ɵfac = function PhotoPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PhotoPage)(i0.ɵɵdirectiveInject(i1.DataService), i0.ɵɵdirectiveInject(i2.Router), i0.ɵɵdirectiveInject(i3.AlertController), i0.ɵɵdirectiveInject(i2.ActivatedRoute), i0.ɵɵdirectiveInject(i4.PatrolService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PhotoPage, selectors: [["app-photo"]], decls: 12, vars: 6, consts: [[3, "translucent"], [3, "photoCount", "currentStep"], [3, "fullscreen"], [1, "ep-page"], [1, "ep-page-head"], [1, "ep-kicker"]], template: function PhotoPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-header", 0);
            i0.ɵɵelement(1, "app-nav-bar", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "ion-content", 2)(3, "div", 3)(4, "div", 4)(5, "p", 5);
            i0.ɵɵtext(6, "Evidence");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "h1");
            i0.ɵɵtext(8, "Camera");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "p");
            i0.ɵɵtext(10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(11, "app-evidence-capture");
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("translucent", true);
            i0.ɵɵadvance();
            i0.ɵɵproperty("photoCount", ctx.enviro_post.offence_images.length)("currentStep", ctx.currentStep);
            i0.ɵɵadvance();
            i0.ɵɵproperty("fullscreen", true);
            i0.ɵɵadvance(8);
            i0.ɵɵtextInterpolate2("", ctx.enviro_post.offence_images.length, " photo", ctx.enviro_post.offence_images.length === 1 ? "" : "s", " attached");
        } }, dependencies: [i3.IonContent, i3.IonHeader, i5.NavBarComponent, i6.EvidenceCaptureComponent], styles: [".show[_ngcontent-%COMP%] {\n  display: block;\n}\n\n.hide[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.ep-capture[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  margin-bottom: 14px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PhotoPage, [{
        type: Component,
        args: [{ selector: 'app-photo', template: "<ion-header [translucent]=\"true\">\n    <app-nav-bar\n        [photoCount]=\"enviro_post.offence_images.length\"\n        [currentStep]=\"currentStep\">\n    </app-nav-bar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n    <div class=\"ep-page\">\n        <div class=\"ep-page-head\">\n            <p class=\"ep-kicker\">Evidence</p>\n            <h1>Camera</h1>\n            <p>{{ enviro_post.offence_images.length }} photo{{ enviro_post.offence_images.length === 1 ? '' : 's' }} attached</p>\n        </div>\n\n        <app-evidence-capture></app-evidence-capture>\n    </div>\n</ion-content>\n", styles: [".show {\n  display: block;\n}\n\n.hide {\n  display: none;\n}\n\n.ep-capture {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  margin-bottom: 14px;\n}\n"] }]
    }], () => [{ type: i1.DataService }, { type: i2.Router }, { type: i3.AlertController }, { type: i2.ActivatedRoute }, { type: i4.PatrolService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PhotoPage, { className: "PhotoPage" }); })();
//# sourceMappingURL=photo.page.js.map