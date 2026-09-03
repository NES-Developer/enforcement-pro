import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LemoPage } from './lemo.page';

const routes: Routes = [
  {
    path: '',
    component: LemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LemoPageRoutingModule {}
