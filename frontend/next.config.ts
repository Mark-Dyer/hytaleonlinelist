import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker deployments - creates a standalone build
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hytaleonlinelist.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;
