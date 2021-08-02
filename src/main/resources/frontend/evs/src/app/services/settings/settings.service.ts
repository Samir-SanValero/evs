import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
  private lastLoadedSettingGroupSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  selectSettingGroup(settingGroup: string): Observable<string> {
    this.lastLoadedSettingGroupSubject.next(settingGroup);
    return this.lastLoadedSettingGroupSubject.asObservable();
  }

  getSelectedSettingGroup(): Observable<string> {
    return this.lastLoadedSettingGroupSubject.asObservable();
  }

  // Error handling
  errorHandle(error): any {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
