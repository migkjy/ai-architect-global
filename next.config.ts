import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: [
      "next-intl",
      "react-markdown",
      "remark-gfm",
      "@vercel/analytics",
      "@vercel/speed-insights",
    ],
  },
  turbopack: {
    root: __dirname,
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

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "newbizsoft",
  project: "ai-architect-global",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
