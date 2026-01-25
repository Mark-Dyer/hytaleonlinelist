package com.hytaleonlinelist.filter;

import com.hytaleonlinelist.util.RequestUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter that generates or extracts correlation IDs for request tracing.
 * The correlation ID is added to MDC for logging and returned in response headers.
 *
 * Priority: Should run before all other filters to ensure correlation ID is available.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String CORRELATION_ID_MDC_KEY = "correlationId";
    public static final String USER_ID_MDC_KEY = "userId";
    public static final String REQUEST_METHOD_MDC_KEY = "requestMethod";
    public static final String REQUEST_URI_MDC_KEY = "requestUri";
    public static final String CLIENT_IP_MDC_KEY = "clientIp";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // Get or generate correlation ID
            String correlationId = extractOrGenerateCorrelationId(request);

            // Add to MDC for logging
            MDC.put(CORRELATION_ID_MDC_KEY, correlationId);
            MDC.put(REQUEST_METHOD_MDC_KEY, request.getMethod());
            MDC.put(REQUEST_URI_MDC_KEY, request.getRequestURI());
            MDC.put(CLIENT_IP_MDC_KEY, RequestUtils.getClientIp(request));

            // Add to response header for client correlation
            response.setHeader(CORRELATION_ID_HEADER, correlationId);

            filterChain.doFilter(request, response);
        } finally {
            // Clean up MDC to prevent memory leaks
            MDC.remove(CORRELATION_ID_MDC_KEY);
            MDC.remove(USER_ID_MDC_KEY);
            MDC.remove(REQUEST_METHOD_MDC_KEY);
            MDC.remove(REQUEST_URI_MDC_KEY);
            MDC.remove(CLIENT_IP_MDC_KEY);
        }
    }

    private String extractOrGenerateCorrelationId(HttpServletRequest request) {
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);

        if (correlationId == null || correlationId.isBlank()) {
            // Generate a new correlation ID if not provided
            correlationId = generateCorrelationId();
        } else {
            // Sanitize the correlation ID to prevent log injection
            correlationId = sanitizeCorrelationId(correlationId);
        }

        return correlationId;
    }

    private String generateCorrelationId() {
        return UUID.randomUUID().toString();
    }

    private String sanitizeCorrelationId(String correlationId) {
        // Limit length and remove potentially dangerous characters
        if (correlationId.length() > 64) {
            correlationId = correlationId.substring(0, 64);
        }
        // Only allow alphanumeric characters, hyphens, and underscores
        return correlationId.replaceAll("[^a-zA-Z0-9\\-_]", "");
    }

    /**
     * Utility method to set the user ID in MDC after authentication.
     * Should be called from JwtAuthenticationFilter after successful authentication.
     */
    public static void setUserId(String userId) {
        if (userId != null) {
            MDC.put(USER_ID_MDC_KEY, userId);
        }
    }

    /**
     * Get the current correlation ID from MDC.
     */
    public static String getCurrentCorrelationId() {
        return MDC.get(CORRELATION_ID_MDC_KEY);
    }
}
