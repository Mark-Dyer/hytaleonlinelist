package com.hytaleonlinelist.dto.response;

public record RegistrationStatusResponse(
        boolean registrationEnabled,
        boolean discordLoginEnabled,
        boolean googleLoginEnabled
) {
}
