package com.hytaleonlinelist.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuration that provides OAuth2 client registrations when the 'oauth' profile is active.
 * This manually creates registrations since OAuth2ClientAutoConfiguration is excluded.
 *
 * Enable by running with: --spring.profiles.active=local,oauth
 */
@Configuration
@Profile("oauth")
public class OAuth2EnabledConfig {

    @Value("${spring.security.oauth2.client.registration.discord.client-id}")
    private String discordClientId;

    @Value("${spring.security.oauth2.client.registration.discord.client-secret}")
    private String discordClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        List<ClientRegistration> registrations = new ArrayList<>();

        // Discord OAuth2 registration
        registrations.add(ClientRegistration.withRegistrationId("discord")
                .clientId(discordClientId)
                .clientSecret(discordClientSecret)
                .scope("identify", "email")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/api/auth/oauth2/callback/{registrationId}")
                .authorizationUri("https://discord.com/api/oauth2/authorize")
                .tokenUri("https://discord.com/api/oauth2/token")
                .userInfoUri("https://discord.com/api/users/@me")
                .userNameAttributeName("id")
                .clientName("Discord")
                .build());

        // Google OAuth2 registration
        registrations.add(ClientRegistration.withRegistrationId("google")
                .clientId(googleClientId)
                .clientSecret(googleClientSecret)
                .scope("openid", "profile", "email")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/api/auth/oauth2/callback/{registrationId}")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://oauth2.googleapis.com/token")
                .userInfoUri("https://openidconnect.googleapis.com/v1/userinfo")
                .userNameAttributeName("sub")
                .clientName("Google")
                .build());

        return new InMemoryClientRegistrationRepository(registrations);
    }
}
