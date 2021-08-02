package com.fenomatch.evsclient.notification.model;

import com.fenomatch.evsclient.notification.bean.Notification;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface NotificationModel extends CrudRepository<Notification, Long>{

    @Override
    Notification save(Notification notification);
    
    @Query(value = "SELECT * FROM notification WHERE deleted = 0 ORDER BY date_reminder DESC", nativeQuery = true)
    List<Notification> findActive();

    @Override
    void deleteById(Long id);

    @Override
    void delete(Notification notification);
    
    @Query(value = "UPDATE notification SET deleted = 1 WHERE id = ?#{[0]}", nativeQuery = true)
    void deleteLogically(Long id);
    
}
