import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { PhotoComponent } from './pages/enviro/photo/photo.component';
// import { QueueComponent } from './pages/enviro/queue/queue.component';


const routes: Routes = [
  // default → tabs/home
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  // tabs root
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'enviro',
    loadChildren: () => import('./pages/enviro/enviro.module').then(m => m.EnviroPageModule)
  },
  {
    path: 'photo',
    loadChildren: () => import('./pages/photo/photo.module').then(m => m.PhotoPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: 'queue',
    loadChildren: () => import('./pages/queue/queue.module').then(m => m.QueuePageModule)
  },
  {
    path: 'lemo',
    loadChildren: () => import('./pages/lemo/lemo.module').then(m => m.LemoPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'site',
    loadChildren: () => import('./pages/site/site.module').then(m => m.SitePageModule)
  },
  {
    path: 'notebook/:id',
    loadChildren: () => import('./pages/notebook/notebook.module').then(m => m.NotebookPageModule)
  },
  // fallback → tabs/home
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
