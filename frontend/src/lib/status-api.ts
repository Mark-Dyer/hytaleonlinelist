import { api } from './api';
import { StatusHistoryEntry, ServerUptimeStats } from '@/types';

/**
 * Get uptime statistics for a server
 */
export async function getServerUptimeStats(serverId: string): Promise<ServerUptimeStats> {
  return api.get<ServerUptimeStats>(`/api/servers/${serverId}/status/uptime`);
}

/**
 * Get status history for a server (for charts)
 * @param serverId Server UUID
 * @param hours Number of hours of history (default 24, max 168)
 */
export async function getServerStatusHistory(
  serverId: string,
  hours: number = 24
): Promise<StatusHistoryEntry[]> {
  return api.get<StatusHistoryEntry[]>(
    `/api/servers/${serverId}/status/history?hours=${hours}`
  );
}
