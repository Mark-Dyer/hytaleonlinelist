package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, UUID> {

    Page<ReviewEntity> findByServerId(UUID serverId, Pageable pageable);

    @Query("SELECT r FROM ReviewEntity r JOIN FETCH r.user WHERE r.server.id = :serverId ORDER BY r.createdAt DESC")
    Page<ReviewEntity> findByServerIdWithUser(@Param("serverId") UUID serverId, Pageable pageable);

    Optional<ReviewEntity> findByServerIdAndUserId(UUID serverId, UUID userId);

    boolean existsByServerIdAndUserId(UUID serverId, UUID userId);

    long countByServerId(UUID serverId);

    @Query("SELECT AVG(r.rating) FROM ReviewEntity r WHERE r.server.id = :serverId")
    Double getAverageRatingByServerId(@Param("serverId") UUID serverId);
}
