import { api } from './api';
import type { ClaimInitiationResponse, ClaimInitiationStatus } from './claim-api';

export interface ClaimStatsResponse {
  totalPendingClaims: number;
  claimsExpiringSoon: number;
  verificationsLast7Days: number;
  totalVerifiedServers: number;
  totalExpiredClaims: number;
  totalCancelledClaims: number;
}

export interface PaginatedClaimsResponse {
  data: ClaimInitiationResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminClaimsApi = {
  /**
   * Get claim statistics for admin dashboard
   */
  async getClaimStats(): Promise<ClaimStatsResponse> {
    return api.get<ClaimStatsResponse>('/api/admin/claims/stats');
  },

  /**
   * Get all claim initiations with pagination
   */
  async getClaims(
    page: number = 0,
    size: number = 20,
    status?: ClaimInitiationStatus
  ): Promise<PaginatedClaimsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (status) {
      params.append('status', status);
    }
    return api.get<PaginatedClaimsResponse>(`/api/admin/claims?${params.toString()}`);
  },

  /**
   * Get claims expiring soon (within 6 hours)
   */
  async getClaimsExpiringSoon(): Promise<ClaimInitiationResponse[]> {
    return api.get<ClaimInitiationResponse[]>('/api/admin/claims/expiring-soon');
  },

  /**
   * Get all claim initiations for a specific server
   */
  async getClaimsForServer(serverId: string): Promise<ClaimInitiationResponse[]> {
    return api.get<ClaimInitiationResponse[]>(`/api/admin/claims/server/${serverId}`);
  },

  /**
   * Invalidate/cancel a claim (admin action)
   */
  async invalidateClaim(claimId: string): Promise<{ message: string }> {
    return api.delete(`/api/admin/claims/${claimId}`);
  },

  /**
   * Manually expire all pending claims that have passed their expiry time
   */
  async expirePendingClaims(): Promise<{ message: string }> {
    return api.post('/api/admin/claims/expire-pending');
  },

  /**
   * Clean up old completed claims
   */
  async cleanupOldClaims(daysToKeep: number = 90): Promise<{ message: string }> {
    return api.delete(`/api/admin/claims/cleanup?daysToKeep=${daysToKeep}`);
  },
};
