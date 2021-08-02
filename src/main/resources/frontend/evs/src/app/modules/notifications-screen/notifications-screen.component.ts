import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Notification, NotificationReminder, NotificationAlert } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { ConfigService } from '../../services/config/config.service';
import { Embryo } from '../../models/patient.model';
import { Subscription } from 'rxjs';
import { AlertService } from '../../components/_alert';
import { HeaderComponent } from '../common/header/header.component'; 

@Component({
  selector: 'app-notifications-screen',
  templateUrl: './notifications-screen.component.html',
  styleUrls: ['./notifications-screen.component.scss']
})



export class NotificationsScreenComponent implements OnInit {
    
  public static FORMAT_DATES = "dd/MM/YYYY hh:mm:ss";
  
  public static CLASS_SELECTED_DAY = "inf-cll-day-selected";
  public static CLASS_SELECTED_PERIOD = "inf-cll-period-selected";
  public static CLASS_SUBPANEL = "sub-pnl-brdr";
  public static CLASS_SUBPANEL_SELECTED = "sub-pnl-brdr-slct";
  
  public static TIME_BETWEEN_CHECKING_ALERTS = 10000;
  
  //Direct link to the div that contains the day frequency
  @ViewChild("daysDiv") public daysDiv;
  //Direct link to the div that contains the frequequency (daily...)
  @ViewChild("frequencyDiv") public frequencyDiv;
  //Direct link to the div that contains the frequequency monthly (bevause this field is special)
  @ViewChild("monthly") public monthlyDiv;
  //Direct link to the div that contains the frequequency (daily...)
  @ViewChild("monthlyDay") public monthlyDay;
  //Direct link to the div that contains the frequequency (daily...)
  @ViewChild("picker") public picker;
  //Direct link to the div that contains the notifications
  @ViewChild("notificationContainer") public notificationsDiv;
  //Direct link to the div that contains the notifications
  @ViewChild("EmbryoSelector") public embryoSelector;
  //Direct link to header
  @ViewChild("header") public header : HeaderComponent;

  notificationForm : FormGroup;
  notificationFormSubmited : boolean;
  
  monthDayStore : number;
  notificationList : Array<Notification>;
  
  popoverTitle = 'Delete confirmation';
  popoverMessage = 'Do you really want to delete the notification?';
//  confirmClicked = false;
  cancelClicked = false;
  alertsToShow : Array <NotificationAlert>;
  embryosSelected : Array<Embryo>;
  timeoutId : number;
  firstExecution : boolean;
  
  /**
   * Constructor. Receives the services it is going to use. and configure some initial variables
   */
  constructor(private formBuilder: FormBuilder,
      public notificationService : NotificationService) {
    this.notificationForm = this.formBuilder.group({
        notId: new FormControl (),
        name: new FormControl("", [Validators.required]),
        inc_chamber: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
        comment: new FormControl("", [Validators.required]),
        datetime: new FormControl("", [Validators.required]),
    });
    this.notificationFormSubmited = false;
    this.monthDayStore = -1;
 }
 
 /**
  * Getters to access some values in the html.
  */
  get name() { return this.notificationForm.get('name'); }
  get inc_chamber() { return this.notificationForm.get('inc_chamber'); }
  get comment() { return this.notificationForm.get('comment'); }
  get datetime() { return this.notificationForm.get('datetime'); }

  /**
   * Called after constructor. Calls the funcion to obtain from the server the notifications
   * in the db.
   */
  ngOnInit(): void {
    this.loadNotifications();
    this.alertsToShow = new Array <NotificationAlert>();
    this.timeoutId = setInterval(function () {
    	this.loadAlerts();
    }.bind(this), 10000);
    this.embryosSelected = new Array<Embryo>();
    this.firstExecution = true;
  }
  
  /**
   * Makes an ajax query (using "notificationService") to obtain the notifications, and sends the response to 
   * correspondent handle function
  */
  loadNotifications () : void {
    var subs : Subscription = this.notificationService.getNotifications().subscribe (
        response => this.handleGetNotifications(response, subs),
        error => this.handleGetNotifications(null, subs),
    );
  }
  
  /**
   * Load alerts to be shown from server
   */
  loadAlerts() {
    var subs : Subscription = this.notificationService.getNotificationsWithAlertsFiltered().subscribe (
        response => this.handleGetAlerts(response, subs),
        error => this.handleGetAlerts(null, subs),
    );
  }
  
