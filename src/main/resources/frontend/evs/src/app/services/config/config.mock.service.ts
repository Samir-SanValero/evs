import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigMockService implements OnDestroy{
  
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  
  public configuration : Array<string>;
  
  constructor(private http: HttpClient) {
  	this.configuration = new Array<string>();
  }
  
  ngOnDestroy () {
  }
  
  getConfig(): void {
    this.configuration[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS] = 5;
    this.configuration[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS] = 5;
    this.configuration[ConfigService.CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK] = 10;
    this.configuration[ConfigService.CONFIG_KEY_TIME_HEADER_NOTIFICATIONS] = 7000;
  }
}
