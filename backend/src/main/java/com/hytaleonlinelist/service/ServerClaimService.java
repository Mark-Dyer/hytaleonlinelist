package com.hytaleonlinelist.service;

import com.hytaleonlinelist.domain.entity.*;
import com.hytaleonlinelist.domain.repository.ServerClaimAttemptRepository;
import com.hytaleonlinelist.domain.repository.ServerClaimInitiationRepository;
import com.hytaleonlinelist.domain.repository.ServerRepository;
import com.hytaleonlinelist.domain.repository.UserRepository;
import com.hytaleonlinelist.dto.request.InitiateClaimRequest;
import com.hytaleonlinelist.dto.response.ClaimInitiatedResponse;
import com.hytaleonlinelist.dto.response.ClaimStatusResponse;
import com.hytaleonlinelist.dto.response.VerificationResultResponse;
import com.hytaleonlinelist.exception.ResourceNotFoundException;
import com.hytaleonlinelist.exception.BadRequestException;
import com.hytaleonlinelist.service.verification.ServerVerifier;
import com.hytaleonlinelist.service.verification.ServerVerifier.VerificationResult;
import com.hytaleonlinelist.util.RequestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for handling server ownership claims and verification.
 * Supports concurrent claims where multiple users can attempt to claim
 * the same server simultaneously - first to verify wins.
 */
@Service
public class ServerClaimService {

    private static final Logger logger = LoggerFactory.getLogger(ServerClaimService.class);

    private static final int TOKEN_LENGTH = 16;
    private static final String TOKEN_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int TOKEN_EXPIRY_HOURS = 48;
    private static final int MAX_ATTEMPTS_PER_HOUR = 5;
    private static final int MAX_ATTEMPTS_PER_DAY = 20;

    private final ServerRepository serverRepository;
    private final ServerClaimAttemptRepository claimAttemptRepository;
    private final ServerClaimInitiationRepository claimInitiationRepository;
    private final UserRepository userRepository;
    private final Map<VerificationMethod, ServerVerifier> verifiers;
    private final SecureRandom secureRandom;

    public ServerClaimService(
            ServerRepository serverRepository,
            ServerClaimAttemptRepository claimAttemptRepository,
            ServerClaimInitiationRepository claimInitiationRepository,
            UserRepository userRepository,
            List<ServerVerifier> verifierList) {
        this.serverRepository = serverRepository;
        this.claimAttemptRepository = claimAttemptRepository;
        this.claimInitiationRepository = claimInitiationRepository;
        this.userRepository = userRepository;
        this.secureRandom = new SecureRandom();

        // Map verifiers by their method
        this.verifiers = verifierList.stream()
                .collect(Collectors.toMap(
                        ServerVerifier::getMethod,
                        v -> v
                ));

        logger.info("Initialized ServerClaimService with {} verification methods: {}",
                verifiers.size(), verifiers.keySet());
    }

    /**
     * Initiate a claim for a server.
     * Generates a verification token and returns instructions for the selected verification method.
     * Multiple users can initiate claims on the same server - first to verify wins.
     */
    @Transactional
    public ClaimInitiatedResponse initiateClaim(UUID serverId, UUID userId, InitiateClaimRequest request) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found with id: " + serverId));

        // Check if server is already owned and verified
        if (server.getOwner() != null && server.getVerifiedAt() != null) {
            throw new BadRequestException("This server has already been claimed and verified by another user.");
        }

        // Validate the verification method
        VerificationMethod method = request.verificationMethod();
        ServerVerifier verifier = verifiers.get(method);

        if (verifier == null) {
            throw new BadRequestException("Invalid verification method: " + method);
        }

        // Get the user
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if verification method is available for this user
        if (!verifier.isAvailableForUser(server, user)) {
            String reason = verifier.getUnavailableReason(server, user);
            if (reason == null) {
                reason = getMethodRequirementHint(method);
            }
            throw new BadRequestException("The " + method.getDisplayName() +
                    " verification method is not available. " + reason);
        }

        // Generate or reuse existing token on the server
        String token;
        Instant tokenExpiry;
        if (server.getClaimToken() != null &&
            server.getClaimTokenExpiry() != null &&
            server.getClaimTokenExpiry().isAfter(Instant.now())) {
            // Reuse existing valid token
            token = server.getClaimToken();
            tokenExpiry = server.getClaimTokenExpiry();
        } else {
            // Generate new token
            token = generateToken();
            tokenExpiry = Instant.now().plus(TOKEN_EXPIRY_HOURS, ChronoUnit.HOURS);
            server.setClaimToken(token);
            server.setClaimTokenExpiry(tokenExpiry);
            serverRepository.save(server);
        }

