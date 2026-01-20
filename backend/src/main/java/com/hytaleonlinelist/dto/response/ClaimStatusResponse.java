package com.hytaleonlinelist.dto.response;

import com.hytaleonlinelist.domain.entity.VerificationMethod;

/**
 * Response containing the current claim/verification status of a server.
 */
public record ClaimStatusResponse(
    String serverId,
    String serverName,
    boolean isClaimed,
    boolean isVerified,
    String ownerId,
    String ownerUsername,
    VerificationMethod verificationMethod,
    String verifiedAt,
    boolean hasPendingClaim,
    String claimTokenExpiry
) {}
