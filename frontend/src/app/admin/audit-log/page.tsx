'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AdminAction, PaginatedResponse } from '@/types';
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Star,
  BadgeCheck,
  Ban,
  UserCog,
  Trash2,
  Server,
  User,
} from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
  SERVER_FEATURED: Star,
  SERVER_UNFEATURED: Star,
  SERVER_VERIFIED: BadgeCheck,
  SERVER_UNVERIFIED: BadgeCheck,
  SERVER_DELETED: Trash2,
  USER_BANNED: Ban,
  USER_UNBANNED: Ban,
  USER_ROLE_CHANGED: UserCog,
};

const actionColors: Record<string, string> = {
  SERVER_FEATURED: 'bg-yellow-500/10 text-yellow-500',
  SERVER_UNFEATURED: 'bg-yellow-500/10 text-yellow-500',
  SERVER_VERIFIED: 'bg-blue-500/10 text-blue-500',
  SERVER_UNVERIFIED: 'bg-blue-500/10 text-blue-500',
  SERVER_DELETED: 'bg-red-500/10 text-red-500',
  USER_BANNED: 'bg-red-500/10 text-red-500',
  USER_UNBANNED: 'bg-green-500/10 text-green-500',
  USER_ROLE_CHANGED: 'bg-purple-500/10 text-purple-500',
};

function formatActionType(actionType: string): string {
  return actionType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AuditLogPage() {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<AdminAction>['meta'] | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.getAuditLog(page, 20);
      setActions(data.data);
      setMeta(data.meta);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load audit log');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Log</h1>
        <p className="mt-1 text-muted-foreground">
          History of all admin actions on the platform
        </p>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : actions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <ScrollText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No actions recorded</h3>
            <p className="text-muted-foreground">
              Admin actions will appear here once performed
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Actions Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Target</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Admin</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Details</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {actions.map((action) => {
                  const Icon = actionIcons[action.actionType] || AlertCircle;
                  const colorClass = actionColors[action.actionType] || 'bg-muted text-muted-foreground';
                  const TargetIcon = action.targetType === 'SERVER' ? Server : User;

                  return (
                    <tr key={action.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium">
                            {formatActionType(action.actionType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1">
                            <TargetIcon className="h-3 w-3" />
                            {action.targetType}
                          </Badge>
                          <span className="text-sm">{action.targetName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        @{action.adminUsername}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                        {action.details || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDateTime(action.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {actions.length} of {meta.total} actions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page + 1} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
