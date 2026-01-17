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
           "AND (:search IS NULL OR " +
           "     LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(s.short_description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(CAST(t.tag AS VARCHAR)) LIKE LOWER(CONCAT('%', :search, '%'))) " +
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
           "AND (:search IS NULL OR " +
           "     LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(s.short_description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(CAST(t.tag AS VARCHAR)) LIKE LOWER(CONCAT('%', :search, '%')))",
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

    boolean existsBySlug(String slug);

    List<ServerEntity> findByOwnerId(UUID ownerId);

    // Admin methods
    @Query("SELECT s FROM ServerEntity s LEFT JOIN FETCH s.owner WHERE " +
           "(:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.owner.username) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY s.createdAt DESC")
    Page<ServerEntity> findAllWithSearchForAdmin(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(s) FROM ServerEntity s WHERE s.createdAt >= :since")
    long countServersCreatedSince(@Param("since") Instant since);

    long countByOwnerId(UUID ownerId);
}
