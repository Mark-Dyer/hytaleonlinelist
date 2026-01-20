package com.hytaleonlinelist.service.verification;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.entity.VerificationMethod;

/**
 * Interface for server ownership verification implementations.
 */
public interface ServerVerifier {

    /**
     * Get the verification method this verifier handles.
     */
    VerificationMethod getMethod();

    /**
     * Check if this verification method is available for the given server.
     * For example, DNS verification requires the server to have a domain.
     */
    boolean isAvailable(ServerEntity server);

    /**
     * Check if this verification method is available for the given server and user.
     * Some methods (like EMAIL) may require user-specific conditions.
     * Default implementation delegates to isAvailable(server).
     *
     * @param server The server to check availability for
     * @param user The user attempting verification (can be null for anonymous checks)
     * @return true if the method is available for this server/user combination
     */
    default boolean isAvailableForUser(ServerEntity server, UserEntity user) {
        return isAvailable(server);
    }

    /**
     * Get the reason why this method is unavailable for the given user.
     * Returns null if the method is available or if there's no user-specific reason.
     *
     * @param server The server
     * @param user The user (can be null)
     * @return A user-friendly message explaining why the method is unavailable, or null
     */
    default String getUnavailableReason(ServerEntity server, UserEntity user) {
        return null;
    }

    /**
     * Get human-readable instructions for this verification method.
     */
    String getInstructions(ServerEntity server, String token);

    /**
     * Attempt to verify the server using the provided token.
     *
     * @param server The server to verify
     * @param token The verification token to look for
     * @return VerificationResult containing success status and message
     */
    VerificationResult verify(ServerEntity server, String token);

    /**
     * Attempt to verify the server with user context.
     * Some methods (like EMAIL) may use user info for verification.
     * Default implementation delegates to verify(server, token).
     *
     * @param server The server to verify
     * @param token The verification token
     * @param user The user attempting verification
     * @return VerificationResult containing success status and message
     */
    default VerificationResult verifyWithUser(ServerEntity server, String token, UserEntity user) {
        return verify(server, token);
    }

    /**
     * Result of a verification attempt.
     */
    record VerificationResult(boolean success, String message) {}
}
