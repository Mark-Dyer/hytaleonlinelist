package com.hytaleonlinelist.dto.response;

/**
 * Statistics about server claims for admin dashboard.
 */
public record ClaimStatsResponse(
    long totalPendingClaims,
    long claimsExpiringSoon,  // Expiring within 6 hours
    long verificationsLast7Days,
    long totalVerifiedServers,
    long totalExpiredClaims,
    long totalCancelledClaims
) {}
