import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';
import { Ng5SliderModule } from 'ng5-slider';
import { EmbryoViewerScreenRoutingModule } from './embryo-viewer-screen-routing.module';
import { HttpClient } from '@angular/common/http';
import { CommonElementsModule } from '../common/common-elements.module';
import { EmbryoViewerScreenComponent } from './embryo-viewer-screen.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ViewerTagListComponent } from './components/viewer-tag-list/viewer-tag-list.component';
import { ViewerModelListComponent } from './components/viewer-model-list/viewer-model-list.component';
import { ViewerTimelineComponent } from './components/viewer-timeline/viewer-timeline.component';
import { ViewerVerticalSliderComponent } from './components/viewer-vertical-slider/viewer-vertical-slider.component';
import { StatusChooserComponent } from './components/status-chooser/status-chooser.component';
import { ViewerMainComponent } from './components/viewer-main/viewer-main.component';
import { ViewerPhaseListComponent } from './components/viewer-phase-list/viewer-phase-list.component';

@NgModule({
  declarations: [EmbryoViewerScreenComponent,
                 ViewerTagListComponent,
                 ViewerModelListComponent,
                 ViewerPhaseListComponent,
                 ViewerTimelineComponent,
                 ViewerVerticalSliderComponent,
                 StatusChooserComponent,
                 ViewerMainComponent],
    imports: [
        CommonModule,
        EmbryoViewerScreenRoutingModule,
        FormsModule,
        GridsterModule,
        CommonElementsModule,
        Ng5SliderModule,
        NgxSpinnerModule
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [EmbryoViewerScreenComponent],
  providers: [HttpClient]
})

export class EmbryoViewerScreenModule {

}
