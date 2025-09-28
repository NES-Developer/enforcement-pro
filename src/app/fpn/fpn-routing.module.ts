import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FPNPage } from './fpn.page';
import { PhotoComponent } from './photo/photo.component';

const routes: Routes = [
  {
    path: '',
    component: FPNPage,
  },
  // {
  //   path: 'fpn/photo',
  //   component: PhotoComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FPNPageRoutingModule {}
