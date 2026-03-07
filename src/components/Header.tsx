"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          <span className="gradient-gold">AI Architect</span>
          <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary" aria-label="Main navigation">
          <Link href="/products" className="hover:text-text-primary transition-colors">
            {t("products")}
          </Link>
          <Link href="/bundle" className="hover:text-text-primary transition-colors">
            {t("bundle")}
          </Link>
          <Link href="/blog" className="hover:text-text-primary transition-colors">
            {t("blog")}
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            {t("about")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/bundle"
            className="hidden md:inline-flex bg-gold text-navy-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors"
          >
            {t("getBundle")}
          </Link>

          {/* Mobile: CTA button */}
          <Link
            href="/bundle"
            className="md:hidden bg-gold text-navy-dark px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gold-light transition-colors"
          >
            {t("bundleShort")}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="md:hidden p-1.5 text-text-secondary hover:text-text-primary transition-colors"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div id="mobile-nav" className="md:hidden bg-navy-dark border-t border-white/5 px-4 py-4 flex flex-col gap-4 text-sm text-text-secondary" role="navigation" aria-label="Mobile navigation">
          <Link href="/products" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            {t("products")}
          </Link>
          <Link href="/bundle" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            {t("getBundle")}
          </Link>
          <Link href="/blog" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            {t("blog")}
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            {t("about")}
          </Link>
        </div>
      )}
    </header>
  );
}
