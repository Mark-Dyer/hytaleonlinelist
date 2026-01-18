package com.hytaleonlinelist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration for scheduled tasks and async processing
 */
@Configuration
@EnableScheduling
@EnableAsync
public class SchedulingConfig {
    // Spring Boot auto-configures a TaskScheduler and AsyncTaskExecutor
    // Default thread pools are sufficient for our server status monitoring
}
