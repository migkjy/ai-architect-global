import type { Metadata } from "next";
import Link from "next/link";
import { bundle, getBundleUrl } from "@/lib/products";
import BuyButton from "@/components/BuyButton";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "About AI Architect Series — Why We Built AI-Powered Business Framework Guides",
  description:
    "Bridge the gap between reading and executing proven business frameworks. AI Architect turns DotCom Secrets, PLF, and Copywriting Secrets into AI-powered systems you can run today.",
  keywords: [
    "AI Architect Series",
    "AI business framework",
    "Russell Brunson AI",
    "Jeff Walker AI",
    "Jim Edwards AI",
    "Nicolas Cole AI",
    "about AI Architect",
    "business automation tools",
  ],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com"}/about`,
  },
};

const bundleUrl = getBundleUrl();

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
    ],
  };

  const approaches = [
    { title: t("approach1Title"), desc: t("approach1Desc") },
    { title: t("approach2Title"), desc: t("approach2Desc") },
    { title: t("approach3Title"), desc: t("approach3Desc") },
    { title: t("approach4Title"), desc: t("approach4Desc") },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-gold">{t("title")}</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            {t("intro1")}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            {t("intro2")}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            {t("intro3")}
          </p>
        </div>

        {/* The Insight */}
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4 gradient-gold">{t("insightTitle")}</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {t("insightP1")}
          </p>
          <p className="text-text-secondary leading-relaxed">
            {t("insightP2")}
          </p>
        </div>

        {/* How We Approach It */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t("approachTitle")}</h2>
          <div className="space-y-6">
            {approaches.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-1.5 bg-gold/30 rounded-full shrink-0" />
                <div>
                  <h3 className="font-bold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Frameworks */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t("frameworksTitle")}</h2>
          <p className="text-text-secondary mb-6">
            {t("frameworksIntro")}
          </p>
          <div className="space-y-3">
            {[
              { author: "Russell Brunson", books: "DotCom Secrets, Expert Secrets, Traffic Secrets", vols: "Vol. 1, 2, 3" },
              { author: "Jim Edwards", books: "Copywriting Secrets", vols: "Vol. 4" },
              { author: "Jeff Walker", books: "Launch (Product Launch Formula)", vols: "Vol. 5" },
              { author: "Nicolas Cole", books: "The Art and Business of Online Writing", vols: "Vol. 6" },
            ].map((item) => (
              <div key={item.author} className="bg-surface/60 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-semibold text-text-primary">{item.author}</div>
                  <div className="text-sm text-text-secondary">{item.books}</div>
                </div>
                <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-2.5 py-1 rounded-full shrink-0">
                  {item.vols}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 text-center card-glow">
          <h2 className="text-2xl font-bold mb-3">
            {t("ctaTitle")}
          </h2>
          <p className="text-text-secondary mb-6">
            {t("ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BuyButton href={bundleUrl} className="text-lg py-4">
              {t("ctaBundle")} &mdash; ${bundle.price}
            </BuyButton>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all"
            >
              {t("ctaViewBooks")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
