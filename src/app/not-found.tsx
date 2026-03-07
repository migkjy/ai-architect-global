import type { Metadata } from "next";
import Link from "next/link";
import NotFoundSubscribeForm from "@/components/NotFoundSubscribeForm";

export const metadata: Metadata = {
  title: "Page Not Found | AI Architect Series",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-navy">
      <div className="max-w-lg w-full">
        {/* 404 */}
        <div className="mb-6">
          <span className="text-8xl font-bold text-gold opacity-20">404</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          The page you requested does not exist or has been moved.
          <br />
          Explore the links below to find what you need.
        </p>

        {/* Navigation links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="bg-gold text-navy-dark px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all"
          >
            Back to Home
          </Link>
          <Link
            href="/ko"
            className="border border-gold/30 text-text-secondary px-6 py-3 rounded-xl hover:border-gold/60 hover:text-text-primary transition-all"
          >
            한국어
          </Link>
          <Link
            href="/ja"
            className="border border-gold/30 text-text-secondary px-6 py-3 rounded-xl hover:border-gold/60 hover:text-text-primary transition-all"
          >
            日本語
          </Link>
        </div>

        {/* Subscribe CTA */}
        <div className="border border-gold/20 rounded-2xl p-6 bg-navy-dark/50">
          <p className="text-sm font-semibold text-gold mb-1">Free AI Business Checklist</p>
          <p className="text-xs text-text-secondary mb-4">
            Get weekly AI business insights delivered to your inbox.
          </p>
          <NotFoundSubscribeForm />
        </div>
      </div>
    </div>
  );
}
