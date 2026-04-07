import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hepnjfiqtikumzxslfaf.supabase.co",
      },
    ],
  },
  compress: true,
};

export default nextConfig;