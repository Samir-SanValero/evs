import { Logger } from '../log/logger.service';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Embryo, InseminationType, Patient } from '../../models/patient.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class PatientService implements OnInit, OnDestroy {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // private lastLoadedPatient: Patient;
  private lastLoadedPatientSubject: BehaviorSubject<Patient> = new BehaviorSubject<Patient>(new Patient());
  private patientSubscription: Subscription;

  // private currentPatients: Patient[];
  private currentPatientsSubject: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  private currentPatientsSubscription: Subscription;

  // private historicPatients: Patient[];
  private historicPatientsSubject: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  private historicPatientsSubscription: Subscription;

  // private lastLoadedEmbryo: Embryo;
  private lastLoadedEmbryoSubject: BehaviorSubject<Embryo> = new BehaviorSubject<Embryo>(new Embryo());

  private inseminationTypes: InseminationType[];
  private inseminationTypesSubject: BehaviorSubject<InseminationType[]> = new BehaviorSubject<InseminationType[]>([]);
  private inseminationTypesSubscription: Subscription;

  constructor(
    private logger: Logger,
    private http: HttpClient
  ) { }


  ngOnInit(): void {
    this.initializeData();
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

    if (this.inseminationTypesSubscription !== undefined) {
      this.inseminationTypesSubscription.unsubscribe();
    }
  }

  public initializeData(): any {
    // GET First patient
    try {
      this.patientSubscription = this.getPatient('1').subscribe((data: {}) => {
          const patient = data as Patient;
          this.selectLastLoadedPatient(patient);
          this.selectEmbryo(patient.embryos[0]);
          console.log('Loaded first patient');
        },
        (err) => {
          console.log('First Patient not found');
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }

    // GET Current patients
    try {
      this.currentPatientsSubscription = this.getCurrentPatients().subscribe((currentPatientsData: {}) => {
          this.selectCurrentPatients(currentPatientsData as Patient[]);
          console.log('Loaded current patients');
        },
        (err) => {
          console.log('Current patients not found');
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }

    // GET Historic patients
    try {
      this.historicPatientsSubscription = this.getHistoricPatients(0).subscribe((historicPatientsData: {}) => {
          this.historicPatientsSubject.next(historicPatientsData as Patient[]);
          console.log('Loaded historic patients');
        },
        (err) => {
          console.log('Historic patients not found');
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }

    // GET Insemination Types
    try {
      this.inseminationTypesSubscription = this.getInseminationTypes().subscribe((inseminationTypesData: {}) => {
          this.inseminationTypes = inseminationTypesData as InseminationType[];
          console.log('Loaded insemination types');
        },
        (err) => {
          console.log('Insemination types not found');
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  // LAST LOADED PATIENT
  selectLastLoadedPatient(patient: Patient): Observable<Patient> {
    this.lastLoadedPatientSubject.next(patient);
    this.lastLoadedEmbryoSubject.next(patient.embryos[0]);
    return this.lastLoadedPatientSubject.asObservable();
  }

  getLastLoadedPatientObservable(): Observable<Patient> {
    return this.lastLoadedPatientSubject.asObservable().pipe();
  }


  // CURRENT PATIENT LIST
  selectCurrentPatients(currentPatients: Patient[]): Observable<Patient[]> {
    this.currentPatientsSubject.next(currentPatients);
    return this.currentPatientsSubject.asObservable();
  }

  getCurrentPatientsObservable(): Observable<Patient[]> {
    return this.currentPatientsSubject.asObservable();
  }


  // HISTORIC PATIENT LIST
  selectHistoricPatients(historicPatients: Patient[]): Observable<Patient[]> {
    this.historicPatientsSubject.next(historicPatients);
    return this.historicPatientsSubject.asObservable();
  }

  getHistoricPatientsObservable(): Observable<Patient[]> {
    return this.historicPatientsSubject.asObservable();
  }


  // SELECTED EMBRYO
  selectEmbryo(embryo: Embryo): Observable<Embryo> {
    this.lastLoadedEmbryoSubject.next(embryo);
    return this.lastLoadedEmbryoSubject.asObservable();
  }

  getSelectedEmbryoObservable(): Observable<Embryo> {
    return this.lastLoadedEmbryoSubject.asObservable();
  }


  // INSEMINATION TYPES
  setLoadedInseminationTypes(inseminationTypes: InseminationType[]): void {
    this.inseminationTypes = inseminationTypes;
  }

  getLoadedInseminationTypes(): InseminationType[] {
    return this.inseminationTypes;
  }



  // GET ALL PATIENTS
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(environment.apiUrl + environment.patientUrl, this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
  }

  // GET ONE PATIENT
  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(environment.apiUrl + environment.patientUrl + '/' + id, this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
  }

  // GET HISTORIC PATIENTS
  getHistoricPatients(page: number): Observable<Patient[]> {
    return this.http.get<Patient[]>(environment.apiUrl + environment.patientUrl + '/historic/' + page, this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
  }

  // GET CURRENT PATIENTS
  getCurrentPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(environment.apiUrl + environment.patientUrl + '/current', this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
  }

  // // POST
  // createPatient(data): Observable<Patient> {
  //   return this.http.post<Patient>(environment.apiUrl + environment.patientUrl, JSON.stringify(data), this.httpOptions)
  //     .pipe(
  //       retry(1),
  //       catchError(this.errorHandle)
  //     )
  // }

  // PUT
  updatePatient(id: number, eTag: string, data: Patient): Observable<Patient> {
    console.log('Updating patient: ' + id);
    this.httpOptions.headers.append('If-Match', eTag);
    return this.http.put<Patient>(environment.apiUrl + environment.patientUrl + '/' + id, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
  }

  updateEmbryo(id: string, eTag: string, data: Embryo): Observable<Embryo> {
    console.log('Updating embryo: ' + id);
    this.httpOptions.headers.append('If-Match', eTag);

    return this.http.put<Embryo>(environment.apiUrl + environment.embryoUrl + '/' + id, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
  }

  // GET INSEMINATION TYPES
  getInseminationTypes(): Observable<InseminationType[]> {
    return this.http.get<InseminationType[]>(environment.apiUrl + environment.patientUrl + '/inseminationType', this.httpOptions)
      .pipe(
        retry(1)
        // , catchError(this.errorHandle)
      );
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

  // setLastLoadedPatient(patient: Patient): any {
  //
  //   for (const embryo of patient.embryos) {
  //     console.log('Loaded patient embryo: ' + embryo.id);
  //     console.log('Loaded patient embryo tags: ' + embryo.tags.length);
  //     console.log('Loaded patient embryo phases: ' + embryo.phases.length);
  //     console.log('Loaded patient embryo images: ' + embryo.images.length);
  //   }
  //
  //   this.lastLoadedPatient = patient;
  // }
  //
  // getLoadedCurrentPatients(): Patient[]{
  //   return this.currentPatients;
  // }
  //
  // setLoadedCurrentPatients(currentPatients: Patient[]): any{
  //   this.currentPatients = currentPatients;
  //   this.currentPatientsSubject.next(currentPatients);
  // }
  //
  // getLoadedHistoricPatients(): Patient[]{
  //   return this.historicPatients;
  // }
  //
  // setLoadedHistoricPatients(historicPatients: Patient[]): any{
  //   this.historicPatients = historicPatients;
  // }
  //
  // getSelectedEmbryo(): Embryo {
  //   return this.lastLoadedEmbryo;
  // }
  //

}






