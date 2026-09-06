import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class BackgroundTaskService {
    constructor() {
        this.intervals = new Set();
        this.timeouts = new Set();
        this.subscriptions = new Set();
    }
    setInterval(handler, timeout, ...args) {
        const id = setInterval(handler, timeout, ...args);
        this.intervals.add(id);
        return id;
    }
    setTimeout(handler, timeout, ...args) {
        const id = setTimeout(() => {
            this.timeouts.delete(id);
            if (typeof handler === 'function') {
                handler(...args);
            }
            else {
                new Function(handler)();
            }
        }, timeout);
        this.timeouts.add(id);
        return id;
    }
    registerInterval(id) {
        this.intervals.add(id);
        return id;
    }
    registerTimeout(id) {
        this.timeouts.add(id);
        return id;
    }
    registerSubscription(subscription) {
        this.subscriptions.add(subscription);
        return subscription;
    }
    clearTimer(id) {
        clearInterval(id);
        clearTimeout(id);
        this.intervals.delete(id);
        this.timeouts.delete(id);
    }
    clearAll() {
        this.intervals.forEach((id) => clearInterval(id));
        this.timeouts.forEach((id) => clearTimeout(id));
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.intervals.clear();
        this.timeouts.clear();
        this.subscriptions.clear();
    }
    static { this.ɵfac = function BackgroundTaskService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BackgroundTaskService)(); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: BackgroundTaskService, factory: BackgroundTaskService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BackgroundTaskService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=background-task.service.js.map