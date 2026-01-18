'use client';

import { useState, useEffect, useCallback } from 'react';
import { UptimeChart } from './UptimeChart';
import { UptimeStats } from './UptimeStats';
import { getServerUptimeStats, getServerStatusHistory } from '@/lib/status-api';
import { StatusHistoryEntry, ServerUptimeStats } from '@/types';

interface ServerStatusSectionProps {
  serverId: string;
}

export function ServerStatusSection({ serverId }: ServerStatusSectionProps) {
  const [stats, setStats] = useState<ServerUptimeStats | null>(null);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hours, setHours] = useState(24);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, historyData] = await Promise.all([
        getServerUptimeStats(serverId),
        getServerStatusHistory(serverId, hours),
      ]);

      setStats(statsData);
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to fetch server status:', err);
      setError('Failed to load status data');
    } finally {
      setIsLoading(false);
    }
  }, [serverId, hours]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRangeChange = (newHours: number) => {
    setHours(newHours);
  };

  if (isLoading && !stats) {
    return (
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
          <div className="h-6 w-40 bg-muted rounded mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
          <div className="h-6 w-40 bg-muted rounded mb-4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-muted-foreground text-center">{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-primary hover:underline text-sm mx-auto block"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stats && <UptimeStats stats={stats} />}
      <UptimeChart history={history} onRangeChange={handleRangeChange} />
    </div>
  );
}
