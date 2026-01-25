'use client';

import { useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { ImportResult, ViewCountFixResult } from '@/types';
import {
  Loader2,
  AlertCircle,
  Database,
  Download,
  CheckCircle2,
  XCircle,
  Server,
  Image,
  FileText,
  Tag,
  Link as LinkIcon,
  AlertTriangle,
  Info,
  SkipForward,
  Eye,
  Wrench,
} from 'lucide-react';

type ImportStatus = 'idle' | 'running' | 'complete' | 'error';
type FixStatus = 'idle' | 'running' | 'complete' | 'error';

export default function AdminImportPage() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // View count fix state
  const [fixStatus, setFixStatus] = useState<FixStatus>('idle');
  const [fixResult, setFixResult] = useState<ViewCountFixResult | null>(null);
  const [fixError, setFixError] = useState<string | null>(null);
  const [fixDialogOpen, setFixDialogOpen] = useState(false);

  const handleImport = async () => {
    setDialogOpen(false);
    setStatus('running');
    setError(null);
    setResult(null);

    try {
      const importResult = await adminApi.importServers();
      setResult(importResult);
      setStatus('complete');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during import');
      }
      setStatus('error');
    }
  };

  const handleFixViewCounts = async () => {
    setFixDialogOpen(false);
    setFixStatus('running');
    setFixError(null);
    setFixResult(null);

    try {
      const result = await adminApi.fixViewCounts();
      setFixResult(result);
      setFixStatus('complete');
    } catch (err) {
      if (err instanceof ApiError) {
        setFixError(err.message);
      } else {
        setFixError('An unexpected error occurred while fixing view counts');
      }
      setFixStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Data Management</h1>
        <p className="mt-1 text-muted-foreground">
          Import server data and run data maintenance operations
        </p>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Server Import from Hytale Servers</CardTitle>
              <CardDescription>
                One-time import to populate the platform with existing server listings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This tool imports server listings from an external Hytale server list API.
            It&apos;s designed as a one-time seed operation to populate your platform with
            existing servers when launching.
          </p>

          {/* What gets imported */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 font-medium flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              What gets imported
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Server className="h-4 w-4 text-green-500" />
                Server name, IP address, port
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 text-green-500" />
                Description and short description
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Image className="h-4 w-4 text-green-500" />
                Banner and icon images (uploaded to R2)
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4 text-green-500" />
                Tags and category mappings
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LinkIcon className="h-4 w-4 text-green-500" />
                Website and Discord URLs
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4 text-green-500" />
                Vote counts and ratings
              </div>
            </div>
          </div>

          {/* Important notes */}
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
            <h4 className="mb-2 font-medium flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Important Notes
            </h4>
            <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-400">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 flex-shrink-0" />
                Servers with existing slugs will be <strong>skipped</strong> (no duplicates)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 flex-shrink-0" />
                Images are downloaded and uploaded to your R2 storage
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 flex-shrink-0" />
                Imported servers have <strong>no owner</strong> (can be claimed)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 flex-shrink-0" />
                This operation may take several minutes to complete
              </li>
            </ul>
          </div>

          {/* R2 requirement */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <h4 className="mb-2 font-medium flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              R2 Storage Requirement
            </h4>
            <p className="text-sm text-muted-foreground">
              For images to be imported, Cloudflare R2 storage must be enabled and configured
              with a valid account ID. Without R2, servers will still be imported but without
              banner/icon images.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Run Import</CardTitle>
              <CardDescription>
                Start the server import process
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Display */}
          {status === 'idle' && (
            <div className="rounded-lg border border-border p-4 text-center">
              <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Ready to import servers. Click the button below to begin.
              </p>
            </div>
          )}

          {status === 'running' && (
            <div className="rounded-lg border border-primary/50 bg-primary/5 p-6 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary mb-3" />
              <p className="font-medium">Import in Progress</p>
              <p className="text-sm text-muted-foreground mt-1">
                This may take several minutes. Please don&apos;t close this page.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Fetching servers, downloading images, and uploading to R2...
              </p>
            </div>
          )}

          {status === 'complete' && result && (
            <div className="space-y-4">
              <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Import Completed Successfully</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-foreground">{result.totalFetched}</div>
                    <div className="text-xs text-muted-foreground">Total Found</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{result.imported}</div>
                    <div className="text-xs text-muted-foreground">Imported</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{result.skipped}</div>
                    <div className="text-xs text-muted-foreground">Skipped</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{result.failed}</div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-4 pt-4 border-t border-green-500/30 space-y-2 text-sm">
                  {result.imported > 0 && (
                    <p className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      {result.imported} server{result.imported !== 1 ? 's' : ''} successfully imported
                    </p>
                  )}
                  {result.skipped > 0 && (
                    <p className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <SkipForward className="h-4 w-4" />
                      {result.skipped} server{result.skipped !== 1 ? 's' : ''} skipped (already exist)
                    </p>
                  )}
                  {result.failed > 0 && (
                    <p className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <XCircle className="h-4 w-4" />
                      {result.failed} server{result.failed !== 1 ? 's' : ''} failed to import
                    </p>
                  )}
                </div>
              </div>

              {/* Errors list if any */}
              {result.errors && result.errors.length > 0 && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Errors ({result.errors.length})</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.slice(0, 20).map((err, index) => (
                      <p key={index} className="text-xs text-red-600 dark:text-red-400 font-mono">
                        {err}
                      </p>
                    ))}
                    {result.errors.length > 20 && (
                      <p className="text-xs text-red-600 dark:text-red-400 italic">
                        ... and {result.errors.length - 20} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Import Failed</span>
              </div>
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  disabled={status === 'running'}
                  className="gap-2"
                >
                  {status === 'running' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : status === 'complete' ? (
                    <>
                      <Download className="h-4 w-4" />
                      Run Import Again
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Start Import
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start Server Import?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      This will import server listings from the external API. The process may
                      take several minutes to complete.
                    </p>
                    <p className="font-medium text-foreground">
                      Are you sure you want to proceed?
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleImport}>
                    Yes, Start Import
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* View Count Fix Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Wrench className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <CardTitle>Fix View Counts</CardTitle>
              <CardDescription>
                Correct view counts for imported servers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This tool fixes view counts for servers where the view count is less than or equal to
            the vote count (which doesn&apos;t make sense since users must view a server to vote).
            It generates realistic view counts based on typical vote conversion rates (2-10%).
          </p>

          {/* What it does */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-3 font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              What this fix does
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                Sets view counts to 10-50x the vote count (with randomness)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                Servers with 0 votes get 50-250 random views
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                Only affects servers where viewCount ≤ voteCount
              </li>
            </ul>
          </div>

          {/* Status Display */}
          {fixStatus === 'idle' && (
            <div className="rounded-lg border border-border p-4 text-center">
              <Eye className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Ready to fix view counts. Click the button below to begin.
              </p>
            </div>
          )}

          {fixStatus === 'running' && (
            <div className="rounded-lg border border-orange-500/50 bg-orange-500/5 p-6 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange-500 mb-3" />
              <p className="font-medium">Fixing View Counts</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we update server view counts...
              </p>
            </div>
          )}

          {fixStatus === 'complete' && fixResult && (
            <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-3">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">View Counts Fixed Successfully</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {fixResult.serversUpdated}
                  </div>
                  <div className="text-xs text-muted-foreground">Servers Updated</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {fixResult.totalViewsAdded.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Views Added</div>
                </div>
              </div>
            </div>
          )}

          {fixStatus === 'error' && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Fix Failed</span>
              </div>
              <p className="text-sm text-destructive">{fixError}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <AlertDialog open={fixDialogOpen} onOpenChange={setFixDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  disabled={fixStatus === 'running'}
                  className="gap-2"
                >
                  {fixStatus === 'running' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fixing...
                    </>
                  ) : fixStatus === 'complete' ? (
                    <>
                      <Wrench className="h-4 w-4" />
                      Run Fix Again
                    </>
                  ) : (
                    <>
                      <Wrench className="h-4 w-4" />
                      Fix View Counts
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Fix Server View Counts?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>
                      This will update view counts for all servers where the view count is
                      less than or equal to the vote count.
                    </p>
                    <p className="font-medium text-foreground">
                      Are you sure you want to proceed?
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFixViewCounts}>
                    Yes, Fix View Counts
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
