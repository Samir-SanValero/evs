import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsScreenRoutingModule } from './notifications-screen-routing.module';
import { NotificationsScreenComponent } from './notifications-screen.component';
import { CommonElementsModule } from "../common/common-elements.module";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { AlertModule } from '../../components/_alert';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientService } from '../../services/patient/patient.service';
import { Logger } from '../../services/log/logger.service';
import { AnalysisService } from '../../services/analysis/analisys.service';


@NgModule({
  declarations: [NotificationsScreenComponent],
  imports: [
    CommonModule,
    NotificationsScreenRoutingModule,
    CommonElementsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule, 
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    AlertModule,
    MatSnackBarModule,
  ],
  bootstrap: [NotificationsScreenComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Tells Angular we will have custom tags in our templates
  ],
  providers:[{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}, MatSnackBarModule]
})
export class NotificationsScreenModule { }
