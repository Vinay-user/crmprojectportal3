package com.crm.portal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CrmPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmPortalApplication.class, args);
    }
}
