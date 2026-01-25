package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServerRepository extends JpaRepository<ServerEntity, UUID>, JpaSpecificationExecutor<ServerEntity> {

    Optional<ServerEntity> findBySlug(String slug);

    List<ServerEntity> findByIsFeaturedTrue();

    Page<ServerEntity> findByCategorySlug(String categorySlug, Pageable pageable);

    Page<ServerEntity> findByIsOnlineTrue(Pageable pageable);

    @Query("SELECT s FROM ServerEntity s WHERE s.category.slug = :categorySlug AND s.isOnline = true")
    Page<ServerEntity> findByCategorySlugAndOnline(@Param("categorySlug") String categorySlug, Pageable pageable);

    @Query(value = "SELECT s.* FROM servers s " +
           "LEFT JOIN server_tags t ON s.id = t.server_id " +
           "LEFT JOIN categories c ON s.category_id = c.id " +
           "WHERE (:categorySlug IS NULL OR c.slug = :categorySlug) " +
           "AND (:online IS NULL OR s.is_online = :online) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "     CAST(s.name AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') OR " +
           "     CAST(s.short_description AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') OR " +
           "     CAST(t.tag AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%')) " +
           "GROUP BY s.id " +
           "ORDER BY " +
           "CASE WHEN :sortBy = 'voteCount' THEN s.vote_count END DESC NULLS LAST, " +
           "CASE WHEN :sortBy = 'playerCount' THEN s.player_count END DESC NULLS LAST, " +
           "CASE WHEN :sortBy = 'createdAt' THEN EXTRACT(EPOCH FROM s.created_at) END DESC NULLS LAST, " +
           "CASE WHEN :sortBy = 'name' THEN s.name END ASC NULLS LAST, " +
           "s.created_at DESC NULLS LAST",
           countQuery = "SELECT COUNT(DISTINCT s.id) FROM servers s " +
           "LEFT JOIN server_tags t ON s.id = t.server_id " +
           "LEFT JOIN categories c ON s.category_id = c.id " +
           "WHERE (:categorySlug IS NULL OR c.slug = :categorySlug) " +
           "AND (:online IS NULL OR s.is_online = :online) " +
           "AND (:search IS NULL OR :search = '' OR " +
           "     CAST(s.name AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') OR " +
           "     CAST(s.short_description AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') OR " +
           "     CAST(t.tag AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%'))",
           nativeQuery = true)
    Page<ServerEntity> findWithFilters(
            @Param("categorySlug") String categorySlug,
            @Param("online") Boolean online,
            @Param("search") String search,
            @Param("sortBy") String sortBy,
            Pageable pageable
    );

    @Query("SELECT SUM(s.playerCount) FROM ServerEntity s WHERE s.isOnline = true")
    Long getTotalOnlinePlayers();

    @Query("SELECT COUNT(s) FROM ServerEntity s WHERE s.isOnline = true")
    Long countOnlineServers();

    @Query("SELECT COALESCE(SUM(s.voteCount), 0) FROM ServerEntity s")
    Long getTotalVoteCount();

    boolean existsBySlug(String slug);

    List<ServerEntity> findByOwnerId(UUID ownerId);

    // Admin methods
    @Query(value = "SELECT DISTINCT s.* FROM servers s " +
           "LEFT JOIN users u ON s.owner_id = u.id " +
           "WHERE (:search IS NULL OR :search = '' OR " +
           "       CAST(s.name AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') " +
           "       OR CAST(u.username AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%')) " +
           "ORDER BY s.created_at DESC",
           countQuery = "SELECT COUNT(DISTINCT s.id) FROM servers s " +
           "LEFT JOIN users u ON s.owner_id = u.id " +
           "WHERE (:search IS NULL OR :search = '' OR " +
           "       CAST(s.name AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') " +
           "       OR CAST(u.username AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%'))",
           nativeQuery = true)
    Page<ServerEntity> findAllWithSearchForAdmin(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(s) FROM ServerEntity s WHERE s.createdAt >= :since")
    long countServersCreatedSince(@Param("since") Instant since);

    long countByOwnerId(UUID ownerId);

    /**
     * Get servers that need pinging (staggered batch processing)
     * Orders by last_pinged_at ascending with NULLs first (never pinged servers get priority)
     */
    @Query("SELECT s FROM ServerEntity s ORDER BY s.lastPingedAt ASC NULLS FIRST")
    List<ServerEntity> findServersNeedingPing(Pageable pageable);

    // Claim and verification queries

    /**
     * Find all unclaimed servers (servers without an owner).
     */
    @Query("SELECT s FROM ServerEntity s WHERE s.owner IS NULL")
    Page<ServerEntity> findUnclaimedServers(Pageable pageable);

    /**
     * Find verified servers.
     */
    @Query("SELECT s FROM ServerEntity s WHERE s.verifiedAt IS NOT NULL")
    Page<ServerEntity> findVerifiedServers(Pageable pageable);

    /**
     * Find servers with expired claim tokens (for cleanup).
     */
    @Query("SELECT s FROM ServerEntity s WHERE s.claimToken IS NOT NULL AND s.claimTokenExpiry < :now AND s.verifiedAt IS NULL")
    List<ServerEntity> findServersWithExpiredClaimTokens(@Param("now") Instant now);

    /**
     * Count unclaimed servers.
     */
    @Query("SELECT COUNT(s) FROM ServerEntity s WHERE s.owner IS NULL")
    long countUnclaimedServers();

    /**
     * Count verified servers.
     */
    @Query("SELECT COUNT(s) FROM ServerEntity s WHERE s.verifiedAt IS NOT NULL")
    long countVerifiedServers();

    /**
     * Get all server slugs (for duplicate checking during import).
     */
    @Query("SELECT s.slug FROM ServerEntity s")
    List<String> findAllSlugs();
}
