package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.RefreshTokenEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, UUID> {

    Optional<RefreshTokenEntity> findByTokenAndRevokedFalse(String token);

    @Modifying
    @Query("UPDATE RefreshTokenEntity r SET r.revoked = true WHERE r.user = :user")
    void revokeAllByUser(@Param("user") UserEntity user);

    @Modifying
    @Query("DELETE FROM RefreshTokenEntity r WHERE r.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") Instant now);

    @Modifying
    @Query("DELETE FROM RefreshTokenEntity r WHERE r.user = :user AND r.revoked = true")
    void deleteRevokedTokensByUser(@Param("user") UserEntity user);

    @Modifying
    @Query("DELETE FROM RefreshTokenEntity r WHERE r.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
}
