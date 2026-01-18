'use client';

import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServerStatusBadgeProps {
  isOnline: boolean;
  lastPingedAt: string | null;
  showLastChecked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ServerStatusBadge({
  isOnline,
  lastPingedAt,
  showLastChecked = true,
  size = 'md',
  className,
}: ServerStatusBadgeProps) {
  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const sizeClasses = {
    sm: {
      dot: 'h-1.5 w-1.5',
      text: 'text-xs',
      icon: 'h-2.5 w-2.5',
      gap: 'gap-1',
    },
    md: {
      dot: 'h-2 w-2',
      text: 'text-sm',
      icon: 'h-3 w-3',
      gap: 'gap-1',
    },
    lg: {
      dot: 'h-2.5 w-2.5',
      text: 'text-base',
      icon: 'h-4 w-4',
      gap: 'gap-1.5',
    },
  };

  const sizes = sizeClasses[size];
  const relativeTime = formatRelativeTime(lastPingedAt);

  return (
    <div className={cn('flex items-center', sizes.gap, className)}>
      {/* Online/Offline Status */}
      <span
        className={cn(
          'flex items-center',
          sizes.gap,
          sizes.text,
          isOnline ? 'text-green-500' : 'text-red-500'
        )}
      >
        <span
          className={cn(
            'rounded-full',
            sizes.dot,
            isOnline ? 'bg-green-500' : 'bg-red-500'
          )}
        />
        {isOnline ? 'Online' : 'Offline'}
      </span>

      {/* Last Checked */}
      {showLastChecked && relativeTime && (
        <span className={cn('flex items-center text-muted-foreground', sizes.gap, sizes.text)}>
          <Clock className={sizes.icon} />
          {relativeTime}
        </span>
      )}
    </div>
  );
}
