'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimCard } from './ClaimCard';
import { claimApi } from '@/lib/claim-api';
import type { ClaimInitiationResponse } from '@/lib/claim-api';
import { ApiError } from '@/lib/api';
import {
  FileCheck,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  History,
} from 'lucide-react';

export function MyClaimsSection() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimInitiationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await claimApi.getMyClaims();
      setClaims(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load claims');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = (serverId: string) => {
    // Navigate to server page where they can verify
    const claim = claims.find((c) => c.serverId === serverId);
    if (claim) {
      router.push(`/server/${claim.serverSlug}`);
    }
  };

  const handleCancel = async (serverId: string) => {
    setActionLoading(serverId);
    try {
      await claimApi.cancelClaim(serverId);
      // Refresh claims
      await fetchClaims();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReInitiate = (serverId: string) => {
    // Navigate to server page where they can re-initiate
    const claim = claims.find((c) => c.serverId === serverId);
    if (claim) {
      router.push(`/server/${claim.serverSlug}`);
    }
  };

  // Filter claims by status
  const activeClaims = claims.filter(
    (c) => c.status === 'PENDING' && c.isActive
  );
  const completedClaims = claims.filter(
    (c) => c.status === 'VERIFIED'
  );
  const otherClaims = claims.filter(
    (c) =>
      c.status === 'EXPIRED' ||
      c.status === 'CANCELLED' ||
      c.status === 'CLAIMED_BY_OTHER' ||
      (c.status === 'PENDING' && !c.isActive)
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            My Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            My Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchClaims}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (claims.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            My Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileCheck className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold">No claims yet</h3>
            <p className="text-sm text-muted-foreground">
              When you claim a server, it will appear here so you can track
              verification progress.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          My Claims
          {activeClaims.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-medium text-white">
              {activeClaims.length} active
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="active" className="gap-1">
              <Clock className="h-4 w-4" />
              Active ({activeClaims.length})
            </TabsTrigger>
            <TabsTrigger value="verified" className="gap-1">
              <CheckCircle2 className="h-4 w-4" />
              Verified ({completedClaims.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="h-4 w-4" />
              History ({otherClaims.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeClaims.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No active claims. Start by claiming a server you own!
              </p>
            ) : (
              <div className="space-y-4">
                {activeClaims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    onVerify={handleVerify}
                    onCancel={handleCancel}
                    isLoading={actionLoading === claim.serverId}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="verified">
            {completedClaims.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No verified claims yet. Complete verification to see them here.
              </p>
            ) : (
              <div className="space-y-4">
                {completedClaims.map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {otherClaims.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No claim history yet.
              </p>
            ) : (
              <div className="space-y-4">
                {otherClaims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    onReInitiate={handleReInitiate}
                    isLoading={actionLoading === claim.serverId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
