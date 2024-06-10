import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestPage } from './service-request.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ServiceRequestPageRoutingModule } from './service-request-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ServiceRequestPageRoutingModule
  ],
  declarations: [ServiceRequestPage]
})
export class ServiceRequestPageModule {}
