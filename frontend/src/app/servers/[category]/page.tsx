'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ServerCard } from '@/components/servers';
import { serverApi, categoryApi } from '@/lib/server-api';
import type { Server, Category, PaginatedResponse } from '@/types';
import {
  Search,
  X,
  Shield,
  Swords,
  Brush,
  Scroll,
  Gamepad2,
  Map,
  Puzzle,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  survival: Shield,
  pvp: Swords,
  creative: Brush,
  rpg: Scroll,
  minigames: Gamepad2,
  adventure: Map,
  modded: Puzzle,
};

const sortOptions = [
  { value: 'votes', label: 'Most Voted' },
  { value: 'players', label: 'Most Players' },
  { value: 'newest', label: 'Newest' },
];

interface PageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = use(params);

  // State
  const [category, setCategory] = useState<Category | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, size: 20, total: 0, totalPages: 0 });

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('votes');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch category on mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await categoryApi.getCategoryBySlug(categorySlug);
        setCategory(data);
      } catch {
        setCategory(null);
      }
    };
    fetchCategory();
  }, [categorySlug]);

  // Fetch servers when filters change
  const fetchServers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<Server> = await serverApi.getServersByCategory(
        categorySlug,
        {
          sort: sortBy as 'votes' | 'players' | 'newest',
          search: debouncedSearch || undefined,
          online: onlineOnly || undefined,
          page: currentPage,
          limit: 20,
        }
      );

      setServers(response.data);
      setMeta(response.meta);
    } catch {
      setError('Failed to load servers. Please try again.');
      setServers([]);
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, sortBy, debouncedSearch, onlineOnly, currentPage]);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  // Show not found if category doesn't exist
  if (category === null && !isLoading) {
    notFound();
  }

  const CategoryIcon = category ? (categoryIcons[category.slug] || Gamepad2) : Gamepad2;

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('votes');
    setOnlineOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/servers">
            <Button variant="ghost" size="sm" className="mb-4 gap-1">
              <ArrowLeft className="h-4 w-4" />
              All Servers
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <CategoryIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {category?.name || 'Loading...'} Servers
              </h1>
              <p className="text-muted-foreground">
                {category?.description || 'Loading category...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters Bar */}
        <Card className="mb-8">
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${category?.name.toLowerCase() || ''} servers...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Online Only Toggle */}
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(e) => { setOnlineOnly(e.target.checked); setCurrentPage(1); }}
                className="h-4 w-4 rounded border-border"
              />
              <span className="text-sm whitespace-nowrap">Online only</span>
            </label>

            {/* Results count */}
            <Badge variant="secondary" className="ml-auto">
              {isLoading ? '...' : `${meta.total} server${meta.total !== 1 ? 's' : ''}`}
            </Badge>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <CategoryIcon className="mb-4 h-12 w-12 text-destructive" />
              <h3 className="mb-2 text-lg font-semibold">Error Loading Servers</h3>
              <p className="mb-4 text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={fetchServers}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Server List */}
        {!isLoading && !error && servers.length > 0 && (
          <>
            <div className="space-y-4">
              {servers.map((server, index) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  rank={(currentPage - 1) * meta.size + index + 1}
                />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="px-4 text-sm text-muted-foreground">
                  Page {currentPage} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={currentPage === meta.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && servers.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <CategoryIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                No {category?.name.toLowerCase() || ''} servers found
              </h3>
              <p className="mb-4 text-muted-foreground">
                {searchQuery || onlineOnly
                  ? 'Try adjusting your filters'
                  : `Be the first to add a ${category?.name.toLowerCase() || ''} server!`}
              </p>
              {(searchQuery || onlineOnly) && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
