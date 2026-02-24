"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          <span className="gradient-gold">AI Architect</span>
          <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <Link href="/products" className="hover:text-text-primary transition-colors">
            All Books
          </Link>
          <Link href="/bundle" className="hover:text-text-primary transition-colors">
            Bundle
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/bundle"
            className="hidden md:inline-flex bg-gold text-navy-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors"
          >
            Get Bundle — $47
          </Link>

          {/* Mobile: CTA button */}
          <Link
            href="/bundle"
            className="md:hidden bg-gold text-navy-dark px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gold-light transition-colors"
          >
            $47 Bundle
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
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
        <div className="md:hidden bg-navy-dark border-t border-white/5 px-4 py-4 flex flex-col gap-4 text-sm text-text-secondary">
          <Link href="/products" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            All Books
          </Link>
          <Link href="/bundle" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            Bundle — All 6 for $47
          </Link>
          <Link href="/about" className="hover:text-text-primary transition-colors" onClick={() => setMobileOpen(false)}>
            About
          </Link>
        </div>
      )}
    </header>
  );
}
