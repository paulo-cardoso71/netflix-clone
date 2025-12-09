import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'uhdtv.io',
      },
      {
        protocol: 'https',
        hostname: 'mango.blender.org',
      },
      {
        protocol: 'https',
        hostname: 'download.blender.org',
      },
    ],
  },
};

export default nextConfig;