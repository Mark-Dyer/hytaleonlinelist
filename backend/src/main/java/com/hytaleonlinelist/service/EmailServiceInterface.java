package com.hytaleonlinelist.service;

/**
 * Interface for email service implementations.
 * Allows switching between SMTP and Postmark implementations.
 */
public interface EmailServiceInterface {

    /**
     * Send email verification email.
     *
     * @param to       recipient email address
     * @param username user's display name
     * @param token    verification token
     */
    void sendVerificationEmail(String to, String username, String token);

    /**
     * Send password reset email.
     *
     * @param to       recipient email address
     * @param username user's display name
     * @param token    password reset token
     */
    void sendPasswordResetEmail(String to, String username, String token);
}
