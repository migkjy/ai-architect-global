import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { books, getBookBySlug } from "@/lib/products";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    books.map((b) => ({ locale, slug: b.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  const canonicalUrl = locale === "en"
    ? `${SITE_URL}/products/${slug}/quick-start`
    : `${SITE_URL}/${locale}/products/${slug}/quick-start`;

  return {
    title: `Quick Start — ${book.title} | AI Native Playbook`,
    description: `Get started with ${book.title} in 5 steps. Key frameworks, first 3 actions, expected outcomes, and copy-paste prompts for ${book.framework}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Quick Start — ${book.title}`,
      description: `Your ${book.title} quick reference: frameworks, first 3 actions, and ready-to-use AI prompts.`,
      type: "website",
      url: canonicalUrl,
      siteName: "AI Native Playbook Series",
    },
    robots: { index: true, follow: true },
  };
}

function escapeJsonLd(json: string): string {
  return json.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

/**
 * Per-book quick start content.
 * {GARY_TODO}: Replace all content values with Gary's final copy.
 * Structure per book:
 *   - firstThreeActions: string[] (3 bullet items)
 *   - expectedOutcomes: { week1, month1, month3 }
 *   - keyPrompts: Array<{ label, prompt }>  (2–3 copy-paste prompts)
 *   - commonMistakes: string[] (3 bullets)
 */
const quickStartContent: Record<
  string,
  {
    firstThreeActions: string[];
    expectedOutcomes: { week1: string; month1: string; month3: string };
    keyPrompts: Array<{ label: string; prompt: string }>;
    commonMistakes: string[];
  }
> = {
  "ai-marketing-architect": {
    firstThreeActions: [
      // {GARY_TODO}: Rewrite in active imperative voice
      "{GARY_TODO} Action 1: Answer the 4 Secret Formula questions (Who is your dream customer? Where are they? What bait will you use? What result do you want?)",
      "{GARY_TODO} Action 2: Map your Value Ladder — identify gaps between your current offers and the 5-step ascension model.",
      "{GARY_TODO} Action 3: Write your first Hook-Story-Offer using the AI Marketing Architect skill.",
    ],
    expectedOutcomes: {
      week1: "{GARY_TODO}: Complete funnel structure defined and first Hook-Story-Offer written.",
      month1: "{GARY_TODO}: First leads entering the funnel. Soap Opera Sequence live.",
      month3: "{GARY_TODO}: Full Value Ladder operational. Measurable revenue from automated sequences.",
    },
    keyPrompts: [
      {
        label: "Value Ladder Builder",
        // {GARY_TODO}: Insert the actual Value Ladder Builder prompt from the book
        prompt:
          "{GARY_TODO: Paste the Value Ladder Builder prompt here — e.g. 'I run [business type]. My current offerings are [list]. Using the Value Ladder framework from DotCom Secrets, analyze my offers, identify gaps, and propose a complete 5-step ascension model with pricing for each level.'}",
      },
      {
        label: "Soap Opera Sequence",
        prompt:
          "{GARY_TODO: Paste the Soap Opera Sequence prompt here — e.g. 'Create a 5-email Soap Opera Sequence for my lead magnet on [topic]. Target customer: [description]. Desired action: [purchase / call / download]. Use Russell Brunson's soap opera format: Day 1 – Good time / Bad time, Day 2 – Wall, Day 3 – Epiphany, Day 4 – Hidden benefits, Day 5 – Urgency close.'}",
      },
    ],
    commonMistakes: [
      // {GARY_TODO}: Rewrite with specific, actionable warnings
      "{GARY_TODO} Mistake 1: Building the full Value Ladder before testing the core offer. Start with one Seed Launch.",
      "{GARY_TODO} Mistake 2: Skipping the Dream Customer definition — generic AI prompts produce generic output.",
      "{GARY_TODO} Mistake 3: Writing Hook-Story-Offer without loading the AI Marketing Architect skill first.",
    ],
  },
  "ai-brand-architect": {
    firstThreeActions: [
      "{GARY_TODO} Action 1: Define your Charismatic Leader identity — who you are, what you believe, and the movement you lead.",
      "{GARY_TODO} Action 2: Craft your Epiphany Bridge story using the 8-step structure.",
      "{GARY_TODO} Action 3: Write your Big Domino statement — the single belief that collapses all objections.",
    ],
    expectedOutcomes: {
      week1: "{GARY_TODO}: Brand narrative complete. Epiphany Bridge story drafted.",
      month1: "{GARY_TODO}: First webinar or VSL script generated and tested.",
      month3: "{GARY_TODO}: Mass Movement building. Measurable growth in follower/subscriber engagement.",
    },
    keyPrompts: [
      {
        label: "Mass Movement Designer",
        prompt:
          "{GARY_TODO: Paste the Mass Movement Designer prompt here.}",
      },
      {
        label: "Perfect Webinar Script Generator",
        prompt:
          "{GARY_TODO: Paste the Perfect Webinar Script Generator prompt here.}",
      },
    ],
    commonMistakes: [
      "{GARY_TODO} Mistake 1: Creating a brand before defining the specific change you want to create in your audience's lives.",
      "{GARY_TODO} Mistake 2: Writing a generic origin story instead of a specific Epiphany Bridge moment.",
      "{GARY_TODO} Mistake 3: Mixing multiple Big Domino statements — pick one belief and collapse it completely.",
    ],
  },
  "ai-traffic-architect": {
    firstThreeActions: [
      "{GARY_TODO} Action 1: Build a detailed Dream Customer Avatar with the AI Traffic Architect skill.",
      "{GARY_TODO} Action 2: Create your Dream 100 list — the 100 places your dream customers already congregate.",
      "{GARY_TODO} Action 3: Choose your primary platform and generate the first week of content.",
    ],
    expectedOutcomes: {
      week1: "{GARY_TODO}: Dream Customer Avatar complete. Dream 100 list built.",
      month1: "{GARY_TODO}: First traffic results visible. Platform content strategy executing.",
      month3: "{GARY_TODO}: Consistent organic traffic. Dream 100 relationships initiated.",
    },
    keyPrompts: [
      {
        label: "Dream Customer Avatar Builder",
        prompt:
          "{GARY_TODO: Paste the Dream Customer Avatar Builder prompt here.}",
      },
      {
        label: "Platform Strategy Generator",
        prompt:
          "{GARY_TODO: Paste the Platform Strategy Generator prompt here.}",
      },
    ],
    commonMistakes: [
      "{GARY_TODO} Mistake 1: Trying to be on all platforms simultaneously — pick one and dominate it first.",
      "{GARY_TODO} Mistake 2: Building Dream 100 list without engaging — it's a relationship strategy, not a list.",
      "{GARY_TODO} Mistake 3: Creating content without a clear Dream Customer Avatar — generic avatar = generic traffic.",
    ],
  },
  "ai-story-architect": {
    firstThreeActions: [
      "{GARY_TODO} Action 1: Run the 5-step Personal Story Mining process to extract your core business narrative.",
      "{GARY_TODO} Action 2: Generate your Headline Arsenal — 10+ headlines across Curiosity, Benefit, and Problem-Solution categories.",
      "{GARY_TODO} Action 3: Rewrite your main sales page headline and opening with FRED targeting.",
    ],
    expectedOutcomes: {
      week1: "{GARY_TODO}: New sales copy drafted for primary product or service.",
      month1: "{GARY_TODO}: Measurable conversion lift on rewritten pages. A/B test data started.",
      month3: "{GARY_TODO}: Full copy library built. Email open rates and click rates improved.",
    },
    keyPrompts: [
      {
        label: "Personal Story Extractor",
        prompt:
          "{GARY_TODO: Paste the Personal Story Extractor prompt here.}",
      },
      {
        label: "Headline Generator",
        prompt:
          "{GARY_TODO: Paste the Headline Generator prompt here.}",
      },
    ],
    commonMistakes: [
      "{GARY_TODO} Mistake 1: Skipping story mining and going straight to headlines — story gives copy its power.",
      "{GARY_TODO} Mistake 2: Applying FRED targeting without identifying which motivator is primary for your audience.",
      "{GARY_TODO} Mistake 3: Writing platform-agnostic copy — adapt hook-story-value-CTA for each channel.",
    ],
  },
  "ai-startup-architect": {
    firstThreeActions: [
      "{GARY_TODO} Action 1: Choose your launch type — Seed Launch (50-200 people), Internal Launch (1,000+), or JV Launch (10,000+).",
      "{GARY_TODO} Action 2: Design your 3-part Prelaunch Content (PLC) sequence with the AI Startup Architect skill.",
      "{GARY_TODO} Action 3: Write the 7-day launch email series from Cart Open through Final Close.",
    ],
    expectedOutcomes: {
      week1: "{GARY_TODO}: Launch plan complete. PLC sequence designed.",
      month1: "{GARY_TODO}: First launch executed. Revenue data collected for optimization.",
      month3: "{GARY_TODO}: Second launch or evergreen funnel live. Scalable launch system established.",
    },
    keyPrompts: [
      {
        label: "PLC Sequence Generator",
        prompt:
          "{GARY_TODO: Paste the PLC Sequence Generator prompt here.}",
      },
      {
        label: "Launch Email Sequence Writer",
        prompt:
          "{GARY_TODO: Paste the Launch Email Sequence Writer prompt here.}",
      },
    ],
    commonMistakes: [
      "{GARY_TODO} Mistake 1: Starting with a JV or Internal Launch before validating with a Seed Launch.",
      "{GARY_TODO} Mistake 2: Creating PLC content without embedding the 9 Mental Triggers throughout.",
      "{GARY_TODO} Mistake 3: Sending a single launch email — the 7-day sequence is what drives the revenue spike.",
    ],
  },
  "ai-content-architect": {
    firstThreeActions: [
      "{GARY_TODO} Action 1: Design your content category — the specific niche you will own and become the obvious leader in.",
      "{GARY_TODO} Action 2: Run the Infinite Ideas Matrix to generate 20 content ideas from one topic.",
      "{GARY_TODO} Action 3: Write and atomize your first article across 5 platforms.",
    ],
    expectedOutcomes: {
      week1: "{GARY_TODO}: Content category defined. 20-idea bank generated. First article published.",
      month1: "{GARY_TODO}: 30-day content calendar live. Platform consistency established.",
      month3: "{GARY_TODO}: 500+ subscribers or followers on primary platform. Monetization path clear.",
    },
    keyPrompts: [
      {
        label: "Infinite Ideas Matrix",
        prompt:
          "{GARY_TODO: Paste the Infinite Ideas Matrix prompt here.}",
      },
      {
        label: "Content Atomizer",
        prompt:
          "{GARY_TODO: Paste the Content Atomizer prompt here.}",
      },
    ],
    commonMistakes: [
      "{GARY_TODO} Mistake 1: Choosing a category that already has a dominant player — find the gap or create a new category.",
      "{GARY_TODO} Mistake 2: Publishing without a consistent 1-3-1 structure — format consistency builds recognition.",
      "{GARY_TODO} Mistake 3: Atomizing content without adapting tone for each platform — LinkedIn ≠ Twitter ≠ Instagram.",
    ],
  },
};

export default async function QuickStartPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const book = getBookBySlug(slug);
  if (!book) notFound();

  const content = quickStartContent[slug];
  if (!content) notFound();

  const canonicalUrl = locale === "en"
    ? `${SITE_URL}/products/${slug}/quick-start`
    : `${SITE_URL}/${locale}/products/${slug}/quick-start`;

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Quick Start — ${book.title}`,
    description: `Get results from ${book.title} in your first week. Key frameworks, first 3 actions, and ready-to-use prompts.`,
    url: canonicalUrl,
    step: content.firstThreeActions.map((action, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: `Action ${i + 1}`,
      text: action,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 3, name: book.title, item: `${SITE_URL}/products/${slug}` },
      { "@type": "ListItem", position: 4, name: "Quick Start", item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(howToJsonLd)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbJsonLd)) }}
      />

      <div className="min-h-screen pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-text-muted flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gold transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products/${slug}`} className="hover:text-gold transition-colors">{book.title}</Link>
            <span>/</span>
            <span className="text-text-secondary">Quick Start</span>
          </div>
        </div>

        {/* Header */}
        <section className="max-w-3xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-gold/70 font-bold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
              Vol. {book.vol} — Quick Start
            </span>
            <span className="text-xs text-text-muted">Based on {book.framework}</span>
          </div>
          <div className="flex items-start gap-4">
            <span className="text-4xl shrink-0">{book.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {/* {GARY_TODO}: Optionally customize per-book headline */}
                <span className="gradient-gold">{book.title}</span>
              </h1>
              <p className="text-text-secondary">{book.tagline}</p>
            </div>
          </div>
        </section>

        {/* Core Frameworks */}
        <section className="max-w-3xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-xl font-bold">Core Frameworks in This Book</h2>
          </div>
          <div className="space-y-2">
            {book.frameworks.map((f, i) => (
              <div key={i} className="flex gap-3 bg-surface/60 border border-white/5 rounded-xl p-4">
                <div className="w-5 h-5 bg-gold/10 border border-gold/20 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </section>

        {/* First 3 Actions */}
        <section className="max-w-3xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Keep heading or adjust tone */}
            <h2 className="text-xl font-bold">Your First 3 Actions</h2>
          </div>
          <div className="space-y-3">
            {content.firstThreeActions.map((action, i) => (
              <div key={i} className="flex gap-4 bg-surface/60 border border-white/5 rounded-xl p-4">
                <div className="shrink-0 w-8 h-8 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center font-bold text-gold text-sm">
                  {i + 1}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Expected Outcomes */}
        <section className="max-w-3xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">Expected Outcomes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Week 1", value: content.expectedOutcomes.week1 },
              { label: "Month 1", value: content.expectedOutcomes.month1 },
              { label: "Month 3", value: content.expectedOutcomes.month3 },
            ].map((outcome) => (
              <div key={outcome.label} className="bg-surface/60 border border-white/5 rounded-xl p-4">
                <div className="text-gold font-bold text-sm mb-2">{outcome.label}</div>
                <p className="text-text-secondary text-xs leading-relaxed">{outcome.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Prompts */}
        <section className="max-w-3xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">Key Prompts — Copy & Paste Ready</h2>
          </div>
          <div className="space-y-4">
            {content.keyPrompts.map((kp, i) => (
              <div key={i} className="bg-surface/60 border border-white/5 rounded-xl p-5">
                <div className="text-gold font-semibold text-sm mb-3">{kp.label}</div>
                <div className="bg-black/20 border border-white/5 rounded-lg p-4">
                  <p className="text-text-muted text-xs font-mono leading-relaxed whitespace-pre-wrap">{kp.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="max-w-3xl mx-auto px-4 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">Common Mistakes to Avoid</h2>
          </div>
          <div className="space-y-3">
            {content.commonMistakes.map((mistake, i) => (
              <div key={i} className="flex gap-3 bg-surface/60 border border-white/5 rounded-xl p-4">
                <div className="w-5 h-5 bg-red-500/10 border border-red-500/20 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{mistake}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — Buy or Re-download */}
        <section className="max-w-3xl mx-auto px-4">
          <div className="bg-surface/60 border border-gold/20 rounded-2xl p-6 card-glow">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <p className="font-semibold text-text-primary mb-1">
                  {/* {GARY_TODO}: Rewrite CTA headline */}
                  {"{GARY_TODO}: CTA headline — e.g. 'Ready to go deeper? Get the full 20-page guide + AI Agent Skill.'"}
                </p>
                <p className="text-text-secondary text-sm">
                  {/* {GARY_TODO}: One-line subtext */}
                  {"{GARY_TODO}: CTA subtext — e.g. 'Includes prompt templates, 4 case studies, and 5-day quickstart.'"}
                </p>
              </div>
              <Link
                href={`/products/${slug}`}
                className="shrink-0 inline-flex items-center gap-2 bg-gold text-navy-dark font-bold px-6 py-3 rounded-xl text-sm hover:bg-gold-light transition-colors"
              >
                {book.title} — $17
              </Link>
            </div>
          </div>

          {/* Navigation to other quick starts */}
          <div className="mt-6">
            <p className="text-xs text-text-muted mb-3">Other Quick Start Guides</p>
            <div className="flex flex-wrap gap-2">
              {books
                .filter((b) => b.slug !== slug)
                .map((b) => (
                  <Link
                    key={b.id}
                    href={`/products/${b.slug}/quick-start`}
                    className="text-xs text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Vol. {b.vol}: {b.title}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
