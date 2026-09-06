import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ConstantsService {
    constructor() {
        this.APP_VERSION = 'Alpha';
        this.APP_VERSION_CODE = 1;
    }
    static { this.ɵfac = function ConstantsService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConstantsService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ConstantsService, factory: ConstantsService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConstantsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [], null); })();
//# sourceMappingURL=constants.service.js.map