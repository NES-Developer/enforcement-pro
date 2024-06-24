import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FPNPage } from './fpn.page';

const routes: Routes = [
  {
    path: '',
    component: FPNPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FPNPageRoutingModule {}
