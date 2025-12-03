import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnviroPage } from './enviro.page';

const routes: Routes = [
  {
    path: '',
    component: EnviroPage
  },


  // {
  //   path: 'fpn/photo',
  //   component: PhotoComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnviroPageRoutingModule {}

