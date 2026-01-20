import { api } from './api';

export type VerificationMethod = 'MOTD' | 'DNS_TXT' | 'FILE_UPLOAD' | 'EMAIL';

export type ClaimInitiationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'CLAIMED_BY_OTHER';

export interface VerificationMethodInfo {
  method: VerificationMethod;
  displayName: string;
  description: string;
  available: boolean;
  requirementHint: string | null;
}

export interface ClaimStatusResponse {
  serverId: string;
  serverName: string;
  isClaimed: boolean;
  isVerified: boolean;
  ownerId: string | null;
  ownerUsername: string | null;
  verificationMethod: VerificationMethod | null;
  verifiedAt: string | null;
  hasPendingClaim: boolean;
  claimTokenExpiry: string | null;
}

export interface ClaimInitiatedResponse {
  serverId: string;
  serverName: string;
  verificationMethod: VerificationMethod;
  verificationToken: string;
  instructions: string;
  expiresInSeconds: number;
}

export interface VerificationResultResponse {
  serverId: string;
  isVerified: boolean;
  verificationMethod: VerificationMethod;
  message: string;
}

export interface InitiateClaimRequest {
  verificationMethod: VerificationMethod;
}

export interface ClaimInitiationResponse {
  id: string;
  serverId: string;
  serverName: string;
  serverSlug: string;
  serverIconUrl: string | null;
  userId: string;
  username: string;
  verificationMethod: VerificationMethod;
  status: ClaimInitiationStatus;
  statusDisplayName: string;
  statusDescription: string;
  initiatedAt: string;
  expiresAt: string;
  expiresInSeconds: number;
  isExpired: boolean;
  isActive: boolean;
  lastAttemptAt: string | null;
  attemptCount: number;
  cancelledAt: string | null;
  completedAt: string | null;
  timeRemainingPercent: number;
}

export const claimApi = {
  /**
   * Get the claim/verification status of a server
   */
  async getClaimStatus(serverId: string): Promise<ClaimStatusResponse> {
    return api.get<ClaimStatusResponse>(`/api/servers/${serverId}/claim/status`);
  },

  /**
   * Get available verification methods for a server
   */
  async getAvailableMethods(serverId: string): Promise<VerificationMethodInfo[]> {
    return api.get<VerificationMethodInfo[]>(`/api/servers/${serverId}/claim/methods`);
  },

  /**
   * Initiate a claim for a server
   */
  async initiateClaim(
    serverId: string,
    method: VerificationMethod
  ): Promise<ClaimInitiatedResponse> {
    return api.post<ClaimInitiatedResponse>(`/api/servers/${serverId}/claim/initiate`, {
      verificationMethod: method,
    });
  },

  /**
   * Attempt to verify a server claim
   */
  async attemptVerification(
    serverId: string,
    method: VerificationMethod
  ): Promise<VerificationResultResponse> {
    return api.post<VerificationResultResponse>(
      `/api/servers/${serverId}/claim/verify?method=${method}`
    );
  },

  /**
   * Cancel a pending claim
   */
  async cancelClaim(serverId: string): Promise<void> {
    return api.delete(`/api/servers/${serverId}/claim/cancel`);
  },

  // User claims endpoints

  /**
   * Get all claim initiations for the current user
   */
  async getMyClaims(): Promise<ClaimInitiationResponse[]> {
    return api.get<ClaimInitiationResponse[]>('/api/users/me/claims');
  },

  /**
   * Get only active (pending) claim initiations for the current user
   */
  async getMyActiveClaims(): Promise<ClaimInitiationResponse[]> {
    return api.get<ClaimInitiationResponse[]>('/api/users/me/claims/active');
  },

  /**
   * Get count of active claims for the current user
   */
  async getMyActiveClaimsCount(): Promise<number> {
    return api.get<number>('/api/users/me/claims/active/count');
  },
};
