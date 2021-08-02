import { Component, OnDestroy, OnInit } from '@angular/core';
import { Embryo, EmbryoStatus, Patient } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';
import { PatientService } from '../../../../services/patient/patient.service';

@Component({
  selector: 'app-status-chooser',
  templateUrl: './status-chooser.component.html',
  styleUrls: ['./status-chooser.component.scss']
})
export class StatusChooserComponent implements OnInit, OnDestroy {

  statuses: EmbryoStatus[];
  selectedStatus: EmbryoStatus;
  patient: Patient;
  embryo: Embryo;

  private statusSubscription: Subscription;

  constructor(public analysisService: AnalysisService,
              public patientService: PatientService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.statusSubscription !== undefined) {
      this.statusSubscription.unsubscribe();
    }
  }

  loadData(): void {
    console.log('Status chooser component - loadStatuses');

    this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      console.log('Status chooser component - patient loaded: ');
      this.patient = patientData as Patient;


      this.patientService.getSelectedEmbryoObservable().subscribe((embryoData) => {
        console.log('Status chooser component - embryo loaded: ');

        this.embryo = embryoData as Embryo;

        this.statusSubscription = this.analysisService.getEmbryoStatuses().subscribe((statusesData) => {
          this.statuses = statusesData as EmbryoStatus[];

          console.log('Status chooser component - loaded statuses: ' + this.statuses.length);
        });
      });
    });
  }

  changeStatus(status: EmbryoStatus): void {
    console.log('Status chooser component - changeStatus');

    this.embryo.status = status;

    for (const embryo of this.patient.embryos) {
      if (embryo.id === this.embryo.id) {
        embryo.status = status;
      }
    }
    this.patientService.selectEmbryo(this.embryo);
    // this.patientService.selectLastLoadedPatient(this.patient);
    console.log('Status chooser component - changed Status');
  }
}
