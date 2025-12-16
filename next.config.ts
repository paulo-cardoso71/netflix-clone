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
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'wallpapers.com', 
      },
    ],
  },
};

export default nextConfig;