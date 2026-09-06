import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/app-http.service";
export class ValidatePersonService {
    constructor(appHttp) {
        this.appHttp = appHttp;
        this.baseUrl = 'https://app.enforcementpro.co.uk/api/verify/idu';
    }
    validateIdetity(body) {
        return this.appHttp.post(this.baseUrl, body, {
            timeoutMs: 20000
        });
    }
    static { this.ɵfac = function ValidatePersonService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ValidatePersonService)(i0.ɵɵinject(i1.AppHttpService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ValidatePersonService, factory: ValidatePersonService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ValidatePersonService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.AppHttpService }], null); })();
//# sourceMappingURL=validate-person.service.js.map