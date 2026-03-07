import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="bg-navy-dark border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-bold text-lg mb-3">
              <span className="gradient-gold">AI Architect</span>
              <span className="text-text-secondary text-sm font-normal ml-1.5">Series</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3 text-sm">{t("books")}</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/products/ai-marketing-architect" className="hover:text-gold transition-colors">AI Marketing Architect</Link></li>
              <li><Link href="/products/ai-brand-architect" className="hover:text-gold transition-colors">AI Brand Architect</Link></li>
              <li><Link href="/products/ai-traffic-architect" className="hover:text-gold transition-colors">AI Traffic Architect</Link></li>
              <li><Link href="/products/ai-story-architect" className="hover:text-gold transition-colors">AI Story Architect</Link></li>
              <li><Link href="/products/ai-startup-architect" className="hover:text-gold transition-colors">AI Startup Architect</Link></li>
              <li><Link href="/products/ai-content-architect" className="hover:text-gold transition-colors">AI Content Architect</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3 text-sm">{t("info")}</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link href="/bundle" className="hover:text-gold transition-colors">{t("completeBundle")}</Link></li>
              <li><Link href="/products" className="hover:text-gold transition-colors">{t("individualBooks")}</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors">{tn("blog")}</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">{tn("about")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-3 text-sm">Related Services</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="https://richbukae.com?utm_source=ai-architect&utm_medium=footer&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  richbukae.com
                </a>
              </li>
              <li>
                <a href="https://aihubkorea.kr?utm_source=ai-architect&utm_medium=footer&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  AIHub Korea
                </a>
              </li>
              <li>
                <a href="https://apppro.kr?utm_source=ai-architect&utm_medium=footer&utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                  AppPro
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 pb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
          <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          <span className="text-white/10">|</span>
          <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
          <span className="text-white/10">|</span>
          <Link href="/refund" className="hover:text-gold transition-colors">Refund Policy</Link>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} AI Architect Series. {t("rights")}.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {t("instantPdf")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