  /**
   * Called when the new notification form is submited.
   * If all the fields are valid, it extracts more information and composes the object
   * to be send to Spring Boot. 
   */
  onSubmit($event) : void {
    this.notificationFormSubmited = true;
    if (this.notificationForm.valid) {
        var notification : Notification = new Notification();
        var id = this.notificationForm.get("notId").value;
        notification.id = (id != -1 && id != "") ? id : null;
        notification.name = this.notificationForm.get("name").value as string;
        notification.chamber = this.notificationForm.get("inc_chamber").value as number;
        notification.comment = this.notificationForm.get("comment").value as string;
        notification.dateReminder = new Date (this.notificationForm.get("datetime").value as string);
        notification.creationDate = new Date(Date.now());
        notification.reminder = new NotificationReminder();
        notification.active = true;
        notification.embryos = this.embryosSelected;
        notification.deleted = false;
        this.getSelectedDayInNotification(notification);
        this.getSelectedPeriodInNotification(notification);
        notification.reminder.month_day = this.monthlyDay.nativeElement.children[0].value;
        var subs : Subscription = this.notificationService.createNotification(notification).subscribe(
            response => this.handleCreationResponse (response, subs),
            error => this.handleCreationResponse (error, subs)
        );
    }
  }
  
  /**
   * Called when the server returns the response of notification creation
   * Shows a message depending on the result.
   */
  handleCreationResponse (response, subs : Subscription) : void {
    var wordAction = "created";
    if (this.notificationForm.get("notId").value != null && this.notificationForm.get("notId").value != -1) {
        wordAction = "updated";
    }
    if (response != null && response.result == "ok" ) {
    	this.header.showAlert('The notification was ' + wordAction + ' correctly.');
    } else {
    	this.header.showAlert(response.result);
    }
    if (subs !== undefined) { //For tests
    	subs.unsubscribe();
    }
    this.loadNotifications();
    this.clearNotificationForm(null);
  }
  
