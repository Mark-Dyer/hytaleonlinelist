package com.hytaleonlinelist.dto.response;

public record AdminSettingsResponse(
        boolean registrationEnabled,
        boolean discordLoginEnabled,
        boolean googleLoginEnabled
) {
}
