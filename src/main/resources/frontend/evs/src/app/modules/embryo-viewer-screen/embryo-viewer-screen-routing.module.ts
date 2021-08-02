import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmbryoViewerScreenComponent } from './embryo-viewer-screen.component';

const routes: Routes = [{ path: '', component: EmbryoViewerScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbryoViewerScreenRoutingModule { }
