import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoScreenRoutingModule } from './video-screen-routing.module';
import { VideoScreenComponent } from './video-screen.component';

import { GridsterModule } from 'angular-gridster2';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner";
import { CommonElementsModule } from "../common/common-elements.module";
import { NgxPanZoomModule } from 'ngx-panzoom';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";



@NgModule({
  declarations: [VideoScreenComponent],
  imports: [
    CommonModule,
    VideoScreenRoutingModule,
    GridsterModule,
    Ng5SliderModule,
    NgxSpinnerModule,
    CommonElementsModule,
    NgxPanZoomModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Tells Angular we will have custom tags in our templates
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [VideoScreenComponent],
//  exports: [EmbryoImageComponent],
})
export class VideoScreenModule { }
