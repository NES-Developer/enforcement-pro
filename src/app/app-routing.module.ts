import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PhotoComponent } from './fpn/photo/photo.component';
import { QueueComponent } from './fpn/queue/queue.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'site',
    loadChildren: () => import('./pages/site/site.module').then( m => m.SitePageModule)
  },
  {
    path: 'fpn/photo',
    component: PhotoComponent,
  },
  {
    path: 'fpn/queue',
    component: QueueComponent,
  },
  {
    path: 'notebook',
    loadChildren: () => import('./pages/notebook/notebook.module').then( m => m.NotebookPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
