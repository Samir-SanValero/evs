import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SettingsMockService {
  constructor(private http: HttpClient) { }

  selectSettingGroup(settingGroup: string): Observable<string> {
    return of ("TEST");
  }

  getSelectedSettingGroup(): Observable<string> {
	  return of ("TESTING");
  }

}
