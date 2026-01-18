'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isFilled = rating <= displayValue;
          const isHalf = !isFilled && rating - 0.5 <= displayValue;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                'transition-colors',
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'fill-transparent text-muted-foreground'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-medium">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
