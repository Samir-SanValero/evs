package com.fenomatch.evsclient.notification.bean;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.transaction.Transactional;

import com.fenomatch.evsclient.patient.bean.Dish;
import com.fenomatch.evsclient.patient.bean.Embryo;

//@Entity
@Transactional
public class NotificationsEmbryos {
    
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = Notification.class)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_notificationembryos_to_notification"))
    private Long idNotification;
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = Embryo.class)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_notificationembryos_to_embryo"))
    private Long idEmbryo;
    
    public Long getIdNotification () {
        return this.idNotification;
    }
    public void setIdNotification (Long value) {
        this.idNotification = value;
    }
    public Long getIdEmbryo() {
        return idEmbryo;
    }
    public void setIdEmbryo(Long idEmbryo) {
        this.idEmbryo = idEmbryo;
    }
    
    

}
