package com.hytaleonlinelist.dto.response;

public record AdminStatsResponse(
    long totalUsers,
    long totalServers,
    long totalVotes,
    long newUsersToday,
    long newServersToday
) {}
