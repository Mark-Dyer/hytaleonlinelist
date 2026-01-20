package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.domain.entity.ClaimInitiationStatus;
import com.hytaleonlinelist.domain.entity.ServerClaimInitiationEntity;
import com.hytaleonlinelist.domain.repository.ServerClaimInitiationRepository;
import com.hytaleonlinelist.dto.response.ClaimInitiationResponse;
import com.hytaleonlinelist.dto.response.ClaimStatsResponse;
import com.hytaleonlinelist.dto.response.MessageResponse;
import com.hytaleonlinelist.dto.response.PaginatedResponse;
import com.hytaleonlinelist.dto.response.PaginationMeta;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.service.ServerClaimService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for admin claim management.
 */
@RestController
@RequestMapping("/api/admin/claims")
@PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR')")
public class AdminClaimsController {

    private final ServerClaimService claimService;
    private final ServerClaimInitiationRepository claimInitiationRepository;

    public AdminClaimsController(
            ServerClaimService claimService,
            ServerClaimInitiationRepository claimInitiationRepository) {
        this.claimService = claimService;
        this.claimInitiationRepository = claimInitiationRepository;
    }

    /**
     * Get claim statistics for admin dashboard.
     */
    @GetMapping("/stats")
    public ResponseEntity<ClaimStatsResponse> getClaimStats() {
        Instant now = Instant.now();
        Instant soonThreshold = now.plus(6, ChronoUnit.HOURS);
        Instant sevenDaysAgo = now.minus(7, ChronoUnit.DAYS);

        long pendingClaims = claimInitiationRepository.countByStatus(ClaimInitiationStatus.PENDING);
        long expiringSoon = claimInitiationRepository.findClaimsExpiringSoon(now, soonThreshold).size();
        long verificationsLast7Days = claimInitiationRepository.countVerificationsSince(sevenDaysAgo);
        long totalVerified = claimInitiationRepository.countByStatus(ClaimInitiationStatus.VERIFIED);
        long totalExpired = claimInitiationRepository.countByStatus(ClaimInitiationStatus.EXPIRED);
        long totalCancelled = claimInitiationRepository.countByStatus(ClaimInitiationStatus.CANCELLED);

        return ResponseEntity.ok(new ClaimStatsResponse(
                pendingClaims,
                expiringSoon,
                verificationsLast7Days,
                totalVerified,
                totalExpired,
                totalCancelled
        ));
    }

    /**
     * Get all claim initiations with pagination.
     */
    @GetMapping
    public ResponseEntity<PaginatedResponse<ClaimInitiationResponse>> getClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ClaimInitiationStatus status) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ServerClaimInitiationEntity> claimsPage;

        if (status != null) {
            claimsPage = claimInitiationRepository.findByStatusOrderByInitiatedAtDesc(status, pageable);
        } else {
            claimsPage = claimInitiationRepository.findAllByOrderByInitiatedAtDesc(pageable);
        }

        List<ClaimInitiationResponse> responses = claimsPage.getContent().stream()
                .map(ClaimInitiationResponse::fromEntity)
                .toList();

        PaginationMeta meta = new PaginationMeta(
                claimsPage.getNumber() + 1,
                claimsPage.getSize(),
                claimsPage.getTotalElements(),
                claimsPage.getTotalPages()
        );

        return ResponseEntity.ok(new PaginatedResponse<>(responses, meta));
    }

    /**
     * Get claims expiring soon (within 6 hours).
     */
    @GetMapping("/expiring-soon")
    public ResponseEntity<List<ClaimInitiationResponse>> getClaimsExpiringSoon() {
        Instant now = Instant.now();
        Instant soonThreshold = now.plus(6, ChronoUnit.HOURS);

        List<ServerClaimInitiationEntity> claims =
                claimInitiationRepository.findClaimsExpiringSoon(now, soonThreshold);

        List<ClaimInitiationResponse> responses = claims.stream()
                .map(ClaimInitiationResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Get all claim initiations for a specific server.
     */
    @GetMapping("/server/{serverId}")
    public ResponseEntity<List<ClaimInitiationResponse>> getClaimsForServer(
            @PathVariable UUID serverId) {
        List<ServerClaimInitiationEntity> claims =
                claimService.getServerClaimInitiations(serverId);

        List<ClaimInitiationResponse> responses = claims.stream()
                .map(ClaimInitiationResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Invalidate/cancel a claim (admin action).
     */
    @DeleteMapping("/{claimId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> invalidateClaim(@PathVariable UUID claimId) {
        ServerClaimInitiationEntity initiation = claimInitiationRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id: " + claimId));

        if (initiation.getStatus() != ClaimInitiationStatus.PENDING) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Only pending claims can be invalidated."));
        }

        initiation.markCancelled();
        claimInitiationRepository.save(initiation);

        return ResponseEntity.ok(new MessageResponse("Claim invalidated successfully."));
    }

    /**
     * Manually expire all pending claims that have passed their expiry time.
     */
    @PostMapping("/expire-pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> expirePendingClaims() {
        int expired = claimService.expirePendingClaims();
        return ResponseEntity.ok(new MessageResponse("Expired " + expired + " pending claims."));
    }

    /**
     * Clean up old completed claims (older than specified days).
     */
    @DeleteMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> cleanupOldClaims(
            @RequestParam(defaultValue = "90") int daysToKeep) {
        int deleted = claimService.cleanupOldClaims(daysToKeep);
        return ResponseEntity.ok(new MessageResponse(
                "Deleted " + deleted + " old claims (older than " + daysToKeep + " days)."));
    }
}
