import Link from "next/link";
import { getTranslations } from "next-intl/server";
import MobileMenuButton from "@/components/MobileMenuButton";

export default async function Header() {
  const t = await getTranslations("nav");

  const navItems = [
    { href: "/products", label: t("products") },
    { href: "/pricing", label: t("pricing") },
    { href: "/bundle", label: t("bundle") },
    { href: "/free-guide", label: t("freeGuide"), highlight: true },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
        <Link href="/" className="font-bold text-lg">
          <span className="gradient-gold">AI Native Playbook</span>
          <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.highlight
                  ? "text-gold font-semibold hover:text-gold-light transition-colors"
                  : "hover:text-text-primary transition-colors"
              }
            >
              {item.highlight ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/bundle"
            className="hidden md:inline-flex bg-gold text-navy-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold-light transition-colors"
          >
            {t("getBundle")}
          </Link>

          <Link
            href="/bundle"
            className="md:hidden bg-gold text-navy-dark px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gold-light transition-colors"
          >
            {t("bundleShort")}
          </Link>

          <MobileMenuButton navItems={navItems} bundleLabel={t("getBundle")} />
        </div>
      </div>
    </header>
  );
}
