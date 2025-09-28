import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotebookPage } from './notebook.page';

const routes: Routes = [
  {
    path: '',
    component: NotebookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotebookPageRoutingModule {}
