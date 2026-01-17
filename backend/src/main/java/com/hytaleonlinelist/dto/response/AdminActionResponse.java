package com.hytaleonlinelist.dto.response;

public record AdminActionResponse(
    String id,
    String adminId,
    String adminUsername,
    String actionType,
    String targetType,
    String targetId,
    String targetName,
    String details,
    String createdAt
) {}
