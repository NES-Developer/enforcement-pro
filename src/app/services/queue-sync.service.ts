import { Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { DataService } from './enforcementpro/data.service';
import { FpnSubmissionService } from './fpn-submission.service';
import { PatrolService } from './patrol.service';

@Injectable({
    providedIn: 'root'
})
export class QueueSyncService {
    private started = false;
    private flushing = false;
    private timer: ReturnType<typeof setInterval> | null = null;

    constructor(
        private data: DataService,
        private fpnSubmission: FpnSubmissionService,
        private patrol: PatrolService
    ) {}

    start(): void {
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

    async flush(): Promise<void> {
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
        } catch {
            // Keep retrying on the next tick.
        } finally {
            this.flushing = false;
        }
    }
}
