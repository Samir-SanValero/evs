import {Injectable, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
import { environment } from '../../../environments/environment.prod';
import { PatientService } from '../patient/patient.service';
import { Patient } from '../../models/patient.model';
import { createUser } from '../../services/functions.mock';

@Injectable({ providedIn: 'root' })
export class AuthenticationMockService implements OnDestroy {

  constructor(
    public router: Router,
    private http: HttpClient,
    private patientService: PatientService
  ) {
    
  }

  ngOnDestroy() {
  }

  public get userValue(): User {
    return createUser(3);
  }

  login(user: User): Observable<User> {
    return of (createUser(3));
  }

  logout(): any {
    this.router.navigate(['/login']);
  }

  refreshToken(): any {
	return of (createUser(3))
  }

  private startRefreshTokenTimer(): any {
  }

  private stopRefreshTokenTimer(): any {
  }

  private initializeData(): any {
  }
}
