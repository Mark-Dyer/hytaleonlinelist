package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.ServerClaimAttemptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.UUID;

@Repository
public interface ServerClaimAttemptRepository extends JpaRepository<ServerClaimAttemptEntity, UUID> {

    /**
     * Count recent failed attempts by a user for rate limiting.
     */
    @Query("SELECT COUNT(a) FROM ServerClaimAttemptEntity a " +
           "WHERE a.user.id = :userId " +
           "AND a.isSuccessful = false " +
           "AND a.attemptedAt > :since")
    long countRecentFailedAttemptsByUser(
        @Param("userId") UUID userId,
        @Param("since") Instant since
    );

    /**
     * Count recent failed attempts from an IP address for rate limiting.
     */
    @Query("SELECT COUNT(a) FROM ServerClaimAttemptEntity a " +
           "WHERE a.ipAddress = :ipAddress " +
           "AND a.isSuccessful = false " +
           "AND a.attemptedAt > :since")
    long countRecentFailedAttemptsByIp(
        @Param("ipAddress") String ipAddress,
        @Param("since") Instant since
    );

    /**
     * Count recent attempts for a specific server by a user.
     */
    @Query("SELECT COUNT(a) FROM ServerClaimAttemptEntity a " +
           "WHERE a.server.id = :serverId " +
           "AND a.user.id = :userId " +
           "AND a.attemptedAt > :since")
    long countRecentAttemptsByUserForServer(
        @Param("serverId") UUID serverId,
        @Param("userId") UUID userId,
        @Param("since") Instant since
    );

    /**
     * Count all recent attempts by a user (for rate limiting).
     */
    @Query("SELECT COUNT(a) FROM ServerClaimAttemptEntity a " +
           "WHERE a.user.id = :userId " +
           "AND a.attemptedAt > :since")
    long countAttemptsByUserSince(
        @Param("userId") UUID userId,
        @Param("since") Instant since
    );
}
