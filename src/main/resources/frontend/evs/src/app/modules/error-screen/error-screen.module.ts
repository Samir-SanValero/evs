import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorScreenRoutingModule } from './error-screen-routing.module';
import { ErrorScreenComponent } from './error-screen.component';

@NgModule({
  declarations: [ErrorScreenComponent],
  imports: [
    CommonModule,
    ErrorScreenRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [ErrorScreenComponent],
  exports: []
})
export class ErrorScreenModule {

}
