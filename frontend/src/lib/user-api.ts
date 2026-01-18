import { api } from './api';

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  username?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface UserVote {
  id: string;
  serverName: string;
  serverSlug: string;
  serverIconUrl: string | null;
  votedAt: string;
}

export interface PagedVotesResponse {
  content: UserVote[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const userApi = {
  getProfile: (): Promise<ProfileResponse> => {
    return api.get<ProfileResponse>('/api/users/profile');
  },

  updateProfile: (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    return api.put<ProfileResponse>('/api/users/profile', data);
  },

  getMyVotes: (page: number = 0, size: number = 20): Promise<PagedVotesResponse> => {
    return api.get<PagedVotesResponse>(`/api/users/votes?page=${page}&size=${size}`);
  },
};
