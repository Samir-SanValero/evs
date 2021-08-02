package com.fenomatch.evsclient.quartz.jobs;

import java.text.DateFormatSymbols;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.fenomatch.evsclient.notification.bean.Notification;
import com.fenomatch.evsclient.notification.bean.NotificationAlert;
import com.fenomatch.evsclient.notification.model.NotificationModel;

public class NotificationJob implements Job {
    private static final Logger log = LoggerFactory.getLogger(NotificationJob.class);
    
    @Autowired
    private NotificationModel notificationModel;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        List <Notification> notifications = this.listAll();
        for (Notification not : notifications) {
            try {
                this.checkNotificationAlert(not);
            } catch (Exception e) {
                log.error("Exception checking notification alert", e);
            }
        }
    }
    
    private List <Notification> listAll () {
        return this.notificationModel.findActive();
    }
    
    private void checkNotificationAlert(Notification not) throws NoSuchFieldException, SecurityException {
        log.info("Starting alert checkin...");
        Instant now = Instant.now();
        String dayOfWeek = getDayName(now.atZone(ZoneId.systemDefault()).getDayOfWeek().getValue() + 1, Locale.ENGLISH); //The name of the fields on db are in english
        String monthName = getMonthName(now.atZone(ZoneId.systemDefault()).getMonthValue() - 1, Locale.ENGLISH);
        int dayOfMonth = now.atZone(ZoneId.systemDefault()).getDayOfMonth();
        boolean isTodayActivated = this.isActivatedDayOfTheWeek(not, dayOfWeek);
        List <NotificationAlert> notificationAlertsToday =  this.searchAlert(not.getAlerts());
        if (isTodayActivated && notificationAlertsToday.size() == 0 && now.isAfter(not.getDateReminder())) {
            newNotification(not);
        }
        if (not.getReminder().isMonth() && not.getReminder().getMonth_day() == dayOfMonth && notificationAlertsToday.size() == 0  && now.isAfter(not.getDateReminder())) {
            newNotification(not);
        }
    }
    
    private boolean newNotification (Notification not) {
        boolean result = false;
        NotificationAlert newAlert = new NotificationAlert();
        newAlert.setTriggerDate(Instant.now());
        newAlert.setDeleted(false);
        not.getAlerts().add(newAlert);
        this.notificationModel.save(not);
        log.info("Alert created");
        result = true;
        return result;
    }
    
    public static String getDayName(int day, Locale locale) {
        DateFormatSymbols symbols = new DateFormatSymbols(locale);
        String[] dayNames = symbols.getWeekdays();
        return dayNames[day].toLowerCase();
    }
    
    public static String getMonthName(int month, Locale locale) {
        DateFormatSymbols symbols = new DateFormatSymbols(locale);
        String[] dayNames = symbols.getMonths();
        return dayNames[month].toLowerCase();
    }
    
    
    private boolean isActivatedDayOfTheWeek (Notification not, String name) {
        boolean result = false;
        
        switch (name) {
        case "monday":
            result = not.getReminder().isMonday();
            break;
        case "tuesday":
            result = not.getReminder().isTuesday();
            break;
        case "wednesday":
            result = not.getReminder().isWednesday();
            break;
        case "thursday":
            result = not.getReminder().isThursday();
            break;
        case "friday":
            result = not.getReminder().isFriday();
            break;
        case "saturday":
            result = not.getReminder().isSaturday();
            break;
        case "sunday":
            result = not.getReminder().isSunday();
            break;
        default:
            //If the day is not correct we must return false to avoid program continuation
            break;
        }
        return result;
    }
    
    
    
    private List<NotificationAlert> searchAlert (List <NotificationAlert> alerts) {
        List<NotificationAlert> result = new ArrayList <NotificationAlert>();
        LocalDate now = LocalDate.now();
        LocalDate alertLocalDate = null;
        for (NotificationAlert al : alerts) {
            alertLocalDate = LocalDate.ofInstant(al.getTriggerDate(), ZoneId.systemDefault());
            if (now.isEqual(alertLocalDate)) {
                result.add(al);
            }
        }
        return result;
    }

}
