import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorScreenComponent } from './error-screen.component';

const routes: Routes = [{ path: 'error', component: ErrorScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorScreenRoutingModule { }
