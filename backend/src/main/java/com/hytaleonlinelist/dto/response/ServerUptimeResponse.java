package com.hytaleonlinelist.dto.response;

import java.time.Instant;
import java.util.UUID;

/**
 * DTO for server uptime statistics
 */
public record ServerUptimeResponse(
    UUID serverId,
    double uptime24h,       // Percentage (0-100)
    double uptime7d,        // Percentage (0-100)
    Integer avgResponseMs,  // Average response time in ms
    long totalChecks24h,    // Number of checks in last 24h
    boolean currentlyOnline,
    Instant lastCheckedAt
) {}
