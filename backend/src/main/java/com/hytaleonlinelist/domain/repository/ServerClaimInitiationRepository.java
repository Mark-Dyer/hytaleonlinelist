package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.ClaimInitiationStatus;
import com.hytaleonlinelist.domain.entity.ServerClaimInitiationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServerClaimInitiationRepository extends JpaRepository<ServerClaimInitiationEntity, UUID> {

    /**
     * Find a user's claim initiation for a specific server.
     */
    Optional<ServerClaimInitiationEntity> findByServerIdAndUserId(UUID serverId, UUID userId);

    /**
     * Find all claim initiations for a server.
     */
    List<ServerClaimInitiationEntity> findByServerId(UUID serverId);

    /**
     * Find all claim initiations for a server with a specific status.
     */
    List<ServerClaimInitiationEntity> findByServerIdAndStatus(UUID serverId, ClaimInitiationStatus status);

    /**
     * Find all active (pending) claim initiations for a server.
     */
    @Query("SELECT c FROM ServerClaimInitiationEntity c " +
           "WHERE c.server.id = :serverId " +
           "AND c.status = 'PENDING' " +
           "AND c.expiresAt > :now")
    List<ServerClaimInitiationEntity> findActiveClaimsForServer(
        @Param("serverId") UUID serverId,
        @Param("now") Instant now
    );

    /**
     * Count active claimers for a server.
     */
    @Query("SELECT COUNT(c) FROM ServerClaimInitiationEntity c " +
           "WHERE c.server.id = :serverId " +
           "AND c.status = 'PENDING' " +
           "AND c.expiresAt > :now")
    long countActiveClaimsForServer(
        @Param("serverId") UUID serverId,
        @Param("now") Instant now
    );

    /**
     * Find all claim initiations by a user.
     */
    List<ServerClaimInitiationEntity> findByUserIdOrderByInitiatedAtDesc(UUID userId);

    /**
     * Find all claim initiations by a user with a specific status.
     */
    List<ServerClaimInitiationEntity> findByUserIdAndStatusOrderByInitiatedAtDesc(UUID userId, ClaimInitiationStatus status);

    /**
     * Find all active (pending) claim initiations by a user.
     */
    @Query("SELECT c FROM ServerClaimInitiationEntity c " +
           "WHERE c.user.id = :userId " +
           "AND c.status = 'PENDING' " +
           "AND c.expiresAt > :now " +
           "ORDER BY c.expiresAt ASC")
    List<ServerClaimInitiationEntity> findActiveClaimsByUser(
        @Param("userId") UUID userId,
        @Param("now") Instant now
    );

    /**
     * Find all pending claim initiations that have expired.
     */
    @Query("SELECT c FROM ServerClaimInitiationEntity c " +
           "WHERE c.status = 'PENDING' " +
           "AND c.expiresAt < :now")
    List<ServerClaimInitiationEntity> findExpiredPendingClaims(@Param("now") Instant now);

    /**
     * Bulk update expired claims to EXPIRED status.
     */
    @Modifying
    @Query("UPDATE ServerClaimInitiationEntity c " +
           "SET c.status = 'EXPIRED', c.completedAt = :now " +
           "WHERE c.status = 'PENDING' " +
           "AND c.expiresAt < :now")
    int markExpiredClaims(@Param("now") Instant now);

    /**
     * Mark all other pending claims for a server as CLAIMED_BY_OTHER.
     * Called when one user successfully verifies.
     */
    @Modifying
    @Query("UPDATE ServerClaimInitiationEntity c " +
           "SET c.status = 'CLAIMED_BY_OTHER', c.completedAt = :now " +
           "WHERE c.server.id = :serverId " +
           "AND c.user.id != :verifiedUserId " +
           "AND c.status = 'PENDING'")
    int markOtherClaimsAsClaimedByOther(
        @Param("serverId") UUID serverId,
        @Param("verifiedUserId") UUID verifiedUserId,
        @Param("now") Instant now
    );

    // Admin queries

    /**
     * Find all claim initiations with pagination (for admin).
     */
    Page<ServerClaimInitiationEntity> findAllByOrderByInitiatedAtDesc(Pageable pageable);

    /**
     * Find all claim initiations by status with pagination (for admin).
     */
    Page<ServerClaimInitiationEntity> findByStatusOrderByInitiatedAtDesc(ClaimInitiationStatus status, Pageable pageable);

    /**
     * Find claims expiring soon (for admin dashboard).
     */
    @Query("SELECT c FROM ServerClaimInitiationEntity c " +
           "WHERE c.status = 'PENDING' " +
           "AND c.expiresAt > :now " +
           "AND c.expiresAt < :soonThreshold " +
           "ORDER BY c.expiresAt ASC")
    List<ServerClaimInitiationEntity> findClaimsExpiringSoon(
        @Param("now") Instant now,
        @Param("soonThreshold") Instant soonThreshold
    );

    /**
     * Count claims by status (for admin dashboard stats).
     */
    long countByStatus(ClaimInitiationStatus status);

    /**
     * Count successful verifications in a time period.
     */
    @Query("SELECT COUNT(c) FROM ServerClaimInitiationEntity c " +
           "WHERE c.status = 'VERIFIED' " +
           "AND c.completedAt > :since")
    long countVerificationsSince(@Param("since") Instant since);

    /**
     * Delete old completed claims (cleanup).
     */
    @Modifying
    @Query("DELETE FROM ServerClaimInitiationEntity c " +
           "WHERE c.status != 'PENDING' " +
           "AND c.completedAt < :before")
    int deleteOldCompletedClaims(@Param("before") Instant before);
}
