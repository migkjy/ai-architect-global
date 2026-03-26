import type { Metadata } from "next";
import Link from "next/link";
import { bundle, getBundleUrl } from "@/lib/products";
import dynamic from "next/dynamic";
const BuyButton = dynamic(() => import("@/components/BuyButton"));
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

const aboutMeta: Record<string, { title: string; description: string }> = {
  en: {
    title: "About — AI Native Playbook Series",
    description: "Bridge the gap between reading and executing business frameworks. 6 AI-powered PDF guides turn Russell Brunson, Jeff Walker, Jim Edwards systems into action.",
  },
  ko: {
    title: "AI Native Playbook Series 소개 — AI 기반 비즈니스 프레임워크 가이드를 만든 이유",
    description: "비즈니스 프레임워크를 읽는 것과 실행하는 것 사이의 갭을 해소합니다. AI Native Playbook이 DotCom Secrets, PLF, Copywriting Secrets를 AI 시스템으로 전환합니다.",
  },
  ja: {
    title: "AI Native Playbook Seriesについて",
    description: "ビジネスフレームワークを読むことと実行することのギャップを埋めます。AI Native PlaybookがDotCom Secrets、PLFをAIシステムに変換。",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();
  const meta = aboutMeta[locale] ?? aboutMeta.en;
  const canonicalUrl = `${siteUrl}/${locale}/about`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      "AI Native Playbook Series",
      "AI business framework",
      "Russell Brunson AI",
      "Jeff Walker AI",
      "Jim Edwards AI",
      "Nicolas Cole AI",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${siteUrl}/en/about`,
        ja: `${siteUrl}/ja/about`,
        "x-default": `${siteUrl}/en/about`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      url: canonicalUrl,
      images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${siteUrl}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };
}

const bundleUrl = getBundleUrl();

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();
  const aboutPageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About AI Native Playbook Series",
      url: `${siteUrl}/about`,
      description: "Bridge the gap between reading and executing proven business frameworks with AI-powered tools.",
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
      ],
    },
  ];

  const approaches = [
    { title: t("approach1Title"), desc: t("approach1Desc") },
    { title: t("approach2Title"), desc: t("approach2Desc") },
    { title: t("approach3Title"), desc: t("approach3Desc") },
    { title: t("approach4Title"), desc: t("approach4Desc") },
  ];

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  const results = [
    { metric: t("result1Metric"), who: t("result1Who") },
    { metric: t("result2Metric"), who: t("result2Who") },
    { metric: t("result3Metric"), who: t("result3Who") },
    { metric: t("result4Metric"), who: t("result4Who") },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(aboutPageJsonLd)) }}
      />
      <div className="max-w-3xl mx-auto px-4">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-gold">{t("title")}</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            {t("intro1")}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed mb-4">
            {t("intro2")}
          </p>
          <p className="text-text-secondary text-lg leading-relaxed mb-8">
            {t("intro3")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <BuyButton href={bundleUrl} className="text-base py-3">
              {t("heroCta")}
            </BuyButton>
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-base"
            >
              {t("heroCtaSecondary")}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <h2 className="text-xl font-bold mb-6 text-text-primary">{t("statsTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface/60 border border-white/5 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold gradient-gold mb-1">{stat.value}</div>
                <div className="text-xs text-text-secondary leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
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

        {/* Why AI Native Playbook Series */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t("whyTitle")}</h2>
          <div className="space-y-4">
            <p className="text-text-secondary leading-relaxed">{t("whyP1")}</p>
            <p className="text-text-secondary leading-relaxed">{t("whyP2")}</p>
            <p className="text-text-secondary leading-relaxed font-medium text-text-primary">{t("whyP3")}</p>
          </div>
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

        {/* Real Results */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t("resultsTitle")}</h2>
          <div className="grid gap-3">
            {results.map((r) => (
              <div key={r.metric} className="bg-surface/60 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-lg font-bold gradient-gold">{r.metric}</span>
                <span className="text-sm text-text-secondary">{r.who}</span>
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

        {/* Who We Are */}
        <div className="mb-16 bg-surface/40 border border-white/5 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">{t("whoTitle")}</h2>
          <p className="text-text-secondary leading-relaxed mb-3">{t("whoP1")}</p>
          <p className="text-text-secondary leading-relaxed">{t("whoP2")}</p>
        </div>

        {/* Blog cross-link */}
        <div className="mb-16 p-5 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-sm text-text-secondary mb-1">{t("blogCrossLinkLabel")}</p>
          <Link
            href="/blog"
            className="text-gold hover:text-gold-light font-medium text-sm transition-colors"
          >
            {t("blogCrossLinkText")} &rarr;
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">{t("trustTitle")}</h2>
          <div className="space-y-3">
            {[
              t("trustItem1"),
              t("trustItem2"),
              t("trustItem3"),
              t("trustItem4"),
              t("trustItem5"),
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-surface/40 border border-white/5 rounded-xl p-4">
                <svg className="w-5 h-5 text-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Your AI Journey — CTA Cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">{t("journeyTitle")}</h2>
          <p className="text-text-secondary text-center mb-8">{t("journeySubtitle")}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Free Guide Card */}
            <div className="bg-surface/60 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-bold text-text-primary mb-2">{t("journeyFreeGuideTitle")}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{t("journeyFreeGuideDesc")}</p>
              <Link
                href="/free-guide"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-sm border border-gold/30 text-gold hover:bg-gold/10 transition-all"
              >
                {t("journeyFreeGuideCta")} &rarr;
              </Link>
            </div>
            {/* Pricing Card */}
            <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-bold text-text-primary mb-2">{t("journeyPricingTitle")}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-1">{t("journeyPricingDesc")}</p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold text-sm bg-gold text-black hover:bg-gold-light transition-all"
              >
                {t("journeyPricingCta")} &rarr;
              </Link>
            </div>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
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
          <p className="text-xs text-text-muted">{t("ctaGuarantee")}</p>
        </div>
      </div>
    </div>
  );
}
