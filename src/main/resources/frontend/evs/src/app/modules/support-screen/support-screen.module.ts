import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportScreenRoutingModule } from './support-screen-routing.module';
import { SupportScreenComponent } from './support-screen.component';
import { CommonElementsModule } from '../common/common-elements.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SupportScreenComponent],
  imports: [
    CommonModule,
    SupportScreenRoutingModule,
    CommonElementsModule,
    MatExpansionModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [SupportScreenComponent],
})
export class SupportScreenModule { }
