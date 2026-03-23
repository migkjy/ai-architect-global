import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

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
      "Open Claude at claude.ai and click 'Projects' in the left sidebar.",
      "Create a new Project named after the framework (e.g., 'Marketing Architect') or open an existing one.",
      "Click 'Add to project knowledge' and upload your .md skill file.",
      "Start a new conversation inside the project. The skill is now active and will persist across every conversation in this project — you do not need to reload it.",
    ],
    note: "Claude Projects is the recommended method because the skill persists. Every conversation in the project has full access to the framework without re-uploading. For bundle buyers: create one project per skill for clean, focused sessions.",
  },
  {
    name: "ChatGPT",
    badge: null,
    steps: [
      "Go to Settings in the top-right corner, then select Custom Instructions.",
      "Open your .md skill file in any text editor and select all the contents.",
      "Paste the skill contents into the 'What would you like ChatGPT to know about you?' field and save.",
      "Start a new conversation. The skill context will be active for all new conversations until you change the Custom Instructions.",
    ],
    note: "Alternative method: at the start of any conversation, paste the full .md contents as your first message before describing your business. This works for any ChatGPT plan without custom instructions access.",
  },
  {
    name: "Gemini",
    badge: null,
    steps: [
      "Open your .md skill file in any text editor and select all the contents.",
      "Start a new Gemini conversation at gemini.google.com.",
      "Paste the skill contents as your first message, followed by a line break and your business description.",
      "Continue with your specific framework prompts. Gemini will apply the skill context throughout the conversation.",
    ],
    note: "Gemini Gems (if available on your plan) allow you to save the skill as a persistent Gem — similar to Claude Projects. Create one Gem per skill for clean, reusable sessions.",
  },
  {
    name: "Any Other LLM",
    badge: null,
    steps: [
      "Open your .md skill file in any text editor and select all the contents.",
      "If the LLM has a system prompt field, paste the skill contents there before starting the conversation.",
      "If there is no system prompt field, paste the skill contents as your first user message, then add a line break and begin describing your business.",
    ],
    note: "Any LLM that supports system prompts or long-context input can use the AI Agent Skills. The skill is plain text — it works wherever you can paste a long document into the conversation context.",
  },
];

const bestPractices = [
  {
    title: "One Skill Per Conversation",
    desc: "Each skill sets a specific expert context — a methodology, a decision tree, a set of evaluation criteria. Mixing multiple frameworks in one session forces the AI to context-switch, which degrades the depth and precision of every output. Use one skill per conversation. Feed outputs from one session into the next.",
  },
  {
    title: "Provide Specific Business Context",
    desc: "The framework knows what to ask. You need to know what to answer. The more specific your business details — your niche, your audience, your current revenue, your specific problem — the more precisely the AI applies the framework. 'I sell coaching' produces generic output. 'I sell 90-day coaching to freelance designers earning $40K who want to reach $100K' produces a Dream Customer profile you can actually use.",
  },
  {
    title: "Use the Built-in Prompt Templates",
    desc: "Each book includes copy-paste prompts designed to extract maximum value from the specific skill. These are not generic questions — they are structured inputs that trigger the framework's full methodology. Use them exactly as written for your first session, then customize once you understand the output structure.",
  },
  {
    title: "Save and Iterate",
    desc: "Save every AI output. In the next session, paste the previous output at the start of the conversation with the skill loaded, then ask for refinement. The iteration cycle is where the real value compounds — each round makes the output more precise, more tailored, and more ready to deploy.",
  },
];

const faqs = [
  {
    question: "The AI isn't following the framework. What should I do?",
    answer: "Start a new conversation and reload the skill — either by re-uploading to your Claude Project, or pasting the .md contents as the first message again. Then provide more specific business context before running prompts. Long conversations can dilute framework adherence as context fills up. Shorter, focused sessions with one clear objective produce more consistent framework application.",
  },
  {
    question: "The output is too generic. How do I get more specific results?",
    answer: "Generic input produces generic output. Provide your exact niche (not 'health coaching' but 'weight loss coaching for women over 45 who have tried multiple diets'), your current situation (list size, revenue, platforms), your specific customer (use the Dream Customer profile if you have run it), and the exact problem you need solved. The framework needs real inputs to produce real outputs.",
  },
  {
    question: "How do I know the skill is working?",
    answer: "Run the same prompt with and without the skill loaded and compare. A skill-loaded AI will reference specific framework terminology — Secret Formula, Value Ladder, Dream 100, FRED, PLC sequence — and structure its output according to the framework's methodology. Without the skill, the AI gives general advice. With it, you get structured framework execution.",
  },
  {
    question: "Can I use multiple skills together?",
    answer: "Use separate conversations per skill and feed outputs from one into the next. Marketing Architect output (Dream Customer profile, Value Ladder) becomes the input for Traffic Architect (Dream 100 list, platform strategy). Traffic Architect output feeds Story Architect (copy targeting). This chaining is more effective than mixing skills in one session, which dilutes each framework's depth.",
  },
  {
    question: "Which skill should I start with?",
    answer: "Start with the skill that addresses your most urgent business problem right now. If you do not know who your customer is — Marketing Architect first. If you do not know how to reach them — Traffic Architect. If you have an offer but no copy that converts — Story Architect. If you are ready to launch — Startup Architect. For a complete onboarding sequence, read the Getting Started guide.",
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
          <p className="text-text-secondary text-lg leading-relaxed">
            Your .md file gives any AI domain-level expertise in a proven business framework. Here is how to load it into Claude, ChatGPT, or Gemini — and get results from day one.
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
                desc: "A structured plain-text file that encodes a complete expert framework — its methodology, decision trees, output templates, and evaluation criteria — as AI-executable instructions. When an AI reads this file, it does not just know about the framework. It follows the framework's methodology when responding to your prompts.",
              },
              {
                label: "vs. Regular Prompts",
                desc: "A regular prompt is a one-shot question. The AI answers from general training data — broad, often shallow. A Skill-loaded conversation is different: the AI operates with the complete expert framework in context for the entire session. Every answer is filtered through that methodology. The depth, structure, and specificity of output is categorically different.",
              },
              {
                label: "The Analogy",
                desc: "Loading the Marketing Architect skill is like hiring Russell Brunson to sit next to you while you work. He does not just answer questions — he runs you through his Secret Formula, builds your Value Ladder, writes your Hook-Story-Offer. Loading the Skill gives any AI that same specialist capability, applied to your specific business.",
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
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Each skill&apos;s output becomes the input for the next. Start with Marketing Architect to define your Dream Customer and Value Ladder. Feed that profile into Traffic Architect to build your Dream 100 list. Use Brand Architect to craft your positioning and origin story. Hand that story to Story Architect to write your sales copy. Use Startup Architect to design your launch sequence around that copy. Then Content Architect to produce the ongoing content that fills your funnel. Each step builds on the last.
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
            <p className="font-bold text-text-primary mb-2">
              Do not have a Skill yet? Get your first one for $17.
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Each book includes the PDF guide, the AI Agent Skill file, and copy-paste prompt templates. Start using it today.
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
