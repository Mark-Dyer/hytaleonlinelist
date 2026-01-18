import { api } from './api';
import type {
  Server,
  Category,
  PaginatedResponse,
  SortOption,
} from '@/types';

export interface ServerQueryParams {
  sort?: SortOption;
  category?: string;
  search?: string;
  online?: boolean;
  page?: number;
  limit?: number;
}

export interface StatsResponse {
  totalServers: number;
  totalPlayers: number;
  onlineServers: number;
}

export const serverApi = {
  /**
   * Get paginated list of servers with optional filters
   */
  async getServers(params: ServerQueryParams = {}): Promise<PaginatedResponse<Server>> {
    const searchParams = new URLSearchParams();

    if (params.sort) searchParams.set('sort', params.sort);
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.online !== undefined) searchParams.set('online', String(params.online));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const query = searchParams.toString();
    const endpoint = query ? `/api/servers?${query}` : '/api/servers';

    return api.get<PaginatedResponse<Server>>(endpoint);
  },

  /**
   * Get a single server by its slug
   */
  async getServerBySlug(slug: string): Promise<Server> {
    return api.get<Server>(`/api/servers/${slug}`);
  },

  /**
   * Get featured servers
   */
  async getFeaturedServers(): Promise<Server[]> {
    return api.get<Server[]>('/api/servers/featured');
  },

  /**
   * Get servers sorted by vote count
   */
  async getTopServersByVotes(limit: number = 10): Promise<Server[]> {
    const response = await this.getServers({ sort: 'votes', limit });
    return response.data;
  },

  /**
   * Get servers sorted by player count
   */
  async getTopServersByPlayers(limit: number = 10): Promise<Server[]> {
    const response = await this.getServers({ sort: 'players', limit });
    return response.data;
  },

  /**
   * Get newest servers
   */
  async getNewServers(limit: number = 10): Promise<Server[]> {
    const response = await this.getServers({ sort: 'newest', limit });
    return response.data;
  },

  /**
   * Get servers by category
   */
  async getServersByCategory(
    categorySlug: string,
    params: Omit<ServerQueryParams, 'category'> = {}
  ): Promise<PaginatedResponse<Server>> {
    return this.getServers({ ...params, category: categorySlug });
  },

  /**
   * Search servers by query
   */
  async searchServers(query: string, limit: number = 20): Promise<Server[]> {
    const response = await this.getServers({ search: query, limit });
    return response.data;
  },
};

export const categoryApi = {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return api.get<Category[]>('/api/categories');
  },

  /**
   * Get a single category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    return api.get<Category>(`/api/categories/${slug}`);
  },
};

export const statsApi = {
  /**
   * Get overall site statistics
   * Note: This calculates from server data since there's no dedicated stats endpoint
   */
  async getStats(): Promise<StatsResponse> {
    // Get a large batch of servers to calculate stats
    const response = await serverApi.getServers({ limit: 1000 });
    const servers = response.data;

    return {
      totalServers: response.meta.total,
      totalPlayers: servers.reduce((sum, s) => sum + (s.playerCount ?? 0), 0),
      onlineServers: servers.filter((s) => s.isOnline).length,
    };
  },
};
