package com.hytaleonlinelist.dto.response;

/**
 * Response DTO matching frontend Review interface.
 *
 * TypeScript interface:
 * interface Review {
 *   id: string;
 *   serverId: string;
 *   user: User;
 *   rating: number;
 *   content: string;
 *   createdAt: string;
 * }
 */
public record ReviewResponse(
    String id,
    String serverId,
    UserResponse user,
    int rating,
    String content,
    String createdAt
) {}
