package com.fenomatch.evsclient.notification.bean;

import java.time.Instant;
import java.util.List;

import com.fenomatch.evsclient.patient.bean.Embryo;

public class NotificationResponse {

    private Long id;
    private String name;
    private Long chamber;
    private String comment;
    private Instant creationDate;
    private Instant dateReminder;
    private NotificationReminder reminder;
    private boolean active;
    private List <Embryo> embryos;
    private boolean deleted;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public long getChamber() {
        return chamber;
    }
    public void setChamber(long chamber) {
        this.chamber = chamber;
    }
    public String getComment() {
        return comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
    public Instant getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }
    public Instant getDateReminder() {
        return dateReminder;
    }
    public void setDateReminder(Instant dateReminder) {
        this.dateReminder = dateReminder;
    }
    public NotificationReminder getReminder() {
        return reminder;
    }
    public void setReminder(NotificationReminder reminder) {
        this.reminder = reminder;
    }
    public boolean isActive() {
        return active;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
    public List <Embryo> getEmbryos() {
        return embryos;
    }
    public void setEmbryos(List <Embryo> embryos) {
        this.embryos = embryos;
    }
    public boolean isDeleted() {
        return deleted;
    }
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
    
    
}
