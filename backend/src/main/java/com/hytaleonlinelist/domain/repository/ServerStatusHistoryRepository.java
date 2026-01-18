package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.ServerStatusHistoryEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ServerStatusHistoryRepository extends JpaRepository<ServerStatusHistoryEntity, UUID> {

    /**
     * Get recent history for a server (for charts), ordered by most recent first
     */
    List<ServerStatusHistoryEntity> findByServerIdOrderByRecordedAtDesc(UUID serverId, Pageable pageable);

    /**
     * Get history within time range, ordered by oldest first (for charts)
     */
    @Query("SELECT h FROM ServerStatusHistoryEntity h WHERE h.server.id = :serverId " +
           "AND h.recordedAt >= :since ORDER BY h.recordedAt ASC")
    List<ServerStatusHistoryEntity> findByServerIdSince(
        @Param("serverId") UUID serverId,
        @Param("since") Instant since
    );

    /**
     * Count successful pings (online) for uptime calculation
     */
    @Query("SELECT COUNT(h) FROM ServerStatusHistoryEntity h " +
           "WHERE h.server.id = :serverId AND h.recordedAt >= :since AND h.isOnline = true")
    long countOnlinePingsSince(@Param("serverId") UUID serverId, @Param("since") Instant since);

    /**
     * Count total pings for uptime calculation
     */
    @Query("SELECT COUNT(h) FROM ServerStatusHistoryEntity h " +
           "WHERE h.server.id = :serverId AND h.recordedAt >= :since")
    long countTotalPingsSince(@Param("serverId") UUID serverId, @Param("since") Instant since);

    /**
     * Cleanup old records (for scheduled cleanup job)
     */
    @Modifying
    @Query("DELETE FROM ServerStatusHistoryEntity h WHERE h.recordedAt < :before")
    int deleteOlderThan(@Param("before") Instant before);

    /**
     * Get average response time for a server (only for successful pings)
     */
    @Query("SELECT AVG(h.responseTimeMs) FROM ServerStatusHistoryEntity h " +
           "WHERE h.server.id = :serverId AND h.recordedAt >= :since AND h.isOnline = true")
    Double getAverageResponseTime(@Param("serverId") UUID serverId, @Param("since") Instant since);
}
