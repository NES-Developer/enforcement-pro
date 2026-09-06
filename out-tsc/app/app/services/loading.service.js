import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class LoadingService {
    constructor() {
        this.loadingSubject = new BehaviorSubject(false);
        this.loading$ = this.loadingSubject.asObservable();
    }
    showLoading() {
        this.loadingSubject.next(true);
    }
    hideLoading() {
        console.log('Hiding loader'); // Debugging
        this.loadingSubject.next(false);
    }
    static { this.ɵfac = function LoadingService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoadingService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: LoadingService, factory: LoadingService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoadingService, [{
        type: Injectable,
        args: [{
                providedIn: 'root',
            }]
    }], null, null); })();
//# sourceMappingURL=loading.service.js.map