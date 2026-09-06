import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EnviroPost } from '../models/enviro';
import { Offence } from '../models/offence';
import { OffenceGroup } from '../models/offence-group';
import { SiteOffence } from '../models/site-offence';
import { ApiService } from './enforcementpro/api.service';
import { DataService } from './enforcementpro/data.service';
import { FpnSubmissionService } from './fpn-submission.service';
import { PatrolService } from './patrol.service';
import { ThermalPrinterService } from './thermal-printer.service';
import { LemoEncourageService } from './lemo-encourage.service';
import { OfflineTicketService } from './offline-ticket.service';
import { QueueSyncService } from './queue-sync.service';
import { GeocodingService } from './geocoding.service';
import { compressDataUrl } from '../helpers/image-compress';

export interface LemoChoice {
  id: string;
  label: string;
  value?: string | number;
  action?: string;
}

export interface LemoField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'tel' | 'email';
  required?: boolean;
  value?: string;
}

export interface LemoOffenceCard {
  id: number;
  name: string;
  groupName: string;
  description: string;
  legislationTitle: string;
  legislation: string;
  maxFine: string;
}

export interface LemoMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  choices?: LemoChoice[];
  fields?: LemoField[];
  showCamera?: boolean;
  showSignature?: boolean;
  offenceCards?: LemoOffenceCard[];
}

export type LemoMode = 'chat' | 'create' | 'images' | 'research';
export type LemoWizardStep =
  | 'zone'
  | 'offence_group'
  | 'offence'
  | 'offender'
  | 'proofs'
  | 'incident'
  | 'place'
  | 'images'
  | 'signature'
  | 'confirm';

@Injectable({
  providedIn: 'root'
})
export class LemoAiService {
  messages: LemoMessage[] = [];
  mode: LemoMode = 'chat';
  wizardStep: LemoWizardStep | null = null;
  busy = false;
  chatId: number | null = null;
  lastPosted: { id: number; fpnNumber: string } | null = null;
  private pendingTicketUrl: string | null = null;
  private readonly ticketBaseUrl = 'https://app.enforcementpro.co.uk/';

  constructor(
    private api: ApiService,
    private data: DataService,
    private fpnSubmission: FpnSubmissionService,
    private patrol: PatrolService,
    private printer: ThermalPrinterService,
    private encourage: LemoEncourageService,
    private offlineTicket: OfflineTicketService,
    private queueSync: QueueSyncService,
    private geocoding: GeocodingService
  ) {}

  async start(): Promise<void> {
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

  async ask(text: string): Promise<void> {
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
        this.pushAssistant(
          'Tell me what you saw — for example littering, dog fouling, or fly-tipping — or pick an offence group below.',
          this.researchChoices()
        );
        return;
      }
      await this.startResearch();
      return;
    }

    if (this.looksLikeNotebook(message)) {
      this.pushAssistant(
        'Use Notebook entry above for issued FPNs, or open the FPN form. The stepper already knows what is required and where to submit.',
        [
          { id: 'notebook', label: 'Notebook entry', action: 'notebook' },
          { id: 'stepper', label: 'Open FPN form', action: 'stepper' },
        ]
      );
      return;
    }

