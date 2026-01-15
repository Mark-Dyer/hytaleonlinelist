package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, UUID> {

    Page<ReviewEntity> findByServerId(UUID serverId, Pageable pageable);

    Optional<ReviewEntity> findByServerIdAndUserId(UUID serverId, UUID userId);

    boolean existsByServerIdAndUserId(UUID serverId, UUID userId);

    long countByServerId(UUID serverId);
}
