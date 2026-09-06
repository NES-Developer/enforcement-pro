import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { compressDataUrl, estimateDataUrlBytes } from '../helpers/image-compress';
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
    private readonly postTimeoutMs = 45000;
    private readonly imageTimeoutMs = 45000;
    private readonly maxAttempts = 3;
    private readonly imageCompressBudgets = [220000, 140000, 80000, 45000];
    private readonly inFlight = new Set<string>();

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
        const lockKey = this.getQueueKey(queueRecord);

        if (this.inFlight.has(lockKey)) {
            return {
                status: 'queued',
                message: 'This FPN is already uploading.'
            };
        }

        this.inFlight.add(lockKey);

        try {
            await this.shrinkPayloadMedia(queueRecord);
            const images = [...(queueRecord.offence_images || [])];

            if (queueRecord.enviro_id) {
                this.holdInQueue(queueRecord);
                return this.uploadHeldImages(queueRecord, images);
            }

            return this.submitSplit(queueRecord, images);
        } finally {
            this.inFlight.delete(lockKey);
        }
    }

    async queueForLater(enviroPost: EnviroPost): Promise<FpnSubmissionResult> {
        if (!this.patrol.canUseFpnTools()) {
            return {
                status: 'blocked',
                message: 'You must be on patrol before saving an FPN.'
            };
        }

        const queueRecord = await this.prepareQueueRecord(enviroPost);
        await this.shrinkPayloadMedia(queueRecord);
        this.addToQueue(queueRecord);

        return {
            status: 'queued',
            message: 'FPN has been captured in Queue.'
        };
    }

    private async submitSplit(queueRecord: EnviroPost, images: string[]): Promise<FpnSubmissionResult> {
        const payload = this.prepareServerPayload(queueRecord);
        payload.offence_images = [];

        const created = await this.postFpnPayload(payload);
        if (created.status !== 'posted') {
            if (created.status === 'queued') {
                queueRecord.offence_images = [...images];
                this.holdInQueue(queueRecord);
            }
            return created;
        }

        if (images.length === 0) {
            this.releaseHeldRecord(queueRecord);
            return created;
        }

        const enviroId = this.extractEnviroId(created.response);
        if (!enviroId) {
            return {
                status: 'failed',
                message: 'FPN was created but no enviro_id was returned for image upload.',
                response: created.response
            };
        }

        queueRecord.enviro_id = enviroId;
        queueRecord.fpn_number = created.response?.data?.fpn_number
            || created.response?.fpn_number
            || queueRecord.fpn_number;
        queueRecord.offence_images = [...images];
        this.holdInQueue(queueRecord);

        return this.uploadHeldImages(queueRecord, images, created.response);
    }

    private async uploadHeldImages(
        queueRecord: EnviroPost,
        images: string[],
        existingResponse?: any
    ): Promise<FpnSubmissionResult> {
        const remaining: string[] = [];
        const pending = [...images];
        const concurrency = 3;

        for (let index = 0; index < pending.length; index += concurrency) {
            const batch = pending.slice(index, index + concurrency);
            const results = await Promise.all(
                batch.map(image => this.uploadImageWithCompression(queueRecord.enviro_id, image))
            );

            results.forEach((uploaded, batchIndex) => {
                if (!uploaded) {
                    remaining.push(batch[batchIndex]);
                }
            });

            queueRecord.offence_images = [...remaining, ...pending.slice(index + concurrency)];
            this.holdInQueue(queueRecord);
        }

        if (remaining.length > 0) {
            queueRecord.offence_images = remaining;
            this.holdInQueue(queueRecord);

            return {
                status: 'queued',
                message: `FPN ${queueRecord.fpn_number || queueRecord.enviro_id} is held. ${remaining.length} photo(s) still need to upload.`,
                response: existingResponse
            };
        }

        this.releaseHeldRecord(queueRecord);

        return {
            status: 'posted',
            message: images.length
                ? 'FPN submitted successfully. Photos were uploaded separately.'
                : 'FPN submitted successfully.',
            response: existingResponse || {
                data: {
                    id: queueRecord.enviro_id,
                    fpn_number: queueRecord.fpn_number
                }
            }
        };
    }

    private async uploadImageWithCompression(enviroId: number, image: string): Promise<boolean> {
        let current = image;

        for (let attempt = 0; attempt < this.imageCompressBudgets.length; attempt++) {
            if (attempt > 0 || estimateDataUrlBytes(current) > this.imageCompressBudgets[attempt]) {
                current = await compressDataUrl(
                    current,
                    this.imageCompressBudgets[attempt],
                    Math.max(0.35, 0.72 - attempt * 0.12)
                );
            }

            try {
                const response = await firstValueFrom(
                    this.api.postFPNImage(enviroId, current).pipe(timeout(this.imageTimeoutMs))
                );

                if (response?.success !== false) {
                    return true;
                }
            } catch {
                // Compress further and try the same photo again.
            }
        }

        return false;
    }

    private async postFpnPayload(payload: EnviroPost): Promise<FpnSubmissionResult> {
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

        return {
            status: 'queued',
            message: `FPN kept in queue after ${this.maxAttempts} failed attempts. ${this.getErrorMessage(lastError)}`
        };
    }

    private extractEnviroId(response: any): number {
        const id = Number(response?.data?.id || response?.id || 0);
        return id > 0 ? id : 0;
    }

    private async prepareQueueRecord(enviroPost: EnviroPost): Promise<EnviroPost> {
        if (!enviroPost.local_id) {
            enviroPost.local_id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }

        const record = this.cloneEnviroPost(enviroPost);
        const user = this.data.getUser();

        if (!record.notebook_entries) {
            record.notebook_entries = new NotebookEntry();
        }

        if (!record.officer_id && user?.id) {
            record.officer_id = user.id;
        }

        if (!this.hasMappedLocation(record)) {
            const lastKnown = this.location.peekLastKnown();
            record.lat = lastKnown.latitude;
            record.lng = lastKnown.longitude;

            const fresh = await this.location.tryCurrentPosition(4000);
            if (fresh) {
                record.lat = fresh.latitude;
                record.lng = fresh.longitude;
            }
        }

        return record;
    }

    private hasMappedLocation(record: EnviroPost): boolean {
        const lat = Number(record.lat);
        const lng = Number(record.lng);
        return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
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

    private async shrinkPayloadMedia(record: EnviroPost): Promise<void> {
        if (Array.isArray(record.offence_images) && record.offence_images.length > 0) {
            record.offence_images = await Promise.all(
                record.offence_images.map(image => compressDataUrl(image, 220000))
            );
        }

        if (typeof record.signature === 'string' && record.signature.length > 0) {
            record.signature = await compressDataUrl(record.signature, 120000);
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
        this.holdInQueue(enviroPost);
    }

    private holdInQueue(enviroPost: EnviroPost): void {
        const existing = this.data.getEnviroQue();
        const key = this.getQueueKey(enviroPost);
        const match = existing.find(item => this.getQueueKey(item) === key);

        if (match) {
            this.data.updateEnviroInQue(match, enviroPost);
            return;
        }

        this.data.pushEnviroQueItem(enviroPost);
    }

    private releaseHeldRecord(enviroPost: EnviroPost): void {
        const existing = this.data.getEnviroQue();
        const key = this.getQueueKey(enviroPost);
        const match = existing.find(item => this.getQueueKey(item) === key);

        if (match) {
            this.data.spliceEnviroQue(match);
        }
    }

    private getQueueKey(enviroPost: EnviroPost): string {
        if (enviroPost.local_id) {
            return `local:${enviroPost.local_id}`;
        }

        if (enviroPost.enviro_id) {
            return `enviro:${enviroPost.enviro_id}`;
        }

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

        if (this.isPayloadTooLarge(error)) {
            return false;
        }

        if (error?.name === 'TimeoutError') {
            return true;
        }

        return [0, 408, 409, 423, 425, 429, 500, 502, 503, 504].includes(status);
    }

    private getErrorMessage(error: any): string {
        if (error?.name === 'TimeoutError') {
            return 'The server took too long to respond.';
        }

        const status = error?.status;
        const serverMessage = error?.error?.message || error?.message;

        if (this.isPayloadTooLarge(error)) {
            return 'FPN is too large to send in one request. Photos will be uploaded separately.';
        }

        if (status === 0) {
            return serverMessage && !String(serverMessage).includes('Unknown Error')
                ? serverMessage
                : 'Could not reach the server. Check the device connection and try again.';
        }

        return serverMessage || 'Network/server error.';
    }

    private isPayloadTooLarge(error: any): boolean {
        const status = error?.status;
        const message = String(error?.error?.message || error?.message || '').toLowerCase();

        return status === 413 || message.includes('payload too large') || message.includes('entity too large');
    }

    private getBackoffMs(attempt: number): number {
        return attempt * 2000;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
