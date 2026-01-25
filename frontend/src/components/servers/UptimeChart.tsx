'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { StatusHistoryEntry } from '@/types';

// Chart colors - matching the theme (oklch to hex approximations)
const CHART_COLORS = {
  primary: '#8B5CF6',      // Purple (primary)
  primaryLight: '#A78BFA', // Lighter purple for gradient
  accent: '#22D3EE',       // Cyan (accent)
  border: '#3F3F5A',       // Border color
  muted: '#71717A',        // Muted text
};

interface UptimeChartProps {
  history: StatusHistoryEntry[];
  onRangeChange?: (hours: number) => void;
}

export function UptimeChart({ history, onRangeChange }: UptimeChartProps) {
  const [range, setRange] = useState<24 | 168>(24);

  const handleRangeChange = (newRange: 24 | 168) => {
    setRange(newRange);
    onRangeChange?.(newRange);
  };

  const chartData = useMemo(() => {
    return history.map((entry) => ({
      time: new Date(entry.recordedAt).getTime(),
      playerCount: entry.playerCount,
      maxPlayers: entry.maxPlayers,
      online: entry.online ? 1 : 0,
    }));
  }, [history]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return range === 24
      ? format(date, 'HH:mm')
      : format(date, 'MM/dd HH:mm');
  };

  const formatTooltipTime = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, HH:mm');
  };

  const maxPlayers = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.playerCount || 0));
    return Math.max(max, 10); // Minimum y-axis of 10
  }, [chartData]);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Player History</h3>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => handleRangeChange(24)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              range === 24
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => handleRangeChange(168)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              range === 168
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            7d
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No data available yet. Check back in a few minutes.
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="playerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.5} />
                  <stop offset="50%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={CHART_COLORS.border}
              />
              <XAxis
                dataKey="time"
                tickFormatter={formatTime}
                stroke={CHART_COLORS.muted}
                tick={{ fontSize: 12, fill: CHART_COLORS.muted }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, maxPlayers]}
                stroke={CHART_COLORS.muted}
                tick={{ fontSize: 12, fill: CHART_COLORS.muted }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        {formatTooltipTime(data.time)}
                      </p>
                      <p className="text-lg font-semibold">
                        {data.playerCount !== null ? `${data.playerCount} players` : 'N/A'}
                        {data.maxPlayers !== null && data.playerCount !== null && (
                          <span className="text-sm text-muted-foreground font-normal">
                            {' '}/{' '}{data.maxPlayers}
                          </span>
                        )}
                      </p>
                      <p className={`text-sm ${data.online ? 'text-green-500' : 'text-red-500'}`}>
                        {data.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="playerCount"
                stroke={CHART_COLORS.primary}
                strokeWidth={2.5}
                fill="url(#playerGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
