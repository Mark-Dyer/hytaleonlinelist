'use client';

import { ServerUptimeStats } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface UptimeStatsProps {
  stats: ServerUptimeStats;
}

export function UptimeStats({ stats }: UptimeStatsProps) {
  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return 'text-green-500';
    if (uptime >= 95) return 'text-green-400';
    if (uptime >= 90) return 'text-yellow-500';
    if (uptime >= 80) return 'text-orange-500';
    return 'text-red-500';
  };

  const formatLastChecked = () => {
    if (!stats.lastCheckedAt) return 'Never';
    return formatDistanceToNow(new Date(stats.lastCheckedAt), { addSuffix: true });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Uptime Statistics</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* 24h Uptime */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground mb-1">24h Uptime</p>
          <p className={`text-2xl font-bold ${getUptimeColor(stats.uptime24h)}`}>
            {stats.uptime24h.toFixed(1)}%
          </p>
        </div>

        {/* 7d Uptime */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground mb-1">7d Uptime</p>
          <p className={`text-2xl font-bold ${getUptimeColor(stats.uptime7d)}`}>
            {stats.uptime7d.toFixed(1)}%
          </p>
        </div>

        {/* Avg Response Time */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
          <p className="text-2xl font-bold text-foreground">
            {stats.avgResponseMs !== null ? `${stats.avgResponseMs}ms` : 'N/A'}
          </p>
        </div>

        {/* Total Checks */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground mb-1">Checks (24h)</p>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalChecks24h}
          </p>
        </div>
      </div>

      {/* Status and Last Checked */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              stats.currentlyOnline ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-muted-foreground">
            {stats.currentlyOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <span className="text-muted-foreground">
          Last checked: {formatLastChecked()}
        </span>
      </div>
    </div>
  );
}
