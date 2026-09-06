import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { compressDataUrl, estimateDataUrlBytes } from '../helpers/image-compress';
import { NotebookEntry } from '../models/notebook-entry';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/api.service";
import * as i2 from "./enforcementpro/data.service";
import * as i3 from "./location.service";
import * as i4 from "./patrol.service";
export class FpnSubmissionService {
    constructor(api, data, location, patrol) {
        this.api = api;
        this.data = data;
        this.location = location;
        this.patrol = patrol;
        this.postTimeoutMs = 45000;
        this.imageTimeoutMs = 45000;
        this.maxAttempts = 3;
        this.imageCompressBudgets = [220000, 140000, 80000, 45000];
        this.inFlight = new Set();
    }
    async submit(enviroPost) {
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
        }
        finally {
            this.inFlight.delete(lockKey);
        }
    }
    async queueForLater(enviroPost) {
        if (!this.patrol.canUseFpnTools()) {
            return {
                status: 'blocked',
                message: 'You must be on patrol before saving an FPN.'
            };
        }
        const queueRecord = await this.prepareQueueRecord(enviroPost);
        await this.shrinkPayloadMedia(queueRecord);
        this.addToQueue(queueRecord);
        return this.appendStorageWarning({
            status: 'queued',
            message: 'FPN has been captured in Queue.'
        });
    }
    async submitSplit(queueRecord, images) {
        const payload = this.prepareServerPayload(queueRecord);
        payload.offence_images = [];
        const created = await this.postFpnPayload(payload);
        if (created.status !== 'posted') {
            if (created.status === 'queued' || created.status === 'auth') {
                queueRecord.offence_images = [...images];
                this.holdInQueue(queueRecord);
            }
            return this.appendStorageWarning(created);
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
        this.holdInQueue(queueRecord);
        queueRecord.fpn_number = created.response?.data?.fpn_number
            || created.response?.fpn_number
            || queueRecord.fpn_number;
        queueRecord.offence_images = [...images];
        this.holdInQueue(queueRecord);
        return this.uploadHeldImages(queueRecord, images, created.response);
    }
    async uploadHeldImages(queueRecord, images, existingResponse) {
        const remaining = [];
        const pending = [...images];
        const concurrency = 3;
        for (let index = 0; index < pending.length; index += concurrency) {
            const batch = pending.slice(index, index + concurrency);
            const results = await Promise.all(batch.map(image => this.uploadImageWithCompression(queueRecord.enviro_id, image)));
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
            return this.appendStorageWarning({
                status: 'queued',
                message: `FPN ${queueRecord.fpn_number || queueRecord.enviro_id} is held. ${remaining.length} photo(s) still need to upload.`,
                response: existingResponse
            });
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
    async uploadImageWithCompression(enviroId, image) {
        let current = image;
        for (let attempt = 0; attempt < this.imageCompressBudgets.length; attempt++) {
            if (attempt > 0 || estimateDataUrlBytes(current) > this.imageCompressBudgets[attempt]) {
                current = await compressDataUrl(current, this.imageCompressBudgets[attempt], Math.max(0.35, 0.72 - attempt * 0.12));
            }
            try {
                const response = await firstValueFrom(this.api.postFPNImage(enviroId, current).pipe(timeout(this.imageTimeoutMs)));
                if (response?.success !== false) {
                    return true;
                }
            }
            catch {
                // Compress further and try the same photo again.
            }
        }
        return false;
    }
    async postFpnPayload(payload) {
        let lastError = null;
        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
            try {
                const response = await firstValueFrom(this.api.postFPN(payload).pipe(timeout(this.postTimeoutMs)));
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
            }
            catch (error) {
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
    extractEnviroId(response) {
        const id = Number(response?.data?.id || response?.id || 0);
        return id > 0 ? id : 0;
    }
    async prepareQueueRecord(enviroPost) {
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
    hasMappedLocation(record) {
        const lat = Number(record.lat);
        const lng = Number(record.lng);
        return Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0 && lng !== 0;
    }
    prepareServerPayload(enviroPost) {
        const payload = this.cloneEnviroPost(enviroPost);
        if (this.isFormOffenceOrder(payload)) {
            const offence = payload.offence_id;
            payload.offence_id = payload.offence_type_id;
            payload.offence_type_id = offence;
        }
        this.applyStringLimits(payload);
        this.flattenNotebookOntoPayload(payload);
        return payload;
    }
    flattenNotebookOntoPayload(payload) {
        const notebook = payload.notebook_entries;
        if (!notebook) {
            return;
        }
        const fields = [
            'is_fpn_advised',
            'is_fpn_handed',
            'height_in_feet',
            'height_in_inch',
            'gender',
            'ethnicity_id',
            'caution',
            'second_caution',
            'visibility_id',
            'weather_id',
            'witness_name',
            'witness_phone',
            'witness_address',
            'witness_statement',
            'officer_statement',
            'is_witness_available',
            'build',
            'hair',
            'distance_from_offender',
            'distinguishing_features',
            'have_reason',
            'nearest_bin',
            'were',
            'did',
            'police_comments',
            'offender_comments',
            'bwv_assest'
        ];
        for (const field of fields) {
            const value = notebook[field];
            if (value === undefined || value === null || value === '' || value === 0) {
                continue;
            }
            payload[field] = value;
        }
    }
    applyStringLimits(payload) {
        const overflowNotes = [];
        const limits = {
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
            const value = payload[field];
            if (typeof value !== 'string') {
                continue;
            }
            const normalised = this.normaliseText(value);
            if (normalised.length > limit) {
                overflowNotes.push(`${field}: ${normalised}`);
            }
            payload[field] = this.truncate(normalised, limit);
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
            payload.officer_statement = payload.notebook_entries.officer_statement;
        }
    }
    async shrinkPayloadMedia(record) {
        if (Array.isArray(record.offence_images) && record.offence_images.length > 0) {
            record.offence_images = await Promise.all(record.offence_images.map(image => compressDataUrl(image, 220000)));
        }
        if (typeof record.signature === 'string' && record.signature.length > 0) {
            record.signature = await compressDataUrl(record.signature, 120000);
        }
    }
    applyNotebookLimits(notebook) {
        const limits = {
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
            const value = notebook[field];
            if (typeof value !== 'string') {
                continue;
            }
            notebook[field] = this.truncate(this.normaliseText(value), limit);
        }
    }
    addToQueue(enviroPost) {
        this.holdInQueue(enviroPost);
    }
    holdInQueue(enviroPost) {
        const existing = this.data.getEnviroQue();
        const key = this.getQueueKey(enviroPost);
        const match = existing.find(item => this.getQueueKey(item) === key);
        if (match) {
            this.data.updateEnviroInQue(match, enviroPost);
            return;
        }
        this.data.pushEnviroQueItem(enviroPost);
    }
    releaseHeldRecord(enviroPost) {
        const existing = this.data.getEnviroQue();
        const key = this.getQueueKey(enviroPost);
        const match = existing.find(item => this.getQueueKey(item) === key);
        if (match) {
            this.data.spliceEnviroQue(match);
        }
    }
    getQueueKey(enviroPost) {
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
    isFormOffenceOrder(enviroPost) {
        const offenceId = Number(enviroPost.offence_id);
        const offenceTypeId = Number(enviroPost.offence_type_id);
        return !!this.data.findOffenceById(offenceId) && !!this.data.findOffenceGroupId(offenceTypeId);
    }
    cloneEnviroPost(enviroPost) {
        return JSON.parse(JSON.stringify(enviroPost));
    }
    normaliseText(value) {
        return value.replace(/\s+/g, ' ').trim();
    }
    truncate(value, limit) {
        if (value.length <= limit) {
            return value;
        }
        if (limit <= 3) {
            return value.slice(0, limit);
        }
        return `${value.slice(0, limit - 3).trimEnd()}...`;
    }
    isAuthError(error) {
        return error?.status === 401;
    }
    isRetryableError(error) {
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
        return [0, 408, 423, 425, 429, 500, 502, 503, 504].includes(status);
    }
    appendStorageWarning(result) {
        const warning = this.data.consumeStorageWarning();
        if (warning) {
            result.message = `${result.message} ${warning}`;
        }
        return result;
    }
    getErrorMessage(error) {
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
    isPayloadTooLarge(error) {
        const status = error?.status;
        const message = String(error?.error?.message || error?.message || '').toLowerCase();
        return status === 413 || message.includes('payload too large') || message.includes('entity too large');
    }
    getBackoffMs(attempt) {
        return attempt * 2000;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static { this.ɵfac = function FpnSubmissionService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FpnSubmissionService)(i0.ɵɵinject(i1.ApiService), i0.ɵɵinject(i2.DataService), i0.ɵɵinject(i3.LocationService), i0.ɵɵinject(i4.PatrolService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: FpnSubmissionService, factory: FpnSubmissionService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FpnSubmissionService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.LocationService }, { type: i4.PatrolService }], null); })();
//# sourceMappingURL=fpn-submission.service.js.map