import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { PatrolService } from '../../services/patrol.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @Input() photoCount: number | null = null;
  @Input() currentStep: number | null = null;

  currentPath = '';

  private readonly patrolLockedRoutes = ['/enviro', '/photo', '/queue'];
  private routerSub?: Subscription;

  constructor(
    private router: Router,
    private patrol: PatrolService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.currentPath = this.pathFromUrl(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentPath = this.pathFromUrl(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  isActive(path: string): boolean {
    return this.currentPath === path || this.currentPath.startsWith(`${path}/`);
  }

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

  private pathFromUrl(url: string): string {
    return url.split('?')[0];
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
