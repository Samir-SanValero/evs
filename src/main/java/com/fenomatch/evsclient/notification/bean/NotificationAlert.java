package com.fenomatch.evsclient.notification.bean;

import java.time.Instant;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.transaction.Transactional;

@Entity
@Transactional
public class NotificationAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Instant triggerDate;
    private boolean deleted;
    private Long notification_id;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Instant getTriggerDate() {
        return triggerDate;
    }
    public void setTriggerDate(Instant triggerDate) {
        this.triggerDate = triggerDate;
    }
    public Long getNotificationId () {
        return this.notification_id;
    }
    public void setNotificationId (Long id) {
        this.notification_id = id;
    }
    public boolean isDeleted() {
        return deleted;
    }
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
     
    
}
