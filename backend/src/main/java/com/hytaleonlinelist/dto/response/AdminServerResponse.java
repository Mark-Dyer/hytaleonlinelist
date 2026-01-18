package com.hytaleonlinelist.dto.response;

public record AdminServerResponse(
    String id,
    String name,
    String slug,
    String iconUrl,
    String ownerUsername,
    String ownerId,
    boolean isFeatured,
    boolean isVerified,
    boolean isOnline,
    int voteCount,
    Integer playerCount,
    String createdAt
) {}
