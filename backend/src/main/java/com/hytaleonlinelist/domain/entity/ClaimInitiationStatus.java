package com.hytaleonlinelist.domain.entity;

/**
 * Status of a server claim initiation.
 * Tracks the lifecycle of a user's attempt to claim a server.
 */
public enum ClaimInitiationStatus {
    /**
     * Active claim in progress, awaiting verification.
     */
    PENDING("Pending", "Claim is active and awaiting verification"),

    /**
     * Successfully verified - user became the server owner.
     */
    VERIFIED("Verified", "Successfully verified and claimed"),

    /**
     * Token expired before verification was completed.
     */
    EXPIRED("Expired", "Claim expired before verification"),

    /**
     * User cancelled their claim.
     */
    CANCELLED("Cancelled", "Claim was cancelled by user"),

    /**
     * Another user verified first and claimed the server.
     */
    CLAIMED_BY_OTHER("Claimed by Other", "Another user claimed this server first");

    private final String displayName;
    private final String description;

    ClaimInitiationStatus(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if this status represents an active/pending claim.
     */
    public boolean isActive() {
        return this == PENDING;
    }

    /**
     * Check if this status represents a terminal state (no further action possible).
     */
    public boolean isTerminal() {
        return this != PENDING;
    }
}
