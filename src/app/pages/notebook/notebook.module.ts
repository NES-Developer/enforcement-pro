import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotebookPageRoutingModule } from './notebook-routing.module';

import { NotebookPage } from './notebook.page';
import { NavBarModule } from '../../components/nav-bar/nav-bar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavBarModule,
    NotebookPageRoutingModule
  ],
  declarations: [NotebookPage]
})
export class NotebookPageModule {}
