import { Injectable } from '@angular/core';
import { Notification, NotificationAlert } from '../models/notification.model';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { createNotificationForTest, createAlertForTest } from './functions.mock';

@Injectable({
  providedIn: 'root'
})
export class NotificationMockService {
  constructor(private http: HttpClient) { }

  public createNotification (notification : Notification) : Observable<string[]> {
	var array : string [] = [];
  	array["result"] = "ok";
    return of (array);
  }

  public getNotifications () : Observable<Array<Notification>> {
	var not = createNotificationForTest(7);
	var array : Array<Notification> = new Array<Notification>();
	array.push (not);
    return of<Array<Notification>> (array);
  }

  public changeActiveNotification (id : number) : Observable<boolean>  {
	  return of (true);
  }

  public deleteNotification (id : number) : Observable<boolean> {
    return of (true);
  }

  public getNotificationsWithAlertsFiltered () : Observable<Array<NotificationAlert>> {
    var alert : NotificationAlert = createAlertForTest(35, 7);
	var array : Array<NotificationAlert> = new Array<NotificationAlert>();
	array.push (alert);
	return of (array);
  }
}
