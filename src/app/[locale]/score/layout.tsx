import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = `${SITE_URL}/${locale}/score`;

  return {
    title: "AI Native Score — How AI-Ready Is Your Business?",
    description:
      "Take the free 2-minute AI readiness assessment. 10 questions to measure how AI-native your business really is. Get your score and personalized recommendations.",
    keywords: [
      "AI readiness assessment",
      "AI native score",
      "AI readiness quiz",
      "business AI assessment",
      "AI maturity model",
      "AI adoption score",
      "how AI ready is my business",
      "AI readiness test",
      "AI transformation assessment",
      "digital transformation quiz",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/score`,
        ja: `${SITE_URL}/ja/score`,
        "x-default": `${SITE_URL}/en/score`,
      },
    },
    openGraph: {
      title: "AI Native Score — How AI-Ready Is Your Business?",
      description:
        "Free 2-minute assessment: 10 questions to measure your business AI readiness. Get your score, tier, and personalized playbook recommendations.",
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "AI Native Score — AI Readiness Assessment",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Native Score — How AI-Ready Is Your Business?",
      description:
        "Free 2-minute assessment: 10 questions to discover your AI readiness level. Take the quiz now.",
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
