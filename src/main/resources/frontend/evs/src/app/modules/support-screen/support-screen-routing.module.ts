import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportScreenComponent } from './support-screen.component';

const routes: Routes = [{ path: '', component: SupportScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportScreenRoutingModule { }
