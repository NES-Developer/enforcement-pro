import { Component } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { DataService } from './services/enforcementpro/data.service';
import { AppUpdateService } from './services/app-update.service';
import { TrackingService } from './services/tracking.service';
import { QueueSyncService } from './services/queue-sync.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private data: DataService,
    private platform: Platform,
    private appUpdate: AppUpdateService,
    private tracking: TrackingService,
    private queueSync: QueueSyncService
  ) {
    this.platform.ready().then(() => {
      this.initialiseTracking();
    });
  }

  private async initialiseTracking(): Promise<void> {
    await this.data.init();
    await this.appUpdate.checkAndInstallIfNeeded('app-start').catch(() => undefined);
    await this.tracking.syncTrackingState().catch(() => undefined);
    this.queueSync.start();

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.appUpdate.checkAndInstallIfNeeded('app-resume').catch(() => undefined);
        this.tracking.syncTrackingState().catch(() => undefined);
        this.queueSync.flush().catch(() => undefined);
      }
    });
  }
}
