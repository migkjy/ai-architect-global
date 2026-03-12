import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const FreeGuideForm = dynamic(() => import("@/components/FreeGuideForm"));

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl =
    locale === "en"
      ? `${SITE_URL}/free-guide`
      : `${SITE_URL}/${locale}/free-guide`;

  return {
    title: "Free AI Business Automation Starter Guide",
    description:
      "Download your free AI starter guide. Learn how to automate marketing funnels, sales copy, and product launches using AI. No purchase required.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Free AI Business Automation Starter Guide",
      description:
        "Get a free guide that shows you how to use AI to automate 6 proven business frameworks. Instant PDF download.",
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Free AI Business Automation Starter Guide",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Free AI Business Automation Starter Guide",
      description:
        "Get a free guide that shows you how to use AI to automate 6 proven business frameworks. Instant PDF download.",
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const benefits = [
  {
    title: "AI Marketing Funnel Blueprint",
    description:
      "A step-by-step framework for building automated marketing funnels with AI.",
  },
  {
    title: "3 Ready-to-Use AI Prompts",
    description:
      "Copy-paste prompts for Claude, ChatGPT, or Gemini that execute real business tasks.",
  },
  {
    title: "Framework Comparison Chart",
    description:
      "See which of the 6 world-class frameworks fits your business stage.",
  },
  {
    title: "5-Day Quickstart Checklist",
    description:
      "A clear action plan to implement AI automation in your business this week.",
  },
];

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

export default async function FreeGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("freeGuide");

  const canonicalUrl =
    locale === "en"
      ? `${SITE_URL}/free-guide`
      : `${SITE_URL}/${locale}/free-guide`;

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Free AI Business Automation Starter Guide",
    description:
      "Download your free AI starter guide. Learn how to automate marketing funnels, sales copy, and product launches using AI. No purchase required.",
    url: canonicalUrl,
    inLanguage: locale === "ko" ? "ko-KR" : locale === "ja" ? "ja-JP" : "en-US",
    isAccessibleForFree: true,
    educationalLevel: "Beginner",
    provider: {
      "@type": "Organization",
      name: "AI Native Playbook",
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT30M",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Free Guide",
        item: `${SITE_URL}/free-guide`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(courseJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />
    <div className="min-h-screen pt-24 pb-20">
      {/* Hook */}
      <section className="text-center max-w-3xl mx-auto px-4 mb-16">
        <span className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase mb-6">
          Free Download
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Get Your Free{" "}
          <span className="gradient-gold">
            AI Business Automation Starter Guide
          </span>
        </h1>

        {/* Story */}
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-4">
          Most business owners spend weeks reading marketing books but never
          execute the frameworks. AI changes that. With the right prompts, you
          can turn proven strategies into automated systems in hours, not months.
        </p>
        <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
          This free starter guide shows you exactly how to begin — with
          actionable prompts, a clear framework comparison, and a 5-day
          quickstart plan.
        </p>
      </section>

      {/* Offer — Email Form */}
      <section className="max-w-xl mx-auto px-4 mb-20">
        {/* Social proof above the form */}
        <p className="text-center text-sm text-text-secondary mb-4 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 1a9 9 0 100 18A9 9 0 0010 1zm3.707 7.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          {t("socialProof")}
        </p>

        <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 md:p-10 relative">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="bg-gold text-navy-dark text-xs font-bold px-4 py-1.5 rounded-full">
              100% FREE
            </span>
          </div>

          <h2 className="text-xl font-bold text-center mb-2 mt-2">
            {t("formHeading")}
          </h2>
          <p className="text-text-secondary text-sm text-center mb-6">
            Instant access. No credit card required.
          </p>

          <FreeGuideForm ctaLabel={t("ctaButton")} />

          {/* Microcopy trust signals */}
          <p className="text-center text-xs text-text-muted mt-4 flex items-center justify-center gap-3 flex-wrap">
            <span>&#10003; {t("microCopy1")}</span>
            <span>&#10003; {t("microCopy2")}</span>
            <span>&#10003; {t("microCopy3")}</span>
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-6 bg-gold rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold">
            What You&apos;ll Get
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all"
            >
              <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 text-gold"
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
              <h3 className="font-bold text-text-primary mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface/60 border border-white/5 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">
              <svg
                className="w-8 h-8 text-gold mx-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            <p className="font-semibold text-text-primary text-sm">
              Instant PDF Download
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Access your guide immediately after signup.
            </p>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">
              <svg
                className="w-8 h-8 text-gold mx-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <p className="font-semibold text-text-primary text-sm">
              No Spam, Ever
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Your email is safe. Unsubscribe anytime.
            </p>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">
              <svg
                className="w-8 h-8 text-gold mx-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                />
              </svg>
            </div>
            <p className="font-semibold text-text-primary text-sm">
              Works with Any AI
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Claude, ChatGPT, Gemini — use your preferred tool.
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
