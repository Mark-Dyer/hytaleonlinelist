'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi, type UpdateServerRequest } from '@/lib/dashboard-api';
import { categoryApi } from '@/lib/server-api';
import { ApiError } from '@/lib/api';
import { trackEvent } from '@/components/analytics';
import type { Category, Server } from '@/types';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  ArrowLeft,
  Server as ServerIcon,
  Loader2,
  AlertCircle,
  X,
  Plus,
} from 'lucide-react';

interface EditServerPageProps {
  params: Promise<{ id: string }>;
}

export default function EditServerPage({ params }: EditServerPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [originalServer, setOriginalServer] = useState<Server | null>(null);

  // Form state
  const [formData, setFormData] = useState<UpdateServerRequest>({
    name: '',
    ipAddress: '',
    port: 5520,
    shortDescription: '',
    description: '',
    bannerUrl: '',
    iconUrl: '',
    websiteUrl: '',
    discordUrl: '',
    categoryId: '',
    tags: [],
    version: '1.0',
    maxPlayers: 100,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [serverData, categoriesData] = await Promise.all([
          dashboardApi.getMyServer(id),
          categoryApi.getAllCategories(),
        ]);

        setOriginalServer(serverData);
        setCategories(categoriesData);

        // Populate form with existing data
        setFormData({
          name: serverData.name,
          ipAddress: serverData.ipAddress,
          port: serverData.port,
          shortDescription: serverData.shortDescription,
          description: serverData.description,
          bannerUrl: serverData.bannerUrl || '',
          iconUrl: serverData.iconUrl || '',
          websiteUrl: serverData.websiteUrl || '',
          discordUrl: serverData.discordUrl || '',
          categoryId: serverData.category.id,
          tags: serverData.tags || [],
          version: serverData.version,
          maxPlayers: serverData.maxPlayers ?? undefined,
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load server data');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    trackEvent('server_update_attempted', { server_id: id });

    try {
      await dashboardApi.updateServer(id, formData);
      trackEvent('server_update_success', { server_id: id });
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        trackEvent('server_update_failed', { server_id: id, error: err.message });
      } else {
        setError('Failed to update server. Please try again.');
        trackEvent('server_update_failed', { server_id: id, error: 'unexpected_error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateServerRequest, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && formData.tags && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove) || [],
    }));
  };

  if (isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !originalServer) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold">Error Loading Server</h2>
            <p className="mb-4 text-muted-foreground">{error}</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && !user.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-yellow-500" />
            <h2 className="mb-2 text-xl font-semibold">Email Verification Required</h2>
            <p className="mb-4 text-muted-foreground">
              You need to verify your email before you can edit a server.
            </p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ServerIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Server</h1>
              <p className="text-sm text-muted-foreground">
                Update your server details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                The essential details about your server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Server Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="My Awesome Server"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    IP Address <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.ipAddress}
                    onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                    placeholder="play.example.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Port</label>
                  <Input
                    type="number"
                    value={formData.port}
                    onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 5520)}
                    placeholder="5520"
                    min={1}
                    max={65535}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Version <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    placeholder="1.0"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Max Players</label>
                  <Input
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value) || 100)}
                    placeholder="100"
                    min={1}
                    max={100000}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>
                Tell players what makes your server special
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Short Description <span className="text-destructive">*</span>
                </label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="A brief description of your server (10-200 characters)"
                  required
                  minLength={10}
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {(formData.shortDescription || '').length}/200 characters
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Write a detailed description of your server. You can use markdown formatting."
                  required
                  minLength={50}
                  maxLength={10000}
                  rows={10}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {(formData.description || '').length}/10000 characters (minimum 50)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add up to 10 tags to help players find your server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  disabled={!tagInput.trim() || (formData.tags?.length || 0) >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>
                Upload images for your server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Server Icon</label>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Square image, recommended 256x256px
                  </p>
                  <ImageUpload
                    type="icon"
                    value={formData.iconUrl}
                    onChange={(url) => handleInputChange('iconUrl', url)}
                    disabled={isLoading}
                    serverSlug={originalServer?.slug}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Server Banner</label>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Wide image, recommended 1200x400px
                  </p>
                  <ImageUpload
                    type="banner"
                    value={formData.bannerUrl}
                    onChange={(url) => handleInputChange('bannerUrl', url)}
                    disabled={isLoading}
                    serverSlug={originalServer?.slug}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>
                Add external links to your server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Website URL</label>
                <Input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Discord URL</label>
                <Input
                  type="url"
                  value={formData.discordUrl}
                  onChange={(e) => handleInputChange('discordUrl', e.target.value)}
                  placeholder="https://discord.gg/example"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
