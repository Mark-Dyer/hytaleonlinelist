import { api } from './api';
import type { Server } from '@/types';

export interface CreateServerRequest {
  name: string;
  ipAddress: string;
  port?: number;
  shortDescription: string;
  description: string;
  bannerUrl?: string;
  iconUrl?: string;
  websiteUrl?: string;
  discordUrl?: string;
  categoryId: string;
  tags?: string[];
  version: string;
  maxPlayers?: number;
}

export interface UpdateServerRequest {
  name?: string;
  ipAddress?: string;
  port?: number;
  shortDescription?: string;
  description?: string;
  bannerUrl?: string;
  iconUrl?: string;
  websiteUrl?: string;
  discordUrl?: string;
  categoryId?: string;
  tags?: string[];
  version?: string;
  maxPlayers?: number;
}

export const dashboardApi = {
  /**
   * Get servers owned by the current user
   */
  async getMyServers(): Promise<Server[]> {
    return api.get<Server[]>('/api/servers/my-servers');
  },

  /**
   * Get a single server by ID for editing (owner only)
   */
  async getMyServer(serverId: string): Promise<Server> {
    return api.get<Server>(`/api/servers/my-servers/${serverId}`);
  },

  /**
   * Create a new server
   */
  async createServer(request: CreateServerRequest): Promise<Server> {
    return api.post<Server>('/api/servers', request);
  },

  /**
   * Update an existing server
   */
  async updateServer(serverId: string, request: UpdateServerRequest): Promise<Server> {
    return api.put<Server>(`/api/servers/${serverId}`, request);
  },

  /**
   * Delete a server
   */
  async deleteServer(serverId: string): Promise<void> {
    await api.delete(`/api/servers/${serverId}`);
  },
};
