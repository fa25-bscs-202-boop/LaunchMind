import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  async redirects() {
    return [
      {
        source: "/auth/:path*",
        destination: `${apiBaseUrl}/auth/:path*`,
        permanent: false,
      },
      {
        source: "/api/auth/:path*",
        destination: `${apiBaseUrl}/auth/:path*`,
        permanent: false,
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
