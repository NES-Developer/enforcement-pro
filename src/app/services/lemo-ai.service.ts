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

export type LemoMode = 'chat' | 'create' | 'images';
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

  constructor(
    private api: ApiService,
    private data: DataService,
    private fpnSubmission: FpnSubmissionService,
    private patrol: PatrolService
  ) {}

  async start(): Promise<void> {
    this.messages = [];
    this.mode = 'chat';
    this.wizardStep = null;
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

    this.busy = true;
    try {
      const matches = this.searchOffences(message);
      await this.replyWithResearch(message, matches);
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

    const enviro = this.draft();
    enviro.site_id = Number(site.id);
    const user = this.data.getUser();
    if (user?.id) {
      enviro.officer_id = user.id;
    }

    const zone = this.currentZone();
    if (zone?.id && !enviro.zone_id) {
      enviro.zone_id = Number(zone.id);
    }

    if (prefillOffenceId) {
      const offence = this.data.findOffenceById(Number(prefillOffenceId));
      if (offence) {
        enviro.offence_id = offence.id;
        enviro.offence_type_id = Number(offence.group);
      }
    }

    this.saveDraft(enviro);
    this.mode = 'create';
    this.pushAssistant('Creating an FPN. I will reuse the site, and the zone if it is already set. Images will be asked for on this flow.');
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
    if (choice.action === 'research') {
      this.pushUser(choice.label);
      this.pushAssistant('Describe what you saw. I will match it to site offences and legislation.', this.homeChoices());
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
    if (choice.action === 'use-offence' && choice.value) {
      this.pushUser(`Use ${choice.label}`);
      this.startCreateFpn(Number(choice.value));
      return;
    }

    this.pushUser(choice.label);
    this.applyChoice(choice);
    this.advanceWizard();
  }

  submitFields(values: Record<string, string>): void {
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
      enviro.is_bwc_active = (values['is_bwc_active'] || enviro.is_bwc_active || '').trim();

      if (!enviro.salutation || !enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth || !enviro.is_bwc_active) {
        this.pushAssistant('I still need title, name, address, town, postcode, date of birth, and BWC.');
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
    }

    this.saveDraft(enviro);
    this.pushUser('Saved.');
    this.advanceWizard();
  }

  continueAfterImages(): void {
    const enviro = this.draft();
    if (!enviro.offence_images?.length) {
      this.pushAssistant('Please capture at least one offence image before continuing.');
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
        const fpnNumber = result.response?.data?.fpn_number || result.response?.fpn_number || '';
        this.mode = 'chat';
        this.wizardStep = null;
        this.pushAssistant(
          fpnNumber
            ? `FPN ${fpnNumber} has been created. ${result.message}`
            : result.message,
          this.homeChoices()
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
    if (!enviro.salutation || !enviro.first_name || !enviro.last_name || !enviro.address || !enviro.town || !enviro.post_code || !enviro.date_of_birth || !enviro.is_bwc_active) {
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
          { key: 'is_bwc_active', label: 'BWC Yes or No', type: 'text', required: true, value: enviro.is_bwc_active },
        ]);
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
        this.pushAssistant('Where exactly? I need the offence location and POI. Description is optional.');
        this.attachFields([
          { key: 'offence_location', label: 'Offence location', type: 'text', required: true, value: enviro.offence_location },
          { key: 'town_area', label: 'Town / ward', type: 'text', value: enviro.town_area },
          { key: 'poi', label: 'POI', type: 'text', required: true, value: enviro.poi },
          { key: 'description', label: 'Description', type: 'textarea', value: enviro.description },
          { key: 'offender_reply', label: 'Offender reply', type: 'textarea', value: enviro.offender_reply },
        ]);
        break;
      case 'images':
        this.pushAssistant(
          'Add offence images now. Take at least one photo, then continue.',
          [{ id: 'images-done', label: 'Images added', action: 'images-done' }]
        );
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
      enviro.salutation = value;
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

  private async replyWithResearch(query: string, matches: LemoOffenceCard[]): Promise<void> {
    const local = this.localResearchReply(query, matches);
    let remote = '';

    try {
      const site = this.data.getSelectedSite();
      const zone = this.currentZone();
      const response = await firstValueFrom(this.api.postLemoChat({
        message: query,
        chat_id: this.chatId,
        site_id: site?.id || null,
        zone_id: zone?.id || null,
      }));
      if (response?.chat_id) {
        this.chatId = response.chat_id;
      }
      remote = response?.assistant_message?.content || '';
    } catch {
      remote = '';
    }

    const content = [remote, local].filter(Boolean).join('\n\n');
    this.pushAssistant(content || 'I could not match that to a site offence. Try a shorter description, or start an FPN and pick the group.', this.homeChoices());
    const last = this.lastAssistant();
    if (last && matches.length) {
      last.offenceCards = matches.slice(0, 4);
    }
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

  private homeChoices(): LemoChoice[] {
    return [
      { id: 'create', label: 'Create FPN', action: 'create' },
      { id: 'research', label: 'Research offence', action: 'research' },
      { id: 'images', label: 'Upload images', action: 'images' },
    ];
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

  private draft(): EnviroPost {
    return this.data.getEnviroPost() || new EnviroPost();
  }

  private saveDraft(enviro: EnviroPost): void {
    this.data.setEnviroPost(enviro);
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
