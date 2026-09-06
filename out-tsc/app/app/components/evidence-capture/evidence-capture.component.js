import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { compressDataUrl, estimateDataUrlBytes } from '../../helpers/image-compress';
import { EnviroPost } from '../../models/enviro';
import * as i0 from "@angular/core";
import * as i1 from "../../services/enforcementpro/data.service";
import * as i2 from "@ionic/angular";
import * as i3 from "@angular/common";
const _c0 = ["video"];
const _c1 = ["canvas"];
function EvidenceCaptureComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 9);
    i0.ɵɵelement(1, "video", 10, 1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("height", ctx_r1.height);
} }
function EvidenceCaptureComponent_p_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 11);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1("", ctx_r1.error, ".");
} }
function EvidenceCaptureComponent_div_8_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 14);
    i0.ɵɵelement(1, "img", 15);
    i0.ɵɵelementStart(2, "button", 16);
    i0.ɵɵlistener("click", function EvidenceCaptureComponent_div_8_div_1_Template_button_click_2_listener() { const idx_r4 = i0.ɵɵrestoreView(_r3).index; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.removePhoto(idx_r4)); });
    i0.ɵɵelement(3, "ion-icon", 17);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const src_r5 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("src", src_r5, i0.ɵɵsanitizeUrl);
} }
function EvidenceCaptureComponent_div_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵtemplate(1, EvidenceCaptureComponent_div_8_div_1_Template, 4, 1, "div", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngForOf", ctx_r1.enviro_post.offence_images);
} }
export class EvidenceCaptureComponent {
    constructor(data, alertController) {
        this.data = data;
        this.alertController = alertController;
        this.compact = false;
        this.maxPhotos = 5;
        this.photosChanged = new EventEmitter();
        this.width = 640;
        this.height = 480;
        this.enviro_post = new EnviroPost();
        this.error = '';
        this.mediaStream = null;
    }
    ngOnInit() {
        this.reload();
    }
    async ngAfterViewInit() {
        await this.setupDevices();
    }
    ngOnDestroy() {
        this.stopCameraStream();
    }
    reload() {
        const enviroPost = this.data.getEnviroPost();
        if (enviroPost) {
            this.enviro_post = enviroPost;
        }
        if (!Array.isArray(this.enviro_post.offence_images)) {
            this.enviro_post.offence_images = [];
        }
    }
    get photoCount() {
        return this.enviro_post.offence_images?.length || 0;
    }
    async capture() {
        this.reload();
        if (this.photoCount >= this.maxPhotos) {
            await this.presentAlert('Limit exceeded', `FPN images cannot exceed ${this.maxPhotos}.`);
            return;
        }
        const videoEl = this.video?.nativeElement;
        const canvasEl = this.canvas?.nativeElement;
        if (!videoEl || !canvasEl) {
            await this.presentAlert('Camera', 'Camera is not ready yet. Please wait a moment.');
            return;
        }
        const context = canvasEl.getContext('2d');
        if (!context) {
            return;
        }
        context.clearRect(0, 0, this.width, this.height);
        context.drawImage(videoEl, 0, 0, this.width, this.height);
        const capturedImage = canvasEl.toDataURL('image/jpeg', 0.72);
        this.enviro_post.offence_images.push(capturedImage);
        this.saveEnviroData();
        await this.compressLastImage();
    }
    removePhoto(idx) {
        this.reload();
        this.enviro_post.offence_images.splice(idx, 1);
        this.saveEnviroData();
    }
    async setupDevices() {
        if (!navigator.mediaDevices?.getUserMedia) {
            this.error = 'Camera is not available on this device';
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' } }
            });
            this.mediaStream = stream;
            if (this.video?.nativeElement) {
                this.video.nativeElement.srcObject = stream;
                await this.video.nativeElement.play();
            }
            this.error = '';
        }
        catch {
            this.error = 'Unable to open the camera. Check permissions and try again';
        }
    }
    stopCameraStream() {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        if (this.video?.nativeElement) {
            this.video.nativeElement.srcObject = null;
        }
    }
    async compressLastImage() {
        const images = this.enviro_post.offence_images;
        if (!images.length) {
            return;
        }
        const lastIndex = images.length - 1;
        const lastImage = images[lastIndex];
        const maxBytes = 220000;
        if (estimateDataUrlBytes(lastImage) <= maxBytes) {
            return;
        }
        try {
            this.enviro_post.offence_images[lastIndex] = await compressDataUrl(lastImage, maxBytes);
            this.saveEnviroData();
        }
        catch {
            // Keep the original capture if compression fails.
        }
    }
    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
        this.photosChanged.emit(this.photoCount);
    }
    async presentAlert(header, message) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['Okay'],
        });
        await alert.present();
    }
    static { this.ɵfac = function EvidenceCaptureComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EvidenceCaptureComponent)(i0.ɵɵdirectiveInject(i1.DataService), i0.ɵɵdirectiveInject(i2.AlertController)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EvidenceCaptureComponent, selectors: [["app-evidence-capture"]], viewQuery: function EvidenceCaptureComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
            i0.ɵɵviewQuery(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.video = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
        } }, inputs: { compact: "compact", maxPhotos: "maxPhotos" }, outputs: { photosChanged: "photosChanged" }, decls: 11, vars: 9, consts: [["canvas", ""], ["video", ""], ["class", "ep-photo-stage", 4, "ngIf"], ["class", "ep-note", 4, "ngIf"], ["type", "button", 1, "ep-capture", 3, "click"], ["name", "camera"], [1, "ep-evidence__count"], ["class", "ep-photo-grid", 4, "ngIf"], [1, "ep-evidence__canvas", 3, "width", "height"], [1, "ep-photo-stage"], ["id", "lemo-video", "autoplay", "", "playsinline", "", 3, "height"], [1, "ep-note"], [1, "ep-photo-grid"], ["class", "ep-photo-tile", 4, "ngFor", "ngForOf"], [1, "ep-photo-tile"], ["alt", "", 3, "src"], ["type", "button", "aria-label", "Remove photo", 3, "click"], ["name", "trash"]], template: function EvidenceCaptureComponent_Template(rf, ctx) { if (rf & 1) {
            const _r1 = i0.ɵɵgetCurrentView();
            i0.ɵɵelementStart(0, "div");
            i0.ɵɵtemplate(1, EvidenceCaptureComponent_div_1_Template, 3, 1, "div", 2)(2, EvidenceCaptureComponent_p_2_Template, 2, 1, "p", 3);
            i0.ɵɵelementStart(3, "button", 4);
            i0.ɵɵlistener("click", function EvidenceCaptureComponent_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r1); return i0.ɵɵresetView(ctx.capture()); });
            i0.ɵɵelement(4, "ion-icon", 5);
            i0.ɵɵtext(5, " Capture ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p", 6);
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(8, EvidenceCaptureComponent_div_8_Template, 2, 1, "div", 7);
            i0.ɵɵelement(9, "canvas", 8, 0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ep-evidence--compact", ctx.compact);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", !ctx.error);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.error);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate2("", ctx.photoCount, " of ", ctx.maxPhotos, " photos attached");
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngIf", ctx.photoCount);
            i0.ɵɵadvance();
            i0.ɵɵproperty("width", ctx.width)("height", ctx.height);
        } }, dependencies: [i3.NgForOf, i3.NgIf, i2.IonIcon], styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n\n.ep-evidence__count[_ngcontent-%COMP%] {\n  margin: 10px 0 0;\n  color: var(--ep-slate);\n  font-size: 13px;\n  font-weight: 600;\n  text-align: center;\n}\n\n.ep-evidence__canvas[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.ep-evidence--compact[_ngcontent-%COMP%]   .ep-photo-stage[_ngcontent-%COMP%] {\n  min-height: 180px;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EvidenceCaptureComponent, [{
        type: Component,
        args: [{ selector: 'app-evidence-capture', template: "<div [class.ep-evidence--compact]=\"compact\">\n  <div class=\"ep-photo-stage\" *ngIf=\"!error\">\n    <video #video id=\"lemo-video\" [height]=\"height\" autoplay playsinline></video>\n  </div>\n\n  <p class=\"ep-note\" *ngIf=\"error\">{{ error }}.</p>\n\n  <button class=\"ep-capture\" type=\"button\" (click)=\"capture()\">\n    <ion-icon name=\"camera\"></ion-icon>\n    Capture\n  </button>\n\n  <p class=\"ep-evidence__count\">{{ photoCount }} of {{ maxPhotos }} photos attached</p>\n\n  <div class=\"ep-photo-grid\" *ngIf=\"photoCount\">\n    <div class=\"ep-photo-tile\" *ngFor=\"let src of enviro_post.offence_images; let idx = index\">\n      <img [src]=\"src\" alt=\"\" />\n      <button type=\"button\" (click)=\"removePhoto(idx)\" aria-label=\"Remove photo\">\n        <ion-icon name=\"trash\"></ion-icon>\n      </button>\n    </div>\n  </div>\n\n  <canvas #canvas class=\"ep-evidence__canvas\" [width]=\"width\" [height]=\"height\"></canvas>\n</div>\n", styles: [":host {\n  display: block;\n}\n\n.ep-evidence__count {\n  margin: 10px 0 0;\n  color: var(--ep-slate);\n  font-size: 13px;\n  font-weight: 600;\n  text-align: center;\n}\n\n.ep-evidence__canvas {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  opacity: 0;\n  pointer-events: none;\n}\n\n.ep-evidence--compact .ep-photo-stage {\n  min-height: 180px;\n}\n"] }]
    }], () => [{ type: i1.DataService }, { type: i2.AlertController }], { compact: [{
            type: Input
        }], maxPhotos: [{
            type: Input
        }], photosChanged: [{
            type: Output
        }], video: [{
            type: ViewChild,
            args: ['video']
        }], canvas: [{
            type: ViewChild,
            args: ['canvas']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EvidenceCaptureComponent, { className: "EvidenceCaptureComponent" }); })();
//# sourceMappingURL=evidence-capture.component.js.map