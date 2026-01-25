package com.hytaleonlinelist.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Utility class for extracting information from HTTP requests.
 */
public final class RequestUtils {

    private RequestUtils() {
        // Utility class - prevent instantiation
    }

    /**
     * Extracts the client IP address from the request.
     * Handles proxied requests by checking X-Forwarded-For and X-Real-IP headers.
     *
     * @param request the HTTP request
     * @return the client IP address
     */
    public static String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }

        // Check X-Forwarded-For header (standard for proxies/load balancers)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            // X-Forwarded-For can contain multiple IPs (client, proxy1, proxy2...)
            // Take the first one which is the original client
            return xForwardedFor.split(",")[0].trim();
        }

        // Check X-Real-IP header (used by some proxies like nginx)
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        // Fallback to remote address
        return request.getRemoteAddr();
    }

    /**
     * Gets the client IP from the current request context.
     * Useful when you don't have direct access to the HttpServletRequest.
     *
     * @return the client IP address, or null if no request context is available
     */
    public static String getClientIpFromContext() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return null;
        }
        return getClientIp(attrs.getRequest());
    }

    /**
     * Gets the current HTTP request from the request context.
     *
     * @return the current HttpServletRequest, or null if no request context is available
     */
    public static HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return null;
        }
        return attrs.getRequest();
    }
}
