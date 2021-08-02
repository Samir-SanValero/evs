import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmbryoSelectionScreenComponent } from './embryo-selection-screen.component';

const routes: Routes = [{ path: '', component: EmbryoSelectionScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmbryoSelectionScreenRoutingModule { }
