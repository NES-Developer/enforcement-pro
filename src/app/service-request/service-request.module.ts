import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRequestPage } from './service-request.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ServiceRequestPageRoutingModule } from './service-request-routing.module';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ServiceRequestPageRoutingModule
  ],
  declarations: [
    ServiceRequestPage,
    Step1Component,
    Step2Component
  ],
  providers: [],
  bootstrap: [ServiceRequestPage]
})
export class ServiceRequestPageModule {}
