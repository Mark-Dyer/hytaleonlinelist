'use client';

import { BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerifiedBadge({ className, showText = true, size = 'md' }: VerifiedBadgeProps) {
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const badgeSizes = {
    sm: 'text-xs px-1.5 py-0',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className={cn(
              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-default',
              badgeSizes[size],
              className
            )}
          >
            <BadgeCheck className={cn(iconSizes[size], showText && 'mr-1')} />
            {showText && 'Verified'}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This server&apos;s ownership has been verified</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
