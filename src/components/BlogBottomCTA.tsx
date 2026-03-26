import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * Bottom CTA banner for blog posts — drives traffic to /score and /pricing.
 * Rendered once per blog post, between article content and existing product CTA.
 * Server component — uses next-intl server translations.
 */
export default function BlogBottomCTA({ locale }: { locale: string }) {
  const t = useTranslations("blogBottomCta");

  const scoreHref = `/${locale}/score`;
  const pricingHref = `/${locale}/pricing`;

  return (
    <div
      className="mt-12 rounded-2xl border border-gold/20 bg-gradient-to-br from-navy-light/80 to-navy-dark/60 p-8 relative overflow-hidden"
      role="complementary"
      aria-label="Next steps"
    >
      {/* Decorative accent */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 bg-gold/5 rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          {t("heading")}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-xl">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Primary CTA — AI Native Score (free, low friction) */}
          <div className="flex flex-col items-start gap-1.5">
            <Link
              href={scoreHref}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-navy-dark transition-colors hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold/60"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              {t("scoreCta")}
            </Link>
            <span className="text-xs text-text-muted ml-1">
              {t("scoreSubtext")}
            </span>
          </div>

          {/* Secondary CTA — Pricing */}
          <div className="flex flex-col items-start gap-1.5">
            <Link
              href={pricingHref}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-text-secondary transition-all hover:border-gold/30 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/60"
            >
              {t("pricingCta")}
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <span className="text-xs text-text-muted ml-1">
              {t("pricingSubtext")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
