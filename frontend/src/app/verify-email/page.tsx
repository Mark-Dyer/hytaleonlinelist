'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/auth-api';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
      } catch {
        setStatus('error');
        setError('Verification failed. The link may have expired.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          )}
          {status === 'success' && (
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          )}
          {status === 'error' && (
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
          )}
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === 'loading' && <p>Verifying your email...</p>}
          {status === 'success' && (
            <>
              <h2 className="text-xl font-semibold">Email Verified!</h2>
              <p className="text-muted-foreground">
                Your email has been verified. You can now vote for servers and add your own.
              </p>
              <Button onClick={() => router.push('/')}>Continue to Home</Button>
            </>
          )}
          {status === 'error' && (
            <>
              <h2 className="text-xl font-semibold">Verification Failed</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
