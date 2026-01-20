package com.hytaleonlinelist.service.verification;

import com.hytaleonlinelist.domain.entity.ServerEntity;
import com.hytaleonlinelist.domain.entity.UserEntity;
import com.hytaleonlinelist.domain.entity.VerificationMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.util.regex.Pattern;

/**
 * Verifies server ownership by checking if the user's registered email
 * domain matches the server's domain.
 *
 * For example:
 * - Server IP: play.mrsupertips.com
 * - User email: admin@mrsupertips.com
 * - Since the domains match and the user verified their email during signup,
 *   we can verify their ownership of the domain.
 */
@Component
public class EmailVerifier implements ServerVerifier {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerifier.class);

    // Pattern to match IP addresses
    private static final Pattern IP_PATTERN = Pattern.compile(
            "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    );

    @Override
    public VerificationMethod getMethod() {
        return VerificationMethod.EMAIL;
    }

    @Override
    public boolean isAvailable(ServerEntity server) {
        // Email verification requires the server to have a domain name, not just an IP
        return server.getIpAddress() != null &&
               !server.getIpAddress().isBlank() &&
               !isIpAddress(server.getIpAddress());
    }

    @Override
    public boolean isAvailableForUser(ServerEntity server, UserEntity user) {
        // First check basic availability
        if (!isAvailable(server)) {
            return false;
        }

        // User must be provided and have a verified email
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return false;
        }

        // Check if user's email domain matches the server's domain
        String serverDomain = extractRootDomain(server.getIpAddress());
        String emailDomain = extractEmailDomain(user.getEmail());

        return serverDomain != null && emailDomain != null &&
               serverDomain.equalsIgnoreCase(emailDomain);
    }

    @Override
    public String getUnavailableReason(ServerEntity server, UserEntity user) {
        if (!isAvailable(server)) {
            return "Email verification requires the server to have a domain name (not an IP address).";
        }

        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return "Email verification requires a verified email address.";
        }

        String serverDomain = extractRootDomain(server.getIpAddress());
        String emailDomain = extractEmailDomain(user.getEmail());

        if (serverDomain == null) {
            return "Could not determine the server's domain.";
        }

        if (emailDomain == null) {
            return "Could not determine your email domain.";
        }

        if (!serverDomain.equalsIgnoreCase(emailDomain)) {
            return String.format(
                "Your email domain (%s) does not match the server's domain (%s). " +
                "Email verification requires your registered email to be from the same domain as the server.",
                emailDomain, serverDomain
            );
        }

        return null; // Available
    }

    @Override
    public String getInstructions(ServerEntity server, String token) {
        String serverDomain = extractRootDomain(server.getIpAddress());
        return """
            Email Domain Verification:

            Your registered email address matches the server's domain (%s).

            Since you have already verified your email during account registration,
            we can confirm that you have access to emails for this domain.

            Click "Verify" to complete the verification process.

            Note: This verification method is instant and does not require any
            additional steps since your email ownership has already been confirmed.
            """.formatted(serverDomain != null ? serverDomain : server.getIpAddress());
    }

    @Override
    public VerificationResult verify(ServerEntity server, String token) {
        // This should not be called directly - use verifyWithUser instead
        logger.warn("EmailVerifier.verify() called without user context");
        return new VerificationResult(false,
            "Email verification requires user context. Please try again.");
    }

    @Override
    public VerificationResult verifyWithUser(ServerEntity server, String token, UserEntity user) {
        logger.info("Attempting email verification for server {} by user {}",
                server.getId(), user != null ? user.getId() : "null");

        if (user == null || user.getEmail() == null) {
            return new VerificationResult(false, "User email information is required.");
        }

        String serverDomain = extractRootDomain(server.getIpAddress());
        String emailDomain = extractEmailDomain(user.getEmail());

        if (serverDomain == null) {
            return new VerificationResult(false,
                "Could not determine the server's domain. Please use a different verification method.");
        }

        if (emailDomain == null) {
            return new VerificationResult(false,
                "Could not determine your email domain. Please contact support.");
        }

        if (!serverDomain.equalsIgnoreCase(emailDomain)) {
            logger.info("Email verification failed - domain mismatch: {} vs {}",
                    emailDomain, serverDomain);
            return new VerificationResult(false,
                String.format("Your email domain (%s) does not match the server's domain (%s).",
                    emailDomain, serverDomain));
        }

        // Check if user's email is verified (they should have verified during signup)
        if (!user.isEmailVerified()) {
            return new VerificationResult(false,
                "Your email address has not been verified. Please verify your email first.");
        }

        logger.info("Email verification successful for server {} by user {}",
                server.getId(), user.getId());
        return new VerificationResult(true,
            "Verification successful! Your server ownership has been confirmed via email domain matching.");
    }

    /**
     * Check if the given string is an IP address.
     */
    private boolean isIpAddress(String address) {
        if (address == null || address.isBlank()) {
            return false;
        }

        // Check for IPv4
        if (IP_PATTERN.matcher(address).matches()) {
            return true;
        }

        // Try to parse as IP to catch edge cases
        try {
            InetAddress inetAddress = InetAddress.getByName(address);
            return inetAddress.getHostAddress().equals(address);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extract the root domain from a hostname.
     * e.g., "play.mrsupertips.com" -> "mrsupertips.com"
     * e.g., "mc.server.example.co.uk" -> "example.co.uk" (simplified handling)
     */
    private String extractRootDomain(String hostname) {
        if (hostname == null || hostname.isBlank()) {
            return null;
        }

        // Remove any port if present
        String domain = hostname.split(":")[0].toLowerCase().trim();

        // Skip if it's an IP address
        if (isIpAddress(domain)) {
            return null;
        }

        // Split by dots
        String[] parts = domain.split("\\.");

        if (parts.length < 2) {
            return domain; // Already a simple domain
        }

        // Handle common two-part TLDs (co.uk, com.au, etc.)
        String lastPart = parts[parts.length - 1];
        String secondLastPart = parts[parts.length - 2];

        // Common two-part TLDs
        if (parts.length >= 3 && isCommonSecondLevelDomain(secondLastPart, lastPart)) {
            // e.g., example.co.uk -> example.co.uk
            return parts[parts.length - 3] + "." + secondLastPart + "." + lastPart;
        }

        // Standard case: return last two parts
        // e.g., play.mrsupertips.com -> mrsupertips.com
        return secondLastPart + "." + lastPart;
    }

    /**
     * Check if this is a common two-part TLD like co.uk, com.au, etc.
     */
    private boolean isCommonSecondLevelDomain(String secondLevel, String topLevel) {
        // Common patterns
        return ("co".equals(secondLevel) || "com".equals(secondLevel) ||
                "org".equals(secondLevel) || "net".equals(secondLevel) ||
                "gov".equals(secondLevel) || "edu".equals(secondLevel) ||
                "ac".equals(secondLevel)) &&
               ("uk".equals(topLevel) || "au".equals(topLevel) ||
                "nz".equals(topLevel) || "za".equals(topLevel) ||
                "in".equals(topLevel) || "jp".equals(topLevel));
    }

    /**
     * Extract the domain from an email address.
     * e.g., "admin@mrsupertips.com" -> "mrsupertips.com"
     */
    private String extractEmailDomain(String email) {
        if (email == null || email.isBlank() || !email.contains("@")) {
            return null;
        }

        String[] parts = email.split("@");
        if (parts.length != 2) {
            return null;
        }

        return parts[1].toLowerCase().trim();
    }
}
