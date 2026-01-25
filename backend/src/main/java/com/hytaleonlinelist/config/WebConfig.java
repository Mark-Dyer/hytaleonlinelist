package com.hytaleonlinelist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration.
 *
 * Note: CORS is configured in SecurityConfig.java using the FRONTEND_URL environment variable.
 * Do not add CORS configuration here as it will conflict with Spring Security's CORS handling.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS is handled by SecurityConfig.corsConfigurationSource()
    // which uses the app.frontend-url property from environment variables
}
