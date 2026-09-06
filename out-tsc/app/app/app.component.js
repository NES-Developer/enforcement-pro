import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import * as i0 from "@angular/core";
import * as i1 from "./services/enforcementpro/data.service";
import * as i2 from "@ionic/angular";
import * as i3 from "./services/app-update.service";
import * as i4 from "./services/tracking.service";
import * as i5 from "./services/queue-sync.service";
import * as i6 from "./loader/loader.component";
export class AppComponent {
    constructor(data, platform, appUpdate, tracking, queueSync) {
        this.data = data;
        this.platform = platform;
        this.appUpdate = appUpdate;
        this.tracking = tracking;
        this.queueSync = queueSync;
        this.platform.ready().then(() => {
            this.initialiseTracking();
        });
    }
    async initialiseTracking() {
        await this.data.init();
        await this.appUpdate.checkAndInstallIfNeeded('app-start').catch(() => undefined);
        await this.tracking.syncTrackingState().catch(() => undefined);
        this.queueSync.start();
        App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
                this.appUpdate.checkAndInstallIfNeeded('app-resume').catch(() => undefined);
                this.tracking.syncTrackingState().catch(() => undefined);
                this.queueSync.flush().catch(() => undefined);
            }
        });
    }
    static { this.ɵfac = function AppComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppComponent)(i0.ɵɵdirectiveInject(i1.DataService), i0.ɵɵdirectiveInject(i2.Platform), i0.ɵɵdirectiveInject(i3.AppUpdateService), i0.ɵɵdirectiveInject(i4.TrackingService), i0.ɵɵdirectiveInject(i5.QueueSyncService)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AppComponent, selectors: [["app-root"]], decls: 3, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-app");
            i0.ɵɵelement(1, "ion-router-outlet")(2, "app-loader");
            i0.ɵɵelementEnd();
        } }, dependencies: [i2.IonApp, i2.IonRouterOutlet, i6.LoaderComponent] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppComponent, [{
        type: Component,
        args: [{ selector: 'app-root', template: "<ion-app>\n  <ion-router-outlet></ion-router-outlet>\n  <app-loader></app-loader>\n</ion-app>\n" }]
    }], () => [{ type: i1.DataService }, { type: i2.Platform }, { type: i3.AppUpdateService }, { type: i4.TrackingService }, { type: i5.QueueSyncService }], null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AppComponent, { className: "AppComponent" }); })();
//# sourceMappingURL=app.component.js.map