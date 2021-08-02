import { Injectable } from '@angular/core';
import { Notification, NotificationAlert } from '../models/notification.model';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private pathNotifications = '/notifications';
  private pathToCreateNotification = '/createUpdate';
  private pathToGetAllNotifications = '/getAll';
  private pathToSetActive = '/enabledisable';
  private pathToDelete = '/delete';
  private pathToGetAlerts = '/getAlerts';

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {
 }

  public createNotification (notification : Notification) : Observable<string[]> {
    let url = environment.apiUrl + this.pathNotifications + this.pathToCreateNotification;
    return this.http.post(url, notification) as Observable<string[]>;
  }

  public getNotifications () : Observable<Array<Notification>> {
    let url = environment.apiUrl + this.pathNotifications + this.pathToGetAllNotifications;
    return this.http.get(url, this.httpOptions) as Observable<Array<Notification>>;
  }

  public changeActiveNotification (id : number) : Observable<boolean>  {
    let url = environment.apiUrl + this.pathNotifications + this.pathToSetActive;
    this.httpOptions['params'] = {id: id};
    return this.http.get(url, this.httpOptions) as Observable<boolean>;
  }

  public deleteNotification (id : number) : Observable<boolean> {
    let url = environment.apiUrl + this.pathNotifications + this.pathToDelete;
    let httpParams = new HttpParams().set('id', id.toString());
    this.httpOptions['params'] = httpParams;
    return this.http.delete(url, this.httpOptions) as Observable<boolean>;
  }

  public getNotificationsWithAlertsFiltered () : Observable<Array<NotificationAlert>> {
    let url = environment.apiUrl + this.pathNotifications + this.pathToGetAlerts;
    return this.http.get(url, this.httpOptions) as Observable<Array<NotificationAlert>>;
  }
}
