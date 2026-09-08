import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes stays OFF for now — a few links still point at etapa-2 paths.
  typedRoutes: false,

  // All imagery is local (`public/media/ph/*`). Add a hostname here when real
  // campaign / Medusa assets move to a CDN.
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
