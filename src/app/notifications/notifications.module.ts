import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';


@NgModule({
  declarations: [  
    NotificationsComponent
  ],
  imports: [
    IonicModule, 
    CommonModule,
    FormsModule,
    NotificationsRoutingModule
  ]
})
export class NotificationsModule { }
