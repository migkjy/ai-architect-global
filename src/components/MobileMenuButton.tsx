"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string; highlight?: boolean };

export default function MobileMenuButton({ navItems, bundleLabel, bundleHref }: { navItems: NavItem[]; bundleLabel: string; bundleHref: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav"
        className="md:hidden p-1.5 text-text-secondary hover:text-text-primary transition-colors"
      >
        {mobileOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="absolute top-full left-0 right-0 md:hidden bg-navy-dark border-t border-white/5 px-4 py-4 flex flex-col gap-4 text-sm text-text-secondary"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.highlight
                  ? "text-gold font-semibold hover:text-gold-light transition-colors"
                  : "hover:text-text-primary transition-colors"
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={bundleHref}
            className="hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            {bundleLabel}
          </Link>
        </div>
      )}
    </>
  );
}
