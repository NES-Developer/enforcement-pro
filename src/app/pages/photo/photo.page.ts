import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EnviroPost } from '../../models/enviro';
import { DataService } from '../../services/enforcementpro/data.service';
import { PatrolService } from '../../services/patrol.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  currentStep: number = 1;
  enviro_post: EnviroPost = new EnviroPost();

  constructor(
    private data: DataService,
    private router: Router,
    private alertController: AlertController,
    private route2: ActivatedRoute,
    private patrol: PatrolService
  ) {
    this.route2.queryParams.subscribe(params => {
      this.currentStep = parseInt(params['currentStep']) || 1;
    });
  }

  ngOnInit(): void {
    if (!this.patrol.canUseFpnTools()) {
      this.presentAlert('Patrol Required', 'Start patrol from the dashboard before using the camera.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadData();
  }

  ionViewWillEnter(): void {
    this.loadData();
  }

  private loadData(): void {
    const enviroPost = this.data.getEnviroPost();
    if (enviroPost) {
      this.enviro_post = enviroPost;
    }
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
