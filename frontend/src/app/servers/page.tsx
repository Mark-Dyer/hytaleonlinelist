import { Suspense } from 'react';
import { ServersContent } from './ServersContent';
import { Card, CardContent } from '@/components/ui/card';
import { Server, Loader2 } from 'lucide-react';

function ServersLoading() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Servers</h1>
              <p className="text-sm text-muted-foreground">Loading servers...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ServersPage() {
  return (
    <Suspense fallback={<ServersLoading />}>
      <ServersContent />
    </Suspense>
  );
}
