package com.hytaleonlinelist.health;

import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Health indicator for scheduled tasks.
 * Tracks when scheduled tasks last ran successfully.
 */
@Component
public class ScheduledTasksHealthIndicator implements HealthIndicator {

    private final AtomicReference<Instant> lastServerPingTime = new AtomicReference<>();
    private final AtomicReference<Instant> lastCleanupTime = new AtomicReference<>();
    private final AtomicReference<Instant> lastUptimeCalculationTime = new AtomicReference<>();

    // Maximum age before considering a scheduled task as stale
    private static final long SERVER_PING_MAX_AGE_MINUTES = 5;
    private static final long CLEANUP_MAX_AGE_HOURS = 25;
    private static final long UPTIME_CALC_MAX_AGE_HOURS = 2;

    @Override
    public Health health() {
        Health.Builder builder = Health.up();

        Instant now = Instant.now();

        // Check server ping task (runs every 60 seconds)
        Instant lastPing = lastServerPingTime.get();
        if (lastPing != null) {
            long minutesAgo = java.time.Duration.between(lastPing, now).toMinutes();
            builder.withDetail("serverPing.lastRun", lastPing.toString());
            builder.withDetail("serverPing.minutesAgo", minutesAgo);

            if (minutesAgo > SERVER_PING_MAX_AGE_MINUTES) {
                builder.status("DEGRADED");
                builder.withDetail("serverPing.status", "STALE");
            } else {
                builder.withDetail("serverPing.status", "OK");
            }
        } else {
            builder.withDetail("serverPing.status", "NOT_YET_RUN");
        }

        // Check cleanup task (runs daily at 3 AM)
        Instant lastCleanup = lastCleanupTime.get();
        if (lastCleanup != null) {
            long hoursAgo = java.time.Duration.between(lastCleanup, now).toHours();
            builder.withDetail("cleanup.lastRun", lastCleanup.toString());
            builder.withDetail("cleanup.hoursAgo", hoursAgo);

            if (hoursAgo > CLEANUP_MAX_AGE_HOURS) {
                builder.withDetail("cleanup.status", "STALE");
            } else {
                builder.withDetail("cleanup.status", "OK");
            }
        } else {
            builder.withDetail("cleanup.status", "NOT_YET_RUN");
        }

        // Check uptime calculation task (runs hourly)
        Instant lastUptime = lastUptimeCalculationTime.get();
        if (lastUptime != null) {
            long hoursAgo = java.time.Duration.between(lastUptime, now).toHours();
            builder.withDetail("uptimeCalculation.lastRun", lastUptime.toString());
            builder.withDetail("uptimeCalculation.hoursAgo", hoursAgo);

            if (hoursAgo > UPTIME_CALC_MAX_AGE_HOURS) {
                builder.withDetail("uptimeCalculation.status", "STALE");
            } else {
                builder.withDetail("uptimeCalculation.status", "OK");
            }
        } else {
            builder.withDetail("uptimeCalculation.status", "NOT_YET_RUN");
        }

        return builder.build();
    }

    /**
     * Record that the server ping task ran successfully.
     */
    public void recordServerPingRun() {
        lastServerPingTime.set(Instant.now());
    }

    /**
     * Record that the cleanup task ran successfully.
     */
    public void recordCleanupRun() {
        lastCleanupTime.set(Instant.now());
    }

    /**
     * Record that the uptime calculation task ran successfully.
     */
    public void recordUptimeCalculationRun() {
        lastUptimeCalculationTime.set(Instant.now());
    }
}
