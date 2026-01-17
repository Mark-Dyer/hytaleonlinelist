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

    @Query("SELECT u FROM UserEntity u WHERE LOWER(u.email) = LOWER(:email) OR LOWER(u.username) = LOWER(:username)")
    Optional<UserEntity> findByEmailOrUsernameIgnoreCase(@Param("email") String email, @Param("username") String username);

    // Admin methods
    @Query("SELECT u FROM UserEntity u WHERE " +
           "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY u.createdAt DESC")
    Page<UserEntity> findAllWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.createdAt >= :since")
    long countUsersCreatedSince(@Param("since") Instant since);
}
