import { Component, OnDestroy, OnInit } from '@angular/core';
import { Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-finder',
  templateUrl: './patient-finder.component.html',
  styleUrls: ['./patient-finder.component.scss']
})
export class PatientFinderComponent implements OnInit, OnDestroy {

  public selectedPatient: Patient;
  public patients: Patient[] = [];
  public historicPatients: Patient[] = [];

  public historicPatientListSelected: false;

  public searchValue: string;
  private patientIdSearchParameter = 'Patient ID';
  private patientNameSearchParameter = 'Patient Name';
  private dishIdSearchParameter = 'Dish ID';

  public searchFoundPatients: Patient[] = [];
  public showFoundPatients = false;

  public selectedSearchParameter: any = this.patientNameSearchParameter;
  public searchParameters: any = [
                                  this.patientNameSearchParameter,
                                  this.patientIdSearchParameter,
                                  this.dishIdSearchParameter
                                 ];

  private patientSubscription: Subscription;
  private currentPatientsSubscription: Subscription;
  private historicPatientsSubscription: Subscription;

  constructor(public patientService: PatientService) {}

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
    console.log('Patient finder component - loadPatients');

    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe(
      data => {
        this.selectedPatient = data as Patient;
      }
    );

    this.currentPatientsSubscription = this.patientService.getCurrentPatientsObservable().subscribe(
      currentPatientsData => {
        this.patients = currentPatientsData as Patient[];
        this.selectedPatient = this.patients[0];
        console.log('Patient finder component - loaded patients: ' + this.patients.length);
      }
    );

    this.historicPatientsSubscription = this.patientService.getHistoricPatientsObservable().subscribe(
      historicPatientsData => {
        this.historicPatients = historicPatientsData as Patient[];
        console.log('Patient finder component - loaded historic patients: ' + this.historicPatients.length);
      }
    );
  }

  changeSearchParameter(searchParameter): any {
    console.log('Patient finder component - changeSearchParameter: ' + searchParameter);

    this.selectedSearchParameter = searchParameter;
    this.searchFoundPatients = [];
    this.searchValue = '';

    console.log('Patient finder component - changed search parameter');
  }

  findPatient(value): any {
    console.log('Patient finder component - findPatient');

    this.searchFoundPatients = [];
    console.log('Patient finder component - findPatient: Finding patient with parameter: ' +
                this.selectedSearchParameter + ' and value ' + value);

    if (value !== '') {
      if (this.selectedSearchParameter === this.patientIdSearchParameter) {
        for (const searchPatient of this.patients) {
          if (searchPatient.patientData.id.toString().trim().includes(value.toString().trim()) !== false) {
            this.searchFoundPatients.push(searchPatient);
            this.searchFoundPatients = this.removeDuplicates(this.searchFoundPatients);
          }
        }
      } else if (this.selectedSearchParameter === this.patientNameSearchParameter) {
        for (const searchPatient of this.patients) {
          if (searchPatient.patientData.name.toString().trim().toLowerCase().includes(value.toString().trim().toLowerCase()) !== false) {
            // show list of current patients matching search
            console.log('Patient finder component - findPatient: Adding to found patients BY NAME: ' + searchPatient.patientData.name);
            this.searchFoundPatients.push(searchPatient);
            this.searchFoundPatients = this.removeDuplicates(this.searchFoundPatients);
          }
        }
      } else if (this.selectedSearchParameter === this.dishIdSearchParameter) {
        for (const searchPatient of this.patients) {
          if (searchPatient.patientData.dish.toString().trim().includes(value.toString().trim()) !== false) {
            // show list of current patients matching search
            console.log('Patient finder component - findPatient: Adding to found patients BY DISH: ' + searchPatient.patientData.dish);
            this.searchFoundPatients.push(searchPatient);
            this.searchFoundPatients = this.removeDuplicates(this.searchFoundPatients);
          }
        }
      }
    }
    if (this.showFoundPatients === false){
      this.showFoundPatients = true;
    }

    console.log('Patient finder component - found patients: ' + this.searchFoundPatients.length);
  }

  changeSelectedPatient(id: number): any {
    console.log('Patient finder component - changeSelectedPatient with: ' + id);
    let patientList: Patient[];

    // We select current patient or historic patient
    // based on selection
    if (this.historicPatientListSelected) {
      patientList = this.historicPatients;
    } else {
      patientList = this.patients;
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
    console.log(/*'Patient finder component - changed selected patient: ' +*/ JSON.stringify(this.selectedPatient));
    this.searchValue = '';
  }

  removeDuplicates(array): any {
    array.filter((item, index) => array.indexOf(item) !== index);
    return array;
  }

}
