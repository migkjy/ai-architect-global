import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "next-intl",
      "react-markdown",
      "remark-gfm",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      { source: "/pricing", destination: "/en/products", permanent: true },
      { source: "/:locale/pricing", destination: "/:locale/products", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/terms", destination: "/en/terms" },
      { source: "/privacy", destination: "/en/privacy" },
      { source: "/refund", destination: "/en/refund" },
    ];
  },
};

export default withNextIntl(nextConfig);
