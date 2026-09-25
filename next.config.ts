import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes stays OFF for now — a few links still point at etapa-2 paths.
  typedRoutes: false,

  images: {
    remotePatterns: [
      // product photography, uploaded to the store's bucket by
      // `scripts/seed-medusa.mjs` and served back as absolute URLs by Medusa
      { protocol: "https", hostname: "ju-rudolph-homolog-media.s3.us-east-1.amazonaws.com" },
      // SWAP POINT: add the production bucket when the live backend exists
    ],
  },
};

export default nextConfig;
