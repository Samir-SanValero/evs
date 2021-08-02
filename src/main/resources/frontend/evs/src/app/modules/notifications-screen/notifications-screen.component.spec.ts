import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsScreenComponent } from './notifications-screen.component';

import { FormBuilder } from '@angular/forms';
import { Notification } from '../../models/notification.model';
import { NotificationMockService } from '../../services/notification.mock.service';
import { NotificationService } from '../../services/notification.service';
import { Embryo } from '../../models/patient.model';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackendInterceptor } from '../../services/backend.interceptor';
import { NotificationsScreenModule } from './notifications-screen.module';
import { RouterTestingModule } from "@angular/router/testing";
import { PatientMockService } from '../../services/patient/patient.mock.service';
import { PatientService } from '../../services/patient/patient.service';
import { Logger } from '../../services/log/logger.service';
import { AnalysisService } from '../../services/analysis/analisys.service';
import { createNotificationForTest, createEmbryo } from '../../services/functions.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('NotificationsScreenComponent', () => {
  let component: NotificationsScreenComponent;
  let fixture: ComponentFixture<NotificationsScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    	providers: [FormBuilder, Logger, AnalysisService,
    	    {
    			provide: NotificationService,
    			useClass: NotificationMockService
			},
    	    {
	            provide: HTTP_INTERCEPTORS,
	            useClass: BackendInterceptor,
	            multi: true
			},
			{
				 provide: PatientService,
				 useClass: PatientMockService,
    	    }
			],
		imports: [NotificationsScreenModule, HttpClientTestingModule, RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
		declarations: [ NotificationsScreenComponent ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(NotificationsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it("#name", () => {
	expect(component.name.value).toEqual('');
	expect(component.name.status).toEqual('INVALID');
  });
  
  it("#inc_chamber", () => {
	expect(component.inc_chamber.value).toEqual('');
	expect(component.inc_chamber.status).toEqual('INVALID');
  });
  
  it("#comment", () => {
	expect(component.comment.value).toEqual('');
	expect(component.comment.status).toEqual('INVALID');
  });
  
  it("#datetime", () => {
	expect(component.datetime.value).toEqual('');
	expect(component.datetime.status).toEqual('INVALID');
  });
  
  it('#loadAlerts', () => {
	component.loadAlerts();
	clearInterval(component.timeoutId);
	expect(component.alertsToShow.length).toEqual(1);
	expect(component.alertsToShow[0].id).toEqual(35);
  });
  
  it('#ngOnInit', async () => {
	component.ngOnInit();
	component.loadAlerts();
	expect(component.firstExecution).toBeFalse();
	expect(component.notificationList.length).toEqual(1);
	expect(component.notificationList[0].id).toEqual(7);
	clearInterval(component.timeoutId);
	expect(component.alertsToShow.length).toEqual(1);
	expect(component.alertsToShow[0].id).toEqual(35);
  });
  
  it('#loadNotifications', () => {
	  let spy = spyOn (component, "handleGetNotifications");
	  component.loadNotifications();
	  expect(spy).toHaveBeenCalled();
	  expect(component.notificationList.length).toBeGreaterThan(0);
	  expect(component.notificationList[0].id).toEqual(7);
	  expect(component.notificationList[0].comment).toEqual("TEST COMMENT");
  });
  
  //Not entering on handleCreationResponse
  /*it('#onSubmit', () => {
	  let array : Array<string> = new Array<string>();
	  array["notId"] = 1;
	  array["name"] = "TEST NAME";
	  array["inc_chamber"] = 1;
	  array["comment"] = "TEST COMMENT";
	  array["datetime"] = new Date();
	  let spy = spyOn (component, "handleCreationResponse");
	  let spy2 = spyOn (component, "loadNotifications");
	  let spy3 = spyOn (component, "clearNotificationForm");
	  
	  component.notificationForm.setValue(array);
	  component.onSubmit(null);
	  expect(spy).toHaveBeenCalled();
	  expect(spy2).toHaveBeenCalled();
	  expect(spy3).toHaveBeenCalled();
  });*/
  
  it('#selectDay', () => {
	let spy = spyOn (component, "checkAllDaysSelected");
	let spy2 = spyOn (component, "checkAllDaysDeselected");
	component.selectDay("d_mon");
	expect(spy).toHaveBeenCalled();
	component.selectDay("d_mon");
	expect(spy2).toHaveBeenCalled();
  });
  
  it('#checkAllDaysSelected', () => {
	let result = component.checkAllDaysSelected();
	expect(result).toBeFalse();
	component.selectDay("d_mon");
	expect(result).toBeFalse();
  });
  
  it('#checkAllDaysDeselected', () => {
	let result = component.checkAllDaysDeselected();
	expect(result).toBe(true);
	component.selectDay("d_mon");
	result = component.checkAllDaysDeselected();
	expect(result).toBeFalse();
  });
  
  it('#getSelectedDayInNotification', () => {
	let spy = spyOn (NotificationsScreenComponent, "convertDayIdToDayNameWithNotification");
	let not : Notification = createNotificationForTest(3);
	component.selectDay("d_fri");
	component.getSelectedDayInNotification(not);
	expect(spy).toHaveBeenCalled();
  });
  
  //deselectAllDays (private)
  //selectAllDays (private)
  
  //Exception en "classlist"
  /*it('#selectPeriod', () => {
	fixture.whenStable();
	let spy = spyOn (component, "findChildById");
	component.selectPeriod("p_day");
	expect(spy).toHaveBeenCalled();
  });*/
  
  it('#getSelectedDayInNotification', () => {
	let spy = spyOn (NotificationsScreenComponent, "convertPeriodIdToPeriodName");
	let not : Notification = createNotificationForTest(3);
	component.getSelectedPeriodInNotification(not);
	expect(spy).toHaveBeenCalled();
  });
  
  //deselectAllPeriods (private)
  
  it('#convertDayIdToDayNameWithNotification', () => {
	component.selectDay("d_fri");
	let selected : Array<HTMLElement> = new Array<HTMLElement>();
	component.daysDiv.nativeElement.childNodes.forEach (function (element) {
		if (element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_DAY)) {
			selected.push(element);
		}
	});
	let not : Notification = createNotificationForTest(3);
	NotificationsScreenComponent.convertDayIdToDayNameWithNotification(selected, not);
	expect(not.reminder.friday).toBe(true);
  });
  
  it('#convertPeriodIdToPeriodName', () => {
	component.selectPeriod("p_week");
	let selected : Array<HTMLElement> = new Array<HTMLElement>();
	component.frequencyDiv.nativeElement.childNodes.forEach (function (element) {
		if (element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_PERIOD)) {
			selected.push(element);
		}
	});
	let not : Notification = createNotificationForTest(3);
	let result = NotificationsScreenComponent.convertPeriodIdToPeriodName(selected, not);
	expect(not.reminder.week).toBe(true);
	expect(result).toEqual("week");
  });
  
  /*it('#findChildById', () => {
	//component.selectDay("d_fri");
	//component.selectDay("d_thu");
	//component.selectDay("d_wed");
	let selected : Array<HTMLElement> = new Array<HTMLElement>();
	component.daysDiv.nativeElement.childNodes.forEach (function (element) {
		if (element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_DAY)) {
			selected.push(element);
		}
	});
	let not : Notification = createNotificationForTest(3);
	let result = component.findChildById(component.frequencyDiv.nativeElement.childNodes, "d_fri");
	expect(result).not.toEqual(null);
  });*/
  
  it('#validateMonthDay', () => {
	component.validateMonthDay(31);
	expect(component.monthDayStore).toBe(31);
	component.validateMonthDay(40);
	expect(component.monthDayStore).toBe(31);
  });
  
  it('#clearNotificationForm', () => {
	let array : Array<string> = new Array<string>();
	array["notId"] = 1;
	array["name"] = "TEST NAME";
	array["inc_chamber"] = 1;
	array["comment"] = "TEST COMMENT";
	array["datetime"] = new Date();
	component.notificationForm.setValue(array);
	component.clearNotificationForm(null);
	  
	expect(component.notificationForm.get("name").value).toBe(null);
	expect(component.notificationForm.get("inc_chamber").value).toBe(null);
	expect(component.notificationForm.get("comment").value).toBe(null);
	expect(component.monthDayStore).toBe(-1);
	expect(component.checkAllDaysDeselected()).toBe(true);
  });
  
  //handleGetNotifications
  
  it('#activateOrDeactivate', () => {
	let spy = spyOn(component, 'handleDesactivateNotification');
	component.activateOrDeactivate(2);
	expect(spy).toHaveBeenCalled();
  })
  
  //handleDesactivateNotification
  
  //error en subscribe
  /*it('#deleteNotification', () => {
	let spy = spyOn(component.notificationService, 'deleteNotification');
	component.deleteNotification(2);
	expect(spy).toHaveBeenCalled();
  });*/
  
  /*it('#startNotificationEdition', () => {
	component.startNotificationEdition(null, 1);
  })*/
  
  //deactivateAllEditionNotification
  
  /*it('#selectAppropiateReminder', () => {
	let reminder : NotificationReminder = new NotificationReminder();
	reminder.monday = true;
	let spy = spyOn(component, 'searchChildById');
	//let spy = spyOn(component, 'deselectAllPeriods');
	component.selectAppropiateReminder(reminder);
	expect(spy).toHaveBeenCalled();
  });*/
  
  //searchChildById
  //searchParentByClass
  
  it('#getWellForAlert', () => {
	expect(component.getWellForAlert(2)).toEqual("");
  })
  
  it('#getCommentForAlert', () => {
	  expect(component.getCommentForAlert(2)).toEqual("");
  });
  
  it('#selectEmbryo', () => {
	let embryo : Embryo = createEmbryo("3");
  	let spy = spyOn (NotificationsScreenComponent, "searchEmbryoIdInArray");
	component.selectEmbryo(embryo);
	expect(spy).toHaveBeenCalled();
  });
  
  
  //searchEmbryoIdInArray
  //searchNotificationAlertInArray
  //searchNotificationById
  
  
  
  
});
