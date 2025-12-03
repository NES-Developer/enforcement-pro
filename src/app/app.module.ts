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
import { IonicStorageModule } from '@ionic/storage-angular';  // <- correct package
import { Drivers, Storage } from '@ionic/storage';
// import { SQLiteService } from './services/sqlite.service'; // we will create this


// import { Camera } from '@awesome-cordova-plugins/camera/ngx';



@NgModule({
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
            name: '__mydb',         // whatever name you like
            driverOrder: ['sqlite', 'indexeddb', 'localstorage']
        }),

        BrowserModule, 
        IonicModule.forRoot(), 
        AppRoutingModule, 
        IonicStorageModule.forRoot()   // <-- Register provider only once here

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

})
export class AppModule {}
