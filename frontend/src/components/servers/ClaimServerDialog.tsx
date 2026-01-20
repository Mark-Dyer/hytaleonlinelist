'use client';

import { useState, useEffect } from 'react';
import { Shield, Globe, Server, FileText, Mail, CheckCircle, AlertCircle, Loader2, Copy, Check, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  claimApi,
  type VerificationMethod,
  type VerificationMethodInfo,
  type ClaimInitiatedResponse,
  type ClaimStatusResponse,
} from '@/lib/claim-api';
import { ApiError } from '@/lib/api';

interface ClaimServerDialogProps {
  serverId: string;
  serverName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationSuccess?: () => void;
}

type Step = 'select-method' | 'instructions' | 'verifying' | 'success' | 'error';

const methodIcons: Record<VerificationMethod, typeof Shield> = {
  MOTD: Server,
  DNS_TXT: Globe,
  FILE_UPLOAD: FileText,
  EMAIL: Mail,
};

export function ClaimServerDialog({
  serverId,
  serverName,
  open,
  onOpenChange,
  onVerificationSuccess,
}: ClaimServerDialogProps) {
  const [step, setStep] = useState<Step>('select-method');
  const [methods, setMethods] = useState<VerificationMethodInfo[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [claimData, setClaimData] = useState<ClaimInitiatedResponse | null>(null);
  const [status, setStatus] = useState<ClaimStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load methods and status when dialog opens
  useEffect(() => {
    if (open) {
      loadInitialData();
    } else {
      // Reset state when dialog closes
      setStep('select-method');
      setSelectedMethod(null);
      setClaimData(null);
      setError(null);
    }
  }, [open, serverId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [methodsData, statusData] = await Promise.all([
        claimApi.getAvailableMethods(serverId),
        claimApi.getClaimStatus(serverId),
      ]);
      setMethods(methodsData);
      setStatus(statusData);

      // If already verified, show success
      if (statusData.isVerified) {
        setStep('success');
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to load verification methods';
      setError(message);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMethod = async (method: VerificationMethod) => {
    setSelectedMethod(method);
    setLoading(true);
    setError(null);

    try {
      const response = await claimApi.initiateClaim(serverId, method);
      setClaimData(response);
      setStep('instructions');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to initiate claim';
      setError(message);
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedMethod) return;

    setStep('verifying');
    setError(null);

    try {
      const result = await claimApi.attemptVerification(serverId, selectedMethod);
      if (result.isVerified) {
        setStep('success');
        onVerificationSuccess?.();
      } else {
        setError(result.message);
        setStep('instructions');
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Verification failed';
      setError(message);
      setStep('instructions');
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancel = async () => {
    try {
      await claimApi.cancelClaim(serverId);
      onOpenChange(false);
    } catch {
      // Ignore errors when cancelling
      onOpenChange(false);
    }
  };

  const renderMethodSelection = () => (
    <TooltipProvider>
      <div className="space-y-4">
        <DialogDescription>
          Choose a verification method to prove you own this server. Different methods are available
          depending on your server configuration.
        </DialogDescription>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => {
              const Icon = methodIcons[method.method];
              const methodButton = (
                <button
                  key={method.method}
                  onClick={() => method.available && handleSelectMethod(method.method)}
                  disabled={!method.available || loading}
                  className={cn(
                    'w-full p-4 rounded-lg border text-left transition-colors',
                    method.available
                      ? 'hover:bg-accent hover:border-primary cursor-pointer'
                      : 'opacity-50 cursor-not-allowed bg-muted/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        method.available ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.displayName}</span>
                        {!method.available && (
                          <Badge variant="secondary" className="text-xs flex items-center gap-1">
                            Unavailable
                            {method.requirementHint && (
                              <Info className="h-3 w-3" />
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                      {!method.available && method.requirementHint && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900">
                          {method.requirementHint}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );

              // Wrap unavailable methods with a tooltip for quick explanation
              if (!method.available && method.requirementHint) {
                return (
                  <Tooltip key={method.method}>
                    <TooltipTrigger asChild>
                      {methodButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>{method.requirementHint}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return methodButton;
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );

  const renderInstructions = () => {
    if (!claimData) return null;

    return (
      <div className="space-y-4">
        <DialogDescription>
          Follow these instructions to verify your ownership of <strong>{serverName}</strong>.
        </DialogDescription>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Verification Token</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(claimData.verificationToken)}
              className="h-8"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <code className="block p-2 rounded bg-background font-mono text-sm break-all">
            {claimData.verificationToken}
          </code>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-sm p-4 rounded-lg bg-muted/50 border">
            {claimData.instructions}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleVerify} className="flex-1">
            <Shield className="h-4 w-4 mr-2" />
            Verify Now
          </Button>
        </div>
      </div>
    );
  };

  const renderVerifying = () => (
    <div className="py-8 text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
      <p className="text-lg font-medium">Verifying your ownership...</p>
      <p className="text-sm text-muted-foreground">This may take a few seconds.</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-8 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-lg font-medium">Verification Successful!</p>
        <p className="text-sm text-muted-foreground mt-1">
          You have successfully verified ownership of <strong>{serverName}</strong>.
        </p>
      </div>
      <Button onClick={() => onOpenChange(false)} className="mt-4">
        Close
      </Button>
    </div>
  );

  const renderError = () => (
    <div className="py-8 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="text-sm text-muted-foreground mt-1">{error || 'An unexpected error occurred.'}</p>
      </div>
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
        <Button onClick={loadInitialData}>Try Again</Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {step === 'success' ? 'Server Verified' : 'Claim Server'}
          </DialogTitle>
        </DialogHeader>

        {step === 'select-method' && renderMethodSelection()}
        {step === 'instructions' && renderInstructions()}
        {step === 'verifying' && renderVerifying()}
        {step === 'success' && renderSuccess()}
        {step === 'error' && renderError()}
      </DialogContent>
    </Dialog>
  );
}
