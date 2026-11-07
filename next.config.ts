import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote photos are optional. Local photos live in /public/photos.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
