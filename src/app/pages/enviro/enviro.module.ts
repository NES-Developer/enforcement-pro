

import { EnviroPageRoutingModule } from './enviro-routing.module';

import { EnviroPage } from './enviro.page';






import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { FPNPage } from '../../fpn.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';

// import { SignaturePadModule } from '@lemonadejs/signature';
// import SignaturePadModule from '@lemonadejs/signature';



import { Step1Component } from '../enviro/step1/step1.component';
import { Step2Component } from '../enviro/step2/step2.component';
import { Step3Component } from '../enviro/step3/step3.component';
import { Step4Component } from '../enviro/step4/step4.component';
import { Step5Component } from '../enviro/step5/step5.component';
import { Step6Component } from '../enviro/step6/step6.component';
import { Step7Component } from '../enviro/step7/step7.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnviroPageRoutingModule,
    NavBarModule,
    ExploreContainerComponentModule
  ],
  declarations: [
    EnviroPage,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    Step7Component,
]
})
export class EnviroPageModule {}




