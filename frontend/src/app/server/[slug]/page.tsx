import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Server } from '@/types';
import { ServerDetailContent } from './ServerDetailContent';
import { JsonLd, createGameServerSchema, createBreadcrumbSchema, SITE_URL } from '@/components/seo/JsonLd';

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const server = await getServerBySlug(slug);

  if (!server) {
    return {
      title: 'Server Not Found',
      description: 'The requested server could not be found.',
    };
  }

  const title = `${server.name} - ${server.category.name} Hytale Server`;
  const description = server.shortDescription ||
    `Join ${server.name}, a ${server.category.name} Hytale server. ${server.isOnline ? 'Currently online' : 'Currently offline'} with ${server.playerCount ?? 0} players.`;

  return {
    title,
    description,
    openGraph: {
      title: `${server.name} | Hytale Online List`,
      description,
      type: 'website',
      url: `${SITE_URL}/server/${server.slug}`,
      images: server.bannerUrl ? [{ url: server.bannerUrl, width: 468, height: 60, alt: `${server.name} banner` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: server.bannerUrl ? [server.bannerUrl] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/server/${server.slug}`,
    },
  };
}

export default async function ServerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const server = await getServerBySlug(slug);

  if (!server) {
    notFound();
  }

  // Create structured data schemas
  const gameServerSchema = createGameServerSchema({
    name: server.name,
    slug: server.slug,
    description: server.shortDescription,
    bannerUrl: server.bannerUrl,
    isOnline: server.isOnline,
    playerCount: server.playerCount,
    maxPlayers: server.maxPlayers,
    ipAddress: server.ipAddress,
    port: server.port,
    category: server.category.name,
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: 'Servers', url: `${SITE_URL}/servers` },
    { name: server.category.name, url: `${SITE_URL}/servers/${server.category.slug}` },
    { name: server.name, url: `${SITE_URL}/server/${server.slug}` },
  ]);

  return (
    <>
      <JsonLd data={gameServerSchema} />
      <JsonLd data={breadcrumbSchema} />
      <ServerDetailContent server={server} />
    </>
  );
}
