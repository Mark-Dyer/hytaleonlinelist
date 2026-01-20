'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Server,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  ExternalLink,
  Play,
  X,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClaimInitiationResponse, ClaimInitiationStatus } from '@/lib/claim-api';

interface ClaimCardProps {
  claim: ClaimInitiationResponse;
  onVerify?: (serverId: string) => void;
  onCancel?: (serverId: string) => void;
  onReInitiate?: (serverId: string) => void;
  isLoading?: boolean;
}

const statusConfig: Record<
  ClaimInitiationStatus,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
    icon: <Clock className="h-4 w-4" />,
    label: 'Pending',
  },
  VERIFIED: {
    color: 'text-green-500',
    bgColor: 'bg-green-500/10 border-green-500/30',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Verified',
  },
  EXPIRED: {
    color: 'text-red-500',
    bgColor: 'bg-red-500/10 border-red-500/30',
    icon: <XCircle className="h-4 w-4" />,
    label: 'Expired',
  },
  CANCELLED: {
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10 border-gray-500/30',
    icon: <X className="h-4 w-4" />,
    label: 'Cancelled',
  },
  CLAIMED_BY_OTHER: {
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
    icon: <Users className="h-4 w-4" />,
    label: 'Claimed by Other',
  },
};

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function ClaimCard({
  claim,
  onVerify,
  onCancel,
  onReInitiate,
  isLoading = false,
}: ClaimCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const config = statusConfig[claim.status];
  const isPending = claim.status === 'PENDING' && claim.isActive;
  const canReInitiate = claim.status === 'EXPIRED' || claim.status === 'CANCELLED';

  return (
    <>
      <Card className={cn('border', config.bgColor)}>
        <CardContent className="p-4">
          {/* Header: Status + Time */}
          <div className="mb-3 flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn('gap-1', config.color, 'border-current')}
            >
              {config.icon}
              {config.label}
            </Badge>
            {isPending && (
              <span className="text-sm text-muted-foreground">
                {formatTimeRemaining(claim.expiresInSeconds)}
              </span>
            )}
            {!isPending && claim.completedAt && (
              <span className="text-sm text-muted-foreground">
                {formatTimeAgo(claim.completedAt)}
              </span>
            )}
          </div>

          {/* Server Info */}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
              {claim.serverIconUrl ? (
                <img
                  src={claim.serverIconUrl}
                  alt={claim.serverName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Server className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{claim.serverName}</h3>
              <p className="text-sm text-muted-foreground">
                Method: {claim.verificationMethod.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Progress bar for pending claims */}
          {isPending && (
            <div className="mb-3">
              <Progress value={claim.timeRemainingPercent} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                {claim.timeRemainingPercent}% time remaining
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Started {formatTimeAgo(claim.initiatedAt)}</span>
            {claim.attemptCount > 0 && (
              <span>
                {claim.attemptCount} attempt{claim.attemptCount !== 1 ? 's' : ''}
                {claim.lastAttemptAt && ` (last: ${formatTimeAgo(claim.lastAttemptAt)})`}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Link href={`/server/${claim.serverSlug}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" />
                View Server
              </Button>
            </Link>

            {isPending && onVerify && (
              <Button
                size="sm"
                className="gap-1"
                onClick={() => onVerify(claim.serverId)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Verify Now
              </Button>
            )}

            {isPending && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-destructive hover:text-destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={isLoading}
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
            )}

            {canReInitiate && onReInitiate && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => onReInitiate(claim.serverId)}
                disabled={isLoading}
              >
                <RefreshCw className="h-3 w-3" />
                Re-initiate
              </Button>
            )}
          </div>

          {/* Status description for non-pending */}
          {!isPending && (
            <p className="mt-3 text-sm text-muted-foreground">
              {claim.statusDescription}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Claim</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your claim for "{claim.serverName}"?
              You can re-initiate a claim later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Claim</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onCancel?.(claim.serverId);
                setShowCancelDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Claim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