        // Create or update the user's claim initiation
        ServerClaimInitiationEntity initiation = claimInitiationRepository
                .findByServerIdAndUserId(serverId, userId)
                .orElse(null);

        if (initiation != null) {
            // User already has an initiation for this server
            if (initiation.getStatus() == ClaimInitiationStatus.PENDING && initiation.isActive()) {
                // Just update the verification method if changed
                initiation.setVerificationMethod(method);
            } else {
                // Previous initiation was completed/expired/cancelled - create fresh one
                initiation.setStatus(ClaimInitiationStatus.PENDING);
                initiation.setVerificationMethod(method);
                initiation.setInitiatedAt(Instant.now());
                initiation.setExpiresAt(tokenExpiry);
                initiation.setAttemptCount(0);
                initiation.setLastAttemptAt(null);
                initiation.setCancelledAt(null);
                initiation.setCompletedAt(null);
            }
        } else {
            // Create new initiation
            initiation = new ServerClaimInitiationEntity();
            initiation.setServer(server);
            initiation.setUser(user);
            initiation.setVerificationMethod(method);
            initiation.setExpiresAt(tokenExpiry);
        }

        claimInitiationRepository.save(initiation);

        // Get instructions for the verification method
        String instructions = verifier.getInstructions(server, token);

        // Calculate seconds until expiry
        long expiresInSeconds = ChronoUnit.SECONDS.between(Instant.now(), tokenExpiry);

        // Count how many other users are also claiming
        long otherClaimers = claimInitiationRepository.countActiveClaimsForServer(serverId, Instant.now()) - 1;

        logger.info("Claim initiated for server {} by user {} using method {} ({} other claimers)",
                serverId, userId, method, otherClaimers);

