'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/lib/dashboard-api';
import { ApiError } from '@/lib/api';
import type { Server } from '@/types';
import { MyClaimsSection } from '@/components/claims';
import {
  Plus,
  Server as ServerIcon,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  BarChart3,
  ChevronUp,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, resendVerificationEmail } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteServerId, setDeleteServerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardApi.getMyServers();
      setServers(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load servers');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteServerId) return;

    setIsDeleting(true);
    try {
      await dashboardApi.deleteServer(deleteServerId);
      setServers(servers.filter((s) => s.id !== deleteServerId));
      setDeleteServerId(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete server');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatNumber = (num: number | null) => {
    if (num === null) return 'N/A';
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleResendVerification = async () => {
    setIsResendingEmail(true);
    try {
      await resendVerificationEmail();
    } catch {
      // Silently fail - user can try again
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.username}
                </p>
              </div>
            </div>
            <Link href="/dashboard/servers/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Server
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Email Verification Warning */}
        {user && !user.emailVerified && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium text-yellow-500">Email not verified</p>
                <p className="text-sm text-muted-foreground">
                  Please verify your email to add or manage servers.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={isResendingEmail}
              >
                {isResendingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Verification'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        {servers.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ServerIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{servers.length}</p>
                  <p className="text-sm text-muted-foreground">Total Servers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ChevronUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatNumber(servers.reduce((sum, s) => sum + s.voteCount, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatNumber(servers.reduce((sum, s) => sum + s.viewCount, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* My Claims Section */}
        <div className="mb-8">
          <MyClaimsSection />
        </div>

        {/* Server List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="h-5 w-5" />
              Your Servers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" onClick={fetchServers}>
                  Try Again
                </Button>
              </div>
            ) : servers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ServerIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 font-semibold">No servers yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add your first server to start getting votes and visibility.
                </p>
                <Link href="/dashboard/servers/add">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Server
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4"
                  >
                    {/* Server Icon */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                      {server.iconUrl ? (
                        <img
                          src={server.iconUrl}
                          alt={server.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ServerIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    {/* Server Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold">{server.name}</h3>
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            server.isOnline ? 'bg-green-500' : 'bg-red-500'
                          )}
                        />
                        {server.isFeatured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                        {server.isVerified && (
                          <Badge className="bg-primary">Verified</Badge>
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {server.shortDescription}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {server.playerCount !== null && server.maxPlayers !== null
                            ? `${formatNumber(server.playerCount)}/${formatNumber(server.maxPlayers)}`
                            : 'N/A'}
                        </span>
                        <span className="flex items-center gap-1">
                          <ChevronUp className="h-3 w-3" />
                          {formatNumber(server.voteCount)} votes
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {formatNumber(server.viewCount)} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/server/${server.slug}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/servers/${server.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteServerId(server.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteServerId} onOpenChange={() => setDeleteServerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Server</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this server? This action cannot be undone.
              All votes and statistics will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Server'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
