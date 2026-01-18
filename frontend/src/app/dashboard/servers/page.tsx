'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * Redirect page for /dashboard/servers
 * Redirects to the main dashboard which shows all servers
 */
export default function DashboardServersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
        </CardContent>
      </Card>
    </div>
  );
}
