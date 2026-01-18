'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export default function VerifyEmailNoticePage() {
  const { user, resendVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      await resendVerificationEmail();
      setResendSuccess(true);
    } catch {
      setResendError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // If user is already verified, show success message
  if (user?.emailVerified) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-muted-foreground">
              Your email has been verified. You now have full access to all features.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{' '}
            {user?.email ? (
              <span className="font-medium text-foreground">{user.email}</span>
            ) : (
              'your email address'
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>
              Click the link in the email to verify your account. This allows you to:
            </p>
            <ul className="mt-2 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Vote for your favorite servers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Add and manage your servers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Write reviews
              </li>
            </ul>
          </div>

          {resendSuccess && (
            <div className="rounded-md bg-green-500/15 px-4 py-3 text-sm text-green-600">
              Verification email sent! Check your inbox.
            </div>
          )}

          {resendError && (
            <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive">
              {resendError}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendEmail}
            disabled={isResending || resendSuccess}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : resendSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Email Sent
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            Didn&apos;t receive the email? Check your spam folder or click resend above.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Continue to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
