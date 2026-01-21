package com.hytaleonlinelist.service.dataimport;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * DTOs for parsing the hytale-servers.com API response.
 */
public class ExternalServerDto {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ApiResponse(
        List<ServerData> data,
        PaginationMeta meta
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PaginationMeta(
        Pagination pagination
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Pagination(
        int page,
        int pageSize,
        int total,
        int pageCount
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ServerData(
        String name,
        String slug,
        String ip,
        int port,
        String description,
        String country,
        @JsonProperty("server_status") String serverStatus,
        int votes,
        @JsonProperty("current_players") Integer currentPlayers,
        @JsonProperty("max_players") Integer maxPlayers,
        String version,
        @JsonProperty("uptime_percentage") Double uptimePercentage,
        @JsonProperty("average_rating") Double averageRating,
        @JsonProperty("total_reviews") Integer totalReviews,
        @JsonProperty("youtube_url") String youtubeUrl,
        @JsonProperty("discord_url") String discordUrl,
        @JsonProperty("website_url") String websiteUrl,
        MediaObject banner,
        MediaObject logo,
        OwnerData owner,
        List<TagData> tags,
        String createdAt,
        String updatedAt
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MediaObject(
        String url,
        String mime,
        String ext
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OwnerData(
        String username
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TagData(
        int id,
        String name,
        String slug,
        String description
    ) {}
}