  /**
   * Function that recevices the id to kwnow which element has been clicked
   * Adequates styles to the correspondent div (to iluminate it or not) 
   */
  selectDay (selectorId : string) : void {
    var element = this.daysDiv.nativeElement.querySelector("#" + selectorId);
    if (element.classList.contains (NotificationsScreenComponent.CLASS_SELECTED_DAY)) { //Desactivate
        element.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_DAY);
        var p_day = this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_day");
        if (p_day != null) {
            p_day.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
        }
        if (this.checkAllDaysDeselected()) {
            var p_week = this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_week");
            if (p_week != null) {
            p_week.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
        }
        }
    } else {
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY); //Activate
        if (this.checkAllDaysSelected()) {
            var p_day = this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_day");
            if (p_day != null) {
                p_day.classList.add(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
            }  
        }
    }
  }
  /**
   * Check if all days are selected
   */
  checkAllDaysSelected () : boolean {
    var result : boolean = true;
        this.daysDiv.nativeElement.childNodes.forEach (function (element) {
            if (!element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_DAY)) {
                result = false;
            }
        });
    return result;
  }  
  
  /**
   * check if none of the days are selected
   */
  checkAllDaysDeselected () : boolean {
    var result : boolean = true;
        this.daysDiv.nativeElement.childNodes.forEach (function (element) {
            if (element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_DAY)) {
                result = false;
            }
        });
    return result;
  }  
  
  /**
   * Depending on the day (and period) selected, this function introduces the 
   * correct values on the notification object
   */
  getSelectedDayInNotification (notification : Notification) : void {
    var selected : Array<HTMLElement> = new Array<HTMLElement>();
    this.daysDiv.nativeElement.childNodes.forEach (function (element) {
        if (element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_DAY)) {
            selected.push(element);
        }
    });
    if (selected.length > 0) {
        NotificationsScreenComponent.convertDayIdToDayNameWithNotification(selected, notification);
    }
  }
  
  /**
   * Removes the "selected style" from all day divs (period)
   */
  private deselectAllDays () : void {
    this.daysDiv.nativeElement.childNodes.forEach (function (element) {
        element.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    })
  }
  /**
   * Adds the "selected style" from all day divs (period)
   */
  private selectAllDays () : void {
    this.daysDiv.nativeElement.childNodes.forEach (function (element) {
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    })
  }
  
  /**
   * Called when a period is clicked. 
   * It manages the styles to make a correct functioning
   */
  selectPeriod (selectorId : string) : void {
    
    var element = this.frequencyDiv.nativeElement.querySelector("#" + selectorId);
    if (!element.classList.contains (NotificationsScreenComponent.CLASS_SELECTED_PERIOD)) { //activating
        if(selectorId == "p_week") {
            this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_month").classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
        } else if(selectorId == "p_day") {
            this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_month").classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
            this.selectAllDays();
        } else if(selectorId == "p_month") {
            this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_week").classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
            this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_day").classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
            this.deselectAllDays();
            this.monthlyDiv.nativeElement.style = "display:none;";
            this.monthlyDay.nativeElement.style = "display:flex;";
        }
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
    } else {
        element.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
        if(selectorId == "p_week") {
            //Do nothing
        } else if(selectorId == "p_day") {
            this.deselectAllDays();
        } else if(selectorId == "p_month") {
            this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_week").classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
            this.findChildById(this.frequencyDiv.nativeElement.childNodes, "p_day").classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
        }
        
    }
  }
  
  /**
   * Depending on which period elements are selected, introduces the
   * correct information on the notification object
   */
  getSelectedPeriodInNotification (notification : Notification) : void {
    var result : Array<HTMLElement> = new Array<HTMLElement>();
    var monthDay : number = -1;
    this.frequencyDiv.nativeElement.childNodes.forEach (function (element) {
        if (element.classList.contains(NotificationsScreenComponent.CLASS_SELECTED_PERIOD)) {
            result.push(element);
        }
    });
    if (this.monthlyDay.nativeElement.children.length > 0) {
        monthDay = this.monthlyDay.nativeElement.children[0].value;
    }
     NotificationsScreenComponent.convertPeriodIdToPeriodName(result, notification);
  }
  
  /**
   * Removes the "selected stlye" from all period divs
   */
  private deselectAllPeriods () : void {
    this.frequencyDiv.nativeElement.childNodes.forEach (function (element) {
        element.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
    })
  }
  
  /**
   * Depending on the day selector actives the correspondent field on the notification object
   */
  public static convertDayIdToDayNameWithNotification (selectedDays : Array<HTMLElement>, notification : Notification) : void {
    selectedDays.forEach(function (element) {
        switch (element.id.toLowerCase()) {
            case "d_mon":
            case "mon":
                notification.reminder.monday = true;
            break;
            
            case "d_tue":
            case "tue":
                notification.reminder.tuesday = true;
            break;
            
            case "d_wed":
            case "wed":
                notification.reminder.wednesday = true;
            break;
            
            case "d_thu":
            case "thu":
                notification.reminder.thursday = true;
            break;
            
            case "d_fri":
            case "fri":
                notification.reminder.friday = true;
            break;
            
            case "d_sat":
            case "sat":
                notification.reminder.saturday = true;
            break;
            
            case "d_sun":
            case "sunday":
                notification.reminder.sunday = true;
            break;
        }
    });
  }
  
  /**
   * Depending on the periods selected, activates the correspondent fields in notification object
   */
  public static convertPeriodIdToPeriodName (selected : Array<HTMLElement>, notification : Notification) : string {
    var result : string = null;
    selected.forEach(function (element){
        switch (element.id.toLowerCase()) {
            case "p_day":
            case "day":
                result = "day"
                notification.reminder.day = true;
            break;
            
            case "p_week":
            case "week":
                result = "week";
                notification.reminder.week = true;
            break;
            
            case "p_month":
            case "month":
                result = "month";
                notification.reminder.month = true;
//                notification.reminder.month_day = 
            break;
        }
    });
    if (result != null)
        return result.toLowerCase();
    return null;
  }
  
  /**
   * Returns the child element which has the id passed as argument
   */
  public findChildById (children : NodeList, id : string) : HTMLElement {
    var result : HTMLElement = null;
    if (children != null) {
        children.forEach(function (element : HTMLElement) {
            if (element.id == id) {
                result = element;
            }
        });
    }
    return result;
  }

  /**
   * Checks if the number introduced in the month special field is correct
   */
  validateMonthDay(value : number) : void {
    this.monthlyDiv.nativeElement.style = "display:flex;";
    this.monthlyDay.nativeElement.style = "display:none;";
    if (value < 1 || value > 31 || value == NaN) {
        var element = this.frequencyDiv.nativeElement.querySelector("#p_month");
        element.classList.remove(NotificationsScreenComponent.CLASS_SELECTED_PERIOD); //Remove selected style
    } else {
    	this.monthDayStore = value;
    }
    
  }
  
  /**
   * Resets all form elements
   */
  clearNotificationForm(event) : void {
    if (event != null) {
        event.preventDefault();
    }
    this.notificationForm.reset();
    this.notificationFormSubmited = false;
    this.monthDayStore = -1;
    this.monthlyDiv.nativeElement.style = "display:flex;";
    this.monthlyDay.nativeElement.style = "display:none;";
    this.deselectAllDays();
    this.deselectAllPeriods();
    this.deactivateAllEditionNotification();
    this.embryosSelected = new Array<Embryo>();
    this.embryoSelector.reset();
  }
  
  /**
   * Called after getting the subscriptions from server
   */
  handleGetNotifications (response : Array<Notification>, subscription : Subscription) : void {
    this.notificationList = response;
    if (subscription !== undefined) {
    	subscription.unsubscribe();
    }
  }
  
  /**
   * Called after getting the alerts from server
   */
  handleGetAlerts (response: Array<NotificationAlert>, subscription : Subscription) {
	var alertsToNotificate : Array <NotificationAlert> = new Array<NotificationAlert>();
	var newArray : Array <NotificationAlert> = new Array<NotificationAlert>();
  	response.forEach (function (element : NotificationAlert) {
  		newArray.push(element);
  		if (!NotificationsScreenComponent.searchNotificationAlertInArray(this.alertsToShow, element)) {
  			alertsToNotificate.push (element);
  		}
  	}.bind(this));
    this.alertsToShow = newArray;
    if (subscription !== undefined) {
    	subscription.unsubscribe();
    }
    
    var notificationText : string = "";
	alertsToNotificate.forEach (function (alert : NotificationAlert) {
		var notification : Notification = NotificationsScreenComponent.searchNotificationById(this.notificationList, alert.notificationId);
		notificationText += "New alert, well " + notification.chamber + " - " + notification.comment + "\n"; 
	}.bind(this));
	
	if (!this.firstExecution) { //Avoid the first time the page is loaded showing all alerts at the same time.
		if (notificationText !== "") {
			this.header.showAlert(notificationText);
		}
	} else {
		this.firstExecution = false;
	}
  }
  
  
  /**
   * Makes an ajax query to activate or desactivate the notification state
   */
  activateOrDeactivate(value) : void {
        var subs : Subscription = this.notificationService.changeActiveNotification(value).subscribe(
            response => this.handleDesactivateNotification (response, subs),
            error => this.handleDesactivateNotification (null, subs),
        );
  }
  
  /**
   * Called when the activation or deactivation of a notification has finished and
   * manages the result returned.
   */
  handleDesactivateNotification (response, subs : Subscription) : void {
    if (response == null) {
    	this.header.showAlert("Threre was an error disactivating / activating the selected notification");
    } else {
    	this.header.showAlert("The notification was enabled / disabled correctly.");
    }
    if (subs !== undefined) {
    	subs.unsubscribe();
    }
  }

  deleteNotification(id : number) : void {
    var subs : Subscription = this.notificationService.deleteNotification(id).subscribe(
        response => { 
        	this.header.showAlert('Notification was deleted correctly.'); 
        	if (subs !== undefined) {
        		subs.unsubscribe(); 
        	}
        	this.loadNotifications(); 
        	this.loadAlerts(); 
        },
        error => { 
        	this.header.showAlert('There was an error deleting notification.');
        	if (subs !== undefined) {
        		subs.unsubscribe(); 
        	}
        }
    );
  }
  
  
  startNotificationEdition(event, index : number) {
    this.deactivateAllEditionNotification();
    var element : HTMLElement = this.searchParentByClass(event.originalTarget, NotificationsScreenComponent.CLASS_SUBPANEL);
    if (element == null) {
        element = this.searchParentByClass(event.originalTarget, NotificationsScreenComponent.CLASS_SUBPANEL_SELECTED);
    }
    
    if (element != null) {
        if (element.classList.contains(NotificationsScreenComponent.CLASS_SUBPANEL)) {
            element.classList.remove(NotificationsScreenComponent.CLASS_SUBPANEL);
            element.classList.add(NotificationsScreenComponent.CLASS_SUBPANEL_SELECTED);
        } else {
            element.classList.remove(NotificationsScreenComponent.CLASS_SUBPANEL_SELECTED);
            element.classList.add(NotificationsScreenComponent.CLASS_SUBPANEL);
        }
    }
    
    this.notificationList[index].embryos.forEach (function (element : Embryo) {
    	this.embryoSelector.selectEmbryo(element);
    }.bind(this));
    
    this.notificationForm.get("notId").setValue(this.notificationList[index].id);
    this.notificationForm.get("name").setValue(this.notificationList[index].name);
    this.notificationForm.get("inc_chamber").setValue(this.notificationList[index].chamber);
    this.notificationForm.get("comment").setValue(this.notificationList[index].comment);
    this.notificationForm.get("datetime").setValue(this.notificationList[index].dateReminder);
    this.selectAppropiateReminder(this.notificationList[index].reminder);
  }
  
  deactivateAllEditionNotification () {
    var childs = this.notificationsDiv.nativeElement.childNodes;
    childs.forEach (function (element) {
        if(typeof element.classList !== 'undefined') {
            if (element.classList.contains(NotificationsScreenComponent.CLASS_SUBPANEL_SELECTED)) {
                element.classList.remove(NotificationsScreenComponent.CLASS_SUBPANEL_SELECTED);
                element.classList.add(NotificationsScreenComponent.CLASS_SUBPANEL);
            }
        }
    })
  }
  
  selectAppropiateReminder (reminder : NotificationReminder) {
    this.deselectAllDays();
    this.deselectAllPeriods();
    var element : HTMLElement = null;
    var node = this.daysDiv;
    if (reminder.monday) {
        element = this.searchChildById(node.nativeElement, "d_mon");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.tuesday) {
        element = this.searchChildById(node.nativeElement, "d_tue");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.wednesday) {
        element = this.searchChildById(node.nativeElement, "d_wed");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.thursday) {
        element = this.searchChildById(node.nativeElement, "d_thu");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.friday) {
        element = this.searchChildById(node.nativeElement, "d_fri");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.saturday) {
        element = this.searchChildById(node.nativeElement, "d_sat");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.sunday) {
        element = this.searchChildById(node.nativeElement, "d_sun");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_DAY);
    } 
    if (reminder.day) {
        element = this.searchChildById(this.frequencyDiv.nativeElement, "p_day");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
    } 
    if (reminder.week) {
        element = this.searchChildById(this.frequencyDiv.nativeElement, "p_week");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
    } 
    if (reminder.month) {
        element = this.searchChildById(this.frequencyDiv.nativeElement, "p_month");
        element.classList.add(NotificationsScreenComponent.CLASS_SELECTED_PERIOD);
    }
    
    
  }
  
  private searchChildById (node : HTMLElement, id : string) : HTMLElement {
    var result : HTMLElement = null;
    node.childNodes.forEach(function (element : HTMLElement) {
        if (element.id == id) {
            result = element as HTMLElement;
        }
    });
    return result;
  }
  
  private searchParentByClass (node : HTMLElement, className : string) : HTMLElement {
    var result : HTMLElement = null;
    var element = node.parentElement;
    while ( element != null) {
        if (element.classList.contains (className)) {
            result = element;
        }
        element = element.parentElement;
    }
    return result;
  }
  
  getWellForAlert (notificationId : number) : string {
    var result : string = "";
     this.notificationList.forEach(function (element : Notification) {
        if (element.id == notificationId) {
            result += "WELL " + element.chamber;
        }
    })
    return result;
  }
  
  getCommentForAlert (notificationId : number) : string {
    var result : string = "";
     this.notificationList.forEach(function (element : Notification) {
        if (element.id == notificationId) {
            result = element.comment;
        }
    })
    return result;
  }
  
  selectEmbryo(event : Embryo) {
	  if (this.embryosSelected === null || typeof this.embryosSelected === "undefined") {
		  this.embryosSelected = new Array<Embryo>();
	  }
	  if (!NotificationsScreenComponent.searchEmbryoIdInArray(this.embryosSelected, event.id)) { //Add
		  this.embryosSelected.push(event as Embryo);
	  } else {
		  this.embryosSelected = this.embryosSelected.filter(emb => emb.id != event.id); //Remove from list
	  }
  }
  
  public static searchEmbryoIdInArray (list : Array<Embryo>, id : string) : boolean {
	  var result = false;
	  list.forEach (function (element : Embryo) {
		  if (element.id == id) {
			  result = true;
		  }
	  });
	  return result;
  }
  
  public static searchNotificationAlertInArray (array : Array<NotificationAlert>, alert : NotificationAlert) : boolean {
	  //TODO: array tiene longitud 0
	  var result = false;
	  array.forEach (function (element) {
		  if (element.id == alert.id) {
			  result = true;
		  }
	  });
	  return result;
  }
  
  
  /**
   * In a notification array returns the notification identified by the id. 
   * @return Notification | null
   */
  public static searchNotificationById (array : Array<Notification>, id : number) : Notification {
	  var result = null;
	  array.forEach (function (element : Notification) {
		  if (element.id == id) {
			  result = element;
		  }
	  });
	  return result;
  }
  
}


