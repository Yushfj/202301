import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Only use this temporarily during development
  },
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Only use this temporarily during development
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // experimental: { // ❌ Remove in Next.js 13.4+
  //   appDir: true, // This is now stable and enabled by default
  // },
};

export default nextConfig;