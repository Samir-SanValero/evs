import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnDestroy{

	public static CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS : string = "EMBRYOSELECTION_GRID_COLUMNS";
	public static CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS : string = "EMBRYOSELECTION_GRID_ROWS";
	//TODO: obtain from server
	public static CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK : string = "TIMELINE_DOUBLE_CLICK_MARGIN_TIME"; //Time in miliseconds
	public static CONFIG_KEY_TIME_HEADER_NOTIFICATIONS : string = "CONFIG_KEY_TIME_HEADER_NOTIFICATIONS";
	

  private pathToConfig = '/config';
  private pathToGetConfig = '/getConfig';

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  public configuration : Array<string>;
  public configSubscription : Subscription;

  constructor(private http: HttpClient) {
  	this.configuration = new Array<string>();
  }

  ngOnDestroy () {
  	this.configSubscription.unsubscribe();
  }

  // Error handling
  errorHandle(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getConfig(): void {
  	let tmpConfig = null;
  	console.log("[Loading configuration...]");
    this.configSubscription = this.http.get<string>(environment.apiUrl + this.pathToConfig + this.pathToGetConfig, this.httpOptions).subscribe(data => {
	    tmpConfig = data;
	    this.configuration[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS] = tmpConfig[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS];
	    this.configuration[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS] = tmpConfig[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS];
	    this.configuration[ConfigService.CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK] = tmpConfig[ConfigService.CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK];
	    this.configuration[ConfigService.CONFIG_KEY_TIME_HEADER_NOTIFICATIONS] = tmpConfig[ConfigService.CONFIG_KEY_TIME_HEADER_NOTIFICATIONS];
	    console.log("[Configuration loaded]");
    });
  }
}
