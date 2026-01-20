package com.hytaleonlinelist.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Application configuration properties.
 */
@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String frontendUrl = "http://localhost:3000";
    private String cookieDomain = "localhost";
    private boolean cookieSecure = false;
    private boolean registrationEnabled = true;
    private boolean discordLoginEnabled = true;
    private boolean googleLoginEnabled = true;

    public String getFrontendUrl() {
        return frontendUrl;
    }

    public void setFrontendUrl(String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    public String getCookieDomain() {
        return cookieDomain;
    }

    public void setCookieDomain(String cookieDomain) {
        this.cookieDomain = cookieDomain;
    }

    public boolean isCookieSecure() {
        return cookieSecure;
    }

    public void setCookieSecure(boolean cookieSecure) {
        this.cookieSecure = cookieSecure;
    }

    public boolean isRegistrationEnabled() {
        return registrationEnabled;
    }

    public void setRegistrationEnabled(boolean registrationEnabled) {
        this.registrationEnabled = registrationEnabled;
    }

    public boolean isDiscordLoginEnabled() {
        return discordLoginEnabled;
    }

    public void setDiscordLoginEnabled(boolean discordLoginEnabled) {
        this.discordLoginEnabled = discordLoginEnabled;
    }

    public boolean isGoogleLoginEnabled() {
        return googleLoginEnabled;
    }

    public void setGoogleLoginEnabled(boolean googleLoginEnabled) {
        this.googleLoginEnabled = googleLoginEnabled;
    }
}
