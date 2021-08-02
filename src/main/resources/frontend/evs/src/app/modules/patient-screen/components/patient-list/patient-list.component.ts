import {Component, OnDestroy, OnInit} from '@angular/core';
import { Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, OnDestroy {

  public viewPatients: Patient[] = [];

  public currentPatients: Patient[] = [];
  public historicPatients: Patient[] = [];
  public historicPatientListSelected = false;
  public selectedPatient: Patient = null;

  public searchFoundPatients: Patient[] = [];
  public showFoundPatients = false;

  private patientSubscription: Subscription;
  private currentPatientsSubscription: Subscription;
  private historicPatientsSubscription: Subscription;

  constructor(public patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  ngOnDestroy(): void {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }

    if (this.currentPatientsSubscription !== undefined) {
      this.currentPatientsSubscription.unsubscribe();
    }

    if (this.historicPatientsSubscription !== undefined) {
      this.historicPatientsSubscription.unsubscribe();
    }
  }

  loadPatients(): any {
    console.log('Patient list component - loadPatients');

    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe(
      patientData => {
        this.selectedPatient = patientData as Patient;
      }
    );

    this.currentPatientsSubscription = this.patientService.getCurrentPatientsObservable().subscribe(
      currentPatientsData => {
        this.currentPatients = currentPatientsData as Patient[];

        this.viewPatients = this.currentPatients;
        this.selectedPatient = this.currentPatients[0];
        console.log('Patient list component - loaded patients: ' + this.currentPatients.length);
      }
    );

    this.historicPatientsSubscription = this.patientService.getHistoricPatientsObservable().subscribe(
      historicPatientsData => {
        this.historicPatients = historicPatientsData as Patient[];

        console.log('Patient list component - loaded historic patients: ' + this.historicPatients.length);
      }
    );


    console.log('Patient list component - loaded patients: ' + this.currentPatients.length);
    console.log('Patient list component - loaded historic patients: ' + this.historicPatients.length);
  }

  activateHistoric(): void {
    console.log('Patient list component - activateHistoric');

    if (this.historicPatients.length > 0) {
      this.selectedPatient = this.historicPatients[0];
      this.viewPatients = this.historicPatients;
      this.patientService.selectLastLoadedPatient(this.selectedPatient);
    }
    this.historicPatientListSelected = true;

    console.log('Patient list component - activated historic');
  }

  deactivateHistoric(): void {
    console.log('Patient list component - deactivateHistoric');

    if (this.currentPatients.length > 0) {
      this.selectedPatient = this.currentPatients[0];
      this.viewPatients = this.currentPatients;
      this.patientService.selectLastLoadedPatient(this.selectedPatient);
    }
    this.historicPatientListSelected = false;

    console.log('Patient list component - deactivated historic');
  }

  changeSelectedPatient(id: number): any {
    console.log('Patient list component - changeSelectedPatient with: ' + id);
    let patientList: Patient[];

    // We select current patient or historic patient
    // based on selection
    if (this.historicPatientListSelected) {
      patientList = this.historicPatients;
    } else {
      patientList = this.currentPatients;
    }

    // If clicked already selected patient, we do nothing
    if (id !== this.selectedPatient.patientData.id) {
      for (const searchPatient of patientList) {
        if (searchPatient.patientData.id === id) {
          this.selectedPatient = searchPatient;
        }
      }

      if (this.showFoundPatients === true) {
        this.showFoundPatients = false;
        this.searchFoundPatients = [];
      }

      this.patientService.selectLastLoadedPatient(this.selectedPatient);
    }
    console.log('Patient list component - changed selected patient: ' + this.selectedPatient);
  }

}
