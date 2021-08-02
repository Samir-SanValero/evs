import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmbryoSelectionScreenRoutingModule } from './embryo-selection-screen-routing.module';
import { EmbryoSelectionScreenComponent } from './embryo-selection-screen.component';

import { GridsterModule } from 'angular-gridster2';
//import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonElementsModule } from "../common/common-elements.module";
import { NgxPanZoomModule } from 'ngx-panzoom';
import { Ng5SliderModule } from 'ng5-slider';


@NgModule({
  declarations: [EmbryoSelectionScreenComponent],
  imports: [
    CommonModule,
    EmbryoSelectionScreenRoutingModule,
    GridsterModule,
    Ng5SliderModule,
    NgxSpinnerModule,
    CommonElementsModule,
    NgxPanZoomModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [EmbryoSelectionScreenComponent],
})
export class EmbryoSelectionScreenModule { }
