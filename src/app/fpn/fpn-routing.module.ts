import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FPNPage } from './fpn.page';
import { PhotoComponent } from './photo/photo.component';
import { QueueComponent } from './queue/queue.component';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import('./fpn.module').then(m => m.FPNPageModule) // optional
  // },
  {
    path: '',
    component: FPNPage,
  },
  {
    path: 'photo',
    component: PhotoComponent
  },
  {
    path: 'queue',
    component: QueueComponent
  }
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
