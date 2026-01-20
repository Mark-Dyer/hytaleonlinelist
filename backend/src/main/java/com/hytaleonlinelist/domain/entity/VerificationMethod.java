package com.hytaleonlinelist.domain.entity;

/**
 * Methods available for verifying server ownership.
 */
public enum VerificationMethod {
    /**
     * Verify by adding a token to the server's MOTD (Message of the Day).
     * Most reliable as it proves direct control of the game server.
     */
    MOTD("MOTD Verification"),

    /**
     * Verify by adding a DNS TXT record to the server's domain.
     * Requires the server to have a custom domain.
     */
    DNS_TXT("DNS TXT Record"),

    /**
     * Verify by uploading a verification file to the server's website.
     * Requires the server to have a website with file upload capability.
     */
    FILE_UPLOAD("File Upload"),

    /**
     * Verify by confirming ownership of an email address matching the server's domain.
     * Requires the user's registered email domain to match the server's IP domain.
     * e.g., Server IP: play.example.com requires email like admin@example.com
     */
    EMAIL("Email Verification");

    private final String displayName;

    VerificationMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
