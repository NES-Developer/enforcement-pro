import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { EnviroPost } from '../models/enviro';
import { NotebookEntry } from '../models/notebook-entry';
import { ApiService } from './enforcementpro/api.service';
import { DataService } from './enforcementpro/data.service';
import { LocationService } from './location.service';
import { PatrolService } from './patrol.service';

export type FpnSubmissionStatus = 'posted' | 'queued' | 'failed' | 'auth' | 'blocked';

export interface FpnSubmissionResult {
    status: FpnSubmissionStatus;
    message: string;
    response?: any;
}

@Injectable({
    providedIn: 'root'
})
export class FpnSubmissionService {
    private readonly postTimeoutMs = 90000;
    private readonly maxAttempts = 3;

    constructor(
        private api: ApiService,
        private data: DataService,
        private location: LocationService,
        private patrol: PatrolService
    ) {}

    async submit(enviroPost: EnviroPost): Promise<FpnSubmissionResult> {
        if (!this.patrol.canUseFpnTools()) {
            return {
                status: 'blocked',
                message: 'You must be on patrol before submitting an FPN.'
            };
        }

        const queueRecord = await this.prepareQueueRecord(enviroPost);
        const payload = this.prepareServerPayload(queueRecord);
        let lastError: any = null;

        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
            try {
                const response = await firstValueFrom(
                    this.api.postFPN(payload).pipe(timeout(this.postTimeoutMs))
                );

                if (response?.success === false) {
                    return {
                        status: 'failed',
                        message: `${response.message || 'The server rejected this FPN.'} (Please edit)`,
                        response
                    };
                }

                return {
                    status: 'posted',
                    message: 'FPN submitted successfully.',
                    response
                };
            } catch (error: any) {
                lastError = error;

                if (this.isAuthError(error)) {
                    return {
                        status: 'auth',
                        message: 'Server has logged you off. Please auto login and submit again.'
                    };
                }

                if (!this.isRetryableError(error)) {
                    return {
                        status: 'failed',
                        message: this.getErrorMessage(error)
                    };
                }

                if (attempt < this.maxAttempts) {
                    await this.sleep(this.getBackoffMs(attempt));
                }
            }
        }

        this.addToQueue(queueRecord);

