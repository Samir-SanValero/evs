import {Injectable, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
import { environment } from '../../../environments/environment.prod';
import { PatientService } from '../patient/patient.service';
import { Patient } from '../../models/patient.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnDestroy {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  private refreshTokenTimeout;

  private lastLoadedPatientSubscription: Subscription;
  private currentPatientsSubscription: Subscription;
  private historicPatientsSubscription: Subscription;

  constructor(
    public router: Router,
    private http: HttpClient,
    private patientService: PatientService
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Http Headers with auth
  httpOptionsCredentials = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  ngOnDestroy() {
    if (this.lastLoadedPatientSubscription !== undefined){
      this.lastLoadedPatientSubscription.unsubscribe();
    }

    if (this.currentPatientsSubscription !== undefined){
      this.currentPatientsSubscription.unsubscribe();
    }

    if (this.historicPatientsSubscription !== undefined){
      this.historicPatientsSubscription.unsubscribe();
    }
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  login(user: User): Observable<User> {
    return this.http.post<any>(environment.apiUrl + environment.authUrl + '/login', JSON.stringify(user) , this.httpOptions)
      .pipe(map(user => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        this.initializeData();
        return user;
      }));
  }

  logout(): any {
    console.log('AUTH: logout');
    this.http.post<any>(environment.apiUrl + environment.userUrl + '/revoke', {}, this.httpOptionsCredentials).subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): any {
    // TODO refresh logic
    const refreshUser: User = new User();

    refreshUser.username = 'admin';
    refreshUser.password = 'refreshToken';

    // refreshUser.username = this.userSubject.getValue().username;
    // refreshUser.password = this.userSubject.getValue().username;

    return this.http.post<any>(environment.apiUrl + environment.authUrl + '/refresh', JSON.stringify(refreshUser), this.httpOptionsCredentials)
      .pipe(map((user) => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  private startRefreshTokenTimer(): any {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.authToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): any {
    clearTimeout(this.refreshTokenTimeout);
  }

  private initializeData(): any {
    console.log('Loading patients data');

    // INITIALIZE FIRST PATIENT
    try {
      this.lastLoadedPatientSubscription = this.patientService.getPatient('1').subscribe(
        (patientData: {}) => {
          this.patientService.selectLastLoadedPatient(patientData as Patient);
          console.log('Loaded first patient' + patientData);
        },
        (err) => {
          console.log(err);
        });
    } catch (error) {
      console.log('Error loading patient data');
      console.log(error);
    }

    // INITIALIZE CURRENT PATIENTS
    try {
      this.currentPatientsSubscription = this.patientService.getCurrentPatients().subscribe(
        (currentPatientsData: {}) => {
          this.patientService.selectCurrentPatients(currentPatientsData as Patient[]);
          console.log('Loaded current patients');
          for (const patient of currentPatientsData as Patient[]) {
            console.log('Patient: ' + patient.patientData.id);
          }
        },
        (err) => {
          console.log(err);
        });
    } catch (error) {
      console.log('Error loading patient data');
      console.log(error);
    }

    // INITIALIZE HISTORIC PATIENTS
    try {
      this.historicPatientsSubscription = this.patientService.getHistoricPatients(0).subscribe(
        (historicPatientData: {}) => {
          this.patientService.selectHistoricPatients(historicPatientData as Patient[]);
          console.log('Loaded historic patients');
          for (const patient of historicPatientData as Patient[]) {
            console.log('Patient: ' + patient.patientData.id);
          }
        },
        (err) => {
          console.log(err);
        });
    } catch (error) {
      console.log('Error loading patient data');
      console.log(error);
    }
  }
}
