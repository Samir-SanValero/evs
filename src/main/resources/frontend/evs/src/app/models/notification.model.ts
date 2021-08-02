
import { Embryo } from "./patient.model";

export class NotificationReminder {
    id : number;
    monday : boolean;
    tuesday : boolean;
    wednesday : boolean;
    thursday : boolean;
    friday : boolean;
    saturday : boolean;
    sunday : boolean;
    day : boolean;
    week : boolean;
    month : boolean;
    month_day : number;
    
    constructor () {
        this.id = null;
        this.monday = false;
        this.tuesday = false;
        this.wednesday = false;
        this.thursday = false;
        this.friday = false;
        this.saturday = false;
        this.sunday = false;
        this.day = false;
        this.week = false;
        this.month = false;
        this.month_day = -1;
    }
}

export class Notification {

    id : number;
    name : string;
    chamber : number;
    comment : string;
    creationDate : Date;
    dateReminder : Date;
    reminder : NotificationReminder;
    active : boolean;
    embryos : Array<Embryo>;
    deleted : boolean;
    alerts : Array<NotificationAlert>
    
    constructor() {}
}

export class NotificationAlert {
    id : number;
    triggerDate : Date;
    notificationId : number;
}

