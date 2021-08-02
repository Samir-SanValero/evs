import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientScreenComponent } from './patient-screen.component';

const routes: Routes = [{ path: '', component: PatientScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientScreenRoutingModule { }
