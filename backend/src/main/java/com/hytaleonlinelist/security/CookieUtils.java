package com.hytaleonlinelist.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {

    @Value("${app.cookie-domain}")
    private String cookieDomain;

    @Value("${app.cookie-secure}")
    private boolean cookieSecure;

    public void addAccessTokenCookie(HttpServletResponse response, String token, int maxAgeSeconds) {
        Cookie cookie = new Cookie("access_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/");
        cookie.setMaxAge(maxAgeSeconds);
        cookie.setAttribute("SameSite", "Lax");
        response.addCookie(cookie);
    }

    public void addRefreshTokenCookie(HttpServletResponse response, String token, int maxAgeSeconds) {
        Cookie cookie = new Cookie("refresh_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath("/api/auth/refresh");
        cookie.setMaxAge(maxAgeSeconds);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    public void clearAuthCookies(HttpServletResponse response) {
        Cookie accessCookie = new Cookie("access_token", "");
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(cookieSecure);
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0);
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refresh_token", "");
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(cookieSecure);
        refreshCookie.setPath("/api/auth/refresh");
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);
    }
}
