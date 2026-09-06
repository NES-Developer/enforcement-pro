import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { enviroStepperStep } from '../../helpers/fpn-core-validation';
import { bindSignaturePad } from '../../helpers/signature-canvas';
import { EnviroPost } from '../../models/enviro';
import { ApiService } from '../../services/enforcementpro/api.service';
import { DataService } from '../../services/enforcementpro/data.service';
import { LemoAiService, LemoChoice, LemoField, LemoOffenceCard } from '../../services/lemo-ai.service';
import { GeocodingService, PlaceSuggestion } from '../../services/geocoding.service';

@Component({
  selector: 'app-lemo',
  templateUrl: './lemo.page.html',
  styleUrls: ['./lemo.page.scss'],
})
export class LemoPage implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(IonContent) content?: IonContent;
  @ViewChild('notebookSection') notebookSection?: ElementRef<HTMLElement>;
  @ViewChildren('signatureCanvas') signatureCanvases?: QueryList<ElementRef<HTMLCanvasElement>>;

  draft: Record<string, string> = {};
  composer = '';
  enviro_post: EnviroPost = new EnviroPost();
  recentFpns: any[] = [];
  locationSuggestions: PlaceSuggestion[] = [];
  private signaturePad?: SignaturePad;
  private shouldScroll = false;
  private suggestTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    public lemo: LemoAiService,
    private api: ApiService,
    private data: DataService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private geocoding: GeocodingService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.data.waitUntilHydrated();
    this.enviro_post = this.data.getEnviroPost() || new EnviroPost();

    if (!this.data.getSelectedSite()?.id) {
      const alert = await this.alertController.create({
        header: 'Site required',
        message: 'Select a site before using Lemo AI.',
        buttons: ['Okay'],
      });
      await alert.present();
      this.router.navigate(['/site']);
      return;
    }

    if (!this.lemo.messages.length) {
      await this.lemo.start();
    }
    this.loadRecentFpns();
    this.syncDraftFromFields();
    this.shouldScroll = true;
  }

  ionViewWillEnter(): void {
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.loadRecentFpns();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.shouldScroll = false;
      this.content?.scrollToBottom(250);
    }
    this.bindSignaturePad();
  }

  ngOnDestroy(): void {
    this.signaturePad?.off();
    if (this.suggestTimer) {
      clearTimeout(this.suggestTimer);
    }
  }

  get siteName(): string {
    return this.data.getSelectedSite()?.name || 'Site';
  }

  get zoneName(): string {
    return this.data.getSelectedZone()?.name || this.data.findZoneById(this.enviro_post.zone_id)?.name || '';
  }

  get photoCount(): number {
    return this.lemo.imageCount();
  }

  get hasDraftPreview(): boolean {
    const enviro = this.enviro_post;
    return !!(enviro?.offence_id || enviro?.first_name || enviro?.offence_images?.length || enviro?.signature || enviro?.offence_location);
  }

  get draftTitle(): string {
    const name = [this.enviro_post.salutation, this.enviro_post.first_name, this.enviro_post.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();
    return name || 'FPN in progress';
  }

  get draftSummary(): string {
    const offence = this.data.findOffenceById(this.enviro_post.offence_id)?.name;
    const location = this.enviro_post.offence_location;
    const photos = this.enviro_post.offence_images?.length
      ? `${this.enviro_post.offence_images.length} photo${this.enviro_post.offence_images.length === 1 ? '' : 's'}`
      : '';
    return [offence, location, photos].filter(Boolean).join(' · ') || 'Continue in the FPN form.';
  }

  isActiveMessage(message: { id: string }): boolean {
    return this.lemo.lastAssistant()?.id === message.id;
  }

  async newChat(): Promise<void> {
    if (this.lemo.busy) {
      return;
    }
    this.composer = '';
    this.draft = {};
    await this.lemo.start();
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.shouldScroll = true;
  }

  cancelCreate(): void {
    this.lemo.cancelWizard();
    this.composer = '';
    this.shouldScroll = true;
  }

  continueImages(): void {
    this.lemo.continueAfterImages();
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.shouldScroll = true;
  }

  onPhotosChanged(): void {
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
  }

  async send(): Promise<void> {
    const text = this.composer.trim();
    if (!text || this.lemo.busy || this.lemo.isCreating) {
      return;
    }
    this.composer = '';
    await this.lemo.ask(text);
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.syncDraftFromFields();
    this.shouldScroll = true;
  }

  choose(choice: LemoChoice): void {
    if (choice?.action === 'queue') {
      this.router.navigate(['/queue']);
      return;
    }
    if (choice?.action === 'notebook') {
      this.openNotebookChoice(choice);
      return;
    }
    if (choice?.action === 'stepper') {
      this.continueInStepper();
      return;
    }

    this.lemo.choose(choice);
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.syncDraftFromFields();
    this.shouldScroll = true;
  }

  issuedSummary(fpn: any): string {
    const offender = [fpn?.offender?.first_name, fpn?.offender?.last_name].filter(Boolean).join(' ').trim();
    const offence = fpn?.offence?.name || fpn?.offence_name || '';
    const location = fpn?.offence_location || '';
    return [offender, offence, location].filter(Boolean).join(' · ') || 'Issued FPN';
  }

  notebookEntryIsEmpty(fpn: any): boolean {
    return !fpn?.notebook_entry || fpn.notebook_entry.length === 0;
  }

  openIssuedNotebook(fpn: any): void {
    const id = Number(fpn?.id || 0);
    if (!id) {
      return;
    }
    this.router.navigate(['/notebook', id], { queryParams: { fpn_number: fpn.fpn_number || '' } });
  }

  continueInStepper(): void {
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    if (this.enviro_post) {
      this.data.setEnviroPost(this.enviro_post);
    }
    this.router.navigate(['/enviro'], {
      queryParams: {
        currentStep: enviroStepperStep(this.enviro_post, {
          requireZone: this.data.getZones().length > 0,
        }),
      },
    });
  }

  useOffence(card: LemoOffenceCard): void {
    this.lemo.choose({
      id: `use-${card.id}`,
      label: card.name,
      value: card.id,
      action: 'use-offence',
    });
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.shouldScroll = true;
  }

  async submitFields(fields: LemoField[]): Promise<void> {
    const missing = fields.find(field => field.required && !String(this.draft[field.key] || '').trim());
    if (missing) {
      await this.presentToast(`${missing.label} is required.`);
      return;
    }
    this.locationSuggestions = [];
    await this.lemo.submitFields(this.draft);
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.shouldScroll = true;
  }

  onLocationInput(event: any): void {
    const value = String(event?.detail?.value || this.draft['offence_location'] || '');
    this.draft['offence_location'] = value;

    if (this.suggestTimer) {
      clearTimeout(this.suggestTimer);
    }

    this.suggestTimer = setTimeout(() => {
      void this.loadLocationSuggestions(value);
    }, 250);
  }

  async selectLocationSuggestion(suggestion: PlaceSuggestion): Promise<void> {
    this.locationSuggestions = [];
    const result = await this.geocoding.geocodePlaceId(suggestion.placeId);
    this.draft['offence_location'] = result?.formattedAddress || suggestion.description;
    if (result) {
      this.lemo.applyDraftPatch({
        offence_location: this.draft['offence_location'],
        lat: String(result.lat),
        lng: String(result.lng),
      });
    }
  }

  private async loadLocationSuggestions(query: string): Promise<void> {
    try {
      this.locationSuggestions = await this.geocoding.suggestPlaces(query);
    } catch {
      this.locationSuggestions = [];
    }
  }

  saveSignature(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      void this.presentToast('Please sign first, then tap Save.');
      return;
    }
    this.lemo.applyDraftPatch({ signature: this.signaturePad.toDataURL() });
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.lemo.continueAfterSignature();
    this.lastSignatureCanvas = undefined;
    this.shouldScroll = true;
  }

  clearSignature(): void {
    this.signaturePad?.clear();
    this.lastSignatureCanvas = undefined;
    this.lemo.applyDraftPatch({ signature: '' });
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
  }

  formattedContent(content: string): string {
    return (content || '').replace(/\*\*/g, '');
  }

  trackMessage(index: number, message: { id: string }): string {
    return message.id;
  }

  private loadRecentFpns(): void {
    const user = this.data.getUser();
    if (!user?.id) {
      this.recentFpns = [];
      return;
    }

    this.api.getRecentFPNs(user.id).subscribe({
      next: (response) => {
        this.recentFpns = Array.isArray(response?.data) ? response.data : [];
      },
      error: () => {
        this.recentFpns = [];
      },
    });
  }

  private openNotebookChoice(choice: LemoChoice): void {
    const postedId = Number(choice.value || this.lemo.lastPosted?.id || 0);
    if (postedId > 0) {
      this.router.navigate(['/notebook', postedId], {
        queryParams: { fpn_number: this.lemo.lastPosted?.fpnNumber || '' },
      });
      return;
    }

    const outstanding = this.recentFpns.filter(fpn => this.notebookEntryIsEmpty(fpn));
    if (outstanding.length === 1) {
      this.openIssuedNotebook(outstanding[0]);
      return;
    }

    if (this.hasDraftPreview) {
      this.continueInStepper();
      return;
    }

    this.notebookSection?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private syncDraftFromFields(): void {
    const last = this.lemo.lastAssistant();
    const next: Record<string, string> = { ...this.draft };
    for (const field of last?.fields || []) {
      if (next[field.key] == null) {
        next[field.key] = field.value || '';
      }
    }
    this.draft = next;
  }

  private lastSignatureCanvas?: HTMLCanvasElement;

  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeSignaturePad();
  }

  private bindSignaturePad(): void {
    const canvas = this.signatureCanvases?.last?.nativeElement;
    if (!canvas || canvas === this.lastSignatureCanvas) {
      return;
    }
    this.signaturePad = bindSignaturePad(canvas, this.signaturePad);
    this.lastSignatureCanvas = canvas;
  }

  private resizeSignaturePad(): void {
    const canvas = this.signatureCanvases?.last?.nativeElement;
    if (!canvas || !this.signaturePad) {
      return;
    }
    this.signaturePad = bindSignaturePad(canvas, this.signaturePad);
    this.lastSignatureCanvas = canvas;
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
    });
    await toast.present();
  }
}
