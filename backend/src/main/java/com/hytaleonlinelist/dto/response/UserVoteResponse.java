package com.hytaleonlinelist.dto.response;

public record UserVoteResponse(
        String id,
        String serverName,
        String serverSlug,
        String serverIconUrl,
        String votedAt
) {}
