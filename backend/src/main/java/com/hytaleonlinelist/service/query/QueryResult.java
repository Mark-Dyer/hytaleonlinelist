package com.hytaleonlinelist.service.query;

import com.hytaleonlinelist.domain.entity.QueryProtocol;

/**
 * Result of a server query operation
 *
 * Note: playerCount is Integer (nullable) to distinguish between:
 * - 0 = confirmed zero players online (from HyQuery/Nitrado)
 * - null = player count unknown (from QUIC/BasicPing which only check connectivity)
 */
public record QueryResult(
    boolean online,
    Integer playerCount,
    Integer maxPlayers,
    String serverName,
    String version,
    String motd,
    long responseTimeMs,
    QueryProtocol protocol,
    String errorMessage
) {
    public static QueryResult success(
        Integer playerCount,
        Integer maxPlayers,
        String serverName,
        String version,
        String motd,
        long responseTimeMs,
        QueryProtocol protocol
    ) {
        return new QueryResult(true, playerCount, maxPlayers, serverName,
            version, motd, responseTimeMs, protocol, null);
    }

    public static QueryResult failure(QueryProtocol protocol, String errorMessage) {
        return new QueryResult(false, null, null, null, null, null,
            0L, protocol, errorMessage);
    }

    public static QueryResult offline() {
        return new QueryResult(false, null, null, null, null, null,
            0L, QueryProtocol.FAILED, "Server unreachable");
    }
}
