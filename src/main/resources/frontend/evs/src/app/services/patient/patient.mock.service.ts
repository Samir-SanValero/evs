import { Logger } from '../log/logger.service';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Embryo, InseminationType, Patient } from '../../models/patient.model';
import { createPatient, createEmbryo, createInseminationType } from '../functions.mock';

@Injectable()
export class PatientMockService implements OnInit, OnDestroy {

  constructor(
    private logger: Logger,
    private http: HttpClient
  ) { }


  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
  }

  public initializeData(): any {
  }

  selectLastLoadedPatient(patient: Patient): Observable<Patient> {
    var patient : Patient = createPatient();
    return of (patient);
  }

  public getLastLoadedPatientObservable(): Observable<Patient> {
	var patient : Patient = createPatient();
  	return of (patient);
  }

  selectCurrentPatients(currentPatients: Patient[]): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  getCurrentPatientsObservable(): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  selectHistoricPatients(historicPatients: Patient[]): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  getHistoricPatientsObservable(): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  selectEmbryo(embryo: Embryo): Observable<Embryo> {
	var embryo : Embryo = createEmbryo("5");
	return of (embryo);
  }

  getSelectedEmbryoObservable(): Observable<Embryo> {
	var embryo : Embryo = createEmbryo("6");
	return of (embryo);
  }

  setLoadedInseminationTypes(inseminationTypes: InseminationType[]): void {
  }

  getLoadedInseminationTypes(): InseminationType[] {
	var insem : InseminationType = createInseminationType(6);
    return new Array<InseminationType>(insem);
  }

  getPatients(): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  public getPatient(id: string): Observable<Patient> {
	var patient : Patient = createPatient();
	return of (patient);
  }

  getHistoricPatients(page: number): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  getCurrentPatients(): Observable<Patient[]> {
	var patient : Patient = createPatient();
	return of (new Array<Patient>(patient));
  }

  updatePatient(id: number, eTag: string, data: Patient): Observable<Patient> {
	var patient : Patient = createPatient();
	return of (patient);
  }

  updateEmbryo(id: string, eTag: string, data: Embryo): Observable<Embryo> {
	var embryo : Embryo = createEmbryo("8");
	return of (embryo);
  }

  // GET INSEMINATION TYPES
  getInseminationTypes(): Observable<InseminationType[]> {
	var insem : InseminationType = createInseminationType(6);
	return of(new Array<InseminationType>(insem));
  }

  // Error handling
  errorHandle(error): any {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}






