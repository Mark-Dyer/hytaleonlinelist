package com.hytaleonlinelist.dto.response;

import com.hytaleonlinelist.domain.entity.ClaimInitiationStatus;
import com.hytaleonlinelist.domain.entity.ServerClaimInitiationEntity;
import com.hytaleonlinelist.domain.entity.VerificationMethod;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Response containing details about a claim initiation.
 * Used for user dashboard and admin views.
 */
public record ClaimInitiationResponse(
    String id,
    String serverId,
    String serverName,
    String serverSlug,
    String serverIconUrl,
    String userId,
    String username,
    VerificationMethod verificationMethod,
    ClaimInitiationStatus status,
    String statusDisplayName,
    String statusDescription,
    String initiatedAt,
    String expiresAt,
    long expiresInSeconds,
    boolean isExpired,
    boolean isActive,
    String lastAttemptAt,
    int attemptCount,
    String cancelledAt,
    String completedAt,
    // Progress percentage (0-100) based on time remaining
    int timeRemainingPercent
) {
    /**
     * Create a response from an entity.
     */
    public static ClaimInitiationResponse fromEntity(ServerClaimInitiationEntity entity) {
        Instant now = Instant.now();
        Instant expiresAt = entity.getExpiresAt();
        Instant initiatedAt = entity.getInitiatedAt();

        // Calculate time remaining
        long expiresInSeconds = 0;
        int timeRemainingPercent = 0;
        boolean isExpired = entity.isExpired();

        if (expiresAt != null && !isExpired) {
            expiresInSeconds = ChronoUnit.SECONDS.between(now, expiresAt);
            if (expiresInSeconds < 0) expiresInSeconds = 0;

            // Calculate percentage of time remaining
            if (initiatedAt != null) {
                long totalSeconds = ChronoUnit.SECONDS.between(initiatedAt, expiresAt);
                if (totalSeconds > 0) {
                    timeRemainingPercent = (int) ((expiresInSeconds * 100) / totalSeconds);
                }
            }
        }

        return new ClaimInitiationResponse(
            entity.getId().toString(),
            entity.getServer().getId().toString(),
            entity.getServer().getName(),
            entity.getServer().getSlug(),
            entity.getServer().getIconUrl(),
            entity.getUser().getId().toString(),
            entity.getUser().getUsername(),
            entity.getVerificationMethod(),
            entity.getStatus(),
            entity.getStatus().getDisplayName(),
            entity.getStatus().getDescription(),
            initiatedAt != null ? initiatedAt.toString() : null,
            expiresAt != null ? expiresAt.toString() : null,
            expiresInSeconds,
            isExpired,
            entity.isActive(),
            entity.getLastAttemptAt() != null ? entity.getLastAttemptAt().toString() : null,
            entity.getAttemptCount(),
            entity.getCancelledAt() != null ? entity.getCancelledAt().toString() : null,
            entity.getCompletedAt() != null ? entity.getCompletedAt().toString() : null,
            timeRemainingPercent
        );
    }
}
