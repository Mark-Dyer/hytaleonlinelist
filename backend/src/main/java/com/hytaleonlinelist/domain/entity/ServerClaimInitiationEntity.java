package com.hytaleonlinelist.domain.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Tracks individual users' claim initiations on servers.
 * Supports concurrent claims where multiple users can attempt to claim
 * the same server simultaneously - first to verify wins.
 */
@Entity
@Table(name = "server_claim_initiations", indexes = {
    @Index(name = "idx_claim_init_server_id", columnList = "server_id"),
    @Index(name = "idx_claim_init_user_id", columnList = "user_id"),
    @Index(name = "idx_claim_init_status", columnList = "status"),
    @Index(name = "idx_claim_init_expires_at", columnList = "expires_at")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_claim_init_server_user", columnNames = {"server_id", "user_id"})
})
public class ServerClaimInitiationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "server_id", nullable = false)
    private ServerEntity server;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(name = "verification_method", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private VerificationMethod verificationMethod;

    @Column(name = "status", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ClaimInitiationStatus status = ClaimInitiationStatus.PENDING;

    @Column(name = "initiated_at", nullable = false, updatable = false)
    private Instant initiatedAt;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "last_attempt_at")
    private Instant lastAttemptAt;

    @Column(name = "attempt_count", nullable = false)
    private Integer attemptCount = 0;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @PrePersist
    protected void onCreate() {
        initiatedAt = Instant.now();
    }

    // Helper methods

    /**
     * Check if this claim initiation is still active (pending and not expired).
     */
    public boolean isActive() {
        return status == ClaimInitiationStatus.PENDING &&
               expiresAt != null &&
               expiresAt.isAfter(Instant.now());
    }

    /**
     * Check if this claim initiation has expired.
     */
    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(Instant.now());
    }

    /**
     * Record a verification attempt.
     */
    public void recordAttempt() {
        this.attemptCount++;
        this.lastAttemptAt = Instant.now();
    }

    /**
     * Mark this initiation as successfully verified.
     */
    public void markVerified() {
        this.status = ClaimInitiationStatus.VERIFIED;
        this.completedAt = Instant.now();
    }

    /**
     * Mark this initiation as cancelled.
     */
    public void markCancelled() {
        this.status = ClaimInitiationStatus.CANCELLED;
        this.cancelledAt = Instant.now();
    }

    /**
     * Mark this initiation as expired.
     */
    public void markExpired() {
        this.status = ClaimInitiationStatus.EXPIRED;
        this.completedAt = Instant.now();
    }

    /**
     * Mark this initiation as claimed by another user.
     */
    public void markClaimedByOther() {
        this.status = ClaimInitiationStatus.CLAIMED_BY_OTHER;
        this.completedAt = Instant.now();
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ServerEntity getServer() {
        return server;
    }

    public void setServer(ServerEntity server) {
        this.server = server;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public VerificationMethod getVerificationMethod() {
        return verificationMethod;
    }

    public void setVerificationMethod(VerificationMethod verificationMethod) {
        this.verificationMethod = verificationMethod;
    }

    public ClaimInitiationStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimInitiationStatus status) {
        this.status = status;
    }

    public Instant getInitiatedAt() {
        return initiatedAt;
    }

    public void setInitiatedAt(Instant initiatedAt) {
        this.initiatedAt = initiatedAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getLastAttemptAt() {
        return lastAttemptAt;
    }

    public void setLastAttemptAt(Instant lastAttemptAt) {
        this.lastAttemptAt = lastAttemptAt;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public Instant getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(Instant cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
