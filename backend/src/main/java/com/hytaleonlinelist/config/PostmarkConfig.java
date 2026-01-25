package com.hytaleonlinelist.config;

import com.postmarkapp.postmark.Postmark;
import com.postmarkapp.postmark.client.ApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Postmark email service.
 */
@Configuration
public class PostmarkConfig {

    @Value("${postmark.api-token}")
    private String apiToken;

    @Bean
    public ApiClient postmarkApiClient() {
        return Postmark.getApiClient(apiToken);
    }
}
