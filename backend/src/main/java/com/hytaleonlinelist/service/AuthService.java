package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.RefreshTokenEntity;
import com.hytaleonlinelist.domain.entity.Role;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.repository.RefreshTokenRepository;
import com.hytaleonlinelist.domain.repository.UserRepository;
import com.hytaleonlinelist.dto.request.LoginRequest;
import com.hytaleonlinelist.dto.request.RegisterRequest;
import com.hytaleonlinelist.dto.response.AuthResponse;
import com.hytaleonlinelist.exception.BadRequestException;
import com.hytaleonlinelist.exception.ConflictException;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.exception.UnauthorizedException;
import com.hytaleonlinelist.security.CookieUtils;
import com.hytaleonlinelist.security.JwtTokenProvider;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.util.RequestUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    // Account lockout configuration
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final Duration LOCKOUT_DURATION = Duration.ofMinutes(15);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final CookieUtils cookieUtils;
    private final EmailServiceInterface emailService;

    public AuthService(
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            AuthenticationManager authenticationManager,
            CookieUtils cookieUtils,
            EmailServiceInterface emailService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.cookieUtils = cookieUtils;
        this.emailService = emailService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        // Check if email or username exists
        if (userRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email already registered");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new ConflictException("Username already taken");
        }

        // Create user
        UserEntity user = new UserEntity();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setEmailVerified(false);
        user.setLastPasswordChangeAt(Instant.now());

        // Generate verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationTokenExpiry(Instant.now().plusSeconds(86400)); // 24 hours

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), verificationToken);

        // Generate tokens and set cookies
        setAuthCookies(user, response);

        return toAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        String clientIp = RequestUtils.getClientIpFromContext();

        // Check if account is locked before attempting authentication
        UserEntity user = userRepository.findByEmail(request.email()).orElse(null);
        if (user != null && user.isAccountLocked()) {
            log.warn("Login attempt for locked account: {} from IP: {}", request.email(), clientIp);
            throw new UnauthorizedException("Account is temporarily locked. Please try again later.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            user = userRepository.findById(principal.id())
                    .orElseThrow(() -> new UnauthorizedException("User not found"));

            // Record successful login
            user.recordSuccessfulLogin(clientIp);
            userRepository.save(user);

            log.info("Successful login for user: {} from IP: {}", user.getUsername(), clientIp);

            setAuthCookies(user, response);

            return toAuthResponse(user);
        } catch (BadCredentialsException e) {
            // Handle failed login attempt
            handleFailedLogin(request.email(), clientIp);
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    private void handleFailedLogin(String email, String clientIp) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.incrementFailedLoginAttempts();

            if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setLockedUntil(Instant.now().plus(LOCKOUT_DURATION));
                log.warn("Account locked due to {} failed attempts: {} from IP: {}",
                        user.getFailedLoginAttempts(), email, clientIp);
            } else {
                log.warn("Failed login attempt {} of {} for: {} from IP: {}",
                        user.getFailedLoginAttempts(), MAX_FAILED_ATTEMPTS, email, clientIp);
            }

            userRepository.save(user);
        });
    }

    @Transactional
    public void logout(UUID userId, HttpServletResponse response) {
        userRepository.findById(userId).ifPresent(user -> {
            refreshTokenRepository.revokeAllByUser(user);
        });
        cookieUtils.clearAuthCookies(response);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken, HttpServletResponse response) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new UnauthorizedException("Refresh token required");
        }

        RefreshTokenEntity tokenEntity = refreshTokenRepository
                .findByTokenAndRevokedFalse(refreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (tokenEntity.getExpiresAt().isBefore(Instant.now())) {
            tokenEntity.setRevoked(true);
            refreshTokenRepository.save(tokenEntity);
            throw new UnauthorizedException("Refresh token expired");
        }

        UserEntity user = tokenEntity.getUser();

        // Revoke old token
        tokenEntity.setRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        // Generate new tokens
        setAuthCookies(user, response);

        return toAuthResponse(user);
    }

    @Transactional
    public void verifyEmail(String token) {
        UserEntity user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (user.getEmailVerificationTokenExpiry().isBefore(Instant.now())) {
            throw new BadRequestException("Verification token expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    public void resendVerificationEmail(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Email already verified");
        }

        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationTokenExpiry(Instant.now().plusSeconds(86400)); // 24 hours
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), verificationToken);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(UUID userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toAuthResponse(user);
    }


    @Transactional
    public void forgotPassword(String email) {
        // Always return success to prevent email enumeration
        userRepository.findByEmail(email).ifPresent(user -> {
            // Don't send reset email for OAuth-only users
            if (user.getPasswordHash() == null && user.getOauthProvider() != null) {
                return;
            }

            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiry(Instant.now().plus(1, ChronoUnit.HOURS));
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), token);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        UserEntity user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getPasswordResetTokenExpiry() == null ||
            user.getPasswordResetTokenExpiry().isBefore(Instant.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        user.setLastPasswordChangeAt(Instant.now());
        // Reset any lockout on password change
        user.resetFailedLoginAttempts();
        userRepository.save(user);

        log.info("Password reset completed for user: {}", user.getUsername());

        // Invalidate all refresh tokens for security
        refreshTokenRepository.deleteByUserId(user.getId());
    }

    private void setAuthCookies(UserEntity user, HttpServletResponse response) {
        // Generate access token
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), user.getRole().name()
        );

        // Generate refresh token
        String refreshToken = jwtTokenProvider.generateRefreshToken();

        // Save refresh token to database
        RefreshTokenEntity refreshTokenEntity = new RefreshTokenEntity();
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setExpiresAt(
                Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpiration())
        );
        refreshTokenRepository.save(refreshTokenEntity);

        // Set cookies (convert milliseconds to seconds)
        int accessTokenMaxAge = (int) (jwtTokenProvider.getAccessTokenExpiration() / 1000);
        int refreshTokenMaxAge = (int) (jwtTokenProvider.getRefreshTokenExpiration() / 1000);

        cookieUtils.addAccessTokenCookie(response, accessToken, accessTokenMaxAge);
        cookieUtils.addRefreshTokenCookie(response, refreshToken, refreshTokenMaxAge);
    }

    private AuthResponse toAuthResponse(UserEntity user) {
        return new AuthResponse(
                user.getId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getRole().name(),
                user.isEmailVerified(),
                user.getCreatedAt().toString()
        );
    }
}
