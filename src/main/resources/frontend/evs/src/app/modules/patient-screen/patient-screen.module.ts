import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';

import { PatientScreenRoutingModule } from './patient-screen-routing.module';
import { PatientScreenComponent } from './patient-screen.component';

import { HttpClient } from '@angular/common/http';
import { CommonElementsModule } from '../common/common-elements.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PatientFinderComponent } from './components/patient-finder/patient-finder.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { PatientDataComponent } from './components/patient-data/patient-data.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PatientScreenComponent, PatientFinderComponent, PatientListComponent, PatientDataComponent],
    imports: [
        CommonModule,
        PatientScreenRoutingModule,
        FormsModule,
        GridsterModule,
        CommonElementsModule,
        NgxSpinnerModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatInputModule,
        MatIconModule,
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [PatientScreenComponent],
  providers: [HttpClient, MainMenuComponent]
})

export class PatientScreenModule {

}
