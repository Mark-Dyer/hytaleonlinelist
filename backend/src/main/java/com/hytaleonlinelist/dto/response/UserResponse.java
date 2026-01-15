package com.hytaleonlinelist.dto.response;

/**
 * Response DTO matching frontend User interface.
 *
 * TypeScript interface:
 * interface User {
 *   id: string;
 *   username: string;
 *   avatarUrl: string | null;
 * }
 */
public record UserResponse(
    String id,
    String username,
    String avatarUrl
) {}
