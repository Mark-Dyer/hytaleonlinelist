package com.hytaleonlinelist.domain.repository;

import com.hytaleonlinelist.domain.entity.OAuthProvider;
import com.hytaleonlinelist.domain.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
}
