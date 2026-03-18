import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { books } from "@/lib/products";

type Props = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

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

// {GARY_TODO}: Replace these step descriptions with Gary's final copy.
// Gary: keep the structure (5 steps), rewrite the desc fields with punchy, benefit-driven language.
const steps = [
  {
    num: "1",
    title: "Read the PDF Guide (30 min)",
    desc: "{GARY_TODO} Explain: skim the full guide first for the big picture. Focus on the framework overview and case studies. The 5-day quickstart checklist is at the end of the PDF.",
    detail: "{GARY_TODO} Add 2–3 bullet tips for reading the PDF effectively.",
  },
  {
    num: "2",
    title: "Load the AI Agent Skill",
    desc: "{GARY_TODO} Explain: the .md file in your download gives your AI specialist-level expertise in the framework. You must load it before running prompts.",
    detail: "{GARY_TODO} Include platform-specific instructions (Claude / ChatGPT / Gemini). Link to /skill-guide for the deep-dive.",
  },
  {
    num: "3",
    title: "Run Your First Prompt",
    desc: "{GARY_TODO} Explain: each book has a 'Start Here' prompt inside. Paste it into your AI with the Skill loaded. Describe your business and watch the framework apply itself.",
    detail: "{GARY_TODO} Give one example prompt (e.g., Vol 1: 'Analyze my business and build a Value Ladder'). Show expected output format.",
  },
  {
    num: "4",
    title: "Follow the 5-Day Quickstart",
    desc: "{GARY_TODO} Explain: each book has a day-by-day action plan. One focused task per day. By day 5 you have a working system.",
    detail: "{GARY_TODO} Link to the specific /products/[slug]/quick-start page for each book the buyer owns.",
  },
  {
    num: "5",
    title: "Iterate and Improve",
    desc: "{GARY_TODO} Explain: feed your AI output back in for refinement. Combine multiple books for a full business system. The more context you give, the better the results.",
    detail: "{GARY_TODO} Mention how bundle buyers can chain the 6 frameworks in sequence for a complete business automation stack.",
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
          {/* {GARY_TODO}: Replace subheadline with Gary's copy */}
          <p className="text-text-secondary text-lg leading-relaxed">
            {"{GARY_TODO: Subheadline — e.g. 'You've got a PDF, an AI Agent Skill file, and a 5-day plan. This guide shows you how to use all three to go from purchase to your first AI-generated business output in under an hour.'}"}
          </p>
        </section>

        {/* What You Received */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h2 className="text-xl font-bold">What You Received</h2>
          </div>
          {/* {GARY_TODO}: Rewrite each item description with concise benefit language */}
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 space-y-4">
            {[
              {
                icon: "📄",
                title: "PDF Guide (20 pages)",
                desc: "{GARY_TODO}: Describe the PDF — framework overview, case studies, 5-day quickstart at the end.",
              },
              {
                icon: "🤖",
                title: "AI Agent Skill (.md file)",
                desc: "{GARY_TODO}: Describe what the .md file does — loads the framework into any AI as domain expertise.",
              },
              {
                icon: "📋",
                title: "Prompt Templates",
                desc: "{GARY_TODO}: Describe the copy-paste prompt templates included for each framework step.",
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
                {/* {GARY_TODO}: Replace this with a one-line benefit statement */}
                <p className="text-xs text-text-secondary">
                  {"{GARY_TODO}: One-line hook — e.g. 'The complete guide to loading and using your .md skill file across Claude, ChatGPT, and Gemini.'"}
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
              {/* {GARY_TODO}: Write a short CTA for users who haven't bought yet */}
              {"{GARY_TODO}: CTA copy for non-buyers — link to /products or /bundle."}
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
