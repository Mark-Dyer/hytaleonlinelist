import { api } from './api';
import type { Review, PaginatedResponse } from '@/types';

export interface CreateReviewRequest {
  rating: number;
  content: string;
}

export interface UpdateReviewRequest {
  rating: number;
  content: string;
}

export const reviewApi = {
  /**
   * Get reviews for a server (public, paginated)
   */
  async getServerReviews(
    serverId: string,
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<Review>> {
    return api.get<PaginatedResponse<Review>>(
      `/api/reviews/server/${serverId}?page=${page}&size=${size}`
    );
  },

  /**
   * Get the current user's review for a server
   */
  async getMyReview(serverId: string): Promise<Review | null> {
    try {
      return await api.get<Review>(`/api/reviews/server/${serverId}/me`);
    } catch {
      // 404 means no review exists
      return null;
    }
  },

  /**
   * Create a new review for a server (requires email verification)
   */
  async createReview(
    serverId: string,
    data: CreateReviewRequest
  ): Promise<Review> {
    return api.post<Review>(`/api/reviews/server/${serverId}`, data);
  },

  /**
   * Update own review
   */
  async updateReview(
    reviewId: string,
    data: UpdateReviewRequest
  ): Promise<Review> {
    return api.put<Review>(`/api/reviews/${reviewId}`, data);
  },

  /**
   * Delete own review
   */
  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`/api/reviews/${reviewId}`);
  },

  /**
   * Admin: Delete any review
   */
  async adminDeleteReview(reviewId: string): Promise<void> {
    await api.delete(`/api/reviews/admin/${reviewId}`);
  },
};
