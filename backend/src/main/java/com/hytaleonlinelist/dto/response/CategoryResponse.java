package com.hytaleonlinelist.dto.response;

/**
 * Response DTO matching frontend Category interface.
 *
 * TypeScript interface:
 * interface Category {
 *   id: string;
 *   name: string;
 *   slug: string;
 *   description: string;
 *   icon: string;
 *   serverCount: number;
 * }
 */
public record CategoryResponse(
    String id,
    String name,
    String slug,
    String description,
    String icon,
    int serverCount
) {}
