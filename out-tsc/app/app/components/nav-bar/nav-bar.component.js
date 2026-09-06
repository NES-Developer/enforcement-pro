import { Component, Input } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "../../services/patrol.service";
import * as i3 from "@ionic/angular";
import * as i4 from "@angular/common";
function NavBarComponent_span_22_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 7);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.photoCount);
} }
export class NavBarComponent {
    constructor(router, patrol, alertController) {
        this.router = router;
        this.patrol = patrol;
        this.alertController = alertController;
        this.photoCount = null;
        this.currentStep = null;
        this.currentPath = '';
        this.patrolLockedRoutes = ['/enviro', '/photo', '/queue'];
    }
    ngOnInit() {
        this.currentPath = this.pathFromUrl(this.router.url);
        this.routerSub = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event) => {
            this.currentPath = this.pathFromUrl(event.urlAfterRedirects);
        });
    }
    ngOnDestroy() {
        this.routerSub?.unsubscribe();
    }
    isActive(path) {
        return this.currentPath === path || this.currentPath.startsWith(`${path}/`);
    }
    async navigate(route) {
        if (this.patrolLockedRoutes.includes(route) && !this.patrol.canUseFpnTools()) {
            await this.presentPatrolRequired();
            this.router.navigate(['/dashboard']);
            return;
        }
        if (route === '/enviro' && this.isFiniteNumber(this.currentStep)) {
            this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
            return;
        }
        this.router.navigate([route]);
    }
    pathFromUrl(url) {
        return url.split('?')[0];
    }
    isFiniteNumber(value) {
        return typeof value === 'number' && Number.isFinite(value);
    }
    async presentPatrolRequired() {
        const alert = await this.alertController.create({
            header: 'Patrol Required',
            message: 'Start patrol from the dashboard before using FPN tools.',
            buttons: ['Okay'],
        });
        await alert.present();
    }
    static { this.ɵfac = function NavBarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NavBarComponent)(i0.ɵɵdirectiveInject(i1.Router), i0.ɵɵdirectiveInject(i2.PatrolService), i0.ɵɵdirectiveInject(i3.AlertController)); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NavBarComponent, selectors: [["app-nav-bar"]], inputs: { photoCount: "photoCount", currentStep: "currentStep" }, decls: 33, vars: 19, consts: [[1, "ep-nav"], [1, "ep-nav__row"], [1, "ep-nav__col"], [1, "ep-nav__btn", 3, "click"], [3, "name"], [1, "ep-nav__label"], ["class", "ep-nav__count", 4, "ngIf"], [1, "ep-nav__count"]], template: function NavBarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ion-toolbar", 0)(1, "ion-row", 1)(2, "ion-col", 2)(3, "ion-tab-button", 3);
            i0.ɵɵlistener("click", function NavBarComponent_Template_ion_tab_button_click_3_listener() { return ctx.navigate("/dashboard"); });
            i0.ɵɵelement(4, "ion-icon", 4);
            i0.ɵɵelementStart(5, "span", 5);
            i0.ɵɵtext(6, "Home");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(7, "ion-col", 2)(8, "ion-tab-button", 3);
            i0.ɵɵlistener("click", function NavBarComponent_Template_ion_tab_button_click_8_listener() { return ctx.navigate("/enviro"); });
            i0.ɵɵelement(9, "ion-icon", 4);
            i0.ɵɵelementStart(10, "span", 5);
            i0.ɵɵtext(11, "FPN");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(12, "ion-col", 2)(13, "ion-tab-button", 3);
            i0.ɵɵlistener("click", function NavBarComponent_Template_ion_tab_button_click_13_listener() { return ctx.navigate("/lemo"); });
            i0.ɵɵelement(14, "ion-icon", 4);
            i0.ɵɵelementStart(15, "span", 5);
            i0.ɵɵtext(16, "Lemo");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(17, "ion-col", 2)(18, "ion-tab-button", 3);
            i0.ɵɵlistener("click", function NavBarComponent_Template_ion_tab_button_click_18_listener() { return ctx.navigate("/photo"); });
            i0.ɵɵelement(19, "ion-icon", 4);
            i0.ɵɵelementStart(20, "span", 5);
            i0.ɵɵtext(21, "Camera");
            i0.ɵɵelementEnd();
            i0.ɵɵtemplate(22, NavBarComponent_span_22_Template, 2, 1, "span", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(23, "ion-col", 2)(24, "ion-tab-button", 3);
            i0.ɵɵlistener("click", function NavBarComponent_Template_ion_tab_button_click_24_listener() { return ctx.navigate("/queue"); });
            i0.ɵɵelement(25, "ion-icon", 4);
            i0.ɵɵelementStart(26, "span", 5);
            i0.ɵɵtext(27, "Queue");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(28, "ion-col", 2)(29, "ion-tab-button", 3);
            i0.ɵɵlistener("click", function NavBarComponent_Template_ion_tab_button_click_29_listener() { return ctx.navigate("/setting"); });
            i0.ɵɵelement(30, "ion-icon", 4);
            i0.ɵɵelementStart(31, "span", 5);
            i0.ɵɵtext(32, "Profile");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵclassProp("is-active", ctx.isActive("/dashboard"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("name", ctx.isActive("/dashboard") ? "home" : "home-outline");
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("is-active", ctx.isActive("/enviro"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("name", ctx.isActive("/enviro") ? "leaf" : "leaf-outline");
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("is-active", ctx.isActive("/lemo"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("name", ctx.isActive("/lemo") ? "sparkles" : "sparkles-outline");
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("is-active", ctx.isActive("/photo"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("name", ctx.isActive("/photo") ? "camera" : "camera-outline");
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngIf", ctx.photoCount !== null);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("is-active", ctx.isActive("/queue"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("name", ctx.isActive("/queue") ? "time" : "time-outline");
            i0.ɵɵadvance(4);
            i0.ɵɵclassProp("is-active", ctx.isActive("/setting"));
            i0.ɵɵadvance();
            i0.ɵɵproperty("name", ctx.isActive("/setting") ? "person" : "person-outline");
        } }, dependencies: [i4.NgIf, i3.IonCol, i3.IonIcon, i3.IonRow, i3.IonTabButton, i3.IonToolbar], styles: ["[_nghost-%COMP%] {\n  display: block;\n}\n\n.ep-nav__col[_ngcontent-%COMP%] {\n  position: relative;\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NavBarComponent, [{
        type: Component,
        args: [{ selector: 'app-nav-bar', template: "<ion-toolbar class=\"ep-nav\">\n  <ion-row class=\"ep-nav__row\">\n    <ion-col class=\"ep-nav__col\">\n      <ion-tab-button class=\"ep-nav__btn\" [class.is-active]=\"isActive('/dashboard')\" (click)=\"navigate('/dashboard')\">\n        <ion-icon [name]=\"isActive('/dashboard') ? 'home' : 'home-outline'\"></ion-icon>\n        <span class=\"ep-nav__label\">Home</span>\n      </ion-tab-button>\n    </ion-col>\n    <ion-col class=\"ep-nav__col\">\n      <ion-tab-button class=\"ep-nav__btn\" [class.is-active]=\"isActive('/enviro')\" (click)=\"navigate('/enviro')\">\n        <ion-icon [name]=\"isActive('/enviro') ? 'leaf' : 'leaf-outline'\"></ion-icon>\n        <span class=\"ep-nav__label\">FPN</span>\n      </ion-tab-button>\n    </ion-col>\n    <ion-col class=\"ep-nav__col\">\n      <ion-tab-button class=\"ep-nav__btn\" [class.is-active]=\"isActive('/lemo')\" (click)=\"navigate('/lemo')\">\n        <ion-icon [name]=\"isActive('/lemo') ? 'sparkles' : 'sparkles-outline'\"></ion-icon>\n        <span class=\"ep-nav__label\">Lemo</span>\n      </ion-tab-button>\n    </ion-col>\n    <ion-col class=\"ep-nav__col\">\n      <ion-tab-button class=\"ep-nav__btn\" [class.is-active]=\"isActive('/photo')\" (click)=\"navigate('/photo')\">\n        <ion-icon [name]=\"isActive('/photo') ? 'camera' : 'camera-outline'\"></ion-icon>\n        <span class=\"ep-nav__label\">Camera</span>\n        <span class=\"ep-nav__count\" *ngIf=\"photoCount !== null\">{{ photoCount }}</span>\n      </ion-tab-button>\n    </ion-col>\n    <ion-col class=\"ep-nav__col\">\n      <ion-tab-button class=\"ep-nav__btn\" [class.is-active]=\"isActive('/queue')\" (click)=\"navigate('/queue')\">\n        <ion-icon [name]=\"isActive('/queue') ? 'time' : 'time-outline'\"></ion-icon>\n        <span class=\"ep-nav__label\">Queue</span>\n      </ion-tab-button>\n    </ion-col>\n    <ion-col class=\"ep-nav__col\">\n      <ion-tab-button class=\"ep-nav__btn\" [class.is-active]=\"isActive('/setting')\" (click)=\"navigate('/setting')\">\n        <ion-icon [name]=\"isActive('/setting') ? 'person' : 'person-outline'\"></ion-icon>\n        <span class=\"ep-nav__label\">Profile</span>\n      </ion-tab-button>\n    </ion-col>\n  </ion-row>\n</ion-toolbar>\n", styles: [":host {\n  display: block;\n}\n\n.ep-nav__col {\n  position: relative;\n}\n"] }]
    }], () => [{ type: i1.Router }, { type: i2.PatrolService }, { type: i3.AlertController }], { photoCount: [{
            type: Input
        }], currentStep: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NavBarComponent, { className: "NavBarComponent" }); })();
//# sourceMappingURL=nav-bar.component.js.map