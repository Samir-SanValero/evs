import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsScreenComponent } from './settings-screen.component';

const routes: Routes = [{ path: '', component: SettingsScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsScreenRoutingModule { }
