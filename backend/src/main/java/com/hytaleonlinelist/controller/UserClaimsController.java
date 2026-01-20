package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.domain.entity.ServerClaimInitiationEntity;
import com.hytaleonlinelist.dto.response.ClaimInitiationResponse;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.ServerClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for user's claim initiations.
 * Used by the user dashboard to display "My Claims" section.
 */
@RestController
@RequestMapping("/api/users/me/claims")
public class UserClaimsController {

    private final ServerClaimService claimService;

    public UserClaimsController(ServerClaimService claimService) {
        this.claimService = claimService;
    }

    /**
     * Get all claim initiations by the current user.
     * Includes all statuses: PENDING, VERIFIED, EXPIRED, CANCELLED, CLAIMED_BY_OTHER.
     */
    @GetMapping
    public ResponseEntity<List<ClaimInitiationResponse>> getMyClaims(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ServerClaimInitiationEntity> initiations =
                claimService.getUserClaimInitiations(principal.id());

        List<ClaimInitiationResponse> responses = initiations.stream()
                .map(ClaimInitiationResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Get only active (pending) claim initiations by the current user.
     */
    @GetMapping("/active")
    public ResponseEntity<List<ClaimInitiationResponse>> getMyActiveClaims(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ServerClaimInitiationEntity> initiations =
                claimService.getUserActiveClaimInitiations(principal.id());

        List<ClaimInitiationResponse> responses = initiations.stream()
                .map(ClaimInitiationResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Get count of active claims for the current user.
     * Useful for showing a badge in the navigation.
     */
    @GetMapping("/active/count")
    public ResponseEntity<Long> getMyActiveClaimsCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ServerClaimInitiationEntity> initiations =
                claimService.getUserActiveClaimInitiations(principal.id());
        return ResponseEntity.ok((long) initiations.size());
    }
}
