import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PatrolService } from '../../services/patrol.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit, AfterViewInit, OnDestroy {


    WIDTH = 640;
    HEIGHT = 480;

    @ViewChild('video')
    public video!: ElementRef;

    @ViewChild('canvas')
    public canvas!: ElementRef;

    currentStep: number = 1;

    enviro_post: EnviroPost = new EnviroPost();
    captures: string[] = [];
    error: any;
    isCaptured!: boolean;
    private mediaStream: MediaStream | null = null;

    constructor(
        private data: DataService,
        private router: Router,
        private alertController: AlertController,
        private route2: ActivatedRoute,
        private patrol: PatrolService
        ) {
            this.route2.queryParams.subscribe(params => {
                this.currentStep = parseInt(params['currentStep']) ?? 1; // Fallback to 1 if null or undefined
            });
        }

    ngOnInit() {
        if (!this.patrol.canUseFpnTools()) {
            this.presentAlert('Patrol Required', 'Start patrol from the dashboard before using the camera.');
            this.router.navigate(['/dashboard']);
            return;
        }

        this.loadData();
    }

    async ngAfterViewInit() {
        if (!this.patrol.canUseFpnTools()) {
            return;
        }

        await this.setupDevices();
    }

    async setupDevices() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: "environment" }
                }
                });
                if (stream) {
                    this.mediaStream = stream;
                    this.video.nativeElement.srcObject = stream;
                    this.video.nativeElement.play();
                    this.error = null;
                } else {
                    this.error = "You have no output video device";
                }
            } catch (e) {
                // this.error = e;
            }
        }
    }

    ngOnDestroy() {
        this.stopCameraStream();
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

    capture() {
        // If already 5 images, block adding more
        if (this.enviro_post.offence_images.length >= 5) {
            this.presentAlert('Limit Exceeded', 'FPN images cannot exceed 5.');
            return;
        }
        this.drawImageToCanvas(this.video.nativeElement);
        const capturedImage = this.canvas.nativeElement.toDataURL('image/png');
        this.captures.push(capturedImage);
        this.enviro_post.offence_images.push(capturedImage);
        this.saveEnviroData();

        // 🔹 New: check if last image is > 5MB, then compress
        this.checkAndCompressLastOffenceImage();
        
    }

    // 🔹 Check the last offence image and compress if bigger than 5MB
    private async checkAndCompressLastOffenceImage(): Promise<void> {
        const images = this.enviro_post.offence_images;
        if (!images || images.length === 0) {
            return;
        }

        const lastIndex = images.length - 1;
        const lastImage = images[lastIndex];

        const sizeInMB = this.getBase64SizeInMB(lastImage);

        console.log('Captured image size (MB):', sizeInMB);

        // Only compress if > 5MB
        if (sizeInMB > 5) {
            // Optional: tell user what's happening
            // if (this.presentAlert) {
                // this.presentAlert('Processing', 'Compressing your image, please wait...');
            // }

            try {
                const compressed = await this.compressBase64(lastImage, 0.6); // quality 0.6

                // Update both arrays so they stay in sync
                this.enviro_post.offence_images[lastIndex] = compressed;

                if (this.captures && this.captures.length > 0) {
                    this.captures[this.captures.length - 1] = compressed;
                }

                // Re-save after compression
                this.saveEnviroData();
            } catch (e) {
                console.error('Error compressing image', e);
            }
        }
    }


    // 🔹 Calculate size of base64 dataURL in MB
    private getBase64SizeInMB(dataUrl: string): number {
        // Strip "data:image/xxx;base64," if present
        const base64 = dataUrl.includes(',')
            ? dataUrl.split(',')[1]
            : dataUrl;

        // Calculate padding
        const paddingMatches = base64.match(/=+$/);
        const padding = paddingMatches ? paddingMatches[0].length : 0;

        // Base64 → bytes
        const sizeInBytes = (base64.length * 3) / 4 - padding;

        // Bytes → MB
        return sizeInBytes / (1024 * 1024);
    }

    // 🔹 Compress a base64 image using an offscreen canvas
    private compressBase64(base64: string, quality: number = 0.6): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject('Canvas 2D context not available');
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Export as JPEG to reduce size (even if original is PNG)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };

            img.onerror = (err) => {
                reject(err);
            };

            img.src = base64;
        });
    }



    route (route: string) {
        if (route == "/tabs/fpn")
        {
            this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
        } 
        else
        {
            this.router.navigate([route]);
        }
    }

    setPhoto(idx: number) {
        this.isCaptured = true;
        const image = new Image();
        image.src = this.captures[idx];
        image.onload = () => {
            this.drawImageToCanvas(image);
        };
    }

    drawImageToCanvas(image: any) {
        const context = this.canvas.nativeElement.getContext('2d');
        context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        context.drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
    }

    removeCurrent() {
        this.isCaptured = false;
    }

    loadData() {
        const enviro_post = this.data.getEnviroPost();
        if (enviro_post !== null) {
        this.enviro_post = enviro_post;
        }
    }

    removePhoto(idx: number) {
        this.captures.splice(idx, 1);
        this.enviro_post.offence_images.splice(idx, 1);
        this.saveEnviroData();
    }

    saveEnviroData() {
        this.data.setEnviroPost(this.enviro_post);
    }

    async presentAlert(header: string, message: string) {
  
        const alert = await this.alertController.create({
            header: header,
            message: message,
            buttons: [
                {
                    text: 'Okay'
                }
            ],
        });
        await alert.present();
    }
}
