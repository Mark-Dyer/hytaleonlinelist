'use client';

import Script from 'next/script';

/**
 * Umami Analytics component for privacy-focused website analytics.
 *
 * Required environment variables:
 * - NEXT_PUBLIC_UMAMI_SCRIPT_URL: URL to your Umami script (e.g., https://cloud.umami.is/script.js)
 * - NEXT_PUBLIC_UMAMI_WEBSITE_ID: Your website ID from the Umami dashboard
 *
 * Optional:
 * - NEXT_PUBLIC_UMAMI_HOST_URL: Custom host URL for self-hosted instances
 *
 * The component only renders when both required env vars are set,
 * making it safe to deploy without analytics configured.
 */
export function UmamiAnalytics() {
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const hostUrl = process.env.NEXT_PUBLIC_UMAMI_HOST_URL;

  // Don't render if Umami is not configured
  if (!scriptUrl || !websiteId) {
    return null;
  }

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      {...(hostUrl && { 'data-host-url': hostUrl })}
      strategy="afterInteractive"
    />
  );
}

/**
 * Track a custom event in Umami.
 *
 * @param eventName - Name of the event to track
 * @param eventData - Optional data to include with the event
 *
 * @example
 * // Track a button click
 * trackEvent('signup_button_click');
 *
 * @example
 * // Track with data
 * trackEvent('server_vote', { serverId: '123', serverName: 'My Server' });
 */
export function trackEvent(eventName: string, eventData?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
    };
  }
}
