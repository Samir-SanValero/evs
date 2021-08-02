package com.fenomatch.evsclient.notification.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fenomatch.evsclient.notification.bean.Notification;
import com.fenomatch.evsclient.notification.bean.NotificationAlert;
import com.fenomatch.evsclient.notification.bean.NotificationResponse;
import com.fenomatch.evsclient.notification.model.NotificationAlertModel;
import com.fenomatch.evsclient.notification.model.NotificationModel;

@RestController
public class NotificationController {
    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    
    @Value("${notifications.default.amountAlerts}")
    private Integer alertsAmount;

    @Autowired
    NotificationModel notificationModel;
    
    @Autowired
    NotificationAlertModel notificationAlertModel;
    
    /*
     * Creates one notification
     */
    @CrossOrigin(origins = {"http://localhost:4200"})
    @RequestMapping(value="/notifications/createUpdate", method = RequestMethod.POST, produces = "application/json")
    public Map <String, String> create (@Valid @RequestBody NotificationResponse res) {
        Map <String, String> result = new TreeMap <String, String> ();
        try {
            Notification notification = null;
            if (res.getId() != null) {
                var foundNotification = this.notificationModel.findById(res.getId());
                    if (foundNotification.isPresent()) {
                        notification = foundNotification.get();
                        notification.setName(res.getName());
                        notification.setChamber(res.getChamber());
                        notification.setComment(res.getComment());
                        notification.setCreationDate(res.getCreationDate());
                        notification.setDateReminder(res.getDateReminder());
                        notification.setReminder(res.getReminder());
                    } else if (res.getId() == null) {
                        notification = Notification.createFromResponse(res, null);
                    }
                    notificationModel.save(notification);
                    result.put("result", "ok");
                }
        }
        catch (Exception e) {
            log.error("NotificationController::create - Error creating notification:\n" + e.getMessage());
            result.put("result", "There was an error saving the notification.");
        }
        return result;
    }
    
    
    @CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4200", "http://localhost:4200"})
    @RequestMapping(value="/notifications/getAll", method = RequestMethod.GET, produces = "application/json")
    public List <NotificationResponse> getAll () {
        List <NotificationResponse> result = new ArrayList <NotificationResponse>();
        List <Notification> notifFromDb = this.notificationModel.findActive();
        for (Notification n : notifFromDb) {
            result.add(n.toNotificationResponse());
        }
        return result;
    }
    
    @CrossOrigin(origins = {"http://localhost:4200", "http://192.168.2.108:4200", "http://192.168.2.104:4200"})
    @RequestMapping(value="/notifications/enabledisable", method = RequestMethod.GET, produces = "application/json")
    public boolean disableNotification (Long id) {
        boolean result = false;
        var foundNotification = this.notificationModel.findById(id);

        if (foundNotification.isPresent()) {
            Notification not = foundNotification.get();
            boolean actual = not.isActive();
            if (actual) {
                not.setActive(false);
                result = true;
            } else {
                not.setActive(true);
                result = true;
            }
            this.notificationModel.save(not);
        }

        return result;
    }
    
    @CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4200", "http://localhost:4200"})
    @RequestMapping(value="/notifications/delete", method = RequestMethod.DELETE, produces = "application/json")
    public boolean deleteNotification (Long id) {
        boolean result = false;
        var foundNotification = this.notificationModel.findById(id);

        if (foundNotification.isPresent()) {
            Notification search = foundNotification.get();
            if (search.getId().equals(id)) {
                for (NotificationAlert a : search.getAlerts()) {
                    this.notificationAlertModel.deleteLogically(a.getId());
                }
                this.notificationModel.deleteLogically(id);
                result = true;
            }
        }
        return result;
    }
    
    @CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4200", "http://localhost:4200"})
    @RequestMapping(value="/notifications/getAlerts", method = RequestMethod.GET, produces = "application/json")
    public List <NotificationAlert>  getAlerts () {
        List <NotificationAlert> result = this.notificationAlertModel.findActiveNotificationAlertsLimited(this.alertsAmount);
        return result;
    }
    
    
    
    
    
}
