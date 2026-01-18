'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * Redirect page for /servers/add
 * - Authenticated users are redirected to /dashboard/servers/add
 * - Unauthenticated users are redirected to /login with a return URL
 */
export default function AddServerRedirect() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Authenticated: redirect to dashboard add server page
        router.replace('/dashboard/servers/add');
      } else {
        // Not authenticated: redirect to login with return URL
        router.replace('/login?redirect=/dashboard/servers/add');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
}
