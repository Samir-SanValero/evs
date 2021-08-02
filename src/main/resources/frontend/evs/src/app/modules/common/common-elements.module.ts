import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CommonRoutingModule } from './common-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EmbryoSelectorComponent } from './embryo-selector/embryo-selector.component';
import { Ng5SliderModule } from 'ng5-slider';
import { PlayControlComponent } from '../../components/play-control/play-control.component';
import { ZoomControlComponent } from '../../components/zoom-control/zoom-control.component';
import { Focus3DComponent } from '../../components/focus3-d/focus3-d.component';
import { AIAnalysisComponent } from '../../components/aianalysis/aianalysis.component';
import { GridsterModule } from 'angular-gridster2';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPanZoomModule } from 'ngx-panzoom';
import { EmbryoImageComponent } from '../../components/embryo-image/embryo-image.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    EmbryoSelectorComponent,
    PlayControlComponent,
    ZoomControlComponent,
    Focus3DComponent,
    AIAnalysisComponent,
    EmbryoImageComponent
  ],
  imports: [
    CommonModule,
    CommonRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    GridsterModule,
    Ng5SliderModule,
    NgxSpinnerModule,
    NgxPanZoomModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    HeaderComponent,
    EmbryoSelectorComponent,
    FooterComponent,
    PlayControlComponent,
    ZoomControlComponent,
    Focus3DComponent,
    AIAnalysisComponent,
    EmbryoImageComponent
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
    MatSnackBarModule
  ]
})
export class CommonElementsModule {

}
