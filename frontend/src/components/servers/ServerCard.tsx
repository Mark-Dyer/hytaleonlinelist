'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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
  Star,
  ThumbsUp,
} from 'lucide-react';
import { Server } from '@/types';
import { cn } from '@/lib/utils';
import { cfImage, imagePresets } from '@/lib/image';
import { useAuth } from '@/contexts/AuthContext';
import { voteApi } from '@/lib/vote-api';
import { ApiError } from '@/lib/api';
import { trackEvent } from '@/components/analytics';

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
      trackEvent('server_card_vote', { server_id: server.id, server_name: server.name });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setHasVotedToday(true);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const copyIP = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
  const serverAddress = `${server.ipAddress}${server.port !== 5520 ? `:${server.port}` : ''}`;

  const formatCount = (count: number | null) => {
    if (count === null) return 'N/A';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
      <div className="flex flex-col sm:flex-row">
        {/* Left section: Rank + Icon */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-4 py-4 border-r border-border/50 bg-muted/30">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-secondary">
            {server.iconUrl ? (
              <img
                src={cfImage(server.iconUrl, imagePresets.iconSmall)}
                alt={server.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <CategoryIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          {rank && (
            <span className="text-sm font-bold text-primary">#{rank}</span>
          )}
        </div>

        {/* Banner section */}
        <div className="flex flex-col sm:w-72 lg:w-80 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border/50">
          {/* Banner image */}
          <Link
            href={`/server/${server.slug}`}
            className="relative block h-16 sm:h-20 overflow-hidden bg-gradient-to-br from-secondary to-secondary/50"
          >
            {server.bannerUrl ? (
              <img
                src={cfImage(server.bannerUrl, imagePresets.bannerCard)}
                alt={`${server.name} banner`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <CategoryIcon className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
            {/* Featured overlay */}
            {server.isFeatured && (
              <div className="absolute left-2 top-2">
                <Badge className="gap-1 bg-amber-500 text-amber-950 hover:bg-amber-500 text-xs">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </Badge>
              </div>
            )}
          </Link>

          {/* IP Address row */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50">
            <span
              className={cn(
                "h-2 w-2 rounded-full flex-shrink-0",
                server.isOnline ? "bg-green-500" : "bg-red-500"
              )}
              title={server.isOnline ? "Online" : "Offline"}
            />
            <code className="flex-1 text-xs sm:text-sm font-mono text-foreground truncate">
              {serverAddress}
            </code>
            <button
              onClick={copyIP}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
                copied
                  ? "bg-green-500/20 text-green-500"
                  : "bg-secondary hover:bg-primary/20 hover:text-primary"
              )}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span className="hidden sm:inline">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Middle section: Server info */}
        <div className="flex-1 min-w-0 p-4">
          {/* Mobile: Icon + Rank inline */}
          <div className="flex sm:hidden items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary flex-shrink-0">
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
            {rank && (
              <span className="text-sm font-bold text-primary">#{rank}</span>
            )}
          </div>

          {/* Server name + badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/server/${server.slug}`}
                  className="text-base sm:text-lg font-semibold hover:text-primary transition-colors truncate"
                >
                  {server.name}
                </Link>
                {server.isVerified && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    Verified
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {server.shortDescription}
              </p>

              {/* Tags */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="text-xs gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {server.category.name}
                </Badge>
                {server.tags?.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {server.tags && server.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{server.tags.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile vote button */}
            <button
              onClick={handleVote}
              disabled={!isAuthenticated || hasVotedToday || isVoting || checkingStatus || Boolean(user && !user.emailVerified)}
              className={cn(
                'sm:hidden flex flex-col items-center rounded-lg px-3 py-2 transition-all',
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
                {formatCount(voteCount)}
              </span>
            </button>
          </div>
        </div>

        {/* Right section: Stats + Vote (desktop) */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-2 px-6 py-4 border-l border-border/50 bg-muted/20 min-w-[120px]">
          {/* Online status */}
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium",
              server.isOnline
                ? "border-green-500/50 bg-green-500/10 text-green-500"
                : "border-red-500/50 bg-red-500/10 text-red-500"
            )}
          >
            {server.isOnline ? "Online" : "Offline"}
          </Badge>

          {/* Players */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {server.playerCount !== null && server.maxPlayers !== null
                ? `${formatCount(server.playerCount)}/${formatCount(server.maxPlayers)}`
                : 'N/A'}
            </span>
          </div>

          {/* Votes */}
          <button
            onClick={handleVote}
            disabled={!isAuthenticated || hasVotedToday || isVoting || checkingStatus || Boolean(user && !user.emailVerified)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all text-sm',
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
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : hasVotedToday ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <ThumbsUp className="h-3.5 w-3.5" />
            )}
            <span className="font-semibold">{formatCount(voteCount)}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
