package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.domain.entity.VerificationMethod;
import com.hytaleonlinelist.dto.request.InitiateClaimRequest;
import com.hytaleonlinelist.dto.response.ClaimInitiatedResponse;
import com.hytaleonlinelist.dto.response.ClaimStatusResponse;
import com.hytaleonlinelist.dto.response.MessageResponse;
import com.hytaleonlinelist.dto.response.VerificationResultResponse;
import com.hytaleonlinelist.security.EmailVerified;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.ServerClaimService;
import com.hytaleonlinelist.service.ServerClaimService.VerificationMethodInfo;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for server claim and verification operations.
 */
@RestController
@RequestMapping("/api/servers/{serverId}/claim")
public class ServerClaimController {

    private final ServerClaimService claimService;

    public ServerClaimController(ServerClaimService claimService) {
        this.claimService = claimService;
    }

    /**
     * Get the claim/verification status of a server.
     * Public endpoint - anyone can check if a server is claimed/verified.
     */
    @GetMapping("/status")
    public ResponseEntity<ClaimStatusResponse> getClaimStatus(@PathVariable UUID serverId) {
        ClaimStatusResponse status = claimService.getClaimStatus(serverId);
        return ResponseEntity.ok(status);
    }

    /**
     * Get available verification methods for a server.
     * Public endpoint - users need to see methods before initiating a claim.
     * For authenticated users, includes user-specific availability (e.g., EMAIL method).
     */
    @GetMapping("/methods")
    public ResponseEntity<List<VerificationMethodInfo>> getAvailableMethods(
            @PathVariable UUID serverId,
            @AuthenticationPrincipal UserPrincipal principal) {
        // Pass user ID if authenticated for user-specific method availability
        UUID userId = principal != null ? principal.id() : null;
        List<VerificationMethodInfo> methods = claimService.getAvailableMethods(serverId, userId);
        return ResponseEntity.ok(methods);
    }

    /**
     * Initiate a claim for a server.
     * Requires authentication and verified email.
     */
    @PostMapping("/initiate")
    @EmailVerified
    public ResponseEntity<ClaimInitiatedResponse> initiateClaim(
            @PathVariable UUID serverId,
            @Valid @RequestBody InitiateClaimRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ClaimInitiatedResponse response = claimService.initiateClaim(
                serverId, principal.id(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Attempt to verify a server claim.
     * Requires authentication and verified email.
     */
    @PostMapping("/verify")
    @EmailVerified
    public ResponseEntity<VerificationResultResponse> attemptVerification(
            @PathVariable UUID serverId,
            @RequestParam VerificationMethod method,
            @AuthenticationPrincipal UserPrincipal principal) {
        VerificationResultResponse response = claimService.attemptVerification(
                serverId, principal.id(), method);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel a pending claim.
     * Requires authentication - only the claiming user can cancel.
     */
    @DeleteMapping("/cancel")
    @EmailVerified
    public ResponseEntity<MessageResponse> cancelClaim(
            @PathVariable UUID serverId,
            @AuthenticationPrincipal UserPrincipal principal) {
        claimService.cancelClaim(serverId, principal.id());
        return ResponseEntity.ok(new MessageResponse("Claim cancelled successfully."));
    }
}
