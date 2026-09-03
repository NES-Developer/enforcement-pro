import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EvidenceCaptureModule } from '../../components/evidence-capture/evidence-capture.module';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';
import { LemoPageRoutingModule } from './lemo-routing.module';
import { LemoPage } from './lemo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavBarModule,
    EvidenceCaptureModule,
    LemoPageRoutingModule
  ],
  declarations: [LemoPage]
})
export class LemoPageModule {}
