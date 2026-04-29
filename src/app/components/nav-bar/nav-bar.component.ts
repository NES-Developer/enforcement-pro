import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input() photoCount: number | null = null;
  @Input() currentStep: number | null = null;

  constructor(private router: Router) {}

  navigate(route: string): void {
    if (route === '/enviro' && this.isFiniteNumber(this.currentStep)) {
      this.router.navigate([route], { queryParams: { currentStep: this.currentStep } });
      return;
    }

    this.router.navigate([route]);
  }

  private isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
  }
}
