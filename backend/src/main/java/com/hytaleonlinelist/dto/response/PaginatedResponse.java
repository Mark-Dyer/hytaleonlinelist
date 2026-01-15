package com.hytaleonlinelist.dto.response;

import java.util.List;

/**
 * Generic paginated response matching frontend PaginatedResponse interface.
 *
 * TypeScript interface:
 * interface PaginatedResponse<T> {
 *   data: T[];
 *   meta: {
 *     page: number;
 *     size: number;
 *     total: number;
 *     totalPages: number;
 *   };
 * }
 */
public record PaginatedResponse<T>(
    List<T> data,
    PaginationMeta meta
) {}
