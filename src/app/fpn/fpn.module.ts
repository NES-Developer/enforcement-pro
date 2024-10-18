import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FPNPage } from './fpn.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

// import { SignaturePadModule } from '@lemonadejs/signature';
// import SignaturePadModule from '@lemonadejs/signature';



import { FPNPageRoutingModule } from './fpn-routing.module';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';
import { Step7Component } from './step7/step7.component';
import { PhotoComponent } from './photo/photo.component';
import { QueueComponent } from './queue/queue.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        FPNPageRoutingModule,
        // SignaturePadModule,
    ],
        declarations: [
            FPNPage,
            Step1Component,
            Step2Component,
            Step3Component,
            Step4Component,
            Step5Component,
            Step6Component,
            Step7Component,
            PhotoComponent,
            QueueComponent
        ]
    })
export class FPNPageModule {}
