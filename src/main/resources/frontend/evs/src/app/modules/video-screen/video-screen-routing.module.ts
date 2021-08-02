import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VideoScreenComponent } from './video-screen.component';

const routes: Routes = [{ path: '', component: VideoScreenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoScreenRoutingModule { }
