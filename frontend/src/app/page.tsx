import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServerCard, ServerCardCompact } from '@/components/servers';
import { JsonLd, createItemListSchema } from '@/components/seo/JsonLd';
import type { Server, Category } from '@/types';
import {
  Gamepad2,
  Users,
  Server as ServerIcon,
  Wifi,
  ArrowRight,
  Shield,
  Swords,
  Brush,
  Scroll,
  Map,
  Puzzle,
  TrendingUp,
  Clock,
  Star,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const categoryIcons: Record<string, React.ElementType> = {
  survival: Shield,
  pvp: Swords,
  creative: Brush,
  rpg: Scroll,
  minigames: Gamepad2,
  adventure: Map,
  modded: Puzzle,
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getFeaturedServers(): Promise<Server[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/servers/featured`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getTopServersByVotes(limit: number): Promise<Server[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/servers?sort=votes&limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getNewServers(limit: number): Promise<Server[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/servers?sort=newest&limit=${limit}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getStats(): Promise<{ totalPlayers: number; totalServers: number; onlineServers: number }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/servers?limit=1000`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { totalPlayers: 0, totalServers: 0, onlineServers: 0 };
    const data = await res.json();
    const servers: Server[] = data.data || [];
    return {
      totalServers: data.meta?.total || servers.length,
      totalPlayers: servers.reduce((sum, s) => sum + (s.playerCount ?? 0), 0),
      onlineServers: servers.filter((s) => s.isOnline).length,
    };
  } catch {
    return { totalPlayers: 0, totalServers: 0, onlineServers: 0 };
  }
}

export default async function HomePage() {
  const [categories, featuredServers, topServers, newServers, stats] = await Promise.all([
    getCategories(),
    getFeaturedServers(),
    getTopServersByVotes(5),
    getNewServers(4),
    getStats(),
  ]);

  // Create ItemList schema for top servers
  const allServers = [...featuredServers, ...topServers].filter(
    (server, index, self) => self.findIndex(s => s.id === server.id) === index
  );
  const itemListSchema = createItemListSchema(
    allServers.map(s => ({ name: s.name, slug: s.slug })),
    'Top Hytale Servers'
  );

  return (
    <div className="flex flex-col">
      <JsonLd data={itemListSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Hytale is now available!
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect
              <span className="block text-gradient">Hytale Server</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Discover and join the best Hytale servers. Browse survival, PvP, RPG,
              minigames, and more. Vote for your favorites and connect with
              thousands of players.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/servers">
                <Button size="lg" className="gap-2">
                  Browse Servers
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/servers/add">
                <Button size="lg" variant="outline">
                  Add Your Server
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalPlayers.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Players Online</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ServerIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalServers}</p>
                  <p className="text-sm text-muted-foreground">Total Servers</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.onlineServers}</p>
                  <p className="text-sm text-muted-foreground">Servers Online</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Browse by Category</h2>
                <p className="text-muted-foreground">
                  Find servers that match your playstyle
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] || Gamepad2;
                return (
                  <Link key={category.slug} href={`/servers/${category.slug}`}>
                    <Card className="group h-full cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50">
                      <CardContent className="flex flex-col items-center p-4 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {category.serverCount} servers
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Servers */}
      {featuredServers.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Featured Servers</h2>
            </div>

            <div className="space-y-4">
              {featuredServers.map((server, index) => (
                <ServerCard key={server.id} server={server} rank={index + 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Servers */}
      {topServers.length > 0 && (
        <section className="border-b border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Top Voted Servers</h2>
              </div>
              <Link href="/servers?sort=votes">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {topServers.map((server, index) => (
                <ServerCard key={server.id} server={server} rank={index + 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Servers */}
      {newServers.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">New Servers</h2>
              </div>
              <Link href="/servers?sort=newest">
                <Button variant="ghost" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {newServers.map((server) => (
                <ServerCardCompact key={server.id} server={server} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-b from-background to-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Own a Hytale Server?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            List your server for free and reach thousands of players looking for
            their next adventure. Get votes, track statistics, and grow your
            community.
          </p>
          <Link href="/servers/add" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              Add Your Server
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
