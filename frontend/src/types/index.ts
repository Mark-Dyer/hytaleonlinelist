export interface Server {
  id: string;
  name: string;
  slug: string;
  ipAddress: string;
  port: number;
  shortDescription: string;
  description: string;
  bannerUrl: string | null;
  iconUrl: string | null;
  websiteUrl: string | null;
  discordUrl: string | null;
  category: Category;
  tags: string[];
  version: string;
  isOnline: boolean;
  playerCount: number | null;  // null = unknown (QUIC/BasicPing), number = confirmed count
  maxPlayers: number | null;
  uptimePercentage: number;
  voteCount: number;
  reviewCount: number;
  averageRating: number | null;
  viewCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: string;
  lastPingedAt: string | null;
  owner: User;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  emailVerified: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  serverCount: number;
}

export interface Review {
  id: string;
  serverId: string;
  user: User;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
}

export interface Vote {
  id: string;
  serverId: string;
  userId: string;
  votedAt: string;
}

export interface ServerStats {
  playerCount: number | null;
  isOnline: boolean;
  recordedAt: string;
}

export type SortOption = 'votes' | 'players' | 'newest' | 'random';

export interface ServerFilters {
  category?: string;
  version?: string;
  online?: boolean;
  search?: string;
  sort?: SortOption;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
}

// Admin types
export interface AdminStats {
  totalUsers: number;
  totalServers: number;
  totalVotes: number;
  newUsersToday: number;
  newServersToday: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  emailVerified: boolean;
  isBanned: boolean;
  bannedReason: string | null;
  createdAt: string;
  serverCount: number;
}

export interface AdminServer {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  ownerUsername: string | null;
  ownerId: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  isOnline: boolean;
  voteCount: number;
  playerCount: number | null;
  createdAt: string;
}

export interface AdminAction {
  id: string;
  adminId: string;
  adminUsername: string;
  actionType: string;
  targetType: 'SERVER' | 'USER' | 'REVIEW';
  targetId: string;
  targetName: string;
  details: string | null;
  createdAt: string;
}

// Server status monitoring types
export interface StatusHistoryEntry {
  online: boolean;
  playerCount: number | null;
  maxPlayers: number | null;
  responseTimeMs: number | null;
  queryProtocol: string | null;
  recordedAt: string;
}

export interface ServerUptimeStats {
  serverId: string;
  uptime24h: number;
  uptime7d: number;
  avgResponseMs: number | null;
  totalChecks24h: number;
  currentlyOnline: boolean;
  lastCheckedAt: string | null;
}

// Registration status
export interface RegistrationStatus {
  registrationEnabled: boolean;
  discordLoginEnabled: boolean;
  googleLoginEnabled: boolean;
}

// Admin settings
export interface AdminSettings {
  registrationEnabled: boolean;
  discordLoginEnabled: boolean;
  googleLoginEnabled: boolean;
}
