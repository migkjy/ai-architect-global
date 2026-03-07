import Link from "next/link";
import { getTranslations } from "next-intl/server";
import MobileMenuButton from "@/components/MobileMenuButton";

export default async function Header() {
  const t = await getTranslations("nav");

  const navItems = [
    { href: "/products", label: t("products") },
    { href: "/bundle", label: t("bundle") },
    { href: "/blog", label: t("blog") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between relative">
        <Link href="/" className="font-bold text-lg">
          <span className="gradient-gold">AI Architect</span>
          <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-text-primary transition-colors">
              {item.label}
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
