package com.hytaleonlinelist.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;

import java.util.Collections;

/**
 * Configuration that provides a placeholder ClientRegistrationRepository when OAuth is disabled.
 * This prevents Spring Security from failing when no OAuth2 client registrations are configured.
 *
 * OAuth2 auto-configuration is excluded in the main application class.
 * To enable OAuth2, run with the 'oauth' profile: --spring.profiles.active=local,oauth
 */
@Configuration
@Profile("!oauth")
public class OAuth2DisabledConfig {

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        // Provide a dummy registration to satisfy Spring Security's OAuth2 client configuration
        // This won't actually be used since OAuth2 login isn't enabled in SecurityConfig
        ClientRegistration dummyRegistration = ClientRegistration.withRegistrationId("disabled")
                .clientId("disabled")
                .clientSecret("disabled")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/oauth2/callback/{registrationId}")
                .authorizationUri("https://disabled.local/oauth/authorize")
                .tokenUri("https://disabled.local/oauth/token")
                .build();

        return new InMemoryClientRegistrationRepository(Collections.singletonList(dummyRegistration));
    }
}
