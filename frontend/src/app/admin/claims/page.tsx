'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { adminClaimsApi, type ClaimStatsResponse, type PaginatedClaimsResponse } from '@/lib/admin-claims-api';
import type { ClaimInitiationResponse, ClaimInitiationStatus } from '@/lib/claim-api';
import { ApiError } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Users,
  MoreVertical,
  ExternalLink,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Timer,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<
  ClaimInitiationStatus,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  PENDING: {
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    icon: <Clock className="h-4 w-4" />,
    label: 'Pending',
  },
  VERIFIED: {
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: 'Verified',
  },
  EXPIRED: {
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: <XCircle className="h-4 w-4" />,
    label: 'Expired',
  },
  CANCELLED: {
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    icon: <XCircle className="h-4 w-4" />,
    label: 'Cancelled',
  },
  CLAIMED_BY_OTHER: {
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    icon: <Users className="h-4 w-4" />,
    label: 'Claimed by Other',
  },
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export default function AdminClaimsPage() {
  const [stats, setStats] = useState<ClaimStatsResponse | null>(null);
  const [claims, setClaims] = useState<ClaimInitiationResponse[]>([]);
  const [meta, setMeta] = useState<PaginatedClaimsResponse['meta'] | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | ClaimInitiationStatus>('all');
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invalidateClaim, setInvalidateClaim] = useState<ClaimInitiationResponse | null>(null);
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [isExpiringPending, setIsExpiringPending] = useState(false);
  const [expiringClaims, setExpiringClaims] = useState<ClaimInitiationResponse[]>([]);

  const loadStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const data = await adminClaimsApi.getClaimStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const loadClaims = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const data = await adminClaimsApi.getClaims(page, 20, status);
      setClaims(data.data);
      setMeta(data.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load claims');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, activeTab]);

  const loadExpiringClaims = useCallback(async () => {
    try {
      const data = await adminClaimsApi.getClaimsExpiringSoon();
      setExpiringClaims(data);
    } catch (err) {
      console.error('Failed to load expiring claims', err);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadExpiringClaims();
  }, [loadStats, loadExpiringClaims]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | ClaimInitiationStatus);
    setPage(0);
  };

  const handleInvalidate = async () => {
    if (!invalidateClaim) return;
    setIsInvalidating(true);
    try {
      await adminClaimsApi.invalidateClaim(invalidateClaim.id);
      await loadClaims();
      await loadStats();
      setInvalidateClaim(null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to invalidate claim');
    } finally {
      setIsInvalidating(false);
    }
  };

  const handleExpirePending = async () => {
    setIsExpiringPending(true);
    try {
      await adminClaimsApi.expirePendingClaims();
      await loadClaims();
      await loadStats();
      await loadExpiringClaims();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to expire claims');
    } finally {
      setIsExpiringPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claims Management</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor and manage server claim initiations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExpirePending}
            disabled={isExpiringPending}
            className="gap-2"
          >
            {isExpiringPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Timer className="h-4 w-4" />
            )}
            Expire Pending
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              loadStats();
              loadClaims();
              loadExpiringClaims();
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isStatsLoading ? '-' : stats?.totalPendingClaims ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Pending Claims</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isStatsLoading ? '-' : stats?.claimsExpiringSoon ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Expiring Soon (&lt;6h)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isStatsLoading ? '-' : stats?.verificationsLast7Days ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Verified (7 days)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {isStatsLoading ? '-' : stats?.totalVerifiedServers ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Verified</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Soon Alert */}
      {expiringClaims.length > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              Claims Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringClaims.slice(0, 5).map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between rounded-lg bg-background/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted overflow-hidden">
                      {claim.serverIconUrl ? (
                        <img
                          src={claim.serverIconUrl}
                          alt={claim.serverName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Server className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{claim.serverName}</p>
                      <p className="text-xs text-muted-foreground">
                        by @{claim.username} via {claim.verificationMethod}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-500 border-amber-500">
                    {formatTimeRemaining(claim.expiresInSeconds)} left
                  </Badge>
                </div>
              ))}
              {expiringClaims.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  +{expiringClaims.length - 5} more expiring soon
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Claims Table with Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="PENDING" className="gap-1">
                <Clock className="h-3 w-3" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="VERIFIED" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </TabsTrigger>
              <TabsTrigger value="EXPIRED" className="gap-1">
                <XCircle className="h-3 w-3" />
                Expired
              </TabsTrigger>
              <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
              <TabsTrigger value="CLAIMED_BY_OTHER">
                <Users className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : claims.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <FileCheck className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No claims found</h3>
              <p className="text-muted-foreground">
                {activeTab === 'all'
                  ? 'No claim initiations yet'
                  : `No ${activeTab.toLowerCase().replace('_', ' ')} claims`}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Server</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Initiated</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Expires</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {claims.map((claim) => {
                      const config = statusConfig[claim.status];
                      return (
                        <tr key={claim.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                                {claim.serverIconUrl ? (
                                  <img
                                    src={claim.serverIconUrl}
                                    alt={claim.serverName}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Server className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <Link
                                  href={`/server/${claim.serverSlug}`}
                                  className="font-medium hover:text-primary"
                                >
                                  {claim.serverName}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">@{claim.username}</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline">
                              {claim.verificationMethod.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={cn('gap-1', config.color, 'border-current')}
                            >
                              {config.icon}
                              {config.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {formatDate(claim.initiatedAt)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {claim.status === 'PENDING' && claim.isActive ? (
                              <span
                                className={cn(
                                  claim.expiresInSeconds < 21600 ? 'text-amber-500' : 'text-muted-foreground'
                                )}
                              >
                                {formatTimeRemaining(claim.expiresInSeconds)}
                              </span>
                            ) : claim.completedAt ? (
                              <span className="text-muted-foreground">
                                {formatDate(claim.completedAt)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/server/${claim.serverSlug}`}
                                    className="cursor-pointer"
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Server
                                  </Link>
                                </DropdownMenuItem>
                                {claim.status === 'PENDING' && claim.isActive && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => setInvalidateClaim(claim)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Invalidate Claim
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {claims.length} of {meta.total} claims
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {page + 1} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page >= meta.totalPages - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Invalidate Confirmation Dialog */}
      <AlertDialog open={!!invalidateClaim} onOpenChange={() => setInvalidateClaim(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invalidate Claim</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to invalidate the claim for &quot;{invalidateClaim?.serverName}&quot;
              by @{invalidateClaim?.username}? This will cancel their claim initiation and they will
              need to start over.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isInvalidating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleInvalidate}
              disabled={isInvalidating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isInvalidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invalidating...
                </>
              ) : (
                'Invalidate Claim'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
