import type { Metadata } from "next";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

type Tier = "beginner" | "adopter" | "native";

const tierLabels: Record<Tier, string> = {
  beginner: "Beginner",
  adopter: "Adopter",
  native: "Native",
};

function isValidTier(t: string | undefined): t is Tier {
  return t === "beginner" || t === "adopter" || t === "native";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ s?: string; t?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const sp = await searchParams;
  const canonicalUrl = `${SITE_URL}/${locale}/score`;

  // Check for shared score params
  const rawScore = sp?.s ? parseInt(sp.s, 10) : null;
  const score = rawScore !== null && !isNaN(rawScore) ? Math.max(0, Math.min(30, rawScore)) : null;
  const tier = isValidTier(sp?.t) ? sp.t : null;

  const hasScore = score !== null;

  // Dynamic title/description for shared results
  const title = hasScore
    ? `I scored ${score}/30 on the AI Native Score${tier ? ` — ${tierLabels[tier]}` : ""}`
    : "AI Native Score — How AI-Ready Is Your Business?";

  const description = hasScore
    ? `My AI readiness score is ${score}/30${tier ? ` (${tierLabels[tier]})` : ""}. How AI-ready is YOUR business? Take the free 2-minute assessment.`
    : "Take the free 2-minute AI readiness assessment. 10 questions to measure how AI-native your business really is. Get your score and personalized recommendations.";

  // Dynamic OG image: use API route with score param when available
  const ogImageUrl = hasScore
    ? `${SITE_URL}/api/og/score?s=${score}`
    : `${SITE_URL}/${locale}/score/opengraph-image`;

  return {
    title,
    description,
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
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook",
      locale: locale === "ja" ? "ja_JP" : "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: hasScore
            ? `AI Native Score: ${score}/30`
            : "AI Native Score — AI Readiness Assessment",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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
