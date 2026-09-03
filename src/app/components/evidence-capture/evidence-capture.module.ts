import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EvidenceCaptureComponent } from './evidence-capture.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [EvidenceCaptureComponent],
  exports: [EvidenceCaptureComponent],
})
export class EvidenceCaptureModule {}
