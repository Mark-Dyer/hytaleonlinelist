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
import type { ImportResult } from '@/types';
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
} from 'lucide-react';

type ImportStatus = 'idle' | 'running' | 'complete' | 'error';

export default function AdminImportPage() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Data Import</h1>
        <p className="mt-1 text-muted-foreground">
          Import server data from external sources to seed the platform
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
    </div>
  );
}
