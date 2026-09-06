import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './services/enforcementpro/api.service';
import { provideHttpClient } from '@angular/common/http'; // New import
import { LoaderComponent } from './loader/loader.component';
// import { IonicSignaturePadModule,IonicsignaturepadProvider } from 'ionicsignaturepad';
import { IonicStorageModule } from '@ionic/storage-angular'; // <- correct package
import * as i0 from "@angular/core";
import * as i1 from "@ionic/storage-angular";
import * as i2 from "@ionic/angular";
// import { SQLiteService } from './services/sqlite.service'; // we will create this
// import { Camera } from '@awesome-cordova-plugins/camera/ngx';
export class AppModule {
    static { this.ɵfac = function AppModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AppModule)(); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: AppModule, bootstrap: [AppComponent] }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [
            { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
            // IonicsignaturepadProvider, 
            ApiService,
            provideHttpClient()
        ], imports: [
            // IonicStorageModule.forRoot({
            //     name: '__mydb',
            //     driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
            // }),
            IonicStorageModule.forRoot({
                name: '__mydb', // whatever name you like
                driverOrder: ['sqlite', 'indexeddb', 'localstorage']
            }),
            BrowserModule,
            IonicModule.forRoot(),
            AppRoutingModule
            // IonicSignaturePadModule
        ] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AppModule, [{
        type: NgModule,
        args: [{
                declarations: [
                    AppComponent,
                    LoaderComponent
                ],
                imports: [
                    // IonicStorageModule.forRoot({
                    //     name: '__mydb',
                    //     driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
                    // }),
                    IonicStorageModule.forRoot({
                        name: '__mydb', // whatever name you like
                        driverOrder: ['sqlite', 'indexeddb', 'localstorage']
                    }),
                    BrowserModule,
                    IonicModule.forRoot(),
                    AppRoutingModule
                    // IonicSignaturePadModule
                ],
                providers: [
                    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
                    // IonicsignaturepadProvider, 
                    ApiService,
                    provideHttpClient()
                ],
                bootstrap: [AppComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this line
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AppModule, { declarations: [AppComponent,
        LoaderComponent], imports: [i1.IonicStorageModule, BrowserModule, i2.IonicModule, AppRoutingModule
        // IonicSignaturePadModule
    ] }); })();
//# sourceMappingURL=app.module.js.map