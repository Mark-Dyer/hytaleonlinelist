package com.hytaleonlinelist.dto.response;

/**
 * Pagination metadata matching frontend meta object.
 *
 * TypeScript interface:
 * meta: {
 *   page: number;
 *   size: number;
 *   total: number;
 *   totalPages: number;
 * }
 */
public record PaginationMeta(
    int page,
    int size,
    long total,
    int totalPages
) {}
