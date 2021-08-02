package com.fenomatch.evsclient.notification.bean;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.transaction.Transactional;


@Entity
@Transactional
public class NotificationReminder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean monday;
    private boolean tuesday;
    private boolean wednesday;
    private boolean thursday;
    private boolean friday;
    private boolean saturday;
    private boolean sunday;
    private boolean day;
    private boolean week;
    private boolean month;
    private int month_day;
    
    public boolean isMonday() {
        return monday;
    }
    public void setMonday(boolean monday) {
        this.monday = monday;
    }
    public boolean isTuesday() {
        return tuesday;
    }
    public void setTuesday(boolean tuesday) {
        this.tuesday = tuesday;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public boolean isWednesday() {
        return wednesday;
    }
    public void setWednesday(boolean wednesday) {
        this.wednesday = wednesday;
    }
    public boolean isThursday() {
        return thursday;
    }
    public void setThursday(boolean thursday) {
        this.thursday = thursday;
    }
    public boolean isFriday() {
        return friday;
    }
    public void setFriday(boolean friday) {
        this.friday = friday;
    }
    public boolean isSaturday() {
        return saturday;
    }
    public void setSaturday(boolean saturday) {
        this.saturday = saturday;
    }
    public boolean isSunday() {
        return sunday;
    }
    public void setSunday(boolean sunday) {
        this.sunday = sunday;
    }
    public boolean isDay() {
        return day;
    }
    public void setDay(boolean day) {
        this.day = day;
    }
    public boolean isWeek() {
        return week;
    }
    public void setWeek(boolean week) {
        this.week = week;
    }
    public boolean isMonth() {
        return month;
    }
    public void setMonth(boolean month) {
        this.month = month;
    }
    public int getMonth_day() {
        return month_day;
    }
    public void setMonth_day(int month_day) {
        this.month_day = month_day;
    }
}
