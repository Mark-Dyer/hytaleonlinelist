'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { voteApi } from '@/lib/vote-api';
import { ApiError } from '@/lib/api';
import { trackEvent } from '@/components/analytics';
import { ReviewList, StarRating } from '@/components/reviews';
import { ServerStatusSection, VerifiedBadge, ClaimServerDialog } from '@/components/servers';
import type { Server } from '@/types';
import {
  Copy,
  Check,
  ChevronUp,
  Users,
  BarChart3,
  MessageSquare,
  Globe,
  Shield,
  Swords,
  Brush,
  Scroll,
  Gamepad2,
  Map,
  Puzzle,
  Activity,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShieldQuestion,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { cfImage, imagePresets } from '@/lib/image';
import { ServerStatusBadge } from '@/components/servers';

const categoryIcons: Record<string, React.ElementType> = {
  survival: Shield,
  pvp: Swords,
  creative: Brush,
  rpg: Scroll,
  minigames: Gamepad2,
  adventure: Map,
  modded: Puzzle,
};

// Discord icon SVG component
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface ServerDetailContentProps {
  server: Server;
}

export function ServerDetailContent({ server }: ServerDetailContentProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [voteCount, setVoteCount] = useState(server.voteCount);
  const [hasVotedToday, setHasVotedToday] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [checkingVoteStatus, setCheckingVoteStatus] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(server.isVerified);

  const CategoryIcon = categoryIcons[server.category.slug] || Gamepad2;

  // Track server detail view on mount
  useEffect(() => {
    trackEvent('server_detail_view', {
      server_id: server.id,
      server_name: server.name,
      category: server.category.slug,
    });
  }, [server.id, server.name, server.category.slug]);

  // Check vote status when user is authenticated
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (isAuthenticated && !authLoading) {
        setCheckingVoteStatus(true);
        try {
          const status = await voteApi.getVoteStatus(server.id);
          setHasVotedToday(status.hasVotedToday);
        } catch {
          // Ignore errors - user just can't see vote status
        } finally {
          setCheckingVoteStatus(false);
        }
      }
    };
    checkVoteStatus();
  }, [server.id, isAuthenticated, authLoading]);

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(
        `${server.ipAddress}${server.port !== 5520 ? `:${server.port}` : ''}`
      );
      setCopied(true);
      trackEvent('server_ip_copied', { server_id: server.id, server_name: server.name });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  const handleVote = async () => {
    if (!isAuthenticated) {
      setVoteError('Please sign in to vote');
      setTimeout(() => setVoteError(null), 3000);
      return;
    }

    if (user && !user.emailVerified) {
      setVoteError('Please verify your email to vote');
      setTimeout(() => setVoteError(null), 3000);
      return;
    }

    if (hasVotedToday) {
      setVoteError('You have already voted today');
      setTimeout(() => setVoteError(null), 3000);
      return;
    }

    setIsVoting(true);
    setVoteError(null);

    try {
      await voteApi.voteForServer(server.id);
      setVoteCount((prev) => prev + 1);
      setHasVotedToday(true);
      setVoteSuccess(true);
      trackEvent('vote_submitted', { server_id: server.id, server_name: server.name });
      setTimeout(() => setVoteSuccess(false), 3000);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setVoteError('Please sign in to vote');
        } else if (error.status === 403) {
          setVoteError('Please verify your email to vote');
        } else if (error.status === 409) {
          setVoteError('You have already voted today');
          setHasVotedToday(true);
        } else {
          setVoteError(error.message || 'Failed to vote');
        }
      } else {
        setVoteError('Failed to vote. Please try again.');
      }
      setTimeout(() => setVoteError(null), 3000);
    } finally {
      setIsVoting(false);
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getVoteButtonContent = () => {
    if (isVoting) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Voting...
        </>
      );
    }

    if (voteSuccess) {
      return (
        <>
          <CheckCircle className="h-5 w-5" />
          Voted!
        </>
      );
    }

    if (hasVotedToday) {
      return (
        <>
          <Check className="h-5 w-5" />
          Voted Today
        </>
      );
    }

    return (
      <>
        <ChevronUp className="h-5 w-5" />
        Vote
      </>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 bg-gradient-to-r from-primary/30 to-accent/30 sm:h-64">
        {server.bannerUrl && (
          <img
            src={cfImage(server.bannerUrl, imagePresets.bannerLarge)}
            alt={server.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="-mt-16 relative z-10 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            {/* Server Icon */}
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border-4 border-background bg-card shadow-lg">
              {server.iconUrl ? (
                <img
                  src={cfImage(server.iconUrl, { width: 128, height: 128 })}
                  alt={server.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CategoryIcon className="h-16 w-16 text-muted-foreground" />
              )}
            </div>

            {/* Server Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold">{server.name}</h1>
                {isVerified && <VerifiedBadge />}
                {server.isFeatured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
                {server.averageRating !== null && (
                  <div className="flex items-center gap-1">
                    <StarRating value={server.averageRating} readonly size="sm" showValue />
                    <span className="text-sm text-muted-foreground">
                      ({server.reviewCount})
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="outline" className="gap-1">
                  <CategoryIcon className="h-3 w-3" />
                  {server.category.name}
                </Badge>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {server.playerCount !== null && server.maxPlayers !== null
                    ? `${formatNumber(server.playerCount)}/${formatNumber(server.maxPlayers)} players`
                    : 'N/A'}
                </span>
                <ServerStatusBadge
                  isOnline={server.isOnline}
                  lastPingedAt={server.lastPingedAt}
                  size="lg"
                />
                <span className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  {server.uptimePercentage}% uptime
                </span>
              </div>
            </div>

            {/* Vote Button */}
            <div className="flex flex-col items-center gap-2">
              <Button
                size="lg"
                className={cn(
                  'gap-2 px-8',
                  hasVotedToday && 'bg-green-600 hover:bg-green-700',
                  voteSuccess && 'bg-green-600 hover:bg-green-700'
                )}
                onClick={handleVote}
                disabled={isVoting || checkingVoteStatus || hasVotedToday}
              >
                {getVoteButtonContent()}
              </Button>
              <span className="text-sm text-muted-foreground">
                {formatNumber(voteCount)} votes
              </span>
              {voteError && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {voteError}
                </div>
              )}
              {!isAuthenticated && !authLoading && (
                <Link href="/login" className="text-xs text-primary hover:underline">
                  Sign in to vote
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* IP Copy */}
            <div className="flex items-center overflow-hidden rounded-lg border border-border bg-card">
              <code className="px-4 py-2 font-mono text-sm">
                {server.ipAddress}
                {server.port !== 5520 && `:${server.port}`}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-full rounded-none border-l border-border px-3"
                onClick={copyIP}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {server.websiteUrl && (
              <a
                href={server.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('server_website_clicked', { server_id: server.id, server_name: server.name })}
              >
                <Button variant="outline" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </Button>
              </a>
            )}

            {server.discordUrl && (
              <a
                href={server.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('server_discord_clicked', { server_id: server.id, server_name: server.name })}
              >
                <Button variant="outline" className="gap-2">
                  <DiscordIcon className="h-4 w-4" />
                  Discord
                </Button>
              </a>
            )}

            {/* Claim/Verify Server Button - show if not verified and user is authenticated */}
            {!isVerified && isAuthenticated && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setClaimDialogOpen(true)}
              >
                <ShieldQuestion className="h-4 w-4" />
                {user?.id === server.owner?.id ? 'Verify Server Ownership' : 'Claim Server'}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 pb-16 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({server.reviewCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="prose prose-invert max-w-none p-6">
                    {/* Convert markdown-style content to HTML */}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {server.description
                        .split('\n')
                        .map((line, index) => {
                          if (line.startsWith('# ')) {
                            return (
                              <h2
                                key={index}
                                className="mb-4 mt-6 text-xl font-bold text-foreground first:mt-0"
                              >
                                {line.slice(2)}
                              </h2>
                            );
                          }
                          if (line.startsWith('## ')) {
                            return (
                              <h3
                                key={index}
                                className="mb-3 mt-5 text-lg font-semibold text-foreground"
                              >
                                {line.slice(3)}
                              </h3>
                            );
                          }
                          if (line.startsWith('- **')) {
                            const match = line.match(/- \*\*(.+?)\*\* - (.+)/);
                            if (match) {
                              return (
                                <p key={index} className="mb-1">
                                  <strong className="text-foreground">
                                    {match[1]}
                                  </strong>{' '}
                                  - {match[2]}
                                </p>
                              );
                            }
                          }
                          if (line.startsWith('- ')) {
                            return (
                              <p key={index} className="mb-1 ml-4">
                                • {line.slice(2)}
                              </p>
                            );
                          }
                          if (line.match(/^\d+\./)) {
                            return (
                              <p key={index} className="mb-1 ml-4">
                                {line}
                              </p>
                            );
                          }
                          if (line === '') {
                            return <br key={index} />;
                          }
                          return (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewList
                  serverId={server.id}
                  reviewCount={server.reviewCount}
                  averageRating={server.averageRating}
                  isServerOwner={user?.id === server.owner?.id}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {server.averageRating !== null && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-2">
                        <StarRating value={server.averageRating} readonly size="sm" />
                        <span className="font-semibold">{server.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reviews</span>
                  <span className="font-semibold">{server.reviewCount}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Votes</span>
                  <span className="font-semibold">
                    {formatNumber(voteCount)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Views</span>
                  <span className="font-semibold">
                    {formatNumber(server.viewCount)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Players</span>
                  <span className="font-semibold">
                    {server.playerCount !== null && server.maxPlayers !== null
                      ? `${formatNumber(server.playerCount)}/${formatNumber(server.maxPlayers)}`
                      : 'N/A'}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="font-semibold">{server.uptimePercentage}%</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <Badge variant="outline">{server.version}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Server Status */}
            <ServerStatusSection serverId={server.id} />

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {server.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Owner Info - only show if server has an owner */}
            {server.owner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Server Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <span className="font-semibold text-primary">
                        {server.owner.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{server.owner.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Listed on{' '}
                        {new Date(server.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Back Button */}
            <Link href="/servers">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Servers
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Claim Server Dialog */}
      <ClaimServerDialog
        serverId={server.id}
        serverName={server.name}
        open={claimDialogOpen}
        onOpenChange={setClaimDialogOpen}
        onVerificationSuccess={() => setIsVerified(true)}
        isOwner={user?.id === server.owner?.id}
      />
    </div>
  );
}
