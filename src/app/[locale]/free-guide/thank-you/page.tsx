import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GA4LeadComplete } from "@/components/GA4PurchaseComplete";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `${SITE_URL}/${locale}/free-guide/thank-you`;

  return {
    title: "Thank You — Your Free Guide is Ready",
    description:
      "Download your free AI Business Automation Starter Guide now.",
    robots: { index: false, follow: false },
    alternates: { canonical: canonicalUrl },
  };
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("thankYou");

  const blogPosts = [
    { slug: t("blog1Slug"), title: t("blog1Title") },
    { slug: t("blog2Slug"), title: t("blog2Title") },
    { slug: t("blog3Slug"), title: t("blog3Title") },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* GA4: fire lead conversion event when thank-you page is viewed */}
      <GA4LeadComplete source="free-guide-thank-you" />
      <section className="text-center max-w-2xl mx-auto px-4">
        {/* Success icon */}
        <div className="w-20 h-20 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="gradient-gold">Your Guide is Ready!</span>
        </h1>

        {/* Social proof */}
        <p className="text-sm text-text-secondary mb-6 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 1a9 9 0 100 18A9 9 0 0010 1zm3.707 7.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          {t("socialProof")}
        </p>

        {/* Download Button */}
        <a
          href="/guides/ai-starter-guide.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 bg-gold text-navy-dark hover:bg-gold-light mb-10"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          {t("downloadBtn")}
        </a>

        {/* What's next — improved 3-step action flow */}
        <div className="bg-surface/60 border border-white/10 rounded-2xl p-8 text-left">
          <h2 className="text-lg font-bold mb-6 text-center">
            {t("whatsNext")}
          </h2>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold text-xs font-bold">1</span>
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {t("step1Title")}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {t("step1Desc")}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold text-xs font-bold">2</span>
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {t("step2Title")}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {t("step2Desc")}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-gold text-xs font-bold">3</span>
              </span>
              <div>
                <p className="font-semibold text-text-primary text-sm">
                  {t("step3Title")}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                  {t("step3Desc")}
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Blog recommendations — continue learning */}
        <div className="mt-8 bg-surface/40 border border-white/5 rounded-2xl p-6 text-left">
          <h2 className="text-base font-bold mb-1">{t("deeperLearning")}</h2>
          <p className="text-xs text-text-secondary mb-4">{t("deeperLearningDesc")}</p>
          <ul className="space-y-3">
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-3 group hover:text-gold transition-colors"
                >
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" aria-hidden="true" />
                  <span className="text-sm text-text-secondary group-hover:text-gold transition-colors leading-snug">
                    {post.title}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary CTA — products */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 rounded-xl font-semibold text-sm text-gold hover:bg-gold/10 hover:border-gold/50 transition-all"
          >
            {t("exploreProducts")}
          </Link>
        </div>
      </section>
    </div>
  );
}
