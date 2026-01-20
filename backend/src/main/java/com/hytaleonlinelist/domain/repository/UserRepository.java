package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.OAuthProvider;
import com.hytaleonlinelist.domain.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByOauthProviderAndOauthId(OAuthProvider oauthProvider, String oauthId);

    Optional<UserEntity> findByEmailVerificationToken(String token);

    Optional<UserEntity> findByPasswordResetToken(String token);

    @Query(value = "SELECT * FROM users u WHERE " +
           "CAST(u.email AS TEXT) ILIKE CAST(:email AS TEXT) " +
           "OR CAST(u.username AS TEXT) ILIKE CAST(:username AS TEXT) LIMIT 1",
           nativeQuery = true)
    Optional<UserEntity> findByEmailOrUsernameIgnoreCase(@Param("email") String email, @Param("username") String username);

    // Admin methods
    @Query(value = "SELECT * FROM users u WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "CAST(u.username AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') " +
           "OR CAST(u.email AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%')) " +
           "ORDER BY u.created_at DESC",
           countQuery = "SELECT COUNT(*) FROM users u WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "CAST(u.username AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%') " +
           "OR CAST(u.email AS TEXT) ILIKE CONCAT('%', CAST(:search AS TEXT), '%'))",
           nativeQuery = true)
    Page<UserEntity> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.createdAt >= :since")
    long countUsersCreatedSince(@Param("since") Instant since);
}
