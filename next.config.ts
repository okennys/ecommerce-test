import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes stays OFF until the real route tree (PLP/PDP/checkout) exists —
  // the shell links to many not-yet-built paths. Re-enable in a later milestone.
  typedRoutes: false,

  // Milestone 1 imagery is 100% local (`public/media/ph/*`). When real assets
  // arrive from a CDN / Medusa file host, add its hostname here.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
