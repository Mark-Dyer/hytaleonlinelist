'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { userApi, type UserVote, type PagedVotesResponse } from '@/lib/user-api';
import { dashboardApi } from '@/lib/dashboard-api';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ServerCard } from '@/components/servers/ServerCard';
import type { Server } from '@/types';
import {
  User,
  Edit,
  Calendar,
  Server as ServerIcon,
  ChevronUp,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import { cfImage, imagePresets } from '@/lib/image';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, refreshUser } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [votes, setVotes] = useState<UserVote[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(true);
  const [isLoadingVotes, setIsLoadingVotes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load servers
  useEffect(() => {
    const loadServers = async () => {
      if (!isAuthenticated) return;
      setIsLoadingServers(true);
      try {
        const data = await dashboardApi.getMyServers();
        setServers(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        }
      } finally {
        setIsLoadingServers(false);
      }
    };
    loadServers();
  }, [isAuthenticated]);

  // Load votes
  useEffect(() => {
    const loadVotes = async () => {
      if (!isAuthenticated) return;
      setIsLoadingVotes(true);
      try {
        const data = await userApi.getMyVotes(0, 20);
        setVotes(data.content);
      } catch (err) {
        // Silently fail for votes
      } finally {
        setIsLoadingVotes(false);
      }
    };
    loadVotes();
  }, [isAuthenticated]);

  const handleProfileUpdate = async () => {
    await refreshUser();
    setEditDialogOpen(false);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={cfImage(user.avatarUrl, imagePresets.avatarLarge) || undefined} alt={user.username} />
              <AvatarFallback className="text-2xl">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
                {!user.emailVerified && (
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Email not verified
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(user.createdAt)}
                </span>
                <span>{user.email}</span>
              </div>
              {user.bio && (
                <p className="mt-3 text-muted-foreground">{user.bio}</p>
              )}
            </div>

            {/* Edit Button */}
            <Button onClick={() => setEditDialogOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="servers">
          <TabsList>
            <TabsTrigger value="servers" className="gap-2">
              <ServerIcon className="h-4 w-4" />
              My Servers ({servers.length})
            </TabsTrigger>
            <TabsTrigger value="votes" className="gap-2">
              <ChevronUp className="h-4 w-4" />
              Vote History ({votes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="mt-6">
            {isLoadingServers ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : servers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <ServerIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No servers yet</h3>
                  <p className="mb-4 text-muted-foreground">
                    You haven&apos;t added any servers to the list.
                  </p>
                  <Link href="/dashboard/servers/add">
                    <Button>Add Your First Server</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {servers.map((server) => (
                  <ServerCard key={server.id} server={server} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="votes" className="mt-6">
            {isLoadingVotes ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : votes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <ChevronUp className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No votes yet</h3>
                  <p className="mb-4 text-muted-foreground">
                    You haven&apos;t voted for any servers yet.
                  </p>
                  <Link href="/servers">
                    <Button>Browse Servers</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {votes.map((vote) => (
                  <Card key={vote.id} className="overflow-hidden">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                        {vote.serverIconUrl ? (
                          <img
                            src={cfImage(vote.serverIconUrl, { width: 40, height: 40 })}
                            alt={vote.serverName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ServerIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/server/${vote.serverSlug}`}
                          className="font-medium hover:text-primary truncate block"
                        >
                          {vote.serverName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Voted on {formatDate(vote.votedAt)}
                        </p>
                      </div>
                      <ChevronUp className="h-5 w-5 text-green-500" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={user}
        onSuccess={handleProfileUpdate}
      />
    </div>
  );
}
