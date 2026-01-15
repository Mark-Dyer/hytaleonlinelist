package com.hytaleonlinelist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.oauth2.client.autoconfigure.OAuth2ClientAutoConfiguration;

@SpringBootApplication(exclude = {OAuth2ClientAutoConfiguration.class})
public class HytaleOnlineListApplication {

    public static void main(String[] args) {
        SpringApplication.run(HytaleOnlineListApplication.class, args);
    }
}
