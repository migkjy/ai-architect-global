export interface Pattern {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  sourceBook: string;
  sourceAuthor: string;
  relatedBookSlug: string;
  keySteps: string[];
  useCases: string[];
}

export const patterns: Pattern[] = [
  {
    slug: "value-ladder-automation",
    title: "Value Ladder AI Automation",
    subtitle: "Build a 5-step customer ascension model with AI",
    description:
      "Automate Russell Brunson's Value Ladder framework using AI. Design your product ecosystem from lead magnets to high-ticket offers, with AI-generated content and positioning for each tier.",
    sourceBook: "DotCom Secrets",
    sourceAuthor: "Russell Brunson",
    relatedBookSlug: "ai-marketing-architect",
    keySteps: [
      "Define your Dream Customer with AI-generated personas",
      "Map the 5-step Value Ladder — AI identifies gaps and proposes new tiers",
      "Generate Hook-Story-Offer content for each product level",
      "Build the 7-Phase Funnel: Cold to Warm to Hot traffic sequences",
      "Create Soap Opera Sequence: AI writes 5-day trust-building email series",
    ],
    useCases: [
      "Online course creators launching their first product ladder",
      "Coaches scaling from 1-on-1 to group programs",
      "E-commerce businesses adding digital upsells",
    ],
  },
  {
    slug: "mass-movement-design",
    title: "Mass Movement Design with AI",
    subtitle: "Build a brand that leads a movement, not just sells a product",
    description:
      "Apply Russell Brunson's Expert Secrets framework using AI to design a Mass Movement. From defining your Charismatic Leader identity to crafting your Epiphany Bridge story and Perfect Webinar script.",
    sourceBook: "Expert Secrets",
    sourceAuthor: "Russell Brunson",
    relatedBookSlug: "ai-brand-architect",
    keySteps: [
      "Define your Charismatic Leader identity, Cause, and New Opportunity",
      "Craft the Epiphany Bridge: 8-step storytelling script with AI",
      "Build Belief System Architecture: Big Domino + 3 false beliefs",
      "Generate Perfect Webinar Script: complete 4-part AI-written script",
      "Execute Dream 100 Traffic Strategy for audience building",
    ],
    useCases: [
      "Personal brands building an engaged community",
      "Thought leaders launching a new methodology",
      "Consultants positioning as category creators",
    ],
  },
  {
    slug: "dream-100-traffic",
    title: "Dream 100 AI Traffic Strategy",
    subtitle:
      "Find your customers where they already are — with AI",
    description:
      "Implement Russell Brunson's Traffic Secrets Dream 100 strategy using AI. Build complete customer avatars, identify 100 traffic sources, and generate platform-specific content strategies.",
    sourceBook: "Traffic Secrets",
    sourceAuthor: "Russell Brunson",
    relatedBookSlug: "ai-traffic-architect",
    keySteps: [
      "AI-generated Dream Customer Avatar from demographic + behavioral data",
      "Identify 100 places your dream customers congregate with AI research",
      "Generate Hook-Story-Offer content optimized per platform",
      "Design organic (Work Your Way In) and paid (Buy Your Way In) strategies",
      "Build Follow-Up Funnel: AI email sequences for cold-to-buyer conversion",
    ],
    useCases: [
      "SaaS startups seeking product-market fit traffic",
      "Local businesses expanding to online audiences",
      "Content creators diversifying traffic sources",
    ],
  },
  {
    slug: "story-driven-copy",
    title: "Story-Driven AI Copywriting",
    subtitle:
      "Every word wins or loses sales — AI fixes the ones that lose",
    description:
      "Apply Jim Edwards' Copywriting Secrets with AI. Mine personal stories, structure Hero's Journey narratives, and generate high-conversion headlines and platform-specific copy.",
    sourceBook: "Copywriting Secrets",
    sourceAuthor: "Jim Edwards",
    relatedBookSlug: "ai-story-architect",
    keySteps: [
      "Personal Story Mining: 5-step process for finding emotional turning points",
      "Hero's Journey Formula: 7-step narrative arc designed by AI",
      "10 Buying Motivators: AI identifies which core motivators drive your audience",
      "Headline Arsenal: generate headlines across Curiosity, Benefit, Problem-Solution",
      "Platform-Specific Copy: Hook, Story, Value, CTA for each channel",
    ],
    useCases: [
      "Marketers optimizing landing page conversion rates",
      "Email marketers improving open and click rates",
      "Ad copywriters generating high-performing variations",
    ],
  },
  {
    slug: "product-launch-sequence",
    title: "AI Product Launch Sequence",
    subtitle: "Launch with a proven sequence — not guesswork",
    description:
      "Automate Jeff Walker's Product Launch Formula using AI. Design the 4-phase launch structure, embed 9 mental triggers naturally, and generate complete prelaunch content and launch email sequences.",
    sourceBook: "Product Launch Formula",
    sourceAuthor: "Jeff Walker",
    relatedBookSlug: "ai-startup-architect",
    keySteps: [
      "PLF 4-Phase Structure: Pre-Prelaunch, PLC sequence, Launch, Post-Launch",
      "Embed 9 Mental Triggers: Authority, Reciprocity, Scarcity, Social Proof",
      "Sideways Sales Letter: AI generates 3-part Prelaunch Content sequence",
      "7-Day Launch Email Sequence: every email from Cart Open to Final Close",
      "Choose launch type: Seed (50-200), Internal (1K-5K), JV (10K+)",
    ],
    useCases: [
      "Digital product creators planning their first launch",
      "Course creators automating recurring launches",
      "SaaS founders designing beta launch sequences",
    ],
  },
];

export const VALID_PATTERN_SLUGS = patterns.map((p) => p.slug);

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}