        return new ClaimInitiatedResponse(
                server.getId().toString(),
                server.getName(),
                method,
                token,
                instructions,
                expiresInSeconds
        );
    }

    /**
     * Attempt to verify a server claim using the specified method.
     * Any user with an active claim initiation can attempt verification.
     * First to successfully verify wins.
     */
    @Transactional
    public VerificationResultResponse attemptVerification(UUID serverId, UUID userId, VerificationMethod method) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found with id: " + serverId));

        // Check if already verified
        if (server.getVerifiedAt() != null) {
            return new VerificationResultResponse(
                    server.getId().toString(),
                    true,
                    server.getVerificationMethod(),
                    "This server is already verified."
            );
        }

        // Check if there's a valid claim token on the server
        if (server.getClaimToken() == null || server.getClaimTokenExpiry() == null ||
            server.getClaimTokenExpiry().isBefore(Instant.now())) {
            throw new BadRequestException("No active claim token found. Please initiate a claim first.");
        }

        // Get the user's claim initiation
        ServerClaimInitiationEntity initiation = claimInitiationRepository
                .findByServerIdAndUserId(serverId, userId)
                .orElseThrow(() -> new BadRequestException(
                        "You must initiate a claim before attempting verification."));

        // Check if the initiation is still active
        if (initiation.getStatus() != ClaimInitiationStatus.PENDING) {
            throw new BadRequestException("Your claim is no longer active. Status: " +
                    initiation.getStatus().getDisplayName());
        }

        if (initiation.isExpired()) {
            initiation.markExpired();
            claimInitiationRepository.save(initiation);
            throw new BadRequestException("Your claim has expired. Please initiate a new claim.");
        }

        // Check rate limiting
        checkRateLimit(serverId, userId);

        // Get the verifier
        ServerVerifier verifier = verifiers.get(method);
        if (verifier == null) {
            throw new BadRequestException("Invalid verification method: " + method);
        }

        // Get full user entity
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!verifier.isAvailableForUser(server, user)) {
            String reason = verifier.getUnavailableReason(server, user);
            throw new BadRequestException("The " + method.getDisplayName() +
                    " verification method is not available. " +
                    (reason != null ? reason : ""));
        }

        // Record the attempt in both tables
        initiation.recordAttempt();

        ServerClaimAttemptEntity attempt = new ServerClaimAttemptEntity();
        attempt.setServer(server);
        attempt.setUser(user);
        attempt.setVerificationMethod(method);
        attempt.setIpAddress(RequestUtils.getClientIpFromContext());

        // Perform verification
        VerificationResult result = verifier.verifyWithUser(server, server.getClaimToken(), user);

        attempt.setIsSuccessful(result.success());
        attempt.setFailureReason(result.success() ? null : result.message());
        claimAttemptRepository.save(attempt);

        if (result.success()) {
            // Mark this initiation as verified
            initiation.markVerified();
            claimInitiationRepository.save(initiation);

            // Mark all other pending initiations for this server as CLAIMED_BY_OTHER
            claimInitiationRepository.markOtherClaimsAsClaimedByOther(
                    serverId, userId, Instant.now());

            // Set the server owner
            server.setOwner(user);
            server.setVerificationMethod(method);
            server.setVerifiedAt(Instant.now());
            server.setClaimToken(null);
            server.setClaimTokenExpiry(null);
            serverRepository.save(server);

            logger.info("Server {} successfully verified by user {} using method {}",
                    serverId, userId, method);

            return new VerificationResultResponse(
                    server.getId().toString(),
                    true,
                    method,
                    result.message()
            );
        } else {
            claimInitiationRepository.save(initiation);

            logger.info("Verification attempt failed for server {} by user {}: {}",
                    serverId, userId, result.message());

            return new VerificationResultResponse(
                    server.getId().toString(),
                    false,
                    method,
                    result.message()
            );
        }
    }

    /**
     * Get the claim/verification status of a server.
     */
    @Transactional(readOnly = true)
    public ClaimStatusResponse getClaimStatus(UUID serverId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found with id: " + serverId));

        boolean isClaimed = server.getOwner() != null;
        boolean isVerified = server.getVerifiedAt() != null;

        boolean hasActiveClaimToken = server.getClaimToken() != null &&
                server.getClaimTokenExpiry() != null &&
                server.getClaimTokenExpiry().isAfter(Instant.now());

        // Count active claimers
        long activeClaimerCount = hasActiveClaimToken ?
                claimInitiationRepository.countActiveClaimsForServer(serverId, Instant.now()) : 0;

        return new ClaimStatusResponse(
                server.getId().toString(),
                server.getName(),
                isClaimed,
                isVerified,
                server.getOwner() != null ? server.getOwner().getId().toString() : null,
                server.getOwner() != null ? server.getOwner().getUsername() : null,
                server.getVerificationMethod(),
                server.getVerifiedAt() != null ? server.getVerifiedAt().toString() : null,
                hasActiveClaimToken,
                server.getClaimTokenExpiry() != null ? server.getClaimTokenExpiry().toString() : null
        );
    }

    /**
     * Get a user's claim initiation for a server, if any.
     */
    @Transactional(readOnly = true)
    public Optional<ServerClaimInitiationEntity> getUserClaimInitiation(UUID serverId, UUID userId) {
        return claimInitiationRepository.findByServerIdAndUserId(serverId, userId);
    }

    /**
     * Get all claim initiations by a user.
     */
    @Transactional(readOnly = true)
    public List<ServerClaimInitiationEntity> getUserClaimInitiations(UUID userId) {
        return claimInitiationRepository.findByUserIdOrderByInitiatedAtDesc(userId);
    }

    /**
     * Get all active (pending) claim initiations by a user.
     */
    @Transactional(readOnly = true)
    public List<ServerClaimInitiationEntity> getUserActiveClaimInitiations(UUID userId) {
        return claimInitiationRepository.findActiveClaimsByUser(userId, Instant.now());
    }

    /**
     * Get all claim initiations for a server.
     */
    @Transactional(readOnly = true)
    public List<ServerClaimInitiationEntity> getServerClaimInitiations(UUID serverId) {
        return claimInitiationRepository.findByServerId(serverId);
    }

    /**
     * Get available verification methods for a server.
     */
    @Transactional(readOnly = true)
    public List<VerificationMethodInfo> getAvailableMethods(UUID serverId) {
        return getAvailableMethods(serverId, null);
    }

    /**
     * Get available verification methods for a server with user context.
     */
    @Transactional(readOnly = true)
    public List<VerificationMethodInfo> getAvailableMethods(UUID serverId, UUID userId) {
        ServerEntity server = serverRepository.findById(serverId)
                .orElseThrow(() -> new ResourceNotFoundException("Server not found with id: " + serverId));

        UserEntity user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        List<VerificationMethodInfo> methods = new ArrayList<>();

        for (ServerVerifier verifier : verifiers.values()) {
            boolean serverAvailable = verifier.isAvailable(server);
            boolean userAvailable = user != null ?
                    verifier.isAvailableForUser(server, user) :
                    serverAvailable;

            String unavailableReason = null;
            if (!userAvailable) {
                unavailableReason = verifier.getUnavailableReason(server, user);
                if (unavailableReason == null && !serverAvailable) {
                    unavailableReason = getMethodRequirementHint(verifier.getMethod());
                }
            }

            methods.add(new VerificationMethodInfo(
                    verifier.getMethod(),
                    verifier.getMethod().getDisplayName(),
                    getMethodDescription(verifier.getMethod()),
                    userAvailable,
                    unavailableReason
            ));
        }

        methods.sort((a, b) -> Boolean.compare(!a.available(), !b.available()));
        return methods;
    }

    /**
     * Cancel a pending claim.
     */
    @Transactional
    public void cancelClaim(UUID serverId, UUID userId) {
        ServerClaimInitiationEntity initiation = claimInitiationRepository
                .findByServerIdAndUserId(serverId, userId)
                .orElseThrow(() -> new BadRequestException(
                        "You don't have a claim on this server."));

        if (initiation.getStatus() != ClaimInitiationStatus.PENDING) {
            throw new BadRequestException("This claim is no longer active and cannot be cancelled.");
        }

        initiation.markCancelled();
        claimInitiationRepository.save(initiation);

        logger.info("Claim cancelled for server {} by user {}", serverId, userId);
    }

    /**
     * Mark expired pending claims as EXPIRED.
     * This should be called periodically by a scheduled job.
     */
    @Transactional
    public int expirePendingClaims() {
        int expired = claimInitiationRepository.markExpiredClaims(Instant.now());
        if (expired > 0) {
            logger.info("Marked {} pending claims as expired", expired);
        }
        return expired;
    }

    /**
     * Delete old completed claims for cleanup.
     * Keeps claims for a certain period for audit purposes.
     */
    @Transactional
    public int cleanupOldClaims(int daysToKeep) {
        Instant cutoff = Instant.now().minus(daysToKeep, ChronoUnit.DAYS);
        int deleted = claimInitiationRepository.deleteOldCompletedClaims(cutoff);
        if (deleted > 0) {
            logger.info("Deleted {} old completed claims older than {} days", deleted, daysToKeep);
        }
        return deleted;
    }

    private String generateToken() {
        StringBuilder token = new StringBuilder(TOKEN_LENGTH);
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            int index = secureRandom.nextInt(TOKEN_CHARACTERS.length());
            token.append(TOKEN_CHARACTERS.charAt(index));
        }
        return token.toString();
    }

    private void checkRateLimit(UUID serverId, UUID userId) {
        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant oneDayAgo = Instant.now().minus(24, ChronoUnit.HOURS);

        long hourlyAttempts = claimAttemptRepository.countAttemptsByUserSince(userId, oneHourAgo);
        if (hourlyAttempts >= MAX_ATTEMPTS_PER_HOUR) {
            throw new BadRequestException(
                    "Too many verification attempts. Please wait before trying again. " +
                    "(Limit: " + MAX_ATTEMPTS_PER_HOUR + " per hour)");
        }

        long dailyAttempts = claimAttemptRepository.countAttemptsByUserSince(userId, oneDayAgo);
        if (dailyAttempts >= MAX_ATTEMPTS_PER_DAY) {
            throw new BadRequestException(
                    "Daily verification attempt limit reached. Please try again tomorrow. " +
                    "(Limit: " + MAX_ATTEMPTS_PER_DAY + " per day)");
        }
    }

    private String getMethodDescription(VerificationMethod method) {
        return switch (method) {
            case MOTD -> "Add a verification code to your server's Message of the Day (MOTD).";
            case DNS_TXT -> "Add a DNS TXT record to your domain to prove ownership.";
            case FILE_UPLOAD -> "Upload a verification file to your website's root directory.";
            case EMAIL -> "Verify using your registered email that matches the server's domain.";
        };
    }

    private String getMethodRequirementHint(VerificationMethod method) {
        return switch (method) {
            case MOTD -> "Requires the server to be online and queryable.";
            case DNS_TXT -> "Requires a domain name (not an IP address).";
            case FILE_UPLOAD -> "Requires a website URL configured for the server.";
            case EMAIL -> "Requires your registered email domain to match the server's domain.";
        };
    }

    /**
     * Information about a verification method.
     */
    public record VerificationMethodInfo(
            VerificationMethod method,
            String displayName,
            String description,
            boolean available,
            String requirementHint
    ) {}
}
