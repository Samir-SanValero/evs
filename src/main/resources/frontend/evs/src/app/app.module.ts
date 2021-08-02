import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { GridsterModule } from 'angular-gridster2';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ErrorScreenModule } from './modules/error-screen/error-screen.module';
import { VideoScreenModule } from './modules/video-screen/video-screen.module';
import { SettingsScreenModule } from './modules/settings-screen/settings-screen.module';
import { MainMenuModule } from './modules/main-menu/main-menu.module';
import { LoginModule } from './modules/login/login.module';
import { NotificationsScreenModule } from './modules/notifications-screen/notifications-screen.module';
import { CommonElementsModule } from './modules/common/common-elements.module';
import { AlertModule, AlertService } from './components/_alert';
import { MediaService } from './services/media.service';
import { NotificationService } from './services/notification.service';
import { SharedVariablesService } from './services/shared-variables.service';
import { PatientService } from './services/patient/patient.service';
import { JwtInterceptor } from './services/authentication/jwt.interceptor';
import { ErrorInterceptor } from './services/authentication/error.interceptor';
import { Logger } from './services/log/logger.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { appInitializer } from './services/authentication/app.initializer';
import { AnalysisService } from './services/analysis/analisys.service';
import { SettingsService } from './services/settings/settings.service';
import { ConfigService } from './services/config/config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    GridsterModule,
    Ng5SliderModule,
    NgbModule,
    NgxSpinnerModule,

    ErrorScreenModule,
    VideoScreenModule,
    SettingsScreenModule,
    MainMenuModule,
    LoginModule,
    CommonElementsModule,
    AlertModule,
    NotificationsScreenModule
  ],
  providers: [MediaService,
              HttpClient,
              SharedVariablesService,
              AlertService,
              PatientService,
              MediaService,
              AnalysisService,
              SettingsService,
              Logger,
              NgxSpinnerModule,
              NotificationService,
              ConfigService,
                { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
                { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
                { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService, ConfigService] }
            ],
  exports: [],
  bootstrap: [AppComponent],
  schemas : [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule { }
