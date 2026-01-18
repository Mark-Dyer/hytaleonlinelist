package com.hytaleonlinelist.dto.response;

import java.time.Instant;

/**
 * DTO for server status history entry (for charts)
 */
public record ServerStatusHistoryResponse(
    boolean online,
    Integer playerCount,
    Integer maxPlayers,
    Integer responseTimeMs,
    String queryProtocol,
    Instant recordedAt
) {}
