import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
// import { PhotoComponent } from './pages/enviro/photo/photo.component';
// import { QueueComponent } from './pages/enviro/queue/queue.component';
const routes = [
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
export class AppRoutingModule {
    static { this.ɵfac = function AppRoutingModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppRoutingModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AppRoutingModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }), RouterModule] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppRoutingModule, [{
        type: NgModule,
        args: [{
                imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
                exports: [RouterModule]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AppRoutingModule, { imports: [i1.RouterModule], exports: [RouterModule] }); })();
//# sourceMappingURL=app-routing.module.js.map