/**
 * Cloudflare Image Transformation utility
 *
 * Transforms image URLs to use Cloudflare's cdn-cgi image resizing.
 * Only transforms URLs from the configured CDN domain.
 *
 * @see https://developers.cloudflare.com/images/transform-images/transform-via-url/
 */

const CDN_HOST = 'cdn.hytaleonlinelist.com';

export interface CfImageOptions {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Quality 1-100 (default: 80) */
  quality?: number;
  /** How the image should fit the dimensions */
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  /** Output format (default: auto) */
  format?: 'auto' | 'avif' | 'webp' | 'jpeg' | 'png';
  /** Device pixel ratio for responsive images */
  dpr?: number;
}

/**
 * Transform an image URL to use Cloudflare Image Transformations.
 *
 * @param url - The original image URL
 * @param options - Transformation options
 * @returns The transformed URL, or the original URL if not from CDN
 *
 * @example
 * // Basic resize
 * cfImage(server.iconUrl, { width: 48, height: 48 })
 * // => https://cdn.hytaleonlinelist.com/cdn-cgi/image/width=48,height=48,quality=80,fit=cover,format=auto/icons/...
 *
 * @example
 * // Banner with custom quality
 * cfImage(server.bannerUrl, { width: 640, height: 160, quality: 85 })
 */
export function cfImage(
  url: string | null | undefined,
  options?: CfImageOptions
): string | undefined {
  if (!url) return undefined;

  // Only transform URLs from our CDN
  if (!url.includes(CDN_HOST)) return url;

  const opts: Record<string, string | number> = {
    quality: options?.quality ?? 80,
    fit: options?.fit ?? 'cover',
    format: options?.format ?? 'auto',
  };

  // Only add dimensions if specified
  if (options?.width) opts.width = options.width;
  if (options?.height) opts.height = options.height;
  if (options?.dpr) opts.dpr = options.dpr;

  const params = Object.entries(opts)
    .map(([k, v]) => `${k}=${v}`)
    .join(',');

  // Insert /cdn-cgi/image/{params}/ after the host
  return url.replace(
    `https://${CDN_HOST}/`,
    `https://${CDN_HOST}/cdn-cgi/image/${params}/`
  );
}

/**
 * Preset configurations for common image sizes
 */
export const imagePresets = {
  /** Server icon - small square (48x48) */
  iconSmall: { width: 48, height: 48 } as CfImageOptions,
  /** Server icon - medium square (64x64) */
  iconMedium: { width: 64, height: 64 } as CfImageOptions,
  /** Server icon - large square (96x96) */
  iconLarge: { width: 96, height: 96 } as CfImageOptions,
  /** Server banner - card size */
  bannerCard: { width: 320, height: 80 } as CfImageOptions,
  /** Server banner - detail page */
  bannerLarge: { width: 1200, height: 300 } as CfImageOptions,
  /** User avatar - small */
  avatarSmall: { width: 32, height: 32 } as CfImageOptions,
  /** User avatar - medium */
  avatarMedium: { width: 48, height: 48 } as CfImageOptions,
  /** User avatar - large */
  avatarLarge: { width: 96, height: 96 } as CfImageOptions,
} as const;
