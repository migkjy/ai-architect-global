import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { books, getBookBySlug } from "@/lib/products";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com").trim();

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
      "Answer the 4 Secret Formula questions — write your raw, honest answers to: (1) Who is your Dream Customer? (2) Where are they congregating? (3) What bait will you use to attract them? (4) What result do you want to give them? Do not overthink. Raw is better than polished.",
      "Feed your answers to the AI with marketing-architect loaded and request a complete Dream Customer Profile Card — demographics, psychographics, congregation map, three bait ideas ranked by likely conversion, and a Before/After transformation statement.",
      "Take the Dream Customer profile and ask the AI to map your Value Ladder — identify your current offers, find the gaps, and propose a complete ascension model from free lead magnet through high-ticket backend.",
    ],
    expectedOutcomes: {
      week1: "Complete Dream Customer Profile Card and Value Ladder map. First Hook-Story-Offer written and ready to test.",
      month1: "First leads entering the funnel. Soap Opera Sequence live and delivering. Measurable open and click rate data.",
      month3: "Full Value Ladder operational with offers at each level. Automated email sequences generating revenue without manual effort.",
    },
    keyPrompts: [
      {
        label: "Dream Customer Profile Builder",
        prompt:
          "I sell [product/service] to [rough audience description]. My industry is [niche]. Using Russell Brunson's Secret Formula from DotCom Secrets, take my inputs and build a complete Dream Customer Profile Card. Include: demographics snapshot, psychographic deep dive (three fears, secret desires, false beliefs), congregation map (specific platforms, communities, podcasts, newsletters), three bait ideas ranked by conversion likelihood, and a Before/After transformation statement.",
      },
      {
        label: "Value Ladder Designer",
        prompt:
          "My Dream Customer is [paste profile from previous output]. My current offerings are [list what you sell and at what price]. Using the Value Ladder framework from DotCom Secrets, analyze my current offer structure, identify gaps in the ascension model, and propose a complete 5-level Value Ladder with: (1) free lead magnet, (2) frontend offer, (3) mid-tier product, (4) backend offer, (5) high-ticket option. Include recommended price points and a one-sentence description of what each level delivers.",
      },
    ],
    commonMistakes: [
      "Building the full Value Ladder before testing the core offer. Validate your middle-tier offer with a Seed Launch before building up or down. Skip this and you risk building a ladder for a customer who does not want to climb.",
      "Skipping the Dream Customer definition and going straight to funnel architecture. The AI applies the framework to YOUR specific customer — without that profile, it produces a generic funnel that attracts no one in particular.",
      "Writing Hook-Story-Offer without loading the marketing-architect skill first. The skill encodes Brunson's complete Hook-Story-Offer methodology — without it, the output is a generic headline, not a framework-driven conversion mechanism.",
    ],
  },
  "ai-brand-architect": {
    firstThreeActions: [
      "Define your New Opportunity — write one sentence: 'Instead of [old way that failed], my customers get [new opportunity] that [delivers result].' Your offer must feel like a new opportunity, not an improvement on what already failed them.",
      "Identify your Big Domino — the ONE belief that, if your prospect holds it, makes every other objection irrelevant. Ask: 'If my ideal customer believed ____________, they would have no choice but to buy.' Write that belief as a single sentence.",
      "Feed your New Opportunity and Big Domino to the AI with brand-architect loaded and request: Big Domino Statement + Three False Belief breakdown (Vehicle, Internal, External) with a story framework for addressing each one.",
    ],
    expectedOutcomes: {
      week1: "Big Domino Statement complete. Three False Beliefs identified with response frameworks. Epiphany Bridge story drafted.",
      month1: "Perfect Webinar script structure generated. First presentation or VSL tested with real audience.",
      month3: "Mass Movement building — measurable growth in follower and subscriber engagement. Brand narrative consistent across all channels.",
    },
    keyPrompts: [
      {
        label: "Big Domino + False Beliefs Builder",
        prompt:
          "Using Russell Brunson's Big Domino framework from Expert Secrets, take my business context and produce: (1) A polished Big Domino Statement — one sentence that captures the single belief my customer must hold. (2) Three False Belief patterns — Vehicle (why they doubt the method), Internal (why they doubt themselves), and External (why they blame their circumstances). For each false belief, write the belief, the truth that breaks it, and a one-paragraph story framework I can use to address it. My business: [describe what you sell and who you sell it to]. Do not invent fictional customer stories. Use logical arguments and framework-based reasoning.",
      },
      {
        label: "Perfect Webinar Script Outline",
        prompt:
          "Using Russell Brunson's Perfect Webinar framework from Expert Secrets, and based on my Big Domino Statement [paste it] and Three False Belief breakdown [paste it], create a Perfect Webinar script outline for my offer: [describe offer and price]. Include: Origin Story structure (Epiphany Bridge format), Three Secrets structure (one secret per False Belief, each delivered as an Epiphany Bridge), and the Stack and Close sequence with value stacking before price reveal.",
      },
    ],
    commonMistakes: [
      "Creating brand content before defining the specific change you want to create in your audience's lives. The Big Domino comes first — every piece of brand content should reinforce that one belief. Without it, your brand is interesting but not persuasive.",
      "Writing a generic origin story instead of a specific Epiphany Bridge moment. The Epiphany Bridge has eight components — background, desire, wall, discovery, plan, conflict, achievement, transformation. A generic story hits none of them with precision.",
      "Identifying multiple Big Domino statements and trying to collapse all of them simultaneously. One belief. One domino. When it falls, everything else falls with it. Spreading across multiple beliefs dilutes the impact of every message you produce.",
    ],
  },
  "ai-traffic-architect": {
    firstThreeActions: [
      "Build your Dream Customer Avatar — not a demographic, a specific person. Provide your niche, audience description, and offer to the AI with traffic-architect loaded. Ask for a full avatar with psychographics, daily information diet, and purchase triggers.",
      "Build your Dream 100 list — categorized across Podcasters, YouTubers, Bloggers/Writers, Social Media Influencers, Community Owners, and Newsletter/Email List Owners. For each category, identify what to look for, how to find them, and a 3-step approach strategy.",
      "Choose your primary platform based on where your Dream 100 already has the most concentration. Generate the first week of platform-native content using the traffic-architect skill and your Dream Customer Avatar as targeting input.",
    ],
    expectedOutcomes: {
      week1: "Dream Customer Avatar complete. Dream 100 list built and categorized. Primary platform selected. First week of content ready.",
      month1: "First traffic results visible — organic reach, click-throughs, or DM responses from Dream 100 engagement. Platform posting cadence established.",
      month3: "Consistent organic traffic from earned Dream 100 relationships. At least 10 active Dream 100 relationships in the Engage or Value phase.",
    },
    keyPrompts: [
      {
        label: "Dream 100 List Builder",
        prompt:
          "Using Russell Brunson's Dream 100 strategy from Traffic Secrets, build me a categorized Dream 100 framework for my niche. My niche: [describe specifically]. My target audience: [describe]. My current platform: [where you are most active]. My offer: [what you sell]. For each of the six categories (Podcasters, YouTubers, Bloggers/Writers, Social Media Influencers, Community Owners, Newsletter Owners), provide: what to look for, how to find them, 15-20 target profile types, and a 3-step approach strategy (Engage, Value, Partnership). Also identify 5 quick-win targets that are smaller, more accessible, and likely to respond.",
      },
      {
        label: "Platform Content Strategy",
        prompt:
          "Based on my Dream Customer Avatar [paste avatar] and my Dream 100 analysis showing the highest concentration on [platform], generate a 4-week content strategy for [platform]. Include: content themes aligned with my Dream Customer's congregation patterns, 3 posts per week with topic, format, and hook for each, and a growth tactic for each week that moves me from consuming to creating to collaborating within the Dream 100.",
      },
    ],
    commonMistakes: [
      "Trying to be present on all platforms simultaneously. Pick the one platform where your Dream 100 has the most concentration and dominate it for 90 days before expanding. Divided attention produces weak results on every platform.",
      "Building a Dream 100 list and treating it as a cold outreach list. The Dream 100 is a relationship strategy. Dig your well before you're thirsty — engage, add value, earn credibility — before you make any kind of ask.",
      "Creating content without a clearly defined Dream Customer Avatar. Generic avatar produces content that attracts no one specifically. The more precise your avatar, the more precisely your content self-selects the right audience.",
    ],
  },
  "ai-story-architect": {
    firstThreeActions: [
      "Run the FRED analysis for your primary offer — map your target audience's Fears, Results, Expectations, and Desires in specific detail. This is not optional warmup. FRED is the diagnostic that determines every word that follows.",
      "Identify the primary and secondary buying motivators for your offer from the 10 Motivators framework — Make money, Save money, Save time, Avoid effort, Escape pain, Get comfort, Cleanliness/hygiene, Get health, Gain praise, Feel loved. Your copy hooks lead with the top two.",
      "Feed your FRED analysis and buying motivators to the AI with story-architect loaded and request a complete sales page using the Stealth Close structure: Problem acknowledgment, Mechanism reveal, Solution positioning, Value stack, Risk reversal, Gentle close.",
    ],
    expectedOutcomes: {
      week1: "FRED analysis complete. New sales copy drafted for your primary product using the Stealth Close structure.",
      month1: "Measurable conversion lift on rewritten pages. A/B test data collected comparing old and new copy.",
      month3: "Full copy library built — sales page, email sequence, ad copy, and social hooks all grounded in the same FRED profile.",
    },
    keyPrompts: [
      {
        label: "FRED Analysis + Sales Page",
        prompt:
          "I need sales copy for [product description]. Price: [price]. Target audience: [describe in detail — who they are, what they earn, what they struggle with]. Using Jim Edwards' story-architect framework, first complete a FRED analysis for this audience (Fears, Results, Expectations, Desires). Then identify the top 2 buying motivators from the 10 Motivators framework. Then write a complete sales page using the Stealth Close structure: (1) Acknowledge the problem using the reader's own language, (2) Introduce the mechanism — why previous solutions failed, (3) Reveal the solution as the logical next step, (4) Stack the value against what it would cost to get these results another way, (5) Risk reversal, (6) Gentle close.",
      },
      {
        label: "Email Hook Generator",
        prompt:
          "Using the FRED analysis [paste your FRED output] and Jim Edwards' Hero's Journey structure for sales copy, write 3 email hooks for my [product]. Each hook should: open in the reader's world using their specific language, name the tension they feel, present a turning point, and deliver through story using the Stealth Close — where the selling happens through narrative, not pitch. No generic 'Hey [Name], struggling with X?' openers.",
      },
    ],
    commonMistakes: [
      "Skipping FRED and going straight to writing copy. Story gives copy its emotional power, and FRED gives story its targeting precision. Without it, your copy speaks to an imagined reader, not the actual one.",
      "Applying FRED without identifying which motivator is primary. Everyone has multiple motivators, but copy that leads with all of them dilutes impact. Identify the dominant one and build the hook around it.",
      "Writing a single version of copy and deploying it across every channel. A sales page, a cold email, and an Instagram caption require different hook structures, different lengths, and different tones — even when the underlying FRED profile is identical.",
    ],
  },
  "ai-startup-architect": {
    firstThreeActions: [
      "Choose your launch type based on your current list size and product status: Seed Launch if you have 50-500 people and no finished product yet, Internal Launch if you have 500+ subscribers and a validated offer, JV Launch if you have proven conversion data and want to scale with partner audiences.",
      "Design your 3-part Pre-Launch Content (PLC) sequence with startup-architect loaded. PLC #1 establishes the opportunity. PLC #2 demonstrates the transformation with real methodology. PLC #3 helps them envision life after the result and creates buying anticipation before the cart opens.",
      "Write the complete launch email series — from Cart Open through Final Close — using the startup-architect skill. A single launch email does not drive revenue. The sequence does.",
    ],
    expectedOutcomes: {
      week1: "Launch type selected. PLC sequence designed with all three pieces outlined. Launch email series drafted.",
      month1: "First launch executed. Conversion data collected. Revenue baseline established for optimization.",
      month3: "Second launch or evergreen funnel live. Scalable launch system established with documented conversion rates for each launch type.",
    },
    keyPrompts: [
      {
        label: "PLC Sequence Generator",
        prompt:
          "I want to launch [describe product or offer]. My current situation: [list size, follower count, audience platforms, whether product is built]. Using Jeff Walker's Product Launch Formula from startup-architect, recommend my launch type and design the complete Pre-Launch Content sequence. For each PLC piece provide: title, goal, core teaching point, and how it addresses the launch psychology question it is designed to answer (PLC 1: Why should I pay attention? PLC 2: How does this work? PLC 3: What will my life look like?). Include a delivery format recommendation for each piece.",
      },
      {
        label: "Launch Email Series Writer",
        prompt:
          "Based on my PLC sequence [paste PLC outline], write the complete launch email series for my [product] at [price]. Include: Day 1 Cart Open email, Day 2 FAQ and social proof email, Day 3 Objection handling email, Day 4 Urgency and scarcity email (if applicable), Day 5 Final Close email. Each email needs: subject line, opening hook, body using PLF copywriting principles, and a clear single call to action. My target customer: [paste Dream Customer profile].",
      },
    ],
    commonMistakes: [
      "Starting with a JV or Internal Launch before validating with a Seed Launch. The Seed Launch is not a smaller version of a real launch — it is the validation mechanism that tells you whether your offer is worth building. Skip it and you risk launching a product that nobody wanted.",
      "Creating PLC content that teaches generically without embedding the specific mental triggers PLF is designed to activate — authority, community, anticipation, reciprocity. The AI Startup Architect skill handles this when loaded correctly. Without the skill, you get educational content, not launch psychology.",
      "Sending one or two launch emails and concluding that launches do not work. The revenue spike in a PLF launch comes from the sequence — particularly the urgency sequence in the final 48 hours. The data consistently shows that Day 5 Final Close emails generate 30-50% of total launch revenue.",
    ],
  },
  "ai-content-architect": {
    firstThreeActions: [
      "Choose one topic you know well and feed it to the AI with content-architect loaded. Request four content pieces using the 4A Framework: Actionable (how-to), Analytical (data/breakdown), Aspirational (vision/possibility), and Anthropological (observation about human behavior). One topic becomes four complete, ready-to-publish drafts.",
      "Review all four pieces and identify which type resonates most with your current audience needs. Publish that one first. Save the other three for the following days. Repeat the process with a new topic each week.",
      "Atomize your best-performing piece across platforms — take the core idea and have the AI reformat it as a LinkedIn post, a Twitter/X thread, a newsletter section, and a video script hook. Adapt tone for each platform, not just format.",
    ],
    expectedOutcomes: {
      week1: "4A content batch completed and first piece published. Platform-specific atomization workflow established.",
      month1: "30-day content calendar live with 4 topics producing 16 pieces. Platform posting consistency established.",
      month3: "Content production is systematic, not effortful. Audience pattern data showing which A-type performs best for your readers. Monetization path from content to offer becoming clear.",
    },
    keyPrompts: [
      {
        label: "4A Content Batch Generator",
        prompt:
          "Using Nicolas Cole's 4A Framework from content-architect, take my topic and write four separate content pieces. My topic: [specific topic you know well]. My target audience: [who you are writing for]. My preferred platform: [LinkedIn / blog / newsletter / social]. Write one Actionable piece (step-by-step how-to), one Analytical piece (breakdown of why something works or fails), one Aspirational piece (vision of the transformed outcome), and one Anthropological piece (observation about human behavior or market pattern related to this topic). Each piece: 300-500 words, strong opening hook, clear point, closing line. Do not use fictional case studies. Use framework principles and logical reasoning.",
      },
      {
        label: "Content Atomizer",
        prompt:
          "Take this [paste your best content piece] and atomize it for distribution across platforms. For each platform, rewrite with the appropriate tone, format, and length: (1) LinkedIn post — professional tone, insight-forward, 150-250 words, (2) Twitter/X thread — punchy, each tweet standalone, 5-7 tweets, (3) Newsletter section — more depth, conversational, 300-400 words with a clear takeaway, (4) Short-form video script hook — 30-60 seconds, hook in first 3 seconds, one core idea. Keep the central argument consistent but adapt the voice and structure for each platform's culture.",
      },
    ],
    commonMistakes: [
      "Choosing a content topic area that already has dominant players producing 10 times your volume. Find the gap — a specific intersection of audience and topic that is underserved — or create a new category where you can be the obvious leader without competing against established voices.",
      "Publishing without the 1-3-1 structure — one strong opening statement, three supporting points or examples, one conclusive takeaway. Format consistency is not aesthetic. It builds reader recognition and makes your content scannable, which is what determines whether anyone finishes reading it.",
      "Atomizing content by copy-pasting the same text to every platform. LinkedIn professionals and Instagram audiences use different language, respond to different hooks, and have different context. Adapt the tone and format, not just the character count.",
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
                  Ready to go deeper? Get the full guide + AI Agent Skill.
                </p>
                <p className="text-text-secondary text-sm">
                  Includes the complete PDF guide, AI Agent Skill file, copy-paste prompt templates, and the 5-day quickstart plan.
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
