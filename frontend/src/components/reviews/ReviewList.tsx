'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewApi } from '@/lib/review-api';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { StarRating } from './StarRating';
import type { Review, PaginatedResponse } from '@/types';
import {
  Loader2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface ReviewListProps {
  serverId: string;
  reviewCount: number;
  averageRating: number | null;
  isServerOwner: boolean;
}

export function ReviewList({
  serverId,
  reviewCount: initialReviewCount,
  averageRating: initialAverageRating,
  isServerOwner,
}: ReviewListProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Review>['meta'] | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User's own review
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [isLoadingMyReview, setIsLoadingMyReview] = useState(false);

  // Edit mode
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Local stats (for optimistic updates)
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [averageRating, setAverageRating] = useState(initialAverageRating);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reviewApi.getServerReviews(serverId, page, 10);
      setReviews(response.data);
      setMeta(response.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load reviews');
      }
    } finally {
      setIsLoading(false);
    }
  }, [serverId, page]);

  const loadMyReview = useCallback(async () => {
    if (!isAuthenticated) {
      setMyReview(null);
      return;
    }
    setIsLoadingMyReview(true);
    try {
      const review = await reviewApi.getMyReview(serverId);
      setMyReview(review);
    } catch {
      setMyReview(null);
    } finally {
      setIsLoadingMyReview(false);
    }
  }, [serverId, isAuthenticated]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    loadMyReview();
  }, [loadMyReview]);

  const handleCreateReview = async (data: {
    rating: number;
    content: string;
  }) => {
    const review = await reviewApi.createReview(serverId, data);
    setMyReview(review);
    setReviewCount((c) => c + 1);
    // Recalculate average (simple approximation)
    if (averageRating !== null) {
      setAverageRating(
        (averageRating * reviewCount + data.rating) / (reviewCount + 1)
      );
    } else {
      setAverageRating(data.rating);
    }
    // Refresh the list
    loadReviews();
  };

  const handleUpdateReview = async (data: {
    rating: number;
    content: string;
  }) => {
    if (!editingReview) return;
    const updated = await reviewApi.updateReview(editingReview.id, data);
    setMyReview(updated);
    setEditingReview(null);
    // Refresh the list
    loadReviews();
  };

  const handleDeleteReview = async (reviewId: string) => {
    const reviewToDelete = reviews.find((r) => r.id === reviewId) || myReview;
    const isAdmin = user?.role === 'ADMIN';

    if (isAdmin && reviewToDelete && !reviewToDelete.isOwner) {
      await reviewApi.adminDeleteReview(reviewId);
    } else {
      await reviewApi.deleteReview(reviewId);
    }

    if (myReview?.id === reviewId) {
      setMyReview(null);
    }

    setReviewCount((c) => Math.max(0, c - 1));
    // Refresh the list
    loadReviews();
  };

  const canWriteReview =
    isAuthenticated && user?.emailVerified && !myReview && !isServerOwner;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">
            Reviews ({reviewCount})
          </h3>
          {averageRating !== null && (
            <div className="flex items-center gap-1">
              <StarRating
                value={averageRating}
                readonly
                size="sm"
                showValue
              />
            </div>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      {canWriteReview && (
        <ReviewForm onSubmit={handleCreateReview} />
      )}

      {/* User's Own Review (when editing) */}
      {editingReview && (
        <ReviewForm
          initialData={editingReview}
          onSubmit={handleUpdateReview}
          onCancel={() => setEditingReview(null)}
          isEdit
        />
      )}

      {/* Show message if user can't review */}
      {!isAuthenticated && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>{' '}
              to write a review
            </p>
          </CardContent>
        </Card>
      )}

      {isAuthenticated && !user?.emailVerified && !myReview && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Please verify your email to write a review
            </p>
          </CardContent>
        </Card>
      )}

      {isServerOwner && !myReview && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              You cannot review your own server
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading || isLoadingMyReview ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center py-8 text-center">
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to share your experience!
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Reviews List */
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={
                review.isOwner && !editingReview
                  ? setEditingReview
                  : undefined
              }
              onDelete={
                review.isOwner || user?.role === 'ADMIN'
                  ? handleDeleteReview
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
