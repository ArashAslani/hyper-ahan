import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // FileModule returns absolute URLs (FileStorage:PublicBaseUrl) — the
        // dev backend origin/port can vary (http/https, 5062/7202), so allow
        // any port on localhost. See docs/FileModule_frontend_integration.md §3.
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5062/api/:path*",
      },
      {
        // Blog images are served by the backend under /docs (see
        // docs/BlogModule_frontend_integration.md §8). Proxying it the same
        // way as /api lets next/image resolve them same-origin, no domain allowlist needed.
        source: "/docs/:path*",
        destination: "http://localhost:5062/docs/:path*",
      },
    ];
  },
};

export default nextConfig;
