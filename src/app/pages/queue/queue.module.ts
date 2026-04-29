import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QueuePageRoutingModule } from './queue-routing.module';

import { QueuePage } from './queue.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavBarModule,
    QueuePageRoutingModule
  ],
  declarations: [QueuePage]
})
export class QueuePageModule {}
