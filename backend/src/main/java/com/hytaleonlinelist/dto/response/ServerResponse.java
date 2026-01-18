package com.hytaleonlinelist.dto.response;

import java.util.List;

/**
 * Response DTO matching frontend Server interface.
 *
 * TypeScript interface:
 * interface Server {
 *   id: string;
 *   name: string;
 *   slug: string;
 *   ipAddress: string;
 *   port: number;
 *   shortDescription: string;
 *   description: string;
 *   bannerUrl: string | null;
 *   iconUrl: string | null;
 *   websiteUrl: string | null;
 *   discordUrl: string | null;
 *   category: Category;
 *   tags: string[];
 *   version: string;
 *   isOnline: boolean;
 *   playerCount: number | null;
 *   maxPlayers: number | null;
 *   uptimePercentage: number;
 *   voteCount: number;
 *   reviewCount: number;
 *   averageRating: number | null;
 *   viewCount: number;
 *   isFeatured: boolean;
 *   isVerified: boolean;
 *   createdAt: string;
 *   lastPingedAt: string | null;
 *   owner: User;
 * }
 */
public record ServerResponse(
    String id,
    String name,
    String slug,
    String ipAddress,
    int port,
    String shortDescription,
    String description,
    String bannerUrl,
    String iconUrl,
    String websiteUrl,
    String discordUrl,
    CategoryResponse category,
    List<String> tags,
    String version,
    boolean isOnline,
    Integer playerCount,
    Integer maxPlayers,
    double uptimePercentage,
    int voteCount,
    int reviewCount,
    Double averageRating,
    long viewCount,
    boolean isFeatured,
    boolean isVerified,
    String createdAt,
    String lastPingedAt,
    UserResponse owner
) {}
