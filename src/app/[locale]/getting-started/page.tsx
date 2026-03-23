import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { books } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = locale === "en"
    ? `${SITE_URL}/getting-started`
    : `${SITE_URL}/${locale}/getting-started`;

  return {
    title: "Getting Started — AI Native Playbook Series",
    description:
      "A new buyer's complete guide: how to read your PDF, load the AI Agent Skill into Claude or ChatGPT, run your first prompt, and follow the 5-day quickstart.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Getting Started — AI Native Playbook Series",
      description:
        "Step-by-step guide: PDF guide, AI Agent Skill setup, first prompt, and 5-day quickstart checklist.",
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

const steps = [
  {
    num: "1",
    title: "Read the PDF Guide (30 min)",
    desc: "Skim the full guide first for the big picture. You do not need to memorize anything — just understand the framework structure and what the AI Agent Skill will do with it. The 5-day quickstart checklist is at the end of the PDF.",
    detail: "Read the framework overview first. Scan the case studies — they show you what output to expect. When you reach the 5-day checklist, stop and move to Step 2. You can go deeper on the theory after you have seen it work.",
  },
  {
    num: "2",
    title: "Load the AI Agent Skill",
    desc: "The .md file in your download is not a document to read — it is a system prompt that gives your AI specialist-level expertise in the framework. Without it, you get generic AI output. With it, you get framework-driven analysis applied to your specific business.",
    detail: "Claude (recommended): Add the .md file to a Claude Project via 'Add to project knowledge.' ChatGPT: Paste the contents into Custom Instructions. Gemini: Paste as your first message. For a full platform-by-platform walkthrough, see the AI Agent Skill Guide.",
  },
  {
    num: "3",
    title: "Run Your First Prompt",
    desc: "Each book has a 'Start Here' prompt built into the framework. With the Skill loaded, paste it into your AI and describe your business in plain language. The AI applies the full expert framework to your specific situation — not a generic template.",
    detail: "Example (Vol 1 — Marketing Architect): 'I sell [product] to [audience]. Use marketing-architect to define my Dream Customer and map my Value Ladder.' Expected output: a structured Dream Customer profile with psychographics, congregation map, bait ideas, and a Before/After transformation statement.",
  },
  {
    num: "4",
    title: "Follow the 5-Day Quickstart",
    desc: "Each book has a day-by-day action plan. One focused task per day. By Day 5 you have a working system — not just a plan, but actual output you can deploy: a funnel structure, a launch sequence, a brand narrative, a traffic strategy.",
    detail: "Find your book's Quick Start guide in the section below. Each guide shows the exact sequence, the prompts to use each day, and what to do with the output. One hour per day is enough.",
  },
  {
    num: "5",
    title: "Iterate and Improve",
    desc: "The first output is your starting point. Feed it back to the AI with your feedback — 'the audience description is too broad, focus on X' — and the framework tightens. The more context you give across sessions, the more precise the output becomes.",
    detail: "Bundle buyers: each framework's output feeds the next. Marketing Architect defines your Dream Customer. Traffic Architect uses that profile to build your Dream 100 list. Story Architect writes the copy for the funnel Marketing Architect designed. Chain them in sequence for a complete business execution system.",
  },
];

export default async function GettingStartedPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const canonicalUrl = locale === "en"
    ? `${SITE_URL}/getting-started`
    : `${SITE_URL}/${locale}/getting-started`;

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get Started with AI Native Playbook Series",
    description:
      "Complete buyer onboarding guide: read your PDF, load the AI Agent Skill, run your first prompt, and follow the 5-day quickstart.",
    url: canonicalUrl,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      position: parseInt(s.num),
      name: s.title,
      text: s.desc,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Getting Started", item: canonicalUrl },
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
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Getting Started</span>
          </div>
        </div>

        {/* Header */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase mb-6">
            Buyer Onboarding Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {/* {GARY_TODO}: Replace headline with final copy */}
            <span className="gradient-gold">Welcome — Here Is Exactly What to Do Next</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            You have a PDF guide, an AI Agent Skill file, and a 5-day quickstart plan. This page shows you how to use all three — from download to your first AI-generated business output in under an hour.
          </p>
        </section>

        {/* What You Received */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-xl font-bold">What You Received</h2>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 space-y-4">
            {[
              {
                icon: "📄",
                title: "PDF Guide (20 pages)",
                desc: "A framework overview, worked examples, and the 5-day quickstart checklist at the end. Read it for context — the AI Agent Skill handles the application.",
              },
              {
                icon: "🤖",
                title: "AI Agent Skill (.md file)",
                desc: "A structured knowledge file you load into Claude, ChatGPT, or any AI. Once loaded, the AI operates as a specialist in the framework — applying it step by step to your specific business, not giving generic answers.",
              },
              {
                icon: "📋",
                title: "Prompt Templates",
                desc: "Copy-paste prompts for each major framework step. These are not generic — they are designed to extract the maximum output from the Skill. Use them exactly as written, then customize from there.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm mb-1">{item.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5-Step Process */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-2xl font-bold">5 Steps to Your First Result</h2>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all"
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-gold/10 border border-gold/20 rounded-xl flex items-center justify-center font-bold text-gold">
                    {step.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary mb-2">{step.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed mb-3">{step.desc}</p>
                    <p className="text-text-muted text-xs leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skill Guide Link */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <Link
            href="/skill-guide"
            className="block bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-5 hover:border-gold/40 transition-colors group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary mb-1">
                  New to AI Agent Skills?
                </p>
                <p className="text-xs text-text-secondary">
                  The complete guide to loading your .md skill file across Claude, ChatGPT, and Gemini — with platform-specific steps, best practices, and troubleshooting.
                </p>
              </div>
              <span className="shrink-0 text-xs bg-gold/15 text-gold px-4 py-2 rounded-lg font-semibold group-hover:bg-gold/25 transition-colors whitespace-nowrap">
                Read Skill Guide &rarr;
              </span>
            </div>
          </Link>
        </section>

        {/* Quick Start Links per Book */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Replace section heading */}
            <h2 className="text-xl font-bold">Quick Start Guides by Book</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/products/${book.slug}/quick-start`}
                className="flex items-center gap-3 bg-surface/40 border border-white/5 rounded-xl p-4 hover:border-gold/20 transition-all group"
              >
                <span className="text-2xl shrink-0">{book.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs text-gold/60 font-bold mb-0.5">Vol. {book.vol}</div>
                  <div className="text-sm font-semibold text-text-primary group-hover:text-gold transition-colors truncate">
                    {book.title}
                  </div>
                  <div className="text-xs text-text-muted">Quick Start &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA to Products */}
        <section className="max-w-3xl mx-auto px-4">
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 text-center">
            <p className="text-text-secondary text-sm mb-3">
              Haven&apos;t purchased yet? Each book is a complete expert framework — AI Agent Skill included — for $17. All 6 books are available as a bundle for $47.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gold border border-gold/20 hover:border-gold/40 px-5 py-2.5 rounded-xl transition-all font-semibold"
            >
              Browse All 6 Books &rarr;
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
