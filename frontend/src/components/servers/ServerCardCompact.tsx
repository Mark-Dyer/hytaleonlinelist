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
import { cfImage, imagePresets } from '@/lib/image';
import { useAuth } from '@/contexts/AuthContext';
import { voteApi } from '@/lib/vote-api';
import { ApiError } from '@/lib/api';
import { trackEvent } from '@/components/analytics';
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

interface ServerCardCompactProps {
  server: Server;
}

export function ServerCardCompact({ server }: ServerCardCompactProps) {
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

  const handleVote = async () => {
    if (!isAuthenticated || hasVotedToday || isVoting) return;
    if (user && !user.emailVerified) return;

    setIsVoting(true);
    try {
      await voteApi.voteForServer(server.id);
      setVoteCount(prev => prev + 1);
      setHasVotedToday(true);
      trackEvent('server_card_vote', { server_id: server.id, server_name: server.name });
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
      trackEvent('server_card_ip_copied', { server_id: server.id, server_name: server.name });
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 !py-0 !gap-0">
      {/* Banner - full bleed, no padding */}
      <Link href={`/server/${server.slug}`} className="block">
        <div className="relative h-20 overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
          {server.bannerUrl ? (
            <img
              src={cfImage(server.bannerUrl, imagePresets.bannerCard)}
              alt={server.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <CategoryIcon className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
          {server.isFeatured && (
            <Badge className="absolute left-2 top-2 bg-amber-500 text-amber-950 hover:bg-amber-500">Featured</Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Header with icon and name */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
            {server.iconUrl ? (
              <img
                src={cfImage(server.iconUrl, { width: 40, height: 40 })}
                alt={server.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <CategoryIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Link
              href={`/server/${server.slug}`}
              className="block truncate font-semibold transition-colors hover:text-primary"
            >
              {server.name}
            </Link>
            <Badge variant="outline" className="gap-1 px-1.5 py-0 text-xs">
              <CategoryIcon className="h-2.5 w-2.5" />
              {server.category.name}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {server.playerCount !== null ? formatPlayerCount(server.playerCount) : 'N/A'}
            </span>
            <ServerStatusBadge
              isOnline={server.isOnline}
              lastPingedAt={server.lastPingedAt}
              size="sm"
            />
          </div>
          <div className={cn(
            'flex items-center gap-1',
            hasVotedToday ? 'text-green-500' : 'text-muted-foreground'
          )}>
            {hasVotedToday ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-primary" />
            )}
            {formatPlayerCount(voteCount)}
          </div>
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {server.shortDescription}
        </p>

        {/* IP and actions */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center overflow-hidden rounded-md border border-border bg-secondary/50">
            <code className="flex-1 truncate px-2 py-1 text-xs font-mono">
              {server.ipAddress}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 rounded-none border-l border-border px-2"
              onClick={copyIP}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
          {isAuthenticated && user?.emailVerified && !hasVotedToday ? (
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleVote}
              disabled={isVoting || checkingStatus}
            >
              {isVoting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Vote'
              )}
            </Button>
          ) : hasVotedToday ? (
            <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700" disabled>
              <Check className="h-3 w-3 mr-1" />
              Voted
            </Button>
          ) : (
            <Link href={`/server/${server.slug}`}>
              <Button size="sm" className="h-7 text-xs">
                View
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
