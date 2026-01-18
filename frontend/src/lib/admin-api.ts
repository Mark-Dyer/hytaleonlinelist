import { api } from './api';
import type {
  AdminStats,
  AdminUser,
  AdminServer,
  AdminAction,
  PaginatedResponse,
} from '@/types';

export interface BanUserRequest {
  reason?: string;
}

export interface ChangeRoleRequest {
  role: 'USER' | 'MODERATOR' | 'ADMIN';
}

export const adminApi = {
  // Stats
  getStats: () => api.get<AdminStats>('/api/admin/stats'),

  // Users
  getUsers: (page: number = 0, size: number = 20, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search) params.append('search', search);
    return api.get<PaginatedResponse<AdminUser>>(`/api/admin/users?${params}`);
  },

  banUser: (userId: string, request: BanUserRequest) =>
    api.post<AdminUser>(`/api/admin/users/${userId}/ban`, request),

  unbanUser: (userId: string) =>
    api.post<AdminUser>(`/api/admin/users/${userId}/unban`),

  changeRole: (userId: string, request: ChangeRoleRequest) =>
    api.put<AdminUser>(`/api/admin/users/${userId}/role`, request),

  // Servers
  getServers: (page: number = 0, size: number = 20, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search) params.append('search', search);
    return api.get<PaginatedResponse<AdminServer>>(`/api/admin/servers?${params}`);
  },

  featureServer: (serverId: string) =>
    api.post<AdminServer>(`/api/admin/servers/${serverId}/feature`),

  verifyServer: (serverId: string) =>
    api.post<AdminServer>(`/api/admin/servers/${serverId}/verify`),

  deleteServer: (serverId: string) =>
    api.delete(`/api/admin/servers/${serverId}`),

  // Audit Log
  getAuditLog: (page: number = 0, size: number = 20) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    return api.get<PaginatedResponse<AdminAction>>(`/api/admin/audit-log?${params}`);
  },
};
