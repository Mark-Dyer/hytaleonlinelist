import { notFound } from 'next/navigation';
import type { Server } from '@/types';
import { ServerDetailContent } from './ServerDetailContent';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function getServerBySlug(slug: string): Promise<Server | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/servers/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch server');
    }
    return res.json();
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const server = await getServerBySlug(slug);

  if (!server) {
    notFound();
  }

  return <ServerDetailContent server={server} />;
}
