package com.fenomatch.evsclient.quartz;

import com.fenomatch.evsclient.quartz.jobs.MediaJob;
import com.fenomatch.evsclient.quartz.jobs.NotificationJob;

import org.quartz.JobDetail;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;
import org.quartz.spi.JobFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.quartz.JobDetailFactoryBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.scheduling.quartz.SimpleTriggerFactoryBean;

import java.io.IOException;
import java.util.Properties;

@Configuration
public class SchedulerConfiguration {

    @Value("${job.media.repeat.interval}")
    private Integer mediaJobInterval;
    
    @Value("${job.notification.repeat.interval}")
    private Integer notificationJobInterval;

// GENERAL
    @Bean
    public JobFactory jobFactory(ApplicationContext applicationContext) {
        SpringJobFactory jobFactory = new SpringJobFactory();
        jobFactory.setApplicationContext(applicationContext);
        return jobFactory;
    }

    @Bean
    public SchedulerFactoryBean schedulerFactoryBean(JobFactory jobFactory,
                                                      @Qualifier ("mediaJobTrigger") Trigger simpleJobTrigger,
                                                      @Qualifier ("notificationJobTrigger") Trigger simpleJobTrigger2) throws IOException {
        SchedulerFactoryBean factory = new SchedulerFactoryBean();
        factory.setJobFactory(jobFactory);
        factory.setQuartzProperties(quartzProperties());
        factory.setTriggers(simpleJobTrigger, simpleJobTrigger2);
        System.out.println("starting jobs....");
        return factory;
    }

    @Bean
    public Properties quartzProperties() throws IOException {
        PropertiesFactoryBean propertiesFactoryBean = new PropertiesFactoryBean();
        propertiesFactoryBean.setLocation(new ClassPathResource("quartz.properties"));
        propertiesFactoryBean.afterPropertiesSet();
        return propertiesFactoryBean.getObject();
    }

// MEDIA SCAN JOB
    @Bean
    public SimpleTriggerFactoryBean mediaJobTrigger(@Qualifier("mediaJobDetail") JobDetail jobDetail) {
        System.out.println("simpleJobTrigger");
        SimpleTriggerFactoryBean factoryBean = new SimpleTriggerFactoryBean();
        factoryBean.setJobDetail(jobDetail);
        factoryBean.setStartDelay(0L);
        factoryBean.setRepeatInterval(mediaJobInterval * 1000L);
        factoryBean.setRepeatCount(SimpleTrigger.REPEAT_INDEFINITELY);
        return factoryBean;
    }

    @Bean
    public JobDetailFactoryBean mediaJobDetail() {
        JobDetailFactoryBean factoryBean = new JobDetailFactoryBean();
        factoryBean.setJobClass(MediaJob.class);
        factoryBean.setDurability(true);
        return factoryBean;
    }
    
    
    @Bean
    public SimpleTriggerFactoryBean notificationJobTrigger(@Qualifier("notificationJobDetail") JobDetail jobDetail) {
        SimpleTriggerFactoryBean factoryBean = new SimpleTriggerFactoryBean();
        factoryBean.setJobDetail(jobDetail);
        factoryBean.setStartDelay(0L);
        factoryBean.setRepeatInterval((long)notificationJobInterval * 1000);
        factoryBean.setRepeatCount(SimpleTrigger.REPEAT_INDEFINITELY);
        return factoryBean;
    }

    @Bean
    public JobDetailFactoryBean notificationJobDetail() {
        JobDetailFactoryBean factoryBean = new JobDetailFactoryBean();
        factoryBean.setJobClass(NotificationJob.class);
        factoryBean.setDurability(true);
        return factoryBean;
    }
}
