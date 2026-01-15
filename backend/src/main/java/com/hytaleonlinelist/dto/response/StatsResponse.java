package com.hytaleonlinelist.dto.response;

/**
 * Platform statistics response.
 */
public record StatsResponse(
    long totalServers,
    long onlineServers,
    long totalPlayers,
    long totalVotes,
    long totalReviews
) {}
