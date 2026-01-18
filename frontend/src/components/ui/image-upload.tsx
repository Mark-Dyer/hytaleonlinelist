'use client';

import { useState, useRef, useCallback } from 'react';
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
        response = await uploadApi.uploadIcon(file);
      } else if (type === 'banner') {
        response = await uploadApi.uploadBanner(file);
      } else {
        response = await uploadApi.uploadAvatar(file);
      }
      onChange(response.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [type, config.maxSize, config.maxSizeLabel, onChange]);

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
        <div className="relative inline-block">
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
