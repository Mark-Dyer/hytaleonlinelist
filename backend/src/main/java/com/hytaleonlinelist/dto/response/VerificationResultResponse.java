package com.hytaleonlinelist.dto.response;

import com.hytaleonlinelist.domain.entity.VerificationMethod;

/**
 * Response after attempting to verify server ownership.
 */
public record VerificationResultResponse(
    String serverId,
    boolean isVerified,
    VerificationMethod verificationMethod,
    String message
) {}
