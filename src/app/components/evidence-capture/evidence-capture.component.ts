import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { compressDataUrl, estimateDataUrlBytes } from '../../helpers/image-compress';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';

@Component({
  selector: 'app-evidence-capture',
  templateUrl: './evidence-capture.component.html',
  styleUrls: ['./evidence-capture.component.scss'],
})
export class EvidenceCaptureComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() compact = false;
  @Input() maxPhotos = 5;
  @Output() photosChanged = new EventEmitter<number>();

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  readonly width = 640;
  readonly height = 480;

  enviro_post: EnviroPost = new EnviroPost();
  error = '';
  private mediaStream: MediaStream | null = null;

  constructor(
    private data: DataService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.setupDevices();
  }

  ngOnDestroy(): void {
    this.stopCameraStream();
  }

  reload(): void {
    const enviroPost = this.data.getEnviroPost();
    if (enviroPost) {
      this.enviro_post = enviroPost;
    }
    if (!Array.isArray(this.enviro_post.offence_images)) {
      this.enviro_post.offence_images = [];
    }
  }

  get photoCount(): number {
    return this.enviro_post.offence_images?.length || 0;
  }

  async capture(): Promise<void> {
    this.reload();

    if (this.photoCount >= this.maxPhotos) {
      await this.presentAlert('Limit exceeded', `FPN images cannot exceed ${this.maxPhotos}.`);
      return;
    }

    const videoEl = this.video?.nativeElement;
    const canvasEl = this.canvas?.nativeElement;
    if (!videoEl || !canvasEl) {
      await this.presentAlert('Camera', 'Camera is not ready yet. Please wait a moment.');
      return;
    }

    const context = canvasEl.getContext('2d');
    if (!context) {
      return;
    }

    context.clearRect(0, 0, this.width, this.height);
    context.drawImage(videoEl, 0, 0, this.width, this.height);
    const capturedImage = canvasEl.toDataURL('image/jpeg', 0.72);
    this.enviro_post.offence_images.push(capturedImage);
    this.saveEnviroData();
    await this.compressLastImage();
  }

  removePhoto(idx: number): void {
    this.reload();
    this.enviro_post.offence_images.splice(idx, 1);
    this.saveEnviroData();
  }

  private async setupDevices(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = 'Camera is not available on this device';
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      this.mediaStream = stream;
      if (this.video?.nativeElement) {
        this.video.nativeElement.srcObject = stream;
        await this.video.nativeElement.play();
      }
      this.error = '';
    } catch {
      this.error = 'Unable to open the camera. Check permissions and try again';
    }
  }

  private stopCameraStream(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.video?.nativeElement) {
      this.video.nativeElement.srcObject = null;
    }
  }

  private async compressLastImage(): Promise<void> {
    const images = this.enviro_post.offence_images;
    if (!images.length) {
      return;
    }

    const lastIndex = images.length - 1;
    const lastImage = images[lastIndex];
    const maxBytes = 220000;
    if (estimateDataUrlBytes(lastImage) <= maxBytes) {
      return;
    }

    try {
      this.enviro_post.offence_images[lastIndex] = await compressDataUrl(lastImage, maxBytes);
      this.saveEnviroData();
    } catch {
      // Keep the original capture if compression fails.
    }
  }

  private saveEnviroData(): void {
    this.data.setEnviroPost(this.enviro_post);
    this.photosChanged.emit(this.photoCount);
  }

  private async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Okay'],
    });
    await alert.present();
  }
}
