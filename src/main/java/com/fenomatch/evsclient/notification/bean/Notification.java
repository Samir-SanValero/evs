package com.fenomatch.evsclient.notification.bean;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fenomatch.evsclient.patient.bean.Embryo;
import com.fenomatch.evsclient.patient.model.EmbryoModel;

@Entity
@Transactional
public class Notification {
    private static final Logger log = LoggerFactory.getLogger(Notification.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
//    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = Dish.class)
//    @JoinColumn(foreignKey=@ForeignKey(name = "fk_notification_to_dish"))
    private Long chamber;
    private String comment;
    private Instant creationDate;
    private Instant dateReminder;
    
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = NotificationReminder.class)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_notification_to_reminder"))
    private NotificationReminder reminder;
    private boolean active;
    @ManyToMany (cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = Embryo.class)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_notification_to_embryo"))
    private Set <Embryo> embryos;
    private boolean deleted;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = NotificationAlert.class)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_notification_to_alert"), name = "notification_id")
    private List <NotificationAlert> alerts;
    
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
    public boolean isDeleted() {
        return deleted;
    }
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
    public Set<Embryo> getEmbryos() {
        return new HashSet<Embryo>(this.embryos);
    }
    public void setEmbryos(Set<Embryo> embryos) {
        this.embryos = new HashSet<Embryo>(embryos);
    }
    public List<NotificationAlert> getAlerts() {
        return alerts;
    }
    public void setAlerts(List<NotificationAlert> alerts) {
        this.alerts = alerts;
    }
    
    
    public NotificationResponse toNotificationResponse () {
        NotificationResponse result = new NotificationResponse();
        result.setId(this.getId());
        result.setName(this.getName());
        result.setChamber(this.getChamber());
        result.setComment(this.getComment());
        result.setCreationDate(this.getCreationDate());
        result.setDateReminder(this.getDateReminder());
        result.setReminder(this.getReminder());
        result.setActive(this.isActive());
        result.setEmbryos(new ArrayList<Embryo>(this.getEmbryos()));
        return result;
    }
    
    public static Notification createFromResponse (NotificationResponse res, EmbryoModel em) {
        Notification result = new Notification ();
        result.setId(res.getId());
        result.setName(res.getName());
        result.setChamber(res.getChamber());
        result.setComment(res.getComment());
        result.setCreationDate(res.getCreationDate());
        result.setDateReminder(res.getDateReminder());
        result.setReminder(res.getReminder());
        result.setActive(res.isActive());
        
        Set <Embryo> group = new HashSet<Embryo>();
        for (Embryo e : res.getEmbryos()) {
        	Embryo fromdb = em.findById(e.getId()).get();
        	if (fromdb != null) {
        		group.add(fromdb);
        	}
        }
        result.setEmbryos(group);
        return result;
    }
    
}
