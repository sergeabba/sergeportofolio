import type { NextConfig } from "next";

const SUPABASE_HOST = "hepnjfiqtikumzxslfaf.supabase.co";

const CSP = [
  "default-src 'self'",
  // Scripts: Next.js inline scripts + no third-party
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // Styles: Tailwind inline + Next.js inline
  "style-src 'self' 'unsafe-inline'",
  // Images: self, Supabase CDN, GitHub chart, data URIs
  `img-src 'self' data: https://${SUPABASE_HOST} https://ghchart.rshah.org https://avatars.githubusercontent.com`,
  // Fonts: self only (Plus Jakarta Sans & Inter served locally)
  "font-src 'self'",
  // API calls: self + Supabase REST/realtime + Resend (server-side only, but kept for safety)
  `connect-src 'self' https://${SUPABASE_HOST} https://api.resend.com https://api.github.com`,
  // No frames, objects, base-uri, form-action locked to self
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
      },
    ],
  },
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
