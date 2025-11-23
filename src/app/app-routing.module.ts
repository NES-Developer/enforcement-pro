import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PhotoComponent } from './fpn/photo/photo.component';
import { QueueComponent } from './fpn/queue/queue.component';

const routes: Routes = [
  // Tabs is app root (so /home => TabsPage -> home child)
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },

  // If you want FPN as its own top-level module (not a tab), keep this:
  // {
  //   path: 'fpns',
  //   loadChildren: () => import('./fpn/fpn.module').then( m => m.FPNPageModule )
  // },

  // {
  //   path: 'settings',
  //   loadChildren: () => import('./service-request/service-request.module').then( m => m.ServiceRequestPageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'site',
    loadChildren: () => import('./pages/site/site.module').then( m => m.SitePageModule)
  },
  {
    path: 'notebook/:id',
    loadChildren: () => import('./pages/notebook/notebook.module').then(m => m.NotebookPageModule)
  },

  // fallback
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
