import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { DataService } from './services/enforcementpro/data.service';
import { TrackingService } from './services/tracking.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private data: DataService,
    private platform: Platform,
    private tracking: TrackingService
  ) {
    this.platform.ready().then(() => {
      this.initialiseTracking();
    });
  }

  private async initialiseTracking(): Promise<void> {
    await this.data.init();
    await this.tracking.syncTrackingState().catch(() => undefined);

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.tracking.syncTrackingState().catch(() => undefined);
      }
    });
  }
}
