package com.hytaleonlinelist.dto.request;

import com.hytaleonlinelist.domain.entity.VerificationMethod;
import jakarta.validation.constraints.NotNull;

/**
 * Request to initiate a server claim/verification process.
 */
public record InitiateClaimRequest(
    @NotNull(message = "Verification method is required")
    VerificationMethod verificationMethod
) {}
