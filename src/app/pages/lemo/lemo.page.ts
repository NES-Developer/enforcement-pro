import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonContent } from '@ionic/angular';
import SignaturePad from 'signature_pad';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { LemoAiService, LemoChoice, LemoField, LemoOffenceCard } from '../../services/lemo-ai.service';

@Component({
  selector: 'app-lemo',
  templateUrl: './lemo.page.html',
  styleUrls: ['./lemo.page.scss'],
})
export class LemoPage implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild(IonContent) content?: IonContent;
  @ViewChildren('signatureCanvas') signatureCanvases?: QueryList<ElementRef<HTMLCanvasElement>>;

  draft: Record<string, string> = {};
  composer = '';
  enviro_post: EnviroPost = new EnviroPost();
  private signaturePad?: SignaturePad;
  private shouldScroll = false;

  constructor(
    public lemo: LemoAiService,
    private data: DataService,
    private router: Router,
    private alertController: AlertController
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
    this.syncDraftFromFields();
    this.shouldScroll = true;
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
  }

  get siteName(): string {
    return this.data.getSelectedSite()?.name || 'Site';
  }

  get zoneName(): string {
    return this.data.getSelectedZone()?.name || this.data.findZoneById(this.enviro_post.zone_id)?.name || '';
  }

  get photoCount(): number {
    return this.data.getEnviroPost()?.offence_images?.length || 0;
  }

  async send(): Promise<void> {
    const text = this.composer.trim();
    if (!text || this.lemo.busy) {
      return;
    }
    this.composer = '';
    await this.lemo.ask(text);
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.syncDraftFromFields();
    this.shouldScroll = true;
  }

  choose(choice: LemoChoice): void {
    this.lemo.choose(choice);
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.syncDraftFromFields();
    this.shouldScroll = true;
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

  submitFields(fields: LemoField[]): void {
    for (const field of fields) {
      if (field.required && !String(this.draft[field.key] || '').trim()) {
        return;
      }
    }
    this.lemo.submitFields(this.draft);
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
    this.shouldScroll = true;
  }

  saveSignature(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      return;
    }
    this.lemo.applyDraftPatch({ signature: this.signaturePad.toDataURL() });
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
  }

  clearSignature(): void {
    this.signaturePad?.clear();
    this.lemo.applyDraftPatch({ signature: '' });
    this.enviro_post = this.data.getEnviroPost() || this.enviro_post;
  }

  formattedContent(content: string): string {
    return (content || '').replace(/\*\*/g, '');
  }

  trackMessage(index: number, message: { id: string }): string {
    return message.id;
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

  private bindSignaturePad(): void {
    const canvas = this.signatureCanvases?.last?.nativeElement;
    if (!canvas || canvas === this.lastSignatureCanvas) {
      return;
    }
    this.signaturePad?.off();
    this.lastSignatureCanvas = canvas;
    this.signaturePad = new SignaturePad(canvas);
  }
}
