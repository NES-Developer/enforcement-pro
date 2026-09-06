import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/data.service";
export class LemoEncourageService {
    constructor(data) {
        this.data = data;
    }
    recordPosted() {
        return this.data.incrementPostedFpnCount();
    }
    line(count) {
        const n = count ?? this.data.getPostedFpnCount();
        if (n <= 1) {
            return 'Good job. Let’s find another offence.';
        }
        if (n === 2) {
            return 'Two FPNs in. Keep that pace going.';
        }
        if (n === 3) {
            return 'Wow, 3 FPNs. You are on a roll.';
        }
        if (n === 4) {
            return 'Four already. Another offence will not stand a chance.';
        }
        if (n === 5) {
            return 'Five FPNs. That is a strong shift.';
        }
        return `Wow, ${n} FPNs. You are on a roll. Let’s find another offence.`;
    }
    prefixed(count) {
        return `Lemo AI: ${this.line(count)}`;
    }
    static { this.ɵfac = function LemoEncourageService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LemoEncourageService)(i0.ɵɵinject(i1.DataService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: LemoEncourageService, factory: LemoEncourageService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LemoEncourageService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.DataService }], null); })();
//# sourceMappingURL=lemo-encourage.service.js.map