import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import { Embryo, Patient } from '../../../models/patient.model';
import { PatientService } from '../../../services/patient/patient.service';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../services/analysis/analisys.service';

@Component({
  selector: 'app-embryo-selector',
  templateUrl: './embryo-selector.component.html',
  styleUrls: ['./embryo-selector.component.scss']
})
export class EmbryoSelectorComponent implements OnInit, OnDestroy {

  public embryo1: Embryo = new Embryo();
  public embryo2: Embryo = new Embryo();

  public embryo3: Embryo = new Embryo();
  public embryo4: Embryo = new Embryo();
  public embryo5: Embryo = new Embryo();
  public embryo6: Embryo = new Embryo();

  public embryo7: Embryo = new Embryo();
  public embryo8: Embryo = new Embryo();
  public embryo9: Embryo = new Embryo();
  public embryo10: Embryo = new Embryo();

  public embryo11: Embryo = new Embryo();
  public embryo12: Embryo = new Embryo();

  public embryos: Array<Embryo> = new Array<Embryo>(26);

  @Output() embryoSelected: EventEmitter<Embryo> = new EventEmitter<Embryo>();
  @Input() title: string;

  private patientSubscription: Subscription;

  constructor(public patientService: PatientService,
              public analysisService: AnalysisService) {}

  ngOnInit(): void {
    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe(
      data => {
        const patient = data as Patient;
        this.setEmbryos(patient.embryos);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }
  }

  /**
   * Load embryos on embryo grid based on embryo.dishLocationNumber
   * @param listEmbryos: array containing patient embryos. Order is not needed.
   */
  public setEmbryos(listEmbryos: Array<Embryo>): void {
    console.log('EmbryoSelector component - Loading embryos');

    for (var i = 1; i < this.embryos.length; i++) {
      for (const embryo of listEmbryos) {

        if (embryo.dishLocationNumber === i) {
          this.embryos[i] = embryo;
          console.log(this.embryos[i]);
        }

      }
    }

    // For que se usaba para el modelo de estrcutura viejo
    /*for (const embryo of listEmbryos) {
      if (embryo.dishLocationNumber === 1) {
        this.embryo1 = embryo;
      }

      if (embryo.dishLocationNumber === 2) {
        this.embryo2 = embryo;
      }

      if (embryo.dishLocationNumber === 3) {
        this.embryo3 = embryo;
      }

      if (embryo.dishLocationNumber === 4) {
        this.embryo4 = embryo;
      }

      if (embryo.dishLocationNumber === 5) {
        this.embryo5 = embryo;
      }

      if (embryo.dishLocationNumber === 6) {
        this.embryo6 = embryo;
      }

      if (embryo.dishLocationNumber === 7) {
        this.embryo7 = embryo;
      }

      if (embryo.dishLocationNumber === 8) {
        this.embryo8 = embryo;
      }

      if (embryo.dishLocationNumber === 9) {
        this.embryo9 = embryo;
      }

      if (embryo.dishLocationNumber === 10) {
        this.embryo10 = embryo;
      }

      if (embryo.dishLocationNumber === 11) {
        this.embryo11 = embryo;
      }

      if (embryo.dishLocationNumber === 12) {
        this.embryo12 = embryo;
      }

      console.log('EmbryoSelector component - Done loading embryos');
    }*/

  }

  /**
   * Emits embryo when one is clicked
   * @param embryo: Embryo object of the embryo that was clicked
   */
  public selectEmbryo(embryo: Embryo): void {
    console.log('EmbryoSelector component - Selecting embryo, dishLocationNumber: ' + embryo.dishLocationNumber);
    this.embryoSelected.emit(embryo);
    this.patientService.selectEmbryo(embryo);
    this.analysisService.selectTagList(embryo.tags);
  }

  /**
   * Changes component title. If title is undefined, no div title is rendered
   */
  public setTitle(title: string): void {
    this.title = title;
  }

}
