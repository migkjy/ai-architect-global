import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getBundleUrl } from "@/lib/products";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  const canonicalUrl = locale === "en" ? `${SITE_URL}/faq` : `${SITE_URL}/${locale}/faq`;

  return {
    title: t("title"),
    description: t("subtitle"),
    keywords: [
      "AI Native Playbook FAQ",
      "AI business automation FAQ",
      "AI marketing playbook questions",
      "AI native business guide help",
      "business automation with AI questions",
      "AI agent skills FAQ",
      "AI PDF guide help",
      "AI Native Playbook refund policy",
      "AI Native Playbook system requirements",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/faq`,
        ko: `${SITE_URL}/ko/faq`,
        ja: `${SITE_URL}/ja/faq`,
        "x-default": `${SITE_URL}/faq`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: canonicalUrl,
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      siteName: "AI Native Playbook Series",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "AI Native Playbook Series FAQ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("subtitle"),
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function FaqAccordionItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const id = `faq-${index}`;
  return (
    <details className="group border border-white/10 rounded-xl overflow-hidden transition-colors hover:border-gold/20">
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none text-left font-semibold text-text-primary select-none">
        <span>{question}</span>
        <svg
          className="w-5 h-5 shrink-0 text-gold transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">
        {answer}
      </div>
    </details>
  );
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faqPage");
  const bundleUrl = getBundleUrl();

  const categories = [
    {
      title: { en: "Product & Content", ko: "상품 및 콘텐츠", ja: "商品・コンテンツ" },
      items: [1, 2, 3, 4, 5],
    },
    {
      title: { en: "Purchase & Payment", ko: "구매 및 결제", ja: "購入・決済" },
      items: [6, 7, 8, 9, 10, 11],
    },
    {
      title: { en: "Refund Policy", ko: "환불 정책", ja: "返金ポリシー" },
      items: [12, 13, 14],
    },
    {
      title: { en: "Technical & Support", ko: "기술 및 지원", ja: "技術・サポート" },
      items: [15, 16, 17, 18, 19, 20],
    },
  ];

  const allFaqItems = Array.from({ length: 20 }, (_, i) => ({
    question: t(`q${i + 1}`),
    answer: t(`a${i + 1}`),
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: t("title"), item: `${SITE_URL}/faq` },
    ],
  };

  const canonicalFaqUrl = locale === "en" ? `${SITE_URL}/faq` : `${SITE_URL}/${locale}/faq`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: t("title"),
    description: t("subtitle"),
    url: canonicalFaqUrl,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: allFaqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".faq-answer"],
    },
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(faqJsonLd)) }}
      />

      <div className="max-w-3xl mx-auto px-4">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-gold">{t("title")}</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.title.en}>
              <h2 className="text-xl font-bold mb-4 text-text-primary">
                {(category.title as Record<string, string>)[locale] ?? category.title.en}
              </h2>
              <div className="space-y-3">
                {category.items.map((idx) => (
                  <FaqAccordionItem
                    key={idx}
                    question={allFaqItems[idx - 1].question}
                    answer={allFaqItems[idx - 1].answer}
                    index={idx}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-surface/60 border border-gold/20 rounded-2xl p-8 text-center card-glow">
          <h2 className="text-2xl font-bold mb-3">{t("ctaTitle")}</h2>
          <p className="text-text-secondary mb-6">{t("ctaDesc")}</p>
          <Link
            href={bundleUrl}
            className="inline-flex items-center justify-center bg-gold text-navy-dark px-8 py-4 rounded-xl font-bold text-lg hover:bg-gold-light transition-colors"
          >
            {t("ctaButton")}
          </Link>
        </div>

        <nav className="mt-10 pt-8 border-t border-white/10" aria-label="Related pages">
          <p className="text-xs font-semibold text-text-secondary/60 uppercase tracking-wider mb-3">Related Pages</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="text-sm text-gold hover:text-gold-light transition-colors">Products</Link>
            <Link href="/blog" className="text-sm text-gold hover:text-gold-light transition-colors">Blog</Link>
            <Link href="/refund" className="text-sm text-gold hover:text-gold-light transition-colors">Refund Policy</Link>
            <Link href="/terms" className="text-sm text-gold hover:text-gold-light transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm text-gold hover:text-gold-light transition-colors">Privacy Policy</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
