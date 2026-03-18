import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com").trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonicalUrl = locale === "en"
    ? `${SITE_URL}/skill-guide`
    : `${SITE_URL}/${locale}/skill-guide`;

  return {
    title: "AI Agent Skill Guide — How to Use Your .md Skill File | AI Native Playbook",
    description:
      "Complete guide to loading and using your AI Agent Skill (.md file) with Claude, ChatGPT, Gemini, and any other LLM. Step-by-step instructions, best practices, and troubleshooting.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "AI Agent Skill Guide — How to Use Your .md Skill File",
      description:
        "How to load your AI Agent Skill into Claude, ChatGPT, or Gemini. Step-by-step guide, best practices, and troubleshooting.",
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

// {GARY_TODO}: Replace all descriptions below with Gary's final copy.
// Structure:
//   - platformSteps: how to load the skill per AI platform
//   - bestPractices: tips array
//   - troubleshooting: FAQ-style entries
//   - combiningSkills: section on how to use multiple skills in sequence

const platforms = [
  {
    name: "Claude (Recommended)",
    badge: "Best Experience",
    steps: [
      // {GARY_TODO}: Rewrite steps in clear, numbered imperative voice
      "{GARY_TODO} Step 1: Open Claude and click 'Projects' in the left sidebar.",
      "{GARY_TODO} Step 2: Create a new Project or open an existing one.",
      "{GARY_TODO} Step 3: Click 'Add to project knowledge' and upload your .md file.",
      "{GARY_TODO} Step 4: Start a new conversation inside the project — the skill is now active.",
    ],
    note: "{GARY_TODO}: Add a tip about Claude Projects — e.g. 'The skill persists across all conversations in the project, so you don't have to reload it each time.'",
  },
  {
    name: "ChatGPT",
    badge: null,
    steps: [
      "{GARY_TODO} Step 1: Go to Settings → Custom Instructions.",
      "{GARY_TODO} Step 2: Open your .md file and copy all the contents.",
      "{GARY_TODO} Step 3: Paste the skill contents into the 'What would you like ChatGPT to know about you?' field.",
      "{GARY_TODO} Step 4: Save and start a new conversation.",
    ],
    note: "{GARY_TODO}: Add a note about alternative: paste the .md content at the start of any conversation as a system prompt.",
  },
  {
    name: "Gemini",
    badge: null,
    steps: [
      "{GARY_TODO} Step 1: Open your .md file and copy all the contents.",
      "{GARY_TODO} Step 2: Start a new Gemini conversation.",
      "{GARY_TODO} Step 3: Paste the skill contents as your first message, then describe your business.",
      "{GARY_TODO} Step 4: Continue the conversation with your specific prompts.",
    ],
    note: "{GARY_TODO}: Add a note about Gemini Gems if applicable.",
  },
  {
    name: "Any Other LLM",
    badge: null,
    steps: [
      "{GARY_TODO} Step 1: Open your .md file and copy all the contents.",
      "{GARY_TODO} Step 2: Paste the skill contents into the system prompt field (if available) or as the first user message.",
      "{GARY_TODO} Step 3: Begin with your business context before running framework prompts.",
    ],
    note: "{GARY_TODO}: Note that any LLM supporting system prompts or long context can use the skills.",
  },
];

const bestPractices = [
  {
    title: "One Skill Per Conversation",
    desc: "{GARY_TODO}: Explain why mixing frameworks in one session degrades quality — each skill sets a specific context.",
  },
  {
    title: "Provide Specific Business Context",
    desc: "{GARY_TODO}: Explain that the more detail you provide about your actual business, the more tailored the output.",
  },
  {
    title: "Use the Built-in Prompt Templates",
    desc: "{GARY_TODO}: Explain that each book includes copy-paste prompts — these are designed to extract maximum value from the skill.",
  },
  {
    title: "Save and Iterate",
    desc: "{GARY_TODO}: Explain how to feed AI outputs back in for refinement across multiple sessions.",
  },
];

const faqs = [
  {
    question: "The AI isn't following the framework. What should I do?",
    answer: "{GARY_TODO}: Answer — e.g. reload the skill by starting a new conversation, add the skill content again, and provide more specific business context.",
  },
  {
    question: "The output is too generic. How do I get more specific results?",
    answer: "{GARY_TODO}: Answer — e.g. provide your niche, current revenue, target customer details, and the specific problem you're solving.",
  },
  {
    question: "How do I know the skill is working?",
    answer: "{GARY_TODO}: Answer — e.g. compare outputs with and without the skill. The skill-loaded AI should reference specific framework terminology and structure.",
  },
  {
    question: "Can I use multiple skills together?",
    answer: "{GARY_TODO}: Answer — explain the recommended sequential approach (separate conversations per skill, feed outputs from one into the next).",
  },
  {
    question: "Which skill should I start with?",
    answer: "{GARY_TODO}: Answer — recommend starting with the skill that addresses the most urgent problem in their business right now. Link to /getting-started for the full guide.",
  },
];

export default async function SkillGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const canonicalUrl = locale === "en"
    ? `${SITE_URL}/skill-guide`
    : `${SITE_URL}/${locale}/skill-guide`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "AI Agent Skill Guide", item: canonicalUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(faqJsonLd)) }}
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
            <span className="text-text-secondary">AI Agent Skill Guide</span>
          </div>
        </div>

        {/* Header */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="inline-block bg-gold/10 border border-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide uppercase mb-6">
            Skill Usage Guide
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {/* {GARY_TODO}: Replace with Gary's final headline */}
            <span className="gradient-gold">How to Use Your AI Agent Skill</span>
          </h1>
          {/* {GARY_TODO}: Replace subheadline */}
          <p className="text-text-secondary text-lg leading-relaxed">
            {"{GARY_TODO: Subheadline — e.g. 'Your .md file gives any AI domain-level expertise in a proven business framework. Here is how to load it and get results from day one.'}"}
          </p>
        </section>

        {/* What Are AI Agent Skills */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Keep or adjust heading */}
            <h2 className="text-xl font-bold">What Is an AI Agent Skill?</h2>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6 space-y-4">
            {[
              {
                label: "The .md File",
                desc: "{GARY_TODO}: Explain what the .md file contains — a structured system prompt encoding a proven business framework as AI-executable instructions.",
              },
              {
                label: "vs. Regular Prompts",
                desc: "{GARY_TODO}: Contrast single-question prompts (one-shot) with Skill-loaded conversations (persistent expert context throughout).",
              },
              {
                label: "The Analogy",
                desc: "{GARY_TODO}: Use the 'specialist consultant' analogy — loading the skill is like hiring a DotCom Secrets expert to sit next to you while you work.",
              },
            ].map((item) => (
              <div key={item.label}>
                <h3 className="font-semibold text-text-primary text-sm mb-1">{item.label}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to Load — Per Platform */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">How to Load Your Skill</h2>
          </div>
          <div className="space-y-6">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-surface/60 border border-white/5 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-text-primary">{platform.name}</h3>
                  {platform.badge && (
                    <span className="text-xs text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full font-semibold">
                      {platform.badge}
                    </span>
                  )}
                </div>
                <ol className="space-y-2 mb-4">
                  {platform.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="shrink-0 w-5 h-5 bg-gold/10 border border-gold/20 rounded-md flex items-center justify-center text-xs text-gold font-bold">
                        {i + 1}
                      </span>
                      <p className="text-text-secondary text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
                {platform.note && (
                  <div className="bg-gold/5 border border-gold/10 rounded-lg px-4 py-3">
                    <p className="text-text-muted text-xs leading-relaxed">{platform.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">Best Practices</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bestPractices.map((bp) => (
              <div
                key={bp.title}
                className="bg-surface/60 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all"
              >
                <h3 className="font-semibold text-text-primary text-sm mb-2">{bp.title}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{bp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Combining Skills */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">Combining Multiple Skills (Bundle)</h2>
          </div>
          <div className="bg-surface/60 border border-white/5 rounded-2xl p-6">
            {/* {GARY_TODO}: Write the combining skills section — recommended sequence, how outputs chain */}
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              {"{GARY_TODO}: Explain the recommended skill sequence: Vol 1 (foundation/funnel) → Vol 2 (brand/movement) → Vol 3 (traffic/audience) → Vol 4 (copy/story) → Vol 5 (launch/PLF) → Vol 6 (content/writing). Each skill's output feeds into the next."}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { vol: 1, title: "AI Marketing Architect", slug: "ai-marketing-architect" },
                { vol: 2, title: "AI Brand Architect", slug: "ai-brand-architect" },
                { vol: 3, title: "AI Traffic Architect", slug: "ai-traffic-architect" },
                { vol: 4, title: "AI Story Architect", slug: "ai-story-architect" },
                { vol: 5, title: "AI Startup Architect", slug: "ai-startup-architect" },
                { vol: 6, title: "AI Content Architect", slug: "ai-content-architect" },
              ].map((b) => (
                <Link
                  key={b.vol}
                  href={`/products/${b.slug}/quick-start`}
                  className="text-xs text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold px-3 py-1.5 rounded-lg transition-all"
                >
                  Vol. {b.vol}: {b.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / Troubleshooting */}
        <section className="max-w-3xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gold rounded-full" />
            {/* {GARY_TODO}: Adjust heading if needed */}
            <h2 className="text-xl font-bold">Troubleshooting</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-surface/60 border border-white/5 rounded-xl p-5 group"
              >
                <summary className="cursor-pointer font-semibold text-text-primary text-sm list-none flex items-center justify-between gap-3">
                  {faq.question}
                  <svg
                    className="w-4 h-4 text-gold shrink-0 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-text-secondary text-sm leading-relaxed mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4">
          <div className="bg-surface/60 border border-gold/20 rounded-2xl p-6 text-center card-glow">
            {/* {GARY_TODO}: Rewrite CTA section */}
            <p className="font-bold text-text-primary mb-2">
              {"{GARY_TODO}: CTA heading — e.g. 'Don't have a Skill yet? Get your first one for $17.'"}
            </p>
            <p className="text-text-secondary text-sm mb-4">
              {"{GARY_TODO}: CTA subtext — e.g. 'Includes the PDF guide + AI Agent Skill + prompt templates. Start using it today.'"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gold text-navy-dark text-sm hover:bg-gold-light transition-colors"
              >
                Browse Individual Books — from $17
              </Link>
              <Link
                href="/bundle"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold border border-gold/20 text-gold text-sm hover:border-gold/40 transition-colors"
              >
                Get All 6 Skills — $47
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/getting-started"
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              Already a buyer? Read the Getting Started Guide &rarr;
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
