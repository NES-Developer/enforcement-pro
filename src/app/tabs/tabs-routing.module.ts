import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
        {
            path: 'home',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
        },
        {
            path: 'service-request',
            loadChildren: () => import('../service-request/service-request.module').then(m => m.ServiceRequestPageModule)
        },
        {
            path: 'fpn',
            loadChildren: () => import('../fpn/fpn.module').then(m => m.FPNPageModule)
        },
        {
            path: '',
            redirectTo: '/tabs/home',
            pathMatch: 'full'
        }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
