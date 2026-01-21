const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface UploadResponse {
  url: string;
  key: string;
  size: number;
}

/**
 * Generates a URL-friendly slug from a server name.
 * This should match the backend's slug generation logic.
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export const uploadApi = {
  /**
   * Upload a server icon image
   * @param file The image file to upload
   * @param serverSlug Optional server slug for naming (omit for new servers without a name yet)
   */
  async uploadIcon(file: File, serverSlug?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const url = new URL(`${API_BASE_URL}/api/upload/icon`);
    if (serverSlug) {
      url.searchParams.set('serverSlug', serverSlug);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload icon');
    }

    return response.json();
  },

  /**
   * Upload a server banner image
   * @param file The image file to upload
   * @param serverSlug Optional server slug for naming (omit for new servers without a name yet)
   */
  async uploadBanner(file: File, serverSlug?: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const url = new URL(`${API_BASE_URL}/api/upload/banner`);
    if (serverSlug) {
      url.searchParams.set('serverSlug', serverSlug);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload banner');
    }

    return response.json();
  },

  /**
   * Upload a user avatar image
   * Avatars are user-centric and don't need a server slug
   */
  async uploadAvatar(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Failed to upload avatar');
    }

    return response.json();
  },
};
