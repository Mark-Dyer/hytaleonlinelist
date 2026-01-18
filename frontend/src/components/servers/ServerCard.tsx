'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Copy,
  Check,
  ExternalLink,
  ChevronUp,
  Shield,
  Swords,
  Brush,
  Scroll,
  Gamepad2,
  Map,
  Puzzle,
  Loader2,
} from 'lucide-react';
import { Server } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { voteApi } from '@/lib/vote-api';
import { ApiError } from '@/lib/api';
import { ServerStatusBadge } from './ServerStatusBadge';

const categoryIcons: Record<string, React.ElementType> = {
  survival: Shield,
  pvp: Swords,
  creative: Brush,
  rpg: Scroll,
  minigames: Gamepad2,
  adventure: Map,
  modded: Puzzle,
};

interface ServerCardProps {
  server: Server;
  rank?: number;
}

export function ServerCard({ server, rank }: ServerCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [voteCount, setVoteCount] = useState(server.voteCount);
  const [hasVotedToday, setHasVotedToday] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Check vote status when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setCheckingStatus(true);
      voteApi.getVoteStatus(server.id)
        .then(status => setHasVotedToday(status.hasVotedToday))
        .catch(() => {})
        .finally(() => setCheckingStatus(false));
    }
  }, [server.id, isAuthenticated]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || hasVotedToday || isVoting) return;
    if (user && !user.emailVerified) return;

    setIsVoting(true);
    try {
      await voteApi.voteForServer(server.id);
      setVoteCount(prev => prev + 1);
      setHasVotedToday(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setHasVotedToday(true);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(
        `${server.ipAddress}${server.port !== 5520 ? `:${server.port}` : ''}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  const CategoryIcon = categoryIcons[server.category.slug] || Gamepad2;

  const formatPlayerCount = (count: number | null) => {
    if (count === null) return 'N/A';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Featured indicator */}
      {server.isFeatured && (
        <div className="absolute right-0 top-0 z-10">
          <div className="bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Featured
          </div>
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Rank number (optional) */}
          {rank && (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-xl font-bold text-muted-foreground">
              #{rank}
            </div>
          )}

          {/* Server icon */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
            {server.iconUrl ? (
              <img
                src={server.iconUrl}
                alt={server.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <CategoryIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Server info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/server/${server.slug}`}
                    className="truncate text-lg font-semibold transition-colors hover:text-primary"
                  >
                    {server.name}
                  </Link>
                  {server.isVerified && (
                    <Badge variant="secondary" className="flex-shrink-0 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Meta info */}
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="gap-1">
                    <CategoryIcon className="h-3 w-3" />
                    {server.category.name}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {server.playerCount !== null && server.maxPlayers !== null
                      ? `${formatPlayerCount(server.playerCount)}/${formatPlayerCount(server.maxPlayers)}`
                      : 'N/A'}
                  </span>
                  <ServerStatusBadge
                    isOnline={server.isOnline}
                    lastPingedAt={server.lastPingedAt}
                    size="md"
                  />
                </div>
              </div>

              {/* Vote button */}
              <button
                onClick={handleVote}
                disabled={!isAuthenticated || hasVotedToday || isVoting || checkingStatus || Boolean(user && !user.emailVerified)}
                className={cn(
                  'flex flex-col items-center rounded-lg px-3 py-2 transition-all',
                  hasVotedToday
                    ? 'bg-green-500/20 text-green-500'
                    : isAuthenticated && user?.emailVerified
                      ? 'bg-secondary hover:bg-primary/20 hover:text-primary cursor-pointer'
                      : 'bg-secondary cursor-default',
                  (isVoting || checkingStatus) && 'opacity-70'
                )}
                title={
                  !isAuthenticated
                    ? 'Sign in to vote'
                    : user && !user.emailVerified
                      ? 'Verify email to vote'
                      : hasVotedToday
                        ? 'Already voted today'
                        : 'Vote for this server'
                }
              >
                {isVoting || checkingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : hasVotedToday ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-primary" />
                )}
                <span className="text-sm font-semibold">
                  {formatPlayerCount(voteCount)}
                </span>
              </button>
            </div>

            {/* Description */}
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {server.shortDescription}
            </p>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* IP Copy */}
              <div className="flex items-center overflow-hidden rounded-md border border-border bg-secondary/50">
                <code className="px-3 py-1.5 text-sm font-mono">
                  {server.ipAddress}
                  {server.port !== 5520 && `:${server.port}`}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-none border-l border-border px-2"
                  onClick={copyIP}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Link href={`/server/${server.slug}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  View Server
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
