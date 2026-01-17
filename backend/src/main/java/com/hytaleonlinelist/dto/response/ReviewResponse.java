package com.hytaleonlinelist.dto.response;

/**
 * Response DTO matching frontend Review interface.
 *
 * TypeScript interface:
 * interface Review {
 *   id: string;
 *   serverId: string;
 *   user: { id: string; username: string; avatarUrl: string | null };
 *   rating: number;
 *   content: string;
 *   createdAt: string;
 *   updatedAt: string;
 *   isOwner: boolean;
 * }
 */
public record ReviewResponse(
    String id,
    String serverId,
    UserResponse user,
    int rating,
    String content,
    String createdAt,
    String updatedAt,
    boolean isOwner
) {}
