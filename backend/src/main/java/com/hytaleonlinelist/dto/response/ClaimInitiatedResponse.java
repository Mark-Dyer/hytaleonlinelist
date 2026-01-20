package com.hytaleonlinelist.dto.response;

import com.hytaleonlinelist.domain.entity.VerificationMethod;

/**
 * Response after initiating a claim/verification process.
 * Contains the verification token and instructions.
 */
public record ClaimInitiatedResponse(
    String serverId,
    String serverName,
    VerificationMethod verificationMethod,
    String verificationToken,
    String instructions,
    long expiresInSeconds
) {}
