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

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "/bundle", label: "Bundle" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

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

        {/* Multilingual messages */}
        <div className="text-text-secondary mb-8 max-w-md mx-auto space-y-1">
          <p>The page you requested does not exist or has been moved.</p>
          <p className="text-sm opacity-75">
            <span className="text-text-secondary/60">KR</span>{" "}
            요청하신 페이지를 찾을 수 없습니다.
          </p>
          <p className="text-sm opacity-75">
            <span className="text-text-secondary/60">JP</span>{" "}
            お探しのページは見つかりませんでした。
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
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
            한국어 홈
          </Link>
          <Link
            href="/ja"
            className="border border-gold/30 text-text-secondary px-6 py-3 rounded-xl hover:border-gold/60 hover:text-text-primary transition-all"
          >
            日本語 ホーム
          </Link>
        </div>

        {/* Internal navigation links */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-gold border border-gold/10 px-4 py-2 rounded-lg hover:border-gold/30 transition-all"
            >
              {link.label}
            </Link>
          ))}
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
