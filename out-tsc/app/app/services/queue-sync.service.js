import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/data.service";
import * as i2 from "./fpn-submission.service";
import * as i3 from "./patrol.service";
export class QueueSyncService {
    constructor(data, fpnSubmission, patrol) {
        this.data = data;
        this.fpnSubmission = fpnSubmission;
        this.patrol = patrol;
        this.started = false;
        this.flushing = false;
        this.timer = null;
    }
    start() {
        if (this.started) {
            this.flush().catch(() => undefined);
            return;
        }
        this.started = true;
        this.flush().catch(() => undefined);
        this.timer = setInterval(() => {
            this.flush().catch(() => undefined);
        }, 30000);
        App.addListener('appStateChange', ({ isActive }) => {
            if (isActive) {
                this.flush().catch(() => undefined);
            }
        });
        window.addEventListener('online', () => {
            this.flush().catch(() => undefined);
        });
    }
    async flush() {
        if (this.flushing || !navigator.onLine || !this.patrol.canUseFpnTools()) {
            return;
        }
        const queue = [...(this.data.getEnviroQue() || [])];
        if (queue.length === 0) {
            return;
        }
        this.flushing = true;
        try {
            for (const item of queue) {
                if (!navigator.onLine || !this.patrol.canUseFpnTools()) {
                    break;
                }
                const result = await this.fpnSubmission.submit(item);
                if (result.status === 'posted') {
                    this.data.spliceEnviroQue(item);
                }
            }
        }
        catch {
            // Keep retrying on the next tick.
        }
        finally {
            this.flushing = false;
        }
    }
    static { this.ɵfac = function QueueSyncService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QueueSyncService)(i0.ɵɵinject(i1.DataService), i0.ɵɵinject(i2.FpnSubmissionService), i0.ɵɵinject(i3.PatrolService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: QueueSyncService, factory: QueueSyncService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QueueSyncService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.DataService }, { type: i2.FpnSubmissionService }, { type: i3.PatrolService }], null); })();
//# sourceMappingURL=queue-sync.service.js.map