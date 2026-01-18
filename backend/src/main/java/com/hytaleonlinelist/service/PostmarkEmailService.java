package com.hytaleonlinelist.service;

import com.postmarkapp.postmark.client.ApiClient;
import com.postmarkapp.postmark.client.data.model.message.MessageResponse;
import com.postmarkapp.postmark.client.data.model.templates.TemplatedMessage;
import com.postmarkapp.postmark.client.exception.PostmarkException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Year;
import java.util.HashMap;
import java.util.Map;

/**
 * Email service implementation using Postmark Template API.
 * This service is activated when postmark.enabled=true and takes precedence
 * over the default SMTP-based EmailService.
 *
 * Templates must be created in the Postmark dashboard with the following aliases:
 * - welcome-verification: Email verification template
 * - password-reset: Password reset template
 */
@Service
@Primary
@ConditionalOnProperty(name = "postmark.enabled", havingValue = "true")
public class PostmarkEmailService implements EmailServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(PostmarkEmailService.class);

    private final ApiClient postmarkClient;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${postmark.from-email}")
    private String fromEmail;

    @Value("${postmark.message-stream:outbound}")
    private String messageStream;

    @Value("${postmark.templates.welcome-verification:welcome-verification}")
    private String welcomeVerificationTemplateAlias;

    @Value("${postmark.templates.password-reset:password-reset}")
    private String passwordResetTemplateAlias;

    @Value("${postmark.support-email:support@hytaleonlinelist.com}")
    private String supportEmail;

    public PostmarkEmailService(ApiClient postmarkClient) {
        this.postmarkClient = postmarkClient;
        logger.info("Postmark email service initialized with Template API");
    }

    /**
     * Send email verification email via Postmark Template API.
     */
    @Override
    @Async
    public void sendVerificationEmail(String to, String username, String token) {
        String verifyUrl = frontendUrl + "/verify-email?token=" + token;

        Map<String, Object> model = new HashMap<>();
        model.put("username", username);
        model.put("action_url", verifyUrl);
        model.put("product_url", frontendUrl);
        model.put("support_email", supportEmail);
        model.put("current_year", Year.now().getValue());

        sendTemplatedEmail(to, welcomeVerificationTemplateAlias, model);
    }

    /**
     * Send password reset email via Postmark Template API.
     */
    @Override
    @Async
    public void sendPasswordResetEmail(String to, String username, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        Map<String, Object> model = new HashMap<>();
        model.put("username", username);
        model.put("action_url", resetUrl);
        model.put("product_url", frontendUrl);
        model.put("support_email", supportEmail);
        model.put("current_year", Year.now().getValue());
        // These can be populated with actual request info if available
        model.put("ip_address", "Not available");
        model.put("request_date", java.time.LocalDateTime.now().toString());

        sendTemplatedEmail(to, passwordResetTemplateAlias, model);
    }

    /**
     * Core method to send templated email via Postmark Template API.
     */
    private void sendTemplatedEmail(String to, String templateAlias, Map<String, Object> model) {
        try {
            TemplatedMessage message = new TemplatedMessage(fromEmail, to);
            message.setTemplateAlias(templateAlias);
            message.setTemplateModel(model);
            message.setMessageStream(messageStream);

            MessageResponse response = postmarkClient.deliverMessageWithTemplate(message);

            logger.info("Templated email sent successfully via Postmark to {} using template '{}' - MessageID: {}",
                    to, templateAlias, response.getMessageId());
        } catch (PostmarkException e) {
            logger.error("Postmark API error sending templated email to {} with template '{}': {} (Error Code: {})",
                    to, templateAlias, e.getMessage(), e.getErrorCode());
        } catch (IOException e) {
            logger.error("IO error sending templated email via Postmark to {}: {}", to, e.getMessage());
        }
    }
}
