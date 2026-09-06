import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EnviroPost } from '../models/enviro';
import { compressDataUrl } from '../helpers/image-compress';
import { UpperCaseWords } from '../helpers/utils';
import { findFirstMissingFpnField, formatDateOfBirth, hasInProgressFpnDraft, lemoWizardProgress, parseDateOfBirth, previousLemoWizardStep, } from '../helpers/fpn-core-validation';
import * as i0 from "@angular/core";
import * as i1 from "./enforcementpro/api.service";
import * as i2 from "./enforcementpro/data.service";
import * as i3 from "./fpn-submission.service";
import * as i4 from "./patrol.service";
import * as i5 from "./thermal-printer.service";
import * as i6 from "./lemo-encourage.service";
import * as i7 from "./offline-ticket.service";
import * as i8 from "./queue-sync.service";
import * as i9 from "./geocoding.service";
export class LemoAiService {
    constructor(api, data, fpnSubmission, patrol, printer, encourage, offlineTicket, queueSync, geocoding) {
        this.api = api;
        this.data = data;
        this.fpnSubmission = fpnSubmission;
        this.patrol = patrol;
        this.printer = printer;
        this.encourage = encourage;
        this.offlineTicket = offlineTicket;
        this.queueSync = queueSync;
        this.geocoding = geocoding;
        this.messages = [];
        this.mode = 'chat';
        this.wizardStep = null;
        this.busy = false;
        this.chatId = null;
        this.lastPosted = null;
        this.pendingTicketUrl = null;
        this.askedPostal = false;
        this.ticketBaseUrl = 'https://app.enforcementpro.co.uk/';
        this.queueLimit = 25;
    }
    async start() {
        this.messages = [];
        this.mode = 'chat';
        this.wizardStep = null;
        this.chatId = null;
        this.pendingTicketUrl = null;
        await this.ensureLookups();
        const site = this.data.getSelectedSite();
        const zone = this.currentZone();
        const siteName = site?.name || 'your assigned site';
        const zoneName = zone?.name;
        let content = `HI, I am Lemo AI. Here to help with your enforcement needs on E-pro.\n\nI can create an FPN, attach offence images, and work through legislation with you so the offence is right.`;
        content += `\n\nWorking on **${siteName}**`;
        content += zoneName ? `, zone **${zoneName}**.` : '. Select a zone if this site uses one.';
        this.pushAssistant(content, this.homeChoices());
    }
    async ask(text) {
        const message = (text || '').trim();
        if (!message || this.busy) {
            return;
        }
        this.pushUser(message);
        if (this.looksLikeCreate(message)) {
            this.startCreateFpn();
            return;
        }
        if (this.looksLikeImages(message)) {
            this.startUploadImages();
            return;
        }
        if (this.looksLikeResearch(message)) {
            if (this.mode === 'research') {
                this.pushAssistant('Tell me what you saw — for example littering, dog fouling, or fly-tipping — or pick an offence group below.', this.researchChoices());
                return;
            }
            await this.startResearch();
            return;
        }
        if (this.looksLikeNotebook(message)) {
            this.pushAssistant('Use Notebook entry above for issued FPNs, or open the FPN form. The stepper already knows what is required and where to submit.', [
                { id: 'notebook', label: 'Notebook entry', action: 'notebook' },
                { id: 'stepper', label: 'Open FPN form', action: 'stepper' },
            ]);
            return;
        }
        this.busy = true;
        try {
            const matches = this.searchOffences(message);
            await this.replyWithResearch(message, matches);
            this.mode = 'chat';
        }
        finally {
            this.busy = false;
        }
    }
    startCreateFpn(prefillOffenceId, replaceDraft = false) {
        if (!this.patrol.canUseFpnTools()) {
            this.pushAssistant('Start patrol from the dashboard before creating an FPN.', this.homeChoices());
            return;
        }
        const site = this.data.getSelectedSite();
        if (!site?.id) {
            this.pushAssistant('Select a site first, then come back to Lemo AI to create the FPN.', this.homeChoices());
            return;
        }
        if (!replaceDraft && hasInProgressFpnDraft(this.draft())) {
            this.pushAssistant('You already have an FPN in progress. Resume it, or start a new one and discard the draft.', [
                { id: 'resume-draft', label: 'Resume draft', action: 'resume-draft' },
                { id: 'replace-draft', label: 'Start new FPN', action: 'replace-draft', value: prefillOffenceId },
                { id: 'cancel', label: 'Cancel', action: 'cancel' },
            ]);
            return;
        }
        this.beginNewFpn(prefillOffenceId);
        this.mode = 'create';
        this.pushAssistant(prefillOffenceId
            ? 'Starting a new FPN with that offence. Site and zone stay set. Offender, photos, and signature start blank.'
            : 'Starting a new FPN. Site and zone stay set. Offender, offence, photos, and signature start blank.');
        this.advanceWizard();
    }
    startUploadImages() {
        if (!this.patrol.canUseFpnTools()) {
            this.pushAssistant('Start patrol from the dashboard before attaching offence images.', this.homeChoices());
            return;
        }
        this.mode = 'images';
        this.wizardStep = 'images';
        this.pushAssistant('Attach offence images for this FPN. Take at least one photo, then continue.', [{ id: 'images-done', label: 'Images added', action: 'images-done' }]);
        const last = this.lastAssistant();
        if (last) {
            last.showCamera = true;
        }
    }
    choose(choice) {
        if (!choice) {
            return;
        }
        if (choice.action === 'create') {
            this.pushUser(choice.label);
            this.startCreateFpn();
            return;
        }
        if (choice.action === 'queue' || choice.action === 'notebook' || choice.action === 'stepper') {
            return;
        }
        if (choice.action === 'research') {
            this.pushUser(choice.label);
            void this.startResearch();
            return;
        }
        if (choice.action === 'research-group' && choice.value) {
            this.pushUser(choice.label);
            this.showResearchGroup(Number(choice.value));
            return;
        }
        if (choice.action === 'images') {
            this.pushUser(choice.label);
            this.startUploadImages();
            return;
        }
        if (choice.action === 'cancel') {
            this.pushUser('Cancel');
            this.requestCancel();
            return;
        }
        if (choice.action === 'resume-draft') {
            this.pushUser(choice.label);
            this.mode = 'create';
            this.advanceWizard();
            return;
        }
        if (choice.action === 'replace-draft') {
            this.pushUser(choice.label);
            this.startCreateFpn(choice.value ? Number(choice.value) : undefined, true);
            return;
        }
        if (choice.action === 'cancel-keep') {
            this.pushUser('Keep draft');
            this.cancelWizard(false);
            return;
        }
        if (choice.action === 'cancel-discard') {
            this.pushUser('Discard draft');
            this.cancelWizard(true);
            return;
        }
        if (choice.action === 'wizard-back') {
            this.goBack();
            return;
        }
        if (choice.action === 'images-done') {
            this.continueAfterImages();
            return;
        }
        if (choice.action === 'signature-done') {
            this.continueAfterSignature();
            return;
        }
        if (choice.action === 'submit') {
            void this.submitFpn();
            return;
        }
        if (choice.action === 'queue-save') {
            void this.queueFpn();
            return;
        }
        if (choice.action === 'print-sunmi' || choice.action === 'print-urovo') {
            this.pushUser(choice.label);
            void this.printTicket(choice.action === 'print-sunmi' ? 'sunmi' : 'urovo');
            return;
        }
        if (choice.action === 'print-skip') {
            this.pushUser('Skip print');
            this.pendingTicketUrl = null;
            this.pushAssistant(`No problem. Ticket was not printed.\n\n${this.encourage.line()}`, this.afterSubmitChoices());
            return;
        }
        if (choice.action === 'use-offence' && choice.value) {
            this.pushUser(`Use ${choice.label}`);
            this.startCreateFpn(Number(choice.value));
            return;
        }
        this.pushUser(choice.label);
        this.applyChoice(choice);
        this.advanceWizard();
    }
    async submitFields(values) {
        const enviro = this.draft();
        const step = this.wizardStep;
        if (step === 'offender') {
            enviro.salutation = (values['salutation'] || enviro.salutation || '').trim();
            enviro.first_name = (values['first_name'] || '').trim();
            enviro.last_name = (values['last_name'] || '').trim();
            enviro.address = (values['address'] || '').trim();
            enviro.town = (values['town'] || '').trim();
            enviro.county = enviro.county || 'United Kingdom';
            enviro.post_code = (values['post_code'] || '').trim().toUpperCase();
            enviro.email = (values['email'] || '').trim();
            enviro.phone = (values['phone'] || '').trim();
            enviro.date_of_birth = formatDateOfBirth(values['dob_year'], values['dob_month'], values['dob_day']);
            if (!enviro.salutation || !enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth) {
                this.pushAssistant('I still need title, name, address, town, a valid UK postcode, and a valid date of birth.');
                this.promptCurrentStep();
                return;
            }
        }
        if (step === 'incident') {
            enviro.offender_reply = (values['offender_reply'] || '').trim();
            enviro.description = (values['description'] || '').trim();
        }
        if (step === 'place') {
            enviro.offence_location = (values['offence_location'] || '').trim();
            enviro.town_area = (values['town_area'] || '').trim();
            enviro.poi = (values['poi'] || '').trim();
            enviro.description = (values['description'] || '').trim();
            enviro.offender_reply = (values['offender_reply'] || '').trim();
            if (values['offence_datetime']) {
                enviro.offence_datetime = values['offence_datetime'];
            }
            if (values['issue_datetime']) {
                enviro.issue_datetime = values['issue_datetime'];
            }
            if (!enviro.offence_location || !enviro.poi || !enviro.land_type_id) {
                this.pushAssistant('Offence location, land type, and POI are required.');
                this.promptCurrentStep();
                return;
            }
            await this.applyGoogleLocation(enviro);
        }
        this.saveDraft(enviro);
        this.pushUser('Saved.');
        this.advanceWizard();
    }
    get isCreating() {
        return this.mode === 'create' || this.mode === 'images';
    }
    get wizardProgress() {
        return lemoWizardProgress(this.wizardStep);
    }
    imageCount() {
        const images = this.draft().offence_images;
        return Array.isArray(images) ? images.length : 0;
    }
    continueAfterImages() {
        const enviro = this.draft();
        if (!Array.isArray(enviro.offence_images)) {
            enviro.offence_images = [];
            this.saveDraft(enviro);
        }
        if (!enviro.offence_images.length) {
            this.pushAssistant('Please capture at least one offence image, then tap Continue with photos.');
            return;
        }
        if (this.mode === 'images') {
            this.mode = 'chat';
            this.wizardStep = null;
            this.pushAssistant(`${enviro.offence_images.length} image(s) attached to this FPN. You can keep chatting, or create / submit the notice.`, this.homeChoices());
            return;
        }
        this.wizardStep = 'signature';
        this.promptCurrentStep();
    }
    continueAfterSignature() {
        const enviro = this.draft();
        if (!enviro.signature) {
            this.wizardStep = 'signature';
            this.pushAssistant('Save a signature before submitting.');
            this.promptCurrentStep();
            return;
        }
        this.wizardStep = 'confirm';
        this.promptCurrentStep();
    }
    async submitFpn() {
        if (this.busy) {
            return;
        }
        const enviro = this.draft();
        if (this.returnToMissingField(enviro)) {
            return;
        }
        this.busy = true;
        this.pushUser('Submit FPN');
        try {
            const result = await this.fpnSubmission.submit(enviro);
            if (result.status === 'posted') {
                const payload = result.response?.data || result.response || {};
                const fpnNumber = payload.fpn_number || '';
                const postedId = Number(payload.id || result.response?.id || 0);
                this.lastPosted = postedId > 0 ? { id: postedId, fpnNumber: String(fpnNumber || '') } : null;
                this.finishSubmittedDraft();
                this.pendingTicketUrl = this.resolveTicketUrl(payload, fpnNumber);
                const created = fpnNumber ? `FPN ${fpnNumber} has been created.` : 'FPN has been created.';
                const pep = this.encourage.line(this.encourage.recordPosted());
                if (this.pendingTicketUrl) {
                    this.pushAssistant(`${created}\n\n${pep}\n\nPrint on Sunmi or Urovo?`, [
                        ...this.printChoices(),
                        ...this.afterSubmitChoices(),
                    ]);
                }
                else {
                    this.offlineTicket.printFor(enviro).catch(() => undefined);
                    this.pushAssistant(`${created}\n\n${pep}\n\nAn offline ticket is printing.`, this.afterSubmitChoices());
                }
                this.queueSync.flush().catch(() => undefined);
                return;
            }
            if (result.status === 'queued') {
                this.finishSubmittedDraft();
                this.offlineTicket.printFor(enviro).catch(() => undefined);
                this.queueSync.start();
                this.pushAssistant(`${result.message}\n\nAn offline ticket is printing. The notice will upload in the background.`, this.queueOrCreateChoices());
                return;
            }
            this.pushAssistant(result.message || 'Unable to submit this FPN right now.', [
                { id: 'retry', label: 'Try submit again', action: 'submit' },
                { id: 'cancel', label: 'Cancel', action: 'cancel' },
            ]);
        }
        finally {
            this.busy = false;
        }
    }
    async queueFpn() {
        if (this.busy) {
            return;
        }
        const enviro = this.draft();
        if (this.returnToMissingField(enviro)) {
            return;
        }
        if (this.data.getEnviroQue().length >= this.queueLimit) {
            this.pushAssistant('Queue has exceeded 25. Submit some queued FPNs first.', this.queueOrCreateChoices());
            return;
        }
        this.busy = true;
        this.pushUser('Save to queue');
        try {
            const result = await this.fpnSubmission.queueForLater(enviro);
            if (result.status === 'queued') {
                this.finishSubmittedDraft();
                this.offlineTicket.printFor(enviro).catch(() => undefined);
                this.pushAssistant('FPN Saved', this.queueOrCreateChoices());
                return;
            }
            this.pushAssistant(result.message || 'Unable to save this FPN right now.', [
                { id: 'retry-queue', label: 'Try save again', action: 'queue-save' },
                { id: 'submit', label: 'Submit FPN', action: 'submit' },
                { id: 'cancel', label: 'Cancel', action: 'cancel' },
            ]);
        }
        finally {
            this.busy = false;
        }
    }
    requestCancel() {
        if (!hasInProgressFpnDraft(this.draft())) {
            this.cancelWizard(false);
            return;
        }
        this.pushAssistant('Keep this FPN draft, or discard it?', [
            { id: 'cancel-keep', label: 'Keep draft', action: 'cancel-keep' },
            { id: 'cancel-discard', label: 'Discard draft', action: 'cancel-discard' },
        ]);
    }
    goBack() {
        const previous = previousLemoWizardStep(this.wizardStep);
        if (!previous) {
            this.requestCancel();
            return;
        }
        this.wizardStep = previous;
        this.promptCurrentStep();
    }
    cancelWizard(discard = false) {
        this.mode = 'chat';
        this.wizardStep = null;
        this.pendingTicketUrl = null;
        this.askedPostal = false;
        if (discard) {
            this.beginNewFpn();
            this.pushAssistant('Draft discarded. I can still research an offence or start a new FPN.', this.homeChoices());
            return;
        }
        this.pushAssistant('Cancelled. The draft is still saved if you want to continue.', this.homeChoices());
    }
    applyDraftPatch(patch) {
        const enviro = this.draft();
        Object.assign(enviro, patch);
        this.saveDraft(enviro);
    }
    lastAssistant() {
        return [...this.messages].reverse().find(item => item.role === 'assistant');
    }
    advanceWizard() {
        const enviro = this.draft();
        const next = this.nextNeededStep(enviro);
        this.wizardStep = next;
        this.promptCurrentStep();
    }
    nextNeededStep(enviro) {
        const gap = findFirstMissingFpnField(enviro, {
            requireZone: this.data.getZones().length > 0,
        });
        return (gap?.wizardStep || 'confirm');
    }
    returnToMissingField(enviro) {
        const gap = findFirstMissingFpnField(enviro, {
            requireZone: this.data.getZones().length > 0,
        });
        if (!gap) {
            return false;
        }
        this.wizardStep = gap.wizardStep;
        this.pushAssistant(gap.message);
        this.promptCurrentStep();
        return true;
    }
    promptCurrentStep() {
        const enviro = this.draft();
        const zone = this.currentZone();
        const site = this.data.getSelectedSite();
        switch (this.wizardStep) {
            case 'zone':
                this.pushAssistant(site?.name
                    ? `Which zone on ${site.name}?`
                    : 'Which zone is this FPN for?', this.choiceList(this.data.getZones().map(item => ({ id: `zone-${item.id}`, label: item.name, value: item.id })), 'zone'));
                break;
            case 'offence_group':
                this.pushAssistant(zone?.name ? `Zone ${zone.name} is set. Which offence group?` : 'Which offence group?', this.choiceList(this.data.getOffenceGroup().map(item => ({ id: `og-${item.id}`, label: item.englishName, value: item.id })), 'offence_group'));
                break;
            case 'offence': {
                const offences = this.offencesForGroup(enviro.offence_type_id);
                this.pushAssistant('Which offence? I will show the legislation after you pick one.', this.choiceList(offences.map(item => ({ id: `off-${item.id}`, label: item.name, value: item.id })), 'offence'));
                break;
            }
            case 'offender':
                if (!enviro.salutation) {
                    this.pushAssistant(this.offenceSummary(enviro.offence_id) + '\n\nWhat title should we use?', this.choiceList(this.data.getSalutations().map(item => ({ id: `sal-${item.id}`, label: item.title, value: item.title })), 'salutation'));
                    break;
                }
                if (!enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth) {
                    const dob = parseDateOfBirth(enviro.date_of_birth);
                    this.pushAssistant('Enter the offender details.');
                    this.attachFields([
                        { key: 'first_name', label: 'Forename', type: 'text', required: true, value: enviro.first_name },
                        { key: 'last_name', label: 'Surname', type: 'text', required: true, value: enviro.last_name },
                        { key: 'address', label: 'Address', type: 'textarea', required: true, value: enviro.address },
                        { key: 'town', label: 'Town', type: 'text', required: true, value: enviro.town },
                        { key: 'post_code', label: 'Postcode', type: 'text', required: true, value: enviro.post_code },
                        { key: 'dob_day', label: 'DOB day', type: 'number', required: true, value: dob?.day || '' },
                        { key: 'dob_month', label: 'DOB month', type: 'number', required: true, value: dob?.month || '' },
                        { key: 'dob_year', label: 'DOB year', type: 'number', required: true, value: dob?.year || '' },
                        { key: 'phone', label: 'Mobile', type: 'tel', value: enviro.phone },
                        { key: 'email', label: 'Email', type: 'email', value: enviro.email },
                    ]);
                    break;
                }
                this.pushAssistant('Did you activate BWC?', this.choiceList([
                    { id: 'bwc-yes', label: 'Yes', value: 'Yes' },
                    { id: 'bwc-no', label: 'No', value: 'No' },
                ], 'bwc'));
                break;
            case 'proofs':
                if (!enviro.proof_of_address) {
                    this.pushAssistant('How was the address proved?', this.choiceList(this.data.getAddressVerifiedBy().map(item => ({ id: `addr-${item.id}`, label: item.textOnMachine, value: item.id })), 'proof_of_address'));
                    break;
                }
                this.pushAssistant('What ID was shown?', this.choiceList(this.data.getIDShown().map(item => ({ id: `id-${item.id}`, label: item.textOnMachine, value: item.id })), 'proof_of_id'));
                break;
            case 'incident':
                if (!enviro.location_id) {
                    this.pushAssistant('Where did the offence happen?', this.choiceList(this.data.getOffenceLocationSuffix().map(item => ({ id: `loc-${item.id}`, label: item.textOnMachine, value: item.id })), 'location'));
                    break;
                }
                if (!enviro.action_id) {
                    this.pushAssistant('How did it happen?', this.choiceList(this.data.getOffenceHow().map(item => ({ id: `act-${item.id}`, label: item.textOnMachine, value: item.id })), 'action'));
                    break;
                }
                this.pushAssistant('Which language should the notice use?', this.choiceList([
                    { id: 'lang-en', label: 'English', value: 'English' },
                    { id: 'lang-cy', label: 'Welsh', value: 'Welsh' },
                ], 'language'));
                break;
            case 'place':
                if (!enviro.land_type_id) {
                    this.pushAssistant('Type of land?', this.choiceList([
                        { id: 'land-1', label: 'Public', value: 1 },
                        { id: 'land-2', label: 'Private', value: 2 },
                    ], 'land_type'));
                    break;
                }
                if (!this.askedPostal) {
                    this.askedPostal = true;
                    this.pushAssistant('Should this FPN be sent by post, or handed on the spot?', this.choiceList([
                        { id: 'postal-yes', label: 'Postal FPN', value: 0 },
                        { id: 'postal-no', label: 'Handed on the spot', value: 1 },
                    ], 'fpn_issued'));
                    break;
                }
                this.pushAssistant('Where exactly? Point of interest is the place name, such as a street, shop, or landmark. Offence time defaults to now — change it if needed.');
                this.attachFields([
                    { key: 'offence_location', label: 'Offence location', type: 'text', required: true, value: enviro.offence_location },
                    { key: 'town_area', label: 'Town / ward', type: 'text', value: enviro.town_area },
                    { key: 'poi', label: 'Point of interest', type: 'text', required: true, value: enviro.poi },
                    { key: 'offence_datetime', label: 'Offence time', type: 'text', required: true, value: enviro.offence_datetime },
                    { key: 'issue_datetime', label: 'Issue time', type: 'text', required: true, value: enviro.issue_datetime },
                    { key: 'description', label: 'Description', type: 'textarea', value: enviro.description },
                    { key: 'offender_reply', label: 'Offender reply', type: 'textarea', value: enviro.offender_reply },
                ]);
                break;
            case 'images':
                this.pushAssistant('Add offence images now. Take at least one photo, then tap Continue with photos.');
                this.attachCamera();
                break;
            case 'signature':
                this.pushAssistant('Sign to confirm this FPN, then save the signature.', [{ id: 'signature-done', label: 'Signature saved', action: 'signature-done' }]);
                this.attachSignature();
                break;
            case 'confirm':
                this.pushAssistant(this.confirmSummary(enviro), [
                    { id: 'submit', label: 'Submit FPN', action: 'submit' },
                    { id: 'queue-save', label: 'Save to queue', action: 'queue-save' },
                    { id: 'cancel', label: 'Cancel', action: 'cancel' },
                ]);
                this.attachSignature();
                break;
        }
    }
    applyChoice(choice) {
        const enviro = this.draft();
        const value = choice.value;
        if (this.wizardStep === 'zone' && value) {
            enviro.zone_id = Number(value);
            const zone = this.data.findZoneById(enviro.zone_id);
            if (zone) {
                this.data.setSelectedZone(zone);
            }
        }
        if (this.wizardStep === 'offence_group' && value) {
            enviro.offence_type_id = Number(value);
            enviro.offence_id = 0;
        }
        if (this.wizardStep === 'offence' && value) {
            enviro.offence_id = Number(value);
            const offence = this.data.findOffenceById(enviro.offence_id);
            if (offence) {
                enviro.offence_type_id = Number(offence.group);
            }
        }
        if (this.wizardStep === 'offender' && typeof value === 'string') {
            if (value === 'Yes' || value === 'No') {
                enviro.is_bwc_active = value;
            }
            else {
                enviro.salutation = value;
            }
        }
        if (this.wizardStep === 'proofs') {
            if (!enviro.proof_of_address && value) {
                enviro.proof_of_address = Number(value);
            }
            else if (value) {
                enviro.proof_of_id = Number(value);
            }
        }
        if (this.wizardStep === 'incident') {
            if (!enviro.location_id && value) {
                enviro.location_id = Number(value);
            }
            else if (!enviro.action_id && value && value !== 'English' && value !== 'Welsh') {
                enviro.action_id = Number(value);
            }
            else if (value === 'English' || value === 'Welsh') {
                enviro.language = String(value);
            }
        }
        if (this.wizardStep === 'place' && (value === 0 || value === 1 || value)) {
            if (choice.id?.startsWith('postal-') || choice.id?.startsWith('fpn_issued')) {
                enviro.fpn_issued = Number(value) === 1 ? 1 : 0;
            }
            else {
                enviro.land_type_id = Number(value);
            }
        }
        this.saveDraft(enviro);
    }
    async replyWithResearch(query, matches, options) {
        const fromPhotos = !!options?.fromPhotos;
        const images = options?.images?.length ? options.images : undefined;
        let remote = '';
        let remoteFailed = false;
        try {
            const site = this.data.getSelectedSite();
            const zone = this.currentZone();
            const response = await firstValueFrom(this.api.postLemoChat({
                message: query,
                chat_id: this.chatId,
                site_id: site?.id || null,
                zone_id: zone?.id || null,
                images,
            }));
            if (response?.chat_id) {
                this.chatId = response.chat_id;
            }
            remote = response?.assistant_message?.content || '';
        }
        catch {
            remote = '';
            remoteFailed = true;
        }
        if (fromPhotos && remote) {
            matches = this.mergeOffenceCards(matches, this.searchOffences(remote));
        }
        const local = this.localResearchReply(fromPhotos ? 'those photos' : query, matches);
        const advisory = remote
            ? 'Advisory — check this against the site offences below. Do not use a suggestion that is not on this site.'
            : '';
        const network = remoteFailed
            ? 'I could not reach Lemo research. Using this site’s offences only.'
            : '';
        const fallback = fromPhotos
            ? 'I could not match those photos to a site offence. Describe what you saw, or pick an offence group below.'
            : 'I could not match that to a site offence. Try a shorter description, or start an FPN and pick the group.';
        this.pushAssistant([network, advisory, remote, local].filter(Boolean).join('\n\n') || fallback, fromPhotos ? this.researchChoices() : this.homeChoices());
        if (matches.length) {
            this.attachResearchCards(matches, 4);
        }
        else if (fromPhotos) {
            this.attachResearchCards(this.siteOffenceCards());
        }
    }
    mergeOffenceCards(...lists) {
        const seen = new Set();
        const merged = [];
        for (const list of lists) {
            for (const card of list) {
                if (seen.has(card.id)) {
                    continue;
                }
                seen.add(card.id);
                merged.push(card);
            }
        }
        return merged;
    }
    localResearchReply(query, matches) {
        if (!matches.length) {
            return '';
        }
        const lines = matches.slice(0, 3).map((item, index) => {
            const legislation = item.legislationTitle || item.legislation
                ? `${item.legislationTitle}${item.legislation ? ` — ${item.legislation}` : ''}`
                : 'No legislation text loaded for this offence.';
            return `${index + 1}. ${item.name} (${item.groupName})\n${legislation}`;
        });
        return `From this site’s offences and legislation, the closest matches for “${query}” are:\n\n${lines.join('\n\n')}\n\nUse one of these if it reassures the offence, or tell me more about what happened.`;
    }
    searchOffences(query) {
        const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
        if (!terms.length) {
            return [];
        }
        return this.data.getOffence()
            .map(offence => ({ offence, score: this.scoreOffence(offence, terms), card: this.toOffenceCard(offence) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.card);
    }
    scoreOffence(offence, terms) {
        const haystack = [
            offence.name,
            offence.description,
            offence.offenceGroup?.englishName,
            offence.engLegislation?.title,
            offence.engLegislation?.legislation,
            offence.welLegislation?.title,
        ].join(' ').toLowerCase();
        return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
    }
    toOffenceCard(offence) {
        return {
            id: offence.id,
            name: offence.name,
            groupName: offence.offenceGroup?.englishName || this.data.findOffenceGroupId(Number(offence.group))?.englishName || 'Offence',
            description: offence.description || '',
            legislationTitle: offence.engLegislation?.title || '',
            legislation: offence.engLegislation?.legislation || '',
            maxFine: offence.maxFine || '',
        };
    }
    offenceSummary(offenceId) {
        const offence = this.data.findOffenceById(offenceId);
        if (!offence) {
            return 'Offence selected.';
        }
        const title = offence.engLegislation?.title || 'Legislation';
        const body = offence.engLegislation?.legislation || offence.description || 'No legislation text loaded.';
        return `Selected offence: ${offence.name}.\n\n${title}\n${body}`;
    }
    confirmSummary(enviro) {
        const site = this.data.getSelectedSite();
        const zone = this.data.findZoneById(enviro.zone_id);
        const group = this.data.findOffenceGroupId(enviro.offence_type_id);
        const offence = this.data.findOffenceById(enviro.offence_id);
        const siteOffence = this.data.findSiteOffence(enviro.offence_id);
        const charges = siteOffence
            ? `Reduced £${siteOffence.charge_amount_reduced} in ${siteOffence.charge_days_reduced} days · Full £${siteOffence.charge_amount_full} in ${siteOffence.charge_days_full} days`
            : '';
        return [
            'Ready to submit this FPN. Check these details before you send:',
            `Site: ${site?.name || enviro.site_id}`,
            `Zone: ${zone?.name || enviro.zone_id}`,
            `Offence: ${offence?.name || enviro.offence_id} (${group?.englishName || 'group'})`,
            `Offender: ${enviro.salutation} ${enviro.first_name} ${enviro.last_name}`,
            `Address: ${enviro.address}, ${enviro.town}, ${enviro.post_code}`,
            `DOB: ${enviro.date_of_birth}`,
            `Location: ${enviro.offence_location}`,
            `POI: ${enviro.poi}`,
            `Language: ${enviro.language}`,
            `Postal FPN: ${enviro.fpn_issued === 0 ? 'Yes' : 'No'}`,
            `Offence time: ${enviro.offence_datetime}`,
            `Issue time: ${enviro.issue_datetime}`,
            `Images: ${enviro.offence_images.length}`,
            charges,
        ].filter(Boolean).join('\n');
    }
    offencesForGroup(groupId) {
        const fromOffences = this.data.getOffence().filter(item => Number(item.group) === Number(groupId) || Number(item.offenceGroup?.id) === Number(groupId));
        const fromSite = this.data.getSiteOffence()
            .filter(item => Number(item.offence_group_id) === Number(groupId))
            .map(item => item.offences)
            .filter(Boolean);
        return this.uniqueOffences([...fromOffences, ...fromSite]);
    }
    uniqueOffences(offences) {
        return Array.from(new Set(offences.map(item => item.id)))
            .map(id => offences.find(item => item.id === id))
            .filter(Boolean);
    }
    async startResearch() {
        this.mode = 'research';
        this.wizardStep = null;
        await this.ensureLookups();
        if (this.imageCount() > 0) {
            await this.researchFromPhotos();
            return;
        }
        const cards = this.siteOffenceCards();
        const groups = this.researchGroups();
        const content = cards.length
            ? `This site has ${cards.length} offence${cards.length === 1 ? '' : 's'}. Tap one to use it, pick a group, or describe what you saw.`
            : groups.length
                ? 'Describe what you saw and I will match it to this site’s offences and legislation.\n\nOr pick an offence group to browse.'
                : 'Describe what you saw and I will match it to this site’s offences and legislation.';
        this.pushAssistant(content, this.researchChoices());
        this.attachResearchCards(cards);
    }
    async researchFromPhotos() {
        const photos = this.imageCount();
        this.pushAssistant(`Looking at your ${photos} photo${photos === 1 ? '' : 's'} on this FPN…`);
        this.busy = true;
        try {
            const images = await this.compressResearchImages();
            const hint = this.siteOffenceHint();
            const query = [
                `Using the ${images.length} photo${images.length === 1 ? '' : 's'} on this FPN.`,
                'Describe what is visible, then name the closest site offences and legislation only.',
                'Do not invent an offence, fine, or act. If unsure, say so.',
                hint,
            ].filter(Boolean).join(' ');
            await this.replyWithResearch(query, [], { images, fromPhotos: true });
        }
        finally {
            this.busy = false;
        }
    }
    async compressResearchImages() {
        const source = (this.draft().offence_images || [])
            .filter((item) => typeof item === 'string' && item.length > 0)
            .slice(0, 2);
        return Promise.all(source.map(item => compressDataUrl(item, 80000, 0.6)));
    }
    siteOffenceHint() {
        const names = this.data.getOffence().map(item => item.name).filter(Boolean).slice(0, 40);
        return names.length ? `Site offences: ${names.join(', ')}.` : '';
    }
    showResearchGroup(groupId) {
        this.mode = 'research';
        const group = this.data.findOffenceGroupId(groupId);
        const cards = this.offencesForGroup(groupId).map(item => this.toOffenceCard(item));
        const name = group?.englishName || 'this group';
        this.pushAssistant(cards.length
            ? `${name}: ${cards.length} offence${cards.length === 1 ? '' : 's'} on this site. Tap one to use it, or describe what you saw.`
            : `No offences in ${name} for this site. Describe what you saw, or pick another group.`, this.researchChoices());
        this.attachResearchCards(cards, 24);
    }
    researchChoices() {
        const groups = this.researchGroups().map(item => ({
            id: `rg-${item.id}`,
            label: item.englishName,
            value: item.id,
            action: 'research-group',
        }));
        groups.push({ id: 'research-cancel', label: 'Cancel', action: 'cancel' });
        return groups;
    }
    researchGroups() {
        return this.extractOffenceGroups(this.data.getOffence(), this.data.getSiteOffence());
    }
    siteOffenceCards() {
        return this.data.getOffence().map(item => this.toOffenceCard(item));
    }
    attachResearchCards(cards, limit = 24) {
        const last = this.lastAssistant();
        if (last && cards.length) {
            last.offenceCards = cards.slice(0, limit);
        }
    }
    beginNewFpn(prefillOffenceId) {
        const next = new EnviroPost();
        const site = this.data.getSelectedSite();
        const user = this.data.getUser();
        const zone = this.currentZone();
        if (site?.id) {
            next.site_id = Number(site.id);
        }
        if (user?.id) {
            next.officer_id = user.id;
        }
        if (zone?.id) {
            next.zone_id = Number(zone.id);
        }
        if (prefillOffenceId) {
            const offence = this.data.findOffenceById(Number(prefillOffenceId));
            if (offence) {
                next.offence_id = offence.id;
                next.offence_type_id = Number(offence.group);
            }
        }
        next.language = '';
        this.askedPostal = false;
        this.saveDraft(next);
        return next;
    }
    finishSubmittedDraft() {
        this.mode = 'chat';
        this.wizardStep = null;
        this.beginNewFpn();
    }
    homeChoices() {
        return [
            { id: 'create', label: 'Create FPN', action: 'create' },
            { id: 'notebook', label: 'Notebook entry', action: 'notebook' },
            { id: 'queue', label: 'Submit from queue', action: 'queue' },
            { id: 'research', label: 'Research offence', action: 'research' },
            { id: 'images', label: 'Upload images', action: 'images' },
        ];
    }
    afterSubmitChoices() {
        const choices = [
            { id: 'create', label: 'Create new FPN', action: 'create' },
            { id: 'queue', label: 'Submit from queue', action: 'queue' },
        ];
        if (this.lastPosted?.id) {
            choices.unshift({ id: 'notebook', label: 'Add notebook', action: 'notebook', value: this.lastPosted.id });
        }
        return choices;
    }
    queueOrCreateChoices() {
        return [
            { id: 'queue', label: 'Submit from queue', action: 'queue' },
            { id: 'create', label: 'Create new FPN', action: 'create' },
        ];
    }
    printChoices() {
        return [
            { id: 'print-sunmi', label: 'Sunmi', action: 'print-sunmi' },
            { id: 'print-urovo', label: 'Urovo', action: 'print-urovo' },
            { id: 'print-skip', label: 'Skip print', action: 'print-skip' },
        ];
    }
    async printTicket(printer) {
        const ticketUrl = this.pendingTicketUrl;
        if (!ticketUrl) {
            this.pushAssistant('I do not have a ticket image to print.', this.homeChoices());
            return;
        }
        this.busy = true;
        try {
            await this.printer.printImageOn(ticketUrl, printer);
            this.pendingTicketUrl = null;
            this.pushAssistant(`Printed on ${printer === 'sunmi' ? 'Sunmi' : 'Urovo'}.\n\n${this.encourage.line()}`, this.afterSubmitChoices());
        }
        catch (error) {
            this.pushAssistant(error?.message || `Unable to print on ${printer === 'sunmi' ? 'Sunmi' : 'Urovo'}.`, this.printChoices());
        }
        finally {
            this.busy = false;
        }
    }
    resolveTicketUrl(payload, fpnNumber) {
        const ticket = payload?.ticket || payload?.ticket_image || payload?.print_ticket;
        if (typeof ticket === 'string' && ticket.trim()) {
            if (ticket.startsWith('http://') || ticket.startsWith('https://')) {
                return ticket;
            }
            const path = ticket.includes('/') ? ticket.replace(/^\//, '') : `uploads/tickets/${ticket}`;
            return `${this.ticketBaseUrl}${path}`;
        }
        if (fpnNumber) {
            return `${this.ticketBaseUrl}uploads/tickets/EP1_${fpnNumber}_PRINT_1_fpn.png`;
        }
        return null;
    }
    choiceList(items, actionPrefix) {
        const choices = items.slice(0, 80);
        choices.push({ id: `${actionPrefix}-cancel`, label: 'Cancel', action: 'cancel' });
        return choices;
    }
    async ensureLookups() {
        this.hydrateResearchLookups();
        if (this.data.checkFPNData() && this.data.getOffence().length) {
            return;
        }
        const site = this.data.getSelectedSite();
        if (!site?.id) {
            return;
        }
        try {
            const data = await firstValueFrom(this.api.getFPNData(site.id));
            this.data.applyFPNData(data);
        }
        catch {
            // Local cached lookups are enough for the wizard if they already exist.
        }
    }
    hydrateResearchLookups() {
        const siteOffences = this.data.getSiteOffence();
        if (!siteOffences?.length) {
            return;
        }
        const offences = this.extractOffence(siteOffences);
        if (offences.length) {
            this.data.setOffences(offences);
        }
        const groups = this.extractOffenceGroups(this.data.getOffence(), siteOffences);
        if (groups.length) {
            this.data.setOffenceGroups(groups);
        }
    }
    extractOffence(siteOffences) {
        const list = (siteOffences || [])
            .map(item => item.offences || item.offence)
            .filter((item) => !!item?.id);
        return this.uniqueOffences(list);
    }
    extractOffenceGroups(offences, siteOffences = []) {
        const byId = new Map();
        for (const offence of offences || []) {
            const group = offence.offenceGroup || this.data.findOffenceGroupId(Number(offence.group));
            if (group?.id) {
                byId.set(Number(group.id), group);
            }
        }
        for (const siteOffence of siteOffences || []) {
            const groupId = Number(siteOffence.offence_group_id || siteOffence.offences?.group || 0);
            if (!groupId || byId.has(groupId)) {
                continue;
            }
            const group = siteOffence.offences?.offenceGroup || this.data.findOffenceGroupId(groupId);
            if (group?.id) {
                byId.set(Number(group.id), group);
            }
        }
        return Array.from(byId.values());
    }
    draft() {
        const enviro = this.data.getEnviroPost() || new EnviroPost();
        const defaults = new EnviroPost();
        if (!Array.isArray(enviro.offence_images)) {
            enviro.offence_images = [];
        }
        if (!String(enviro.language || '').trim()) {
            enviro.language = defaults.language;
        }
        if (!String(enviro.county || '').trim()) {
            enviro.county = defaults.county;
        }
        if (!String(enviro.offence_datetime || '').trim()) {
            enviro.offence_datetime = defaults.offence_datetime;
        }
        if (!String(enviro.issue_datetime || '').trim()) {
            enviro.issue_datetime = defaults.issue_datetime;
        }
        return enviro;
    }
    saveDraft(enviro) {
        UpperCaseWords(enviro);
        this.data.setEnviroPost(enviro);
    }
    async applyGoogleLocation(enviro) {
        const result = await this.geocoding.geocodeAddress(enviro.offence_location);
        if (!result) {
            return;
        }
        enviro.offence_location = result.formattedAddress || enviro.offence_location;
        enviro.lat = String(result.lat);
        enviro.lng = String(result.lng);
    }
    currentZone() {
        const selected = this.data.getSelectedZone();
        if (selected?.id) {
            return selected;
        }
        const enviro = this.draft();
        if (enviro.zone_id) {
            return this.data.findZoneById(Number(enviro.zone_id));
        }
        return undefined;
    }
    looksLikeCreate(text) {
        return /create\s+(an\s+)?(enviro|fpn|ticket)|issue\s+(an\s+)?(fpn|ticket)|new\s+fpn/i.test(text);
    }
    looksLikeImages(text) {
        return /upload\s+(images?|photos?)|add\s+(images?|photos?)|offence\s+images?|evidence/i.test(text);
    }
    looksLikeResearch(text) {
        return /^(research(\s+(an\s+)?offence)?|look\s*up(\s+(an\s+)?offence)?|reassure(\s+(an\s+)?offence)?)$/i.test(text.trim());
    }
    looksLikeNotebook(text) {
        return /^(notebook(\s+entry)?|add\s+(a\s+)?notebook|note\s*book)$/i.test(text.trim());
    }
    pushUser(content) {
        this.messages.push({ id: this.id(), role: 'user', content });
    }
    pushAssistant(content, choices) {
        this.messages.push({
            id: this.id(),
            role: 'assistant',
            content,
            choices,
        });
    }
    attachFields(fields) {
        const last = this.lastAssistant();
        if (last) {
            last.fields = fields;
        }
    }
    attachCamera() {
        const last = this.lastAssistant();
        if (last) {
            last.showCamera = true;
        }
    }
    attachSignature() {
        const last = this.lastAssistant();
        if (last) {
            last.showSignature = true;
        }
    }
    id() {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    static { this.ɵfac = function LemoAiService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LemoAiService)(i0.ɵɵinject(i1.ApiService), i0.ɵɵinject(i2.DataService), i0.ɵɵinject(i3.FpnSubmissionService), i0.ɵɵinject(i4.PatrolService), i0.ɵɵinject(i5.ThermalPrinterService), i0.ɵɵinject(i6.LemoEncourageService), i0.ɵɵinject(i7.OfflineTicketService), i0.ɵɵinject(i8.QueueSyncService), i0.ɵɵinject(i9.GeocodingService)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: LemoAiService, factory: LemoAiService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LemoAiService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: i1.ApiService }, { type: i2.DataService }, { type: i3.FpnSubmissionService }, { type: i4.PatrolService }, { type: i5.ThermalPrinterService }, { type: i6.LemoEncourageService }, { type: i7.OfflineTicketService }, { type: i8.QueueSyncService }, { type: i9.GeocodingService }], null); })();
//# sourceMappingURL=lemo-ai.service.js.map