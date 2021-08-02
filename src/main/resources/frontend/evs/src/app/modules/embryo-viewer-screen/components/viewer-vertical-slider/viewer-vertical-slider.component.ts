import {Component, OnDestroy, OnInit} from '@angular/core';
import { ChangeContext, Options } from 'ng5-slider';
import { Embryo, Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient/patient.service';
import { ImagesRequest } from '../../../../models/images-request-model';
import { MediaService } from '../../../../services/media.service';
import { EmbryoImage } from '../../../../models/embryo-image.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';

@Component({
  selector: 'app-viewer-vertical-slider',
  templateUrl: './viewer-vertical-slider.component.html',
  styleUrls: ['./viewer-vertical-slider.component.scss']
})
export class ViewerVerticalSliderComponent implements OnInit, OnDestroy {

  patient: Patient;
  embryo: Embryo;
  image: EmbryoImage;

  patientSubscription: Subscription;
  embryoSubscription: Subscription;
  imageSubscription: Subscription;

  zAxisValue: number = 1;
  imageWidth: number = 500;

  zAxisSliderOptions: Options = {
    hidePointerLabels: true,
    hideLimitLabels: true,
    stepsArray: [
      {value: 1},
      {value: 2},
      {value: 3},
      {value: 4},
      {value: 5},
      {value: 6},
      {value: 7},
      {value: 8},
      {value: 9},
      {value: 10},
      {value: 11},
      {value: 12},
      {value: 13}
    ],
    vertical: true,
    disabled: true
  };

  constructor(public patientService: PatientService,
              public mediaService: MediaService,
              public analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }

    if (this.embryoSubscription !== undefined) {
      this.embryoSubscription.unsubscribe();
    }

    if (this.imageSubscription !== undefined) {
      this.imageSubscription.unsubscribe();
    }
  }

  loadData(): any {
    console.log('Vertical slider component - loadData');
    // this.patient = this.patientService.getLastLoadedPatient();

    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      this.patient = patientData as Patient;
      console.log('Vertical slider component - patient loaded');

      this.embryoSubscription = this.patientService.getSelectedEmbryoObservable().subscribe((embryoData) => {
        this.embryo = embryoData as Embryo;
        console.log('Vertical slider component - embryo loaded');

        this.imageSubscription = this.mediaService.getSelectedImageObservable().subscribe((imageData) => {
          this.image = imageData as EmbryoImage;
          console.log('Vertical slider component - embryo image loaded');
        });
      });
    });

    console.log('Vertical slider component - loaded Data');
  }

  /**
   * Changes selected image when user changes Z focal slider
   */
  sliderChange(changeContext: ChangeContext): void {
    console.log('Vertical slider component - sliderChange: ' + changeContext.value);
    const zIndex: number = changeContext.value;

    const imagesRequest: ImagesRequest = new ImagesRequest();

    console.log('Vertical slider component - ' + zIndex);
    console.log('Vertical slider component - ' + this.image.digitalizationTimeFromEpoch);

    for (const embryoImage of this.embryo.images) {
      if (embryoImage.zIndex === zIndex && embryoImage.digitalizationTimeFromEpoch === this.image.digitalizationTimeFromEpoch) {
//        imagesRequest.folder = embryoImage.path;
        imagesRequest.imagesIds = [embryoImage.id];
        imagesRequest.imageWidth = this.imageWidth;

        // We call media service to get new image, and emit the value for other components
        this.mediaService.selectEmbryoImage(imagesRequest);
      }
    }
  }

}
