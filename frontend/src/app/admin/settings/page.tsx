'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/admin-api';
import { ApiError } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AdminSettings } from '@/types';
import {
  Loader2,
  AlertCircle,
  Settings,
  UserPlus,
  KeyRound,
} from 'lucide-react';

// Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Google icon component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminApi.getSettings();
        setSettings(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load settings');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleToggle = async (
    field: 'registration' | 'discord' | 'google',
    apiCall: () => Promise<AdminSettings>,
    successMsg: string
  ) => {
    setSavingField(field);
    setError(null);
    setSuccessMessage(null);

    try {
      const newSettings = await apiCall();
      setSettings(newSettings);
      setSuccessMessage(successMsg);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update settings');
      }
    } finally {
      setSavingField(null);
    }
  };

  const handleToggleRegistration = () => {
    if (!settings) return;
    handleToggle(
      'registration',
      () => adminApi.setRegistrationEnabled(!settings.registrationEnabled),
      settings.registrationEnabled
        ? 'Registration has been disabled'
        : 'Registration has been enabled'
    );
  };

  const handleToggleDiscord = () => {
    if (!settings) return;
    handleToggle(
      'discord',
      () => adminApi.setDiscordLoginEnabled(!settings.discordLoginEnabled),
      settings.discordLoginEnabled
        ? 'Discord login has been disabled'
        : 'Discord login has been enabled'
    );
  };

  const handleToggleGoogle = () => {
    if (!settings) return;
    handleToggle(
      'google',
      () => adminApi.setGoogleLoginEnabled(!settings.googleLoginEnabled),
      settings.googleLoginEnabled
        ? 'Google login has been disabled'
        : 'Google login has been enabled'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage platform-wide settings
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

      {successMessage && (
        <Card className="border-green-500/50 bg-green-500/10">
          <CardContent className="flex items-center gap-3 p-4">
            <Settings className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-600 dark:text-green-400">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* User Registration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>User Registration</CardTitle>
              <CardDescription>
                Control whether new users can register on the platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium">Registration Status</p>
              <p className="text-sm text-muted-foreground">
                {settings?.registrationEnabled
                  ? 'New users can register for accounts'
                  : 'Registration is disabled - new users cannot sign up'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  settings?.registrationEnabled
                    ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                }`}
              >
                {settings?.registrationEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Button
                onClick={handleToggleRegistration}
                disabled={savingField !== null}
                variant={settings?.registrationEnabled ? 'outline' : 'default'}
              >
                {savingField === 'registration' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : settings?.registrationEnabled ? (
                  'Disable'
                ) : (
                  'Enable'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OAuth Providers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <KeyRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>OAuth Providers</CardTitle>
              <CardDescription>
                Control which OAuth providers users can use to sign in or register
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Discord */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5865F2]/10">
                <DiscordIcon className="h-5 w-5 text-[#5865F2]" />
              </div>
              <div>
                <p className="font-medium">Discord Login</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.discordLoginEnabled
                    ? 'Users can sign in with their Discord account'
                    : 'Discord authentication is disabled'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  settings?.discordLoginEnabled
                    ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                }`}
              >
                {settings?.discordLoginEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Button
                onClick={handleToggleDiscord}
                disabled={savingField !== null}
                variant={settings?.discordLoginEnabled ? 'outline' : 'default'}
              >
                {savingField === 'discord' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : settings?.discordLoginEnabled ? (
                  'Disable'
                ) : (
                  'Enable'
                )}
              </Button>
            </div>
          </div>

          {/* Google */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <GoogleIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Google Login</p>
                <p className="text-sm text-muted-foreground">
                  {settings?.googleLoginEnabled
                    ? 'Users can sign in with their Google account'
                    : 'Google authentication is disabled'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  settings?.googleLoginEnabled
                    ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                    : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                }`}
              >
                {settings?.googleLoginEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Button
                onClick={handleToggleGoogle}
                disabled={savingField !== null}
                variant={settings?.googleLoginEnabled ? 'outline' : 'default'}
              >
                {savingField === 'google' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : settings?.googleLoginEnabled ? (
                  'Disable'
                ) : (
                  'Enable'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