        return {
            status: 'queued',
            message: `FPN kept in queue after ${this.maxAttempts} failed attempts. ${this.getErrorMessage(lastError)}`
        };
    }

    async queueForLater(enviroPost: EnviroPost): Promise<FpnSubmissionResult> {
        if (!this.patrol.canUseFpnTools()) {
            return {
                status: 'blocked',
                message: 'You must be on patrol before saving an FPN.'
            };
        }

        const queueRecord = await this.prepareQueueRecord(enviroPost);
        this.addToQueue(queueRecord);

        return {
            status: 'queued',
            message: 'FPN has been captured in Queue.'
        };
    }

    private async prepareQueueRecord(enviroPost: EnviroPost): Promise<EnviroPost> {
        const record = this.cloneEnviroPost(enviroPost);
        const user = this.data.getUser();

        if (!record.notebook_entries) {
            record.notebook_entries = new NotebookEntry();
        }

        if (!record.officer_id && user?.id) {
            record.officer_id = user.id;
        }

        const position = await this.location.requireCurrentPosition();
        record.lat = position.latitude;
        record.lng = position.longitude;

        return record;
    }

    private prepareServerPayload(enviroPost: EnviroPost): EnviroPost {
        const payload = this.cloneEnviroPost(enviroPost);

        if (this.isFormOffenceOrder(payload)) {
            const offence = payload.offence_id;
            payload.offence_id = payload.offence_type_id;
            payload.offence_type_id = offence;
        }

        this.applyStringLimits(payload);

        return payload;
    }

    private applyStringLimits(payload: EnviroPost): void {
        const overflowNotes: string[] = [];
        const limits: Record<string, number> = {
            salutation: 50,
            first_name: 100,
            last_name: 100,
            address: 250,
            town: 100,
            county: 100,
            post_code: 20,
            date_of_birth: 20,
            phone: 50,
            email: 150,
            is_bwc_active: 10,
            proof_of_address: 100,
            proof_of_id: 100,
            language: 20,
            offender_reply: 190,
            description: 190,
            description_waste: 190,
            offence_location: 190,
            town_area: 100,
            poi: 190
        };

        for (const [field, limit] of Object.entries(limits)) {
            const value = (payload as any)[field];

            if (typeof value !== 'string') {
                continue;
            }

            const normalised = this.normaliseText(value);

            if (normalised.length > limit) {
                overflowNotes.push(`${field}: ${normalised}`);
            }

            (payload as any)[field] = this.truncate(normalised, limit);
        }

        if (!payload.notebook_entries) {
            payload.notebook_entries = new NotebookEntry();
        }

        this.applyNotebookLimits(payload.notebook_entries);

        if (overflowNotes.length > 0) {
            const existing = this.normaliseText(payload.notebook_entries.officer_statement || '');
            const overflow = `Additional FPN text: ${overflowNotes.join(' | ')}`;
            const combined = existing ? `${existing} | ${overflow}` : overflow;
            payload.notebook_entries.officer_statement = this.truncate(combined, 1800);
            (payload as any).officer_statement = payload.notebook_entries.officer_statement;
        }
    }

    private applyNotebookLimits(notebook: NotebookEntry): void {
        const limits: Record<string, number> = {
            is_fpn_advised: 10,
            is_fpn_handed: 10,
            height_in_feet: 20,
            height_in_inch: 20,
            gender: 50,
            caution: 20,
            second_caution: 20,
            witness_name: 100,
            witness_phone: 50,
            witness_address: 250,
            witness_statement: 1800,
            officer_statement: 1800,
            is_witness_available: 10,
            build: 100,
            distance_from_offender: 250,
            distinguishing_features: 250,
            have_reason: 250,
            nearest_bin: 250,
            were: 50,
            did: 50,
            police_comments: 250,
            offender_comments: 250,
            bwv_assest: 250
        };

        for (const [field, limit] of Object.entries(limits)) {
            const value = (notebook as any)[field];

            if (typeof value !== 'string') {
                continue;
            }

            (notebook as any)[field] = this.truncate(this.normaliseText(value), limit);
        }
    }

    private addToQueue(enviroPost: EnviroPost): void {
        const existing = this.data.getEnviroQue();
        const key = this.getQueueKey(enviroPost);
        const isDuplicate = existing.some(item => this.getQueueKey(item) === key);

        if (!isDuplicate) {
            this.data.pushEnviroQueItem(enviroPost);
        }
    }

    private getQueueKey(enviroPost: EnviroPost): string {
        if (enviroPost.fpn_number) {
            return `fpn:${enviroPost.fpn_number}`;
        }

        if (enviroPost.barcode) {
            return `barcode:${enviroPost.barcode}`;
        }

        return [
            enviroPost.officer_id,
            enviroPost.first_name,
            enviroPost.last_name,
            enviroPost.offence_location,
            enviroPost.offence_datetime
        ].join('|').toLowerCase();
    }

    private isFormOffenceOrder(enviroPost: EnviroPost): boolean {
        const offenceId = Number(enviroPost.offence_id);
        const offenceTypeId = Number(enviroPost.offence_type_id);

        return !!this.data.findOffenceById(offenceId) && !!this.data.findOffenceGroupId(offenceTypeId);
    }

    private cloneEnviroPost(enviroPost: EnviroPost): EnviroPost {
        return JSON.parse(JSON.stringify(enviroPost)) as EnviroPost;
    }

    private normaliseText(value: string): string {
        return value.replace(/\s+/g, ' ').trim();
    }

    private truncate(value: string, limit: number): string {
        if (value.length <= limit) {
            return value;
        }

        if (limit <= 3) {
            return value.slice(0, limit);
        }

        return `${value.slice(0, limit - 3).trimEnd()}...`;
    }

    private isAuthError(error: any): boolean {
        return error?.status === 401;
    }

    private isRetryableError(error: any): boolean {
        const status = error?.status;
        const message = this.getErrorMessage(error).toLowerCase();

        if (message.includes('data too long')) {
            return false;
        }

        return [0, 408, 409, 423, 425, 429, 500, 502, 503, 504].includes(status);
    }

    private getErrorMessage(error: any): string {
        return error?.error?.message || error?.message || 'Network/server error.';
    }

    private getBackoffMs(attempt: number): number {
        return attempt * 2000;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
