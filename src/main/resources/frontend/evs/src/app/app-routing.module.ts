import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorScreenComponent } from './modules/error-screen/error-screen.component';
import { AuthGuard } from './services/authentication/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: () =>
      import('./modules/login/login.module').then(m => m.LoginModule) },

  { path: '', loadChildren: () =>
      import('./modules/main-menu/main-menu.module').then(m => m.MainMenuModule), canActivate: [AuthGuard]},

  { path: 'support', loadChildren: () =>
      import('./modules/support-screen/support-screen.module').then(m => m.SupportScreenModule) },

  { path: 'notifications', loadChildren: () =>
      import('./modules/notifications-screen/notifications-screen.module').then(m => m.NotificationsScreenModule), canActivate: [AuthGuard] },

  { path: 'mainMenu', loadChildren: () =>
      import('./modules/main-menu/main-menu.module').then(m => m.MainMenuModule), canActivate: [AuthGuard]},

  { path: 'patient', loadChildren: () =>
      import('./modules/patient-screen/patient-screen.module').then(m => m.PatientScreenModule),
    canActivate: [AuthGuard]},

  { path: 'viewer', loadChildren: () =>
      import('./modules/embryo-viewer-screen/embryo-viewer-screen.module').then(m => m.EmbryoViewerScreenModule),
                                                                               canActivate: [AuthGuard]},

  { path: 'embryo-selection', loadChildren: () =>
      import('./modules/embryo-selection-screen/embryo-selection-screen.module').then(m => m.EmbryoSelectionScreenModule),
                                                                                      canActivate: [AuthGuard]},

  { path: 'video', loadChildren: () =>
      import('./modules/video-screen/video-screen.module').then(m => m.VideoScreenModule),
                                                                canActivate: [AuthGuard]},

  { path: 'settings', loadChildren: () =>
      import('./modules/settings-screen/settings-screen.module').then(m => m.SettingsScreenModule),
                                                                     canActivate: [AuthGuard]},

  { path: 'header', loadChildren: () =>
      import('./modules/common/common-elements.module').then(m => m.CommonElementsModule),
                                                            canActivate: [AuthGuard]},

    // Error screen
    { path: '**', pathMatch: 'full', component: ErrorScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
