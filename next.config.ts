import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingExcludes: {
    "/api/gallery": ["./shared/gallery/**", "./.context/gallery/**"],
    "/api/gallery/asset": ["./shared/gallery/**", "./.context/gallery/**"],
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
