package com.hytaleonlinelist.dto.response;

public record AdminUserResponse(
    String id,
    String username,
    String email,
    String avatarUrl,
    String role,
    boolean emailVerified,
    boolean isBanned,
    String bannedReason,
    String createdAt,
    long serverCount
) {}
