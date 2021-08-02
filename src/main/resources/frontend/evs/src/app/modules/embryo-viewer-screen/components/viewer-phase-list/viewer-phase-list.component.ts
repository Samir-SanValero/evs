import {Component, OnDestroy, OnInit} from '@angular/core';
import {Embryo, EmbryoInstant, Patient, Phase, Tag} from "../../../../models/patient.model";
import {EmbryoImage} from "../../../../models/embryo-image.model";
import {Subscription} from "rxjs";
import {PatientService} from "../../../../services/patient/patient.service";
import {AnalysisService} from "../../../../services/analysis/analisys.service";
import {MediaService} from "../../../../services/media.service";


@Component({
  selector: 'app-viewer-phase-list',
  templateUrl: './viewer-phase-list.component.html',
  styleUrls: ['./viewer-phase-list.component.css']
})
export class ViewerPhaseListComponent implements OnInit, OnDestroy {

  private defaultTimeZoneTranslation = 7200000000;

  showModal = false;

  public selectedPhase: Phase;

  public patient: Patient;
  public embryo: Embryo;
  public baseTags: Tag[];
  public tagList: Tag[];
  public embryoInstant: EmbryoInstant;
  public embryoImage: EmbryoImage;
  public basePhases: Phase[];

  private patientSubscription: Subscription;
  private embryoSubscription: Subscription;
  private tagSubscription: Subscription;
  private instantSubscription: Subscription;
  private embryoImageSubscription: Subscription;
  private tagListSubscription: Subscription;
  private phaseSubscription: Subscription;

  constructor(public patientService: PatientService,
              public analysisService: AnalysisService,
              public mediaService: MediaService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }

    if (this.embryoSubscription !== undefined) {
      this.embryoSubscription.unsubscribe();
    }

    if (this.tagSubscription !== undefined) {
      this.tagSubscription.unsubscribe();
    }

    if (this.instantSubscription !== undefined) {
      this.instantSubscription.unsubscribe();
    }

    if (this.embryoImageSubscription !== undefined) {
      this.embryoImageSubscription.unsubscribe();
    }

    if (this.tagListSubscription !== undefined) {
      this.tagListSubscription.unsubscribe();
    }

    if (this.phaseSubscription !== undefined) {
      this.phaseSubscription.unsubscribe();
    }
  }

  loadData(): any {
    console.log('Phase list component - loadTags');
    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      console.log('Phase list component - patient loaded: ');
      this.patient = patientData as Patient;

      this.embryoSubscription = this.patientService.getSelectedEmbryoObservable().subscribe((embryoData) => {
        console.log('Phase list component - embryo loaded: ');
        this.embryo = embryoData as Embryo;

        this.tagSubscription = this.analysisService.getAllBasePhases().subscribe((basePhasesData) => {
          this.basePhases = basePhasesData as Phase[];
          console.log('Phase list component - loaded base phase: ' + this.basePhases.length);

        });
      });
    });
  }

  /**
   * Adds selected phase to timeline
   */
  selectPhase(selectedPhase: Phase): any {

  }

}
