package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.AdminActionEntity;
import com.hytaleonlinelist.domain.entity.TargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminActionEntity, UUID> {

    Page<AdminActionEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT a FROM AdminActionEntity a WHERE a.targetType = :type AND a.targetId = :id ORDER BY a.createdAt DESC")
    List<AdminActionEntity> findByTarget(@Param("type") TargetType type, @Param("id") UUID id);

    @Query("SELECT a FROM AdminActionEntity a ORDER BY a.createdAt DESC")
    Page<AdminActionEntity> findRecentActions(Pageable pageable);
}
