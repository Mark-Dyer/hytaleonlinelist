import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { Server, Category, PaginatedResponse } from '@/types';
import { ServersPageClient } from './ServersPageClient';
import { Card, CardContent } from '@/components/ui/card';
import { Server as ServerIcon, Loader2 } from 'lucide-react';
import { JsonLd, createBreadcrumbSchema, createItemListSchema, SITE_URL } from '@/components/seo/JsonLd';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getServers(): Promise<PaginatedResponse<Server> | null> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/servers?sort=votes&page=1&limit=20`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch servers');
    }
    return res.json();
  } catch {
    return null;
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    return res.json();
  } catch {
    return [];
  }
}

const year = new Date().getFullYear();

export const metadata: Metadata = {
  title: `Hytale Server List ${year} - Browse All Servers`,
  description: `Browse and discover the best Hytale servers in ${year}. Filter by category, search by name, and find your perfect server to join. Updated hourly with player counts and status.`,
  openGraph: {
    title: `All Hytale Servers | Hytale Online List`,
    description: `Browse and discover the best Hytale servers in ${year}. Filter by category, search by name, and find your perfect server to join.`,
    type: 'website',
    url: `${SITE_URL}/servers`,
  },
  twitter: {
    card: 'summary',
    title: `Hytale Server List ${year}`,
    description: `Browse and discover the best Hytale servers in ${year}. Filter by category, search by name, and find your perfect server to join.`,
  },
  alternates: {
    canonical: `${SITE_URL}/servers`,
  },
};

function ServersLoading() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ServerIcon className="h-5 w-5 text-primary" />
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

export default async function ServersPage() {
  // Fetch data in parallel
  const [serversResponse, categories] = await Promise.all([
    getServers(),
    getCategories(),
  ]);

  // Default empty response if servers fetch fails
  const servers = serversResponse?.data ?? [];
  const meta = serversResponse?.meta ?? { page: 1, size: 20, total: 0, totalPages: 0 };

  // Create schemas
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Servers', url: `${SITE_URL}/servers` },
  ]);

  const itemListSchema = createItemListSchema(
    servers.map((s) => ({ name: s.name, slug: s.slug })),
    'Top Hytale Servers'
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <Suspense fallback={<ServersLoading />}>
        <ServersPageClient
          initialServers={servers}
          initialMeta={meta}
          initialCategories={categories}
        />
      </Suspense>
    </>
  );
}
