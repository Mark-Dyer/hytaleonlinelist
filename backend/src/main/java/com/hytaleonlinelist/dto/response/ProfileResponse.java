package com.hytaleonlinelist.dto.response;

public record ProfileResponse(
        String id,
        String username,
        String email,
        String avatarUrl,
        String bio,
        String role,
        boolean emailVerified,
        String createdAt
) {}
