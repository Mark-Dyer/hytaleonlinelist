package com.hytaleonlinelist.dto.response;

public record AuthResponse(
        String id,
        String username,
        String email,
        String avatarUrl,
        String role,
        boolean emailVerified
) {}
