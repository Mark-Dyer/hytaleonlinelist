import { api } from './api';

export interface VoteResponse {
  id: string;
  serverId: string;
  userId: string;
  votedAt: string;
}

export interface VoteStatusResponse {
  hasVotedToday: boolean;
}

export const voteApi = {
  /**
   * Vote for a server (requires authentication and email verification)
   */
  async voteForServer(serverId: string): Promise<VoteResponse> {
    return api.post<VoteResponse>(`/api/votes/server/${serverId}`);
  },

  /**
   * Check if the current user has voted for a server today
   */
  async getVoteStatus(serverId: string): Promise<VoteStatusResponse> {
    return api.get<VoteStatusResponse>(`/api/votes/server/${serverId}/status`);
  },
};
