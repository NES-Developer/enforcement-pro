import { Component, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PatrolService } from '../../services/patrol.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input() photoCount: number | null = null;
  @Input() currentStep: number | null = null;

  private readonly patrolLockedRoutes = ['/enviro', '/photo', '/queue'];

  constructor(
    private router: Router,
    private patrol: PatrolService,
    private alertController: AlertController
  ) {}

  async navigate(route: string): Promise<void> {
    if (this.patrolLockedRoutes.includes(route) && !this.patrol.canUseFpnTools()) {
      await this.presentPatrolRequired();
      this.router.navigate(['/dashboard']);
      return;
    }

    if (route === '/enviro' && this.isFiniteNumber(this.currentStep)) {
      this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
      return;
    }

    this.router.navigate([route]);
  }

  private isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }

  private async presentPatrolRequired(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Patrol Required',
      message: 'Start patrol from the dashboard before using FPN tools.',
      buttons: ['Okay'],
    });

    await alert.present();
  }
}