    this.busy = true;
    try {
      const matches = this.searchOffences(message);
      await this.replyWithResearch(message, matches);
      this.mode = 'chat';
    } finally {
      this.busy = false;
    }
  }

  startCreateFpn(prefillOffenceId?: number): void {
    if (!this.patrol.canUseFpnTools()) {
      this.pushAssistant('Start patrol from the dashboard before creating an FPN.', this.homeChoices());
      return;
    }

    const site = this.data.getSelectedSite();
    if (!site?.id) {
      this.pushAssistant('Select a site first, then come back to Lemo AI to create the FPN.', this.homeChoices());
      return;
    }

    this.beginNewFpn(prefillOffenceId);
    this.mode = 'create';
    this.pushAssistant(
      prefillOffenceId
        ? 'Starting a new FPN with that offence. Site and zone stay set. Offender, photos, and signature start blank.'
        : 'Starting a new FPN. Site and zone stay set. Offender, offence, photos, and signature start blank.'
    );
    this.advanceWizard();
  }

  startUploadImages(): void {
    if (!this.patrol.canUseFpnTools()) {
      this.pushAssistant('Start patrol from the dashboard before attaching offence images.', this.homeChoices());
      return;
    }

    this.mode = 'images';
    this.wizardStep = 'images';
    this.pushAssistant(
      'Attach offence images for this FPN. Take at least one photo, then continue.',
      [{ id: 'images-done', label: 'Images added', action: 'images-done' }],
    );
    const last = this.lastAssistant();
    if (last) {
      last.showCamera = true;
    }
  }

  choose(choice: LemoChoice): void {
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
      this.cancelWizard();
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

  async submitFields(values: Record<string, string>): Promise<void> {
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
      enviro.date_of_birth = this.formatDob(values['dob_year'], values['dob_month'], values['dob_day']);

      if (!enviro.salutation || !enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth) {
        this.pushAssistant('I still need title, name, address, town, postcode, and date of birth.');
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

  get isCreating(): boolean {
    return this.mode === 'create' || this.mode === 'images';
  }

  imageCount(): number {
    const images = this.draft().offence_images;
    return Array.isArray(images) ? images.length : 0;
  }

  continueAfterImages(): void {
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
      this.pushAssistant(
        `${enviro.offence_images.length} image(s) attached to this FPN. You can keep chatting, or create / submit the notice.`,
        this.homeChoices()
      );
      return;
    }

    this.wizardStep = 'signature';
    this.promptCurrentStep();
  }

  continueAfterSignature(): void {
    const enviro = this.draft();
    if (!enviro.signature) {
      this.pushAssistant('Save a signature before submitting.');
      return;
    }
    this.wizardStep = 'confirm';
    this.promptCurrentStep();
  }

  async submitFpn(): Promise<void> {
    if (this.busy) {
      return;
    }

    const enviro = this.draft();
    if (!enviro.offence_images?.length) {
      this.wizardStep = 'images';
      this.pushAssistant('This FPN still needs offence images.');
      this.promptCurrentStep();
      return;
    }
    if (!enviro.signature) {
      this.wizardStep = 'signature';
      this.pushAssistant('This FPN still needs a signature.');
      this.promptCurrentStep();
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
        } else {
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
        this.pushAssistant(
          `${result.message}\n\nAn offline ticket is printing. The notice will upload in the background.`,
          this.queueOrCreateChoices()
        );
        return;
      }

      this.pushAssistant(result.message || 'Unable to submit this FPN right now.', [
        { id: 'retry', label: 'Try submit again', action: 'submit' },
        { id: 'cancel', label: 'Cancel', action: 'cancel' },
      ]);
    } finally {
      this.busy = false;
    }
  }

  cancelWizard(): void {
    this.mode = 'chat';
    this.wizardStep = null;
    this.pendingTicketUrl = null;
    this.pushAssistant('Cancelled. I can still research an offence or start a new FPN.', this.homeChoices());
  }

  applyDraftPatch(patch: Partial<EnviroPost>): void {
    const enviro = this.draft();
    Object.assign(enviro, patch);
    this.saveDraft(enviro);
  }

  lastAssistant(): LemoMessage | undefined {
    return [...this.messages].reverse().find(item => item.role === 'assistant');
  }

  private advanceWizard(): void {
    const enviro = this.draft();
    const next = this.nextNeededStep(enviro);
    this.wizardStep = next;
    this.promptCurrentStep();
  }

  private nextNeededStep(enviro: EnviroPost): LemoWizardStep {
    if (!enviro.zone_id && this.data.getZones().length > 0) {
      return 'zone';
    }
    if (!enviro.offence_type_id) {
      return 'offence_group';
    }
    if (!enviro.offence_id) {
      return 'offence';
    }
    if (!enviro.salutation || !enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth || !this.hasBwc(enviro)) {
      return 'offender';
    }
    if (!enviro.proof_of_address || !enviro.proof_of_id) {
      return 'proofs';
    }
    if (!enviro.location_id || !enviro.action_id) {
      return 'incident';
    }
    if (!enviro.offence_location || !enviro.poi || !enviro.land_type_id) {
      return 'place';
    }
    if (!enviro.offence_images?.length) {
      return 'images';
    }
    if (!enviro.signature) {
      return 'signature';
    }
    return 'confirm';
  }

  private promptCurrentStep(): void {
    const enviro = this.draft();
    const zone = this.currentZone();
    const site = this.data.getSelectedSite();

    switch (this.wizardStep) {
      case 'zone':
        this.pushAssistant(
          site?.name
            ? `Which zone on ${site.name}?`
            : 'Which zone is this FPN for?',
          this.choiceList(
            this.data.getZones().map(item => ({ id: `zone-${item.id}`, label: item.name, value: item.id })),
            'zone'
          )
        );
        break;
      case 'offence_group':
        this.pushAssistant(
          zone?.name ? `Zone ${zone.name} is set. Which offence group?` : 'Which offence group?',
          this.choiceList(
            this.data.getOffenceGroup().map(item => ({ id: `og-${item.id}`, label: item.englishName, value: item.id })),
            'offence_group'
          )
        );
        break;
      case 'offence': {
        const offences = this.offencesForGroup(enviro.offence_type_id);
        this.pushAssistant(
          'Which offence? I will show the legislation after you pick one.',
          this.choiceList(
            offences.map(item => ({ id: `off-${item.id}`, label: item.name, value: item.id })),
            'offence'
          )
        );
        break;
      }
      case 'offender':
        if (!enviro.salutation) {
          this.pushAssistant(
            this.offenceSummary(enviro.offence_id) + '\n\nWhat title should we use?',
            this.choiceList(
              this.data.getSalutations().map(item => ({ id: `sal-${item.id}`, label: item.title, value: item.title })),
              'salutation'
            )
          );
          break;
        }
        if (!enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth) {
          this.pushAssistant('Enter the offender details.');
          this.attachFields([
            { key: 'first_name', label: 'Forename', type: 'text', required: true, value: enviro.first_name },
            { key: 'last_name', label: 'Surname', type: 'text', required: true, value: enviro.last_name },
            { key: 'address', label: 'Address', type: 'textarea', required: true, value: enviro.address },
            { key: 'town', label: 'Town', type: 'text', required: true, value: enviro.town },
            { key: 'post_code', label: 'Postcode', type: 'text', required: true, value: enviro.post_code },
            { key: 'dob_day', label: 'DOB day', type: 'number', required: true },
            { key: 'dob_month', label: 'DOB month', type: 'number', required: true },
            { key: 'dob_year', label: 'DOB year', type: 'number', required: true },
            { key: 'phone', label: 'Mobile', type: 'tel', value: enviro.phone },
            { key: 'email', label: 'Email', type: 'email', value: enviro.email },
          ]);
          break;
        }
        this.pushAssistant(
          'Did you activate BWC?',
          this.choiceList([
            { id: 'bwc-yes', label: 'Yes', value: 'Yes' },
            { id: 'bwc-no', label: 'No', value: 'No' },
          ], 'bwc')
        );
        break;
      case 'proofs':
        if (!enviro.proof_of_address) {
          this.pushAssistant(
            'How was the address proved?',
            this.choiceList(
              this.data.getAddressVerifiedBy().map(item => ({ id: `addr-${item.id}`, label: item.textOnMachine, value: item.id })),
              'proof_of_address'
            )
          );
          break;
        }
        this.pushAssistant(
          'What ID was shown?',
          this.choiceList(
            this.data.getIDShown().map(item => ({ id: `id-${item.id}`, label: item.textOnMachine, value: item.id })),
            'proof_of_id'
          )
        );
        break;
      case 'incident':
        if (!enviro.location_id) {
          this.pushAssistant(
            'Where did the offence happen?',
            this.choiceList(
              this.data.getOffenceLocationSuffix().map(item => ({ id: `loc-${item.id}`, label: item.textOnMachine, value: item.id })),
              'location'
            )
          );
          break;
        }
        this.pushAssistant(
          'How did it happen?',
          this.choiceList(
            this.data.getOffenceHow().map(item => ({ id: `act-${item.id}`, label: item.textOnMachine, value: item.id })),
            'action'
          )
        );
        break;
      case 'place':
        if (!enviro.land_type_id) {
          this.pushAssistant('Type of land?', this.choiceList([
            { id: 'land-1', label: 'Public', value: 1 },
            { id: 'land-2', label: 'Private', value: 2 },
          ], 'land_type'));
          break;
        }
        if (enviro.fpn_issued !== 0 && enviro.fpn_issued !== 1) {
          enviro.fpn_issued = 0;
          this.saveDraft(enviro);
        }
        this.pushAssistant('Where exactly? Point of interest is the place name, such as a street, shop, or landmark.');
        this.attachFields([
          { key: 'offence_location', label: 'Offence location', type: 'text', required: true, value: enviro.offence_location },
          { key: 'town_area', label: 'Town / ward', type: 'text', value: enviro.town_area },
          { key: 'poi', label: 'Point of interest', type: 'text', required: true, value: enviro.poi },
          { key: 'description', label: 'Description', type: 'textarea', value: enviro.description },
          { key: 'offender_reply', label: 'Offender reply', type: 'textarea', value: enviro.offender_reply },
        ]);
        break;
      case 'images':
        this.pushAssistant('Add offence images now. Take at least one photo, then tap Continue with photos.');
        this.attachCamera();
        break;
      case 'signature':
        this.pushAssistant(
          'Sign to confirm this FPN, then save the signature.',
          [{ id: 'signature-done', label: 'Signature saved', action: 'signature-done' }]
        );
        this.attachSignature();
        break;
      case 'confirm':
        this.pushAssistant(
          this.confirmSummary(enviro),
          [
            { id: 'submit', label: 'Submit FPN', action: 'submit' },
            { id: 'cancel', label: 'Cancel', action: 'cancel' },
          ]
        );
        break;
    }
  }

  private applyChoice(choice: LemoChoice): void {
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
      } else {
        enviro.salutation = value;
      }
    }
    if (this.wizardStep === 'proofs') {
      if (!enviro.proof_of_address && value) {
        enviro.proof_of_address = String(value);
      } else if (value) {
        enviro.proof_of_id = String(value);
      }
    }
    if (this.wizardStep === 'incident') {
      if (!enviro.location_id && value) {
        enviro.location_id = Number(value);
      } else if (!enviro.action_id && value) {
        enviro.action_id = Number(value);
      } else if (!enviro.language && value) {
        enviro.language = String(value);
      }
    }
    if (this.wizardStep === 'place' && value) {
      enviro.land_type_id = Number(value);
    }

    this.saveDraft(enviro);
  }

  private async replyWithResearch(
    query: string,
    matches: LemoOffenceCard[],
    options?: { images?: string[]; fromPhotos?: boolean }
  ): Promise<void> {
    const fromPhotos = !!options?.fromPhotos;
    const images = options?.images?.length ? options.images : undefined;
    let remote = '';

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
    } catch {
      remote = '';
    }

    if (fromPhotos && remote) {
      matches = this.mergeOffenceCards(matches, this.searchOffences(remote));
    }

    const local = this.localResearchReply(fromPhotos ? 'those photos' : query, matches);
    const fallback = fromPhotos
      ? 'I could not match those photos to a site offence. Describe what you saw, or pick an offence group below.'
      : 'I could not match that to a site offence. Try a shorter description, or start an FPN and pick the group.';
    this.pushAssistant(
      [remote, local].filter(Boolean).join('\n\n') || fallback,
      fromPhotos ? this.researchChoices() : this.homeChoices()
    );
    const last = this.lastAssistant();
    if (last && matches.length) {
      last.offenceCards = matches.slice(0, 4);
    }
  }

  private mergeOffenceCards(...lists: LemoOffenceCard[][]): LemoOffenceCard[] {
    const seen = new Set<number>();
    const merged: LemoOffenceCard[] = [];
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

  private localResearchReply(query: string, matches: LemoOffenceCard[]): string {
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

  searchOffences(query: string): LemoOffenceCard[] {
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

  private scoreOffence(offence: Offence, terms: string[]): number {
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

  private toOffenceCard(offence: Offence): LemoOffenceCard {
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

  private offenceSummary(offenceId: number): string {
    const offence = this.data.findOffenceById(offenceId);
    if (!offence) {
      return 'Offence selected.';
    }

    const title = offence.engLegislation?.title || 'Legislation';
    const body = offence.engLegislation?.legislation || offence.description || 'No legislation text loaded.';
    return `Selected offence: ${offence.name}.\n\n${title}\n${body}`;
  }

  private confirmSummary(enviro: EnviroPost): string {
    const site = this.data.getSelectedSite();
    const zone = this.data.findZoneById(enviro.zone_id);
    const group = this.data.findOffenceGroupId(enviro.offence_type_id);
    const offence = this.data.findOffenceById(enviro.offence_id);
    return [
      'Ready to submit this FPN:',
      `Site: ${site?.name || enviro.site_id}`,
      `Zone: ${zone?.name || enviro.zone_id}`,
      `Offence: ${offence?.name || enviro.offence_id} (${group?.englishName || 'group'})`,
      `Offender: ${enviro.salutation} ${enviro.first_name} ${enviro.last_name}`,
      `Images: ${enviro.offence_images.length}`,
    ].join('\n');
  }

  private offencesForGroup(groupId: number): Offence[] {
    return this.data.getOffence().filter(item => Number(item.group) === Number(groupId));
  }

  private async startResearch(): Promise<void> {
    this.mode = 'research';
    this.wizardStep = null;
    await this.ensureLookups();

    if (this.imageCount() > 0) {
      await this.researchFromPhotos();
      return;
    }

    const groups = this.data.getOffenceGroup();
    const content = groups.length
      ? 'Describe what you saw and I will match it to this site’s offences and legislation.\n\nOr pick an offence group to browse.'
      : 'Describe what you saw and I will match it to this site’s offences and legislation.';

    this.pushAssistant(content, this.researchChoices());
  }

  private async researchFromPhotos(): Promise<void> {
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
    } finally {
      this.busy = false;
    }
  }

  private async compressResearchImages(): Promise<string[]> {
    const source = (this.draft().offence_images || [])
      .filter((item): item is string => typeof item === 'string' && item.length > 0)
      .slice(0, 2);

    return Promise.all(source.map(item => compressDataUrl(item, 80000, 0.6)));
  }

  private siteOffenceHint(): string {
    const names = this.data.getOffence().map(item => item.name).filter(Boolean).slice(0, 40);
    return names.length ? `Site offences: ${names.join(', ')}.` : '';
  }

  private showResearchGroup(groupId: number): void {
    this.mode = 'research';
    const group = this.data.findOffenceGroupId(groupId);
    const cards = this.offencesForGroup(groupId).map(item => this.toOffenceCard(item));
    const name = group?.englishName || 'this group';

    this.pushAssistant(
      cards.length
        ? `${name}: ${cards.length} offence${cards.length === 1 ? '' : 's'} on this site. Tap one to use it, or describe what you saw.`
        : `No offences in ${name} for this site. Describe what you saw, or pick another group.`,
      this.researchChoices()
    );

    const last = this.lastAssistant();
    if (last && cards.length) {
      last.offenceCards = cards.slice(0, 12);
    }
  }

  private researchChoices(): LemoChoice[] {
    const groups: LemoChoice[] = this.data.getOffenceGroup().map(item => ({
      id: `rg-${item.id}`,
      label: item.englishName,
      value: item.id,
      action: 'research-group',
    }));
    groups.push({ id: 'research-cancel', label: 'Cancel', action: 'cancel' });
    return groups;
  }

  private beginNewFpn(prefillOffenceId?: number): EnviroPost {
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

    this.saveDraft(next);
    return next;
  }

  private finishSubmittedDraft(): void {
    this.mode = 'chat';
    this.wizardStep = null;
    this.beginNewFpn();
  }

  private homeChoices(): LemoChoice[] {
    return [
      { id: 'create', label: 'Create FPN', action: 'create' },
      { id: 'notebook', label: 'Notebook entry', action: 'notebook' },
      { id: 'queue', label: 'Submit from queue', action: 'queue' },
      { id: 'research', label: 'Research offence', action: 'research' },
      { id: 'images', label: 'Upload images', action: 'images' },
    ];
  }

  private afterSubmitChoices(): LemoChoice[] {
    const choices: LemoChoice[] = [
      { id: 'create', label: 'Create new FPN', action: 'create' },
      { id: 'queue', label: 'Submit from queue', action: 'queue' },
    ];
    if (this.lastPosted?.id) {
      choices.unshift({ id: 'notebook', label: 'Add notebook', action: 'notebook', value: this.lastPosted.id });
    }
    return choices;
  }

  private queueOrCreateChoices(): LemoChoice[] {
    return [
      { id: 'queue', label: 'Submit from queue', action: 'queue' },
      { id: 'create', label: 'Create new FPN', action: 'create' },
    ];
  }

  private printChoices(): LemoChoice[] {
    return [
      { id: 'print-sunmi', label: 'Sunmi', action: 'print-sunmi' },
      { id: 'print-urovo', label: 'Urovo', action: 'print-urovo' },
      { id: 'print-skip', label: 'Skip print', action: 'print-skip' },
    ];
  }

  private async printTicket(printer: 'sunmi' | 'urovo'): Promise<void> {
    const ticketUrl = this.pendingTicketUrl;
    if (!ticketUrl) {
      this.pushAssistant('I do not have a ticket image to print.', this.homeChoices());
      return;
    }

    this.busy = true;
    try {
      await this.printer.printImageOn(ticketUrl, printer);
      this.pendingTicketUrl = null;
      this.pushAssistant(
        `Printed on ${printer === 'sunmi' ? 'Sunmi' : 'Urovo'}.\n\n${this.encourage.line()}`,
        this.afterSubmitChoices()
      );
    } catch (error: any) {
      this.pushAssistant(
        error?.message || `Unable to print on ${printer === 'sunmi' ? 'Sunmi' : 'Urovo'}.`,
        this.printChoices()
      );
    } finally {
      this.busy = false;
    }
  }

  private resolveTicketUrl(payload: any, fpnNumber: string): string | null {
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

  private choiceList(items: LemoChoice[], actionPrefix: string): LemoChoice[] {
    const choices = items.slice(0, 40);
    choices.push({ id: `${actionPrefix}-cancel`, label: 'Cancel', action: 'cancel' });
    return choices;
  }

  private async ensureLookups(): Promise<void> {
    if (this.data.checkFPNData()) {
      return;
    }

    const site = this.data.getSelectedSite();
    if (!site?.id) {
      return;
    }

    try {
      const data = await firstValueFrom(this.api.getFPNData(site.id));
      const payload = data?.data || {};
      if (payload.salutations) {
        this.data.setSalutations(payload.salutations);
      }
      if (payload.zones) {
        this.data.setZones(payload.zones);
      }
      if (payload.offence_how) {
        this.data.setOffenceHow(payload.offence_how);
      }
      if (payload.offence_location_suffix) {
        this.data.setOffenceLocationSuffix(payload.offence_location_suffix);
      }
      if (payload.address_verified_via) {
        this.data.setAddressVerifiedBy(payload.address_verified_via);
      }
      if (payload.id_shown) {
        this.data.setIdShown(payload.id_shown);
      }
      if (payload.poi_prefix) {
        this.data.setPOIPrefix(payload.poi_prefix);
      }
      if (payload.site_offences) {
        this.data.setSiteOffences(payload.site_offences);
        const offences = this.extractOffence(payload.site_offences);
        this.data.setOffences(offences);
        this.data.setOffenceGroups(this.extractOffenceGroups(offences));
      }
    } catch {
      // Local cached lookups are enough for the wizard if they already exist.
    }
  }

  private extractOffence(siteOffences: SiteOffence[]): Offence[] {
    const groups = siteOffences.map(item => item.offences).filter(Boolean);
    return Array.from(new Set(groups.map(item => item.id)))
      .map(id => groups.find(item => item.id === id) as Offence);
  }

  private extractOffenceGroups(offences: Offence[]): OffenceGroup[] {
    const groups = offences.map(item => item.offenceGroup).filter(Boolean);
    return Array.from(new Set(groups.map(item => item.id)))
      .map(id => groups.find(item => item.id === id) as OffenceGroup);
  }

  private hasBwc(enviro: EnviroPost): boolean {
    const value = String(enviro.is_bwc_active || '').trim().toLowerCase();
    return value === 'yes' || value === 'no';
  }

  private draft(): EnviroPost {
    const enviro = this.data.getEnviroPost() || new EnviroPost();
    if (!Array.isArray(enviro.offence_images)) {
      enviro.offence_images = [];
    }
    return enviro;
  }

  private saveDraft(enviro: EnviroPost): void {
    this.data.setEnviroPost(enviro);
  }

  private async applyGoogleLocation(enviro: EnviroPost): Promise<void> {
    const result = await this.geocoding.geocodeAddress(enviro.offence_location);
    if (!result) {
      return;
    }

    enviro.offence_location = result.formattedAddress || enviro.offence_location;
    enviro.lat = String(result.lat);
    enviro.lng = String(result.lng);
  }

  private currentZone() {
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

  private formatDob(year?: string, month?: string, day?: string): string {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);
    if (!y || !m || !d || m > 12 || d > 31) {
      return '';
    }
    return `${String(y).padStart(4, '0')}/${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
  }

  private looksLikeCreate(text: string): boolean {
    return /create\s+(an\s+)?(enviro|fpn|ticket)|issue\s+(an\s+)?(fpn|ticket)|new\s+fpn/i.test(text);
  }

  private looksLikeImages(text: string): boolean {
    return /upload\s+(images?|photos?)|add\s+(images?|photos?)|offence\s+images?|evidence/i.test(text);
  }

  private looksLikeResearch(text: string): boolean {
    return /^(research(\s+(an\s+)?offence)?|look\s*up(\s+(an\s+)?offence)?|reassure(\s+(an\s+)?offence)?)$/i.test(text.trim());
  }

  private looksLikeNotebook(text: string): boolean {
    return /^(notebook(\s+entry)?|add\s+(a\s+)?notebook|note\s*book)$/i.test(text.trim());
  }

  private pushUser(content: string): void {
    this.messages.push({ id: this.id(), role: 'user', content });
  }

  private pushAssistant(content: string, choices?: LemoChoice[]): void {
    this.messages.push({
      id: this.id(),
      role: 'assistant',
      content,
      choices,
    });
  }

  private attachFields(fields: LemoField[]): void {
    const last = this.lastAssistant();
    if (last) {
      last.fields = fields;
    }
  }

  private attachCamera(): void {
    const last = this.lastAssistant();
    if (last) {
      last.showCamera = true;
    }
  }

  private attachSignature(): void {
    const last = this.lastAssistant();
    if (last) {
      last.showSignature = true;
    }
  }

  private id(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
