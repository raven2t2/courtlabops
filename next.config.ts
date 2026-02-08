import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    "/api/leads": ["./data/crm/leads/**"],
    "/api/coaches": ["./data/crm/coaches/**"],
    "/api/sponsors-local": ["./data/crm/sponsors-adelaide-local.json"],
    "/api/affiliates-complete": ["./data/crm/affiliates-complete.json"],
  },
  outputFileTracingExcludes: {
    "/api/gallery": ["./shared/gallery/**", "./.context/gallery/**"],
    "/api/gallery/asset": ["./shared/gallery/**", "./.context/gallery/**"],
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
