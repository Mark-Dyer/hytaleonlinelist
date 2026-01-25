'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { trackEvent } from '@/components/analytics';
import type { Server, Category, PaginatedResponse } from '@/types';
import {
  Search,
  SlidersHorizontal,
  X,
  Shield,
  Swords,
  Brush,
  Scroll,
  Gamepad2,
  Map,
  Puzzle,
  Server as ServerIcon,
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

interface ServersPageClientProps {
  initialServers: Server[];
  initialMeta: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  initialCategories: Category[];
}

export function ServersPageClient({
  initialServers,
  initialMeta,
  initialCategories,
}: ServersPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const initialSort = searchParams.get('sort') || 'votes';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // State initialized with SSR data
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [categories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState(initialMeta);

  // Filter state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Track if filters have been modified from initial state
  const [filtersModified, setFiltersModified] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery !== initialSearch) {
        setCurrentPage(1);
        setFiltersModified(true);
        // Track search query when user stops typing
        if (searchQuery.trim()) {
          trackEvent('search_query_submitted', { query: searchQuery.trim() });
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, initialSearch]);

  // Fetch servers when filters change (after initial load)
  const fetchServers = useCallback(async () => {
    if (!filtersModified) return;

    setIsLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<Server> = await serverApi.getServers({
        sort: sortBy as 'votes' | 'players' | 'newest',
        category: selectedCategory || undefined,
        search: debouncedSearch || undefined,
        online: onlineOnly || undefined,
        page: currentPage,
        limit: 20,
      });

      setServers(response.data);
      setMeta(response.meta);
    } catch {
      setError('Failed to load servers. Please try again.');
      setServers([]);
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, selectedCategory, debouncedSearch, onlineOnly, currentPage, filtersModified]);

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  // Update URL when filters change
  useEffect(() => {
    if (!filtersModified) return;

    const params = new URLSearchParams();
    if (sortBy !== 'votes') params.set('sort', sortBy);
    if (selectedCategory) params.set('category', selectedCategory);
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (currentPage > 1) params.set('page', String(currentPage));

    const query = params.toString();
    router.replace(query ? `/servers?${query}` : '/servers', { scroll: false });
  }, [sortBy, selectedCategory, debouncedSearch, currentPage, router, filtersModified]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('votes');
    setOnlineOnly(false);
    setCurrentPage(1);
    setFiltersModified(true);
    trackEvent('filters_cleared');
  };

  const handleFilterChange = (filterType: string, value: string | boolean) => {
    setCurrentPage(1);
    setFiltersModified(true);
    trackEvent('filter_applied', { filter_type: filterType, value: String(value) });
  };

  const hasActiveFilters = searchQuery || selectedCategory || onlineOnly;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ServerIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">All Servers</h1>
              <p className="text-sm text-muted-foreground">
                Browse {meta.total} Hytale servers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <Card>
              <CardContent className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="font-semibold">Filters</span>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-1 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search servers..."
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
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={(value) => { setSortBy(value); handleFilterChange('sort', value); }}>
                    <SelectTrigger>
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
                </div>

                {/* Online Only Toggle */}
                <div className="mb-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlineOnly}
                      onChange={(e) => { setOnlineOnly(e.target.checked); handleFilterChange('online_only', e.target.checked); }}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="text-sm">Online servers only</span>
                  </label>
                </div>

                {/* Categories */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Category</label>
                  <div className="space-y-1">
                    <Button
                      variant={selectedCategory === '' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => { setSelectedCategory(''); handleFilterChange('category', 'all'); }}
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => {
                      const Icon = categoryIcons[category.slug] || Gamepad2;
                      return (
                        <Button
                          key={category.slug}
                          variant={
                            selectedCategory === category.slug
                              ? 'secondary'
                              : 'ghost'
                          }
                          size="sm"
                          className="w-full justify-start gap-2"
                          onClick={() => { setSelectedCategory(category.slug); handleFilterChange('category', category.slug); }}
                        >
                          <Icon className="h-4 w-4" />
                          {category.name}
                          <span className="ml-auto text-xs text-muted-foreground">
                            {category.serverCount}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Server List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    Showing {servers.length} of {meta.total} server
                    {meta.total !== 1 ? 's' : ''}
                    {hasActiveFilters && ' (filtered)'}
                  </>
                )}
              </p>

              {/* Active filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {searchQuery}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchQuery('')}
                      />
                    </Badge>
                  )}
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find((c) => c.slug === selectedCategory)?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => { setSelectedCategory(''); handleFilterChange('category', 'all'); }}
                      />
                    </Badge>
                  )}
                  {onlineOnly && (
                    <Badge variant="secondary" className="gap-1">
                      Online only
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => { setOnlineOnly(false); handleFilterChange('online_only', false); }}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

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
                  <ServerIcon className="mb-4 h-12 w-12 text-destructive" />
                  <h3 className="mb-2 text-lg font-semibold">Error Loading Servers</h3>
                  <p className="mb-4 text-muted-foreground">{error}</p>
                  <Button variant="outline" onClick={() => { setFiltersModified(true); fetchServers(); }}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Server Cards */}
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
                      onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); setFiltersModified(true); }}
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
                      onClick={() => { setCurrentPage((p) => Math.min(meta.totalPages, p + 1)); setFiltersModified(true); }}
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
                  <ServerIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">No servers found</h3>
                  <p className="mb-4 text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
