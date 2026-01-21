package com.hytaleonlinelist.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

/**
 * Filter for logging HTTP requests and responses.
 * Logs request details at the start and response details with timing at the end.
 *
 * In production, this logs at INFO level with minimal details.
 * In development, this logs at DEBUG level with more verbose information.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1) // Run after CorrelationIdFilter
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    // Endpoints to skip logging (health checks, static resources, etc.)
    private static final Set<String> SKIP_LOGGING_PATHS = Set.of(
            "/actuator/health",
            "/actuator/health/liveness",
            "/actuator/health/readiness",
            "/favicon.ico"
    );

    // Sensitive headers that should not be logged
    private static final Set<String> SENSITIVE_HEADERS = Set.of(
            "authorization",
            "cookie",
            "x-api-key",
            "x-auth-token"
    );

    // Maximum body size to log (to prevent memory issues)
    private static final int MAX_BODY_LOG_SIZE = 1000;

    // Maximum content cache size for request body (10KB)
    private static final int MAX_CONTENT_CACHE_SIZE = 10240;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Skip logging for certain paths
        if (shouldSkipLogging(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        long startTime = System.currentTimeMillis();
        String correlationId = CorrelationIdFilter.getCurrentCorrelationId();

        // Wrap request and response for body caching (only in debug mode)
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request, MAX_CONTENT_CACHE_SIZE);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        // Log request start
        logRequestStart(wrappedRequest, correlationId);

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            // Log request completion
            logRequestCompletion(wrappedRequest, wrappedResponse, duration, correlationId);

            // Copy body to response (required when using ContentCachingResponseWrapper)
            wrappedResponse.copyBodyToResponse();
        }
    }

    private boolean shouldSkipLogging(HttpServletRequest request) {
        String path = request.getRequestURI();
        return SKIP_LOGGING_PATHS.contains(path);
    }

    private void logRequestStart(ContentCachingRequestWrapper request, String correlationId) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();

        if (log.isDebugEnabled()) {
            // Verbose logging for development
            StringBuilder sb = new StringBuilder();
            sb.append("Incoming request: ").append(method).append(" ").append(uri);
            if (queryString != null) {
                sb.append("?").append(queryString);
            }
            sb.append(" | Headers: ").append(getSafeHeaders(request));

            log.debug(sb.toString());
        } else if (log.isInfoEnabled()) {
            // Minimal logging for production
            String fullPath = queryString != null ? uri + "?" + queryString : uri;
            log.info("Request started: {} {}", method, fullPath);
        }
    }

    private void logRequestCompletion(ContentCachingRequestWrapper request,
                                      ContentCachingResponseWrapper response,
                                      long durationMs,
                                      String correlationId) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();

        if (log.isDebugEnabled()) {
            // Verbose logging for development
            StringBuilder sb = new StringBuilder();
            sb.append("Request completed: ").append(method).append(" ").append(uri);
            sb.append(" | Status: ").append(status);
            sb.append(" | Duration: ").append(durationMs).append("ms");
            sb.append(" | Response size: ").append(response.getContentSize()).append(" bytes");

            // Log response body for errors (in debug mode only)
            if (status >= 400) {
                String responseBody = getResponseBody(response);
                if (responseBody != null && !responseBody.isEmpty()) {
                    sb.append(" | Body: ").append(responseBody);
                }
            }

            log.debug(sb.toString());
        } else if (log.isInfoEnabled()) {
            // Structured logging for production
            if (status >= 500) {
                log.error("Request failed: {} {} | Status: {} | Duration: {}ms",
                        method, uri, status, durationMs);
            } else if (status >= 400) {
                log.warn("Request error: {} {} | Status: {} | Duration: {}ms",
                        method, uri, status, durationMs);
            } else if (durationMs > 5000) {
                // Log slow requests
                log.warn("Slow request: {} {} | Status: {} | Duration: {}ms",
                        method, uri, status, durationMs);
            } else {
                log.info("Request completed: {} {} | Status: {} | Duration: {}ms",
                        method, uri, status, durationMs);
            }
        }
    }

    private String getSafeHeaders(HttpServletRequest request) {
        StringBuilder headers = new StringBuilder("{");
        Collection<String> headerNames = Collections.list(request.getHeaderNames());

        boolean first = true;
        for (String headerName : headerNames) {
            if (!first) {
                headers.append(", ");
            }
            first = false;

            String lowerHeaderName = headerName.toLowerCase();
            if (SENSITIVE_HEADERS.contains(lowerHeaderName)) {
                headers.append(headerName).append(": [REDACTED]");
            } else {
                headers.append(headerName).append(": ").append(request.getHeader(headerName));
            }
        }
        headers.append("}");
        return headers.toString();
    }

    private String getResponseBody(ContentCachingResponseWrapper response) {
        try {
            byte[] content = response.getContentAsByteArray();
            if (content.length == 0) {
                return null;
            }

            int length = Math.min(content.length, MAX_BODY_LOG_SIZE);
            String body = new String(content, 0, length, response.getCharacterEncoding());

            if (content.length > MAX_BODY_LOG_SIZE) {
                body += "... [truncated]";
            }

            // Sanitize body to prevent log injection
            return body.replace("\n", " ").replace("\r", " ");
        } catch (Exception e) {
            return "[Unable to read body]";
        }
    }
}
