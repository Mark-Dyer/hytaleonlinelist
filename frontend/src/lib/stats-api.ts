import type { PlatformStats } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const statsApi = {
  /**
   * Get platform-wide statistics.
   * This is more efficient than fetching all servers and calculating client-side.
   */
  getPlatformStats: async (): Promise<PlatformStats> => {
    const res = await fetch(`${API_BASE_URL}/api/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch platform stats');
    }
    return res.json();
  },
};
