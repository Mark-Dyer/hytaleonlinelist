package com.hytaleonlinelist.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * SMTP-based email service implementation.
 * This is the fallback when Postmark is not enabled (postmark.enabled=false or not set).
 */
@Service
@ConditionalOnProperty(name = "postmark.enabled", havingValue = "false", matchIfMissing = true)
public class EmailService implements EmailServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@hytaleonlinelist.com}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendVerificationEmail(String to, String username, String token) {
        String verifyUrl = frontendUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Verify your email - Hytale Online List");
        message.setText(
                "Hi " + username + ",\n\n" +
                "Welcome to Hytale Online List!\n\n" +
                "Please verify your email by clicking the link below:\n\n" +
                verifyUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create an account, please ignore this email.\n\n" +
                "- The Hytale Online List Team"
        );

        try {
            mailSender.send(message);
            logger.info("Verification email sent to {}", to);
        } catch (MailException e) {
            logger.error("Failed to send verification email to {}: {}", to, e.getMessage());
            // Don't throw - email sending should not block registration
        }
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String username, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Reset your password - Hytale Online List");
        message.setText(
                "Hi " + username + ",\n\n" +
                "You requested a password reset.\n\n" +
                "Click the link below to reset your password:\n\n" +
                resetUrl + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "- The Hytale Online List Team"
        );

        try {
            mailSender.send(message);
            logger.info("Password reset email sent to {}", to);
        } catch (MailException e) {
            logger.error("Failed to send password reset email to {}: {}", to, e.getMessage());
        }
    }
}
