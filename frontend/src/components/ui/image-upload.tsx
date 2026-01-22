'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { uploadApi, type UploadResponse } from '@/lib/upload-api';
import { cn } from '@/lib/utils';
import { Upload, X, Loader2, ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  type: 'icon' | 'banner' | 'avatar';
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  uploadEndpoint?: string;
  /** Server slug for naming uploaded files (used for existing servers) */
  serverSlug?: string;
}

interface DeferredImageUploadProps {
  type: 'icon' | 'banner';
  file?: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

const CONFIG = {
  icon: {
    maxSize: 2 * 1024 * 1024, // 2MB
    maxSizeLabel: '2MB',
    aspectRatio: 'aspect-square',
    previewClass: 'h-24 w-24 rounded-lg',
    dropzoneClass: 'h-32 w-32',
  },
  banner: {
    maxSize: 5 * 1024 * 1024, // 5MB
    maxSizeLabel: '5MB',
    aspectRatio: 'aspect-[3/1]',
    previewClass: 'h-32 w-full rounded-lg',
    dropzoneClass: 'h-40 w-full',
  },
  avatar: {
    maxSize: 2 * 1024 * 1024, // 2MB
    maxSizeLabel: '2MB',
    aspectRatio: 'aspect-square',
    previewClass: 'h-24 w-24 rounded-full',
    dropzoneClass: 'h-32 w-32',
  },
};

export function ImageUpload({
  type,
  value,
  onChange,
  disabled = false,
  className,
  uploadEndpoint,
  serverSlug,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = CONFIG[type];

  const handleUpload = useCallback(async (file: File) => {
    setError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
      return;
    }

    // Validate file size
    if (file.size > config.maxSize) {
      setError(`File size exceeds ${config.maxSizeLabel}`);
      return;
    }

    setIsUploading(true);

    try {
      let response: UploadResponse;
      if (type === 'icon') {
        response = await uploadApi.uploadIcon(file, serverSlug);
      } else if (type === 'banner') {
        response = await uploadApi.uploadBanner(file, serverSlug);
      } else {
        response = await uploadApi.uploadAvatar(file);
      }
      onChange(response.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [type, config.maxSize, config.maxSizeLabel, onChange, serverSlug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, [disabled, isUploading, handleUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {value ? (
        <div className={cn("relative overflow-hidden", type === 'banner' ? 'w-full' : 'inline-block')}>
          <img
            src={value}
            alt={`Server ${type}`}
            className={cn(
              config.previewClass,
              'object-cover border border-border'
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            config.dropzoneClass,
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50',
            (disabled || isUploading) && 'cursor-not-allowed opacity-50'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="mt-2 text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {isDragging ? (
                  <Upload className="h-5 w-5 text-primary" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <span className="mt-2 text-sm font-medium">
                {isDragging ? 'Drop to upload' : 'Click or drag to upload'}
              </span>
              <span className="text-xs text-muted-foreground">
                JPEG, PNG, GIF, WebP (max {config.maxSizeLabel})
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Deferred image upload component for new server creation.
 * Instead of uploading immediately, stores the File object and shows a local preview.
 * The actual upload happens when the form is submitted.
 */
export function DeferredImageUpload({
  type,
  file,
  onFileChange,
  disabled = false,
  className,
}: DeferredImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = CONFIG[type];

  // Create and cleanup object URL for preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
      return;
    }

    // Validate file size
    if (selectedFile.size > config.maxSize) {
      setError(`File size exceeds ${config.maxSizeLabel}`);
      return;
    }

    onFileChange(selectedFile);
  }, [config.maxSize, config.maxSizeLabel, onFileChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onFileChange(null);
    setError(null);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {previewUrl ? (
        <div className={cn("relative overflow-hidden", type === 'banner' ? 'w-full' : 'inline-block')}>
          <img
            src={previewUrl}
            alt={`Server ${type} preview`}
            className={cn(
              config.previewClass,
              'object-cover border border-border'
            )}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
          <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
            Pending upload
          </span>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            config.dropzoneClass,
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {isDragging ? (
              <Upload className="h-5 w-5 text-primary" />
            ) : (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <span className="mt-2 text-sm font-medium">
            {isDragging ? 'Drop to select' : 'Click or drag to select'}
          </span>
          <span className="text-xs text-muted-foreground">
            JPEG, PNG, GIF, WebP (max {config.maxSizeLabel})
          </span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
