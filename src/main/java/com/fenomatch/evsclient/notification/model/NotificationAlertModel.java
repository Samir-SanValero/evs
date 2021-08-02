package com.fenomatch.evsclient.notification.model;

import com.fenomatch.evsclient.notification.bean.NotificationAlert;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface NotificationAlertModel extends CrudRepository<NotificationAlert, Long>{

    @Override
    NotificationAlert save(NotificationAlert notificationAlert);
    
    @Override
    void deleteById(Long id);

    @Override
    void delete(NotificationAlert notification);
    
    @Query (value="SELECT * FROM notification_alert WHERE deleted = 0 ORDER BY trigger_date DESC LIMIT ?#{[0]}", nativeQuery = true )
    List <NotificationAlert> findActiveNotificationAlertsLimited(int amountAlerts);
    
    @Query(value = "UPDATE notification_alert SET deleted = 1 WHERE id = ?#{[0]}", nativeQuery = true)
    void deleteLogically(Long id);

}
