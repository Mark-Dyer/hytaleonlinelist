package com.hytaleonlinelist.dto.response;

/**
 * Response DTO matching frontend Vote interface.
 *
 * TypeScript interface:
 * interface Vote {
 *   id: string;
 *   serverId: string;
 *   userId: string;
 *   votedAt: string;
 * }
 */
public record VoteResponse(
    String id,
    String serverId,
    String userId,
    String votedAt
) {}
