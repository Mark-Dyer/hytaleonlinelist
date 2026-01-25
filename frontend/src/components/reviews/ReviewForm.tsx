'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './StarRating';
import { trackEvent } from '@/components/analytics';
import { Loader2 } from 'lucide-react';
import type { Review } from '@/types';

interface ReviewFormProps {
  initialData?: Review;
  onSubmit: (data: { rating: number; content: string }) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export function ReviewForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [content, setContent] = useState(initialData?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = rating >= 1 && rating <= 5 && content.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError(
        rating === 0
          ? 'Please select a rating'
          : 'Review must be at least 10 characters'
      );
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({ rating, content: content.trim() });
      trackEvent(isEdit ? 'review_updated' : 'review_submitted', { rating });
      if (!isEdit) {
        setRating(0);
        setContent('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {isEdit ? 'Edit Your Review' : 'Write a Review'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <StarRating
              value={rating}
              onChange={setRating}
              size="lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Review</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this server... (minimum 10 characters)"
              rows={4}
              maxLength={2000}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground text-right">
              {content.length}/2000
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEdit ? 'Saving...' : 'Submitting...'}
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
