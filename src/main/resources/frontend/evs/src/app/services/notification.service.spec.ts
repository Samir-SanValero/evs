import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable, Injector, inject } from '@angular/core';

//import { Notification, NotificationAlert, NotificationReminder } from '../models/notification.model';
import { NotificationService } from './notification.service';
import { BackendInterceptor } from './backend.interceptor';
//import { Observable, of } from 'rxjs';
import { createNotificationForTest } from './functions.mock';


describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    	imports: [HttpClientTestingModule],
    	providers: [HttpClient,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		}
        ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('#createNotification should create a new notification an return "ok"', () => {
	var not = createNotificationForTest(58);
	service.createNotification(not).subscribe(response => {
		expect(response["result"]).toEqual("ok");
	}).unsubscribe();
  });
  
  it('#getNotifications should return notifications', () => {
	  service.getNotifications().subscribe(response => {
		  expect(response.length).toBeGreaterThan(0);
	  });
  });
  
  it('#changeActiveNotification should return true ', () => {
	  service.changeActiveNotification(1).subscribe(response => {
		  expect(response).toBe(true);
	  });
  });
  
  it('#deleteNotification should return true', () => {
	  service.deleteNotification(1).subscribe(response => {
		  expect(response).toBe(true);
	  });
  });
  
  it('#getNotificationsWithAlertsFiltered should return alerts', () => {
	  service.getNotificationsWithAlertsFiltered().subscribe(response => {
		  expect(response.length).toBeGreaterThan(0);
	  });
  });
  
});




