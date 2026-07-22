import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/**',
        search: '**',
      },
      {
        pathname: '/**',
        search: '',
      },
      {
        pathname: '/**',
      },
    ],
    // Safe SVG handling
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Auto-convert to modern formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Device breakpoints matching Tailwind breakpoints
    deviceSizes: [480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // No remotePatterns needed — all images are served through /api/assets/ proxy
    // which is on the same origin as the Next.js app, so optimization works natively.
  },
};

export default nextConfig;
