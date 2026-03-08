export type Book = {
  id: string;
  slug: string;
  vol: number;
  title: string;
  subtitle: string;
  tagline: string;
  shortDescription: string;
  framework: string;
  sourceBook: string;
  icon: string;
  color: string;
  envKey: string;
  /** Paddle Price ID 환경변수 키 (예: PADDLE_PRICE_ID_VOL1) */
  paddlePriceEnvKey: string;
  highlights: string[];
  caseStudy: {
    result: string;
    detail: string;
  };
  frameworks: string[];
  whatsInside: string[];
  relatedSlugs?: string[];
  isBestseller?: boolean;
  isNew?: boolean;
};

export type Bundle = {
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discount: number;
  envKey: string;
};

export const books: Book[] = [
  {
    id: "marketing-architect",
    slug: "ai-marketing-architect",
    vol: 1,
    title: "AI Marketing Architect",
    subtitle: "DotCom Secrets Automated with AI",
    tagline: "Stop designing funnels from scratch. Let AI build Russell Brunson's system for your business.",
    shortDescription:
      "Apply the core frameworks from DotCom Secrets — Value Ladder, Hook-Story-Offer, Soap Opera Sequence — using AI that understands your specific business and customer.",
    framework: "DotCom Secrets",
    sourceBook: "Russell Brunson",
    icon: "🎯",
    color: "from-blue-500/20 to-purple-500/20",
    envKey: "NEXT_PUBLIC_LS_PRODUCT_1_URL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_VOL1",
    highlights: [
      "Value Ladder — 5-step customer ascension model",
      "Hook-Story-Offer — AI content framework",
      "7-Phase Funnel System",
      "Soap Opera Sequence — 5-day email series",
    ],
    caseStudy: {
      result: "Yoga instructor: $600 → $5,000/month",
      detail: "Applied Value Ladder with AI to launch online courses and complete funnel system.",
    },
    frameworks: [
      "The Secret Formula: 4 questions to define your dream customer with AI-generated personas",
      "The Value Ladder: 5-step customer ascension model — AI maps gaps and proposes new product ideas",
      "Hook-Story-Offer: AI generates hooks tailored to your audience's specific pain points",
      "The 7-Phase Funnel: Cold → warm → hot traffic sequences built by AI",
      "Soap Opera Sequence: AI writes your complete 5-day trust-building email series",
    ],
    whatsInside: [
      "20-page premium PDF guide (A4 format)",
      "AI Marketing Architect system prompt",
      "Prompt templates for each framework step",
      "4 real before/after case studies with revenue numbers",
      "ROI scenarios for 12-month funnel growth",
      "5-day quickstart checklist",
    ],
    relatedSlugs: ["ai-brand-architect", "ai-traffic-architect"],
    isBestseller: true,
  },
  {
    id: "brand-architect",
    slug: "ai-brand-architect",
    vol: 2,
    title: "AI Brand Architect",
    subtitle: "Expert Secrets Automated with AI",
    tagline: "Build a brand that leads a movement, not just sells a product.",
    shortDescription:
      "Apply Russell Brunson's Expert Secrets framework with AI — from Mass Movement design and Attractive Character building to your complete Perfect Webinar script.",
    framework: "Expert Secrets",
    sourceBook: "Russell Brunson",
    icon: "🔳",
    color: "from-purple-500/20 to-pink-500/20",
    envKey: "NEXT_PUBLIC_LS_PRODUCT_2_URL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_VOL2",
    highlights: [
      "Mass Movement Design",
      "The Epiphany Bridge storytelling",
      "Belief System Architecture",
      "Perfect Webinar Script Generator",
    ],
    caseStudy: {
      result: "Life coach: 500 followers → 3,000 fans + 45 consultations/month",
      detail: "Applied Mass Movement framework to transform generic following into engaged community.",
    },
    frameworks: [
      "Mass Movement Design: Define your Charismatic Leader identity, Cause, and New Opportunity",
      "The Epiphany Bridge: 8-step storytelling script that guides customers to discover your solution",
      "Belief System Architecture: Build your Big Domino statement and dissolve the 3 false beliefs",
      "The Perfect Webinar Script: AI generates your complete 4-part script ready for webinars or VSLs",
      "Dream 100 Traffic Strategy: Access your competitors' audiences through strategic relationships",
    ],
    whatsInside: [
      "20-page premium PDF guide (A4 format)",
      "AI Brand Architect system prompt",
      "Belief System Builder prompt",
      "Perfect Webinar Script Generator prompt",
      "3 real case studies: life coach, ceramic artist, e-commerce consultant",
      "5-day quickstart checklist",
    ],
    relatedSlugs: ["ai-marketing-architect", "ai-story-architect"],
  },
  {
    id: "traffic-architect",
    slug: "ai-traffic-architect",
    vol: 3,
    title: "AI Traffic Architect",
    subtitle: "Traffic Secrets Automated with AI",
    tagline: "Stop chasing traffic. Build a system that finds your customers where they already are.",
    shortDescription:
      "Apply Russell Brunson's Traffic Secrets with AI — from Dream Customer avatar creation and Dream 100 list building to platform-specific content strategies.",
    framework: "Traffic Secrets",
    sourceBook: "Russell Brunson",
    icon: "📝",
    color: "from-green-500/20 to-teal-500/20",
    envKey: "NEXT_PUBLIC_LS_PRODUCT_3_URL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_VOL3",
    highlights: [
      "Dream Customer Avatar AI generation",
      "Dream 100 Strategy — 60-day roadmap",
      "Platform-Specific Content (Instagram, YouTube, Google)",
      "Follow-Up Funnel automation",
    ],
    caseStudy: {
      result: "SaaS startup: 30 → 250 leads/month, CPA dropped 87%",
      detail: "AI-designed multi-channel traffic strategy cut cost per acquisition from $125 to $16.",
    },
    frameworks: [
      "Dream Customer Avatar: AI analyzes demographic and behavioral data to build a complete customer profile",
      "Dream 100 Strategy: AI identifies 100 places your dream customers congregate and builds 60-day plan",
      "Platform-Specific Content: AI generates Hook-Story-Offer sets optimized for Instagram, YouTube, Google",
      "Work Your Way In / Buy Your Way In: Organic and paid strategies for your specific niche",
      "Follow-Up Funnel: AI builds email sequences that convert cold traffic into buyers",
    ],
    whatsInside: [
      "20-page premium PDF guide (A4 format)",
      "AI Traffic Architect system prompt",
      "Dream 100 Builder prompt",
      "Platform Strategy Generator prompt",
      "3 real case studies with traffic growth numbers",
      "12-month traffic growth ROI scenario",
      "5-day quickstart checklist",
    ],
    relatedSlugs: ["ai-marketing-architect", "ai-content-architect"],
  },
  {
    id: "story-architect",
    slug: "ai-story-architect",
    vol: 4,
    title: "AI Story Architect",
    subtitle: "Copywriting Secrets Automated with AI",
    tagline: "Every word you write is either winning or losing sales. AI fixes the ones that are losing.",
    shortDescription:
      "Apply Jim Edwards' 31 Copywriting Secrets with AI — from personal story mining and Hero's Journey structuring to headline generation and platform-specific copy.",
    framework: "Copywriting Secrets",
    sourceBook: "Jim Edwards",
    icon: "🧠",
    color: "from-orange-500/20 to-red-500/20",
    envKey: "NEXT_PUBLIC_LS_PRODUCT_4_URL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_VOL4",
    highlights: [
      "Personal Story Mining — 5-step process",
      "Hero's Journey Story Formula",
      "Headline Arsenal — 3 formula categories",
      "FRED Targeting for high-conversion copy",
    ],
    caseStudy: {
      result: "Handmade jam brand: 1.2% → 6.8% conversion rate",
      detail: "Story-based copywriting applied across email, landing pages, and social ads.",
    },
    frameworks: [
      "Personal Story Mining: 5-step process for finding emotional turning points AI transforms into sales narratives",
      "The Hero's Journey Formula: 7-step structure — AI designs the complete narrative arc for your business",
      "The 10 Buying Motivators: AI identifies which core motivators drive your audience, then optimizes copy",
      "Headline Arsenal: AI generates headlines across Curiosity, Benefit, and Problem-Solution categories",
      "Platform-Specific Copy: Hook → Story → Value → CTA adapted for email, landing pages, social, and ads",
    ],
    whatsInside: [
      "20-page premium PDF guide (A4 format)",
      "AI Story Architect system prompt",
      "Personal Story Extractor prompt",
      "Headline Generator prompt (3 formula categories)",
      "3 real case studies: life coach (email open rate 15% → 52%), jam brand, coding bootcamp",
      "Copy ROI scenarios across 5 channel types",
      "5-day quickstart checklist",
    ],
    relatedSlugs: ["ai-brand-architect", "ai-content-architect"],
    isBestseller: true,
  },
  {
    id: "startup-architect",
    slug: "ai-startup-architect",
    vol: 5,
    title: "AI Startup Architect",
    subtitle: "Product Launch Formula Automated with AI",
    tagline: "Launch any product with a proven sequence — not guesswork, not luck.",
    shortDescription:
      "Apply Jeff Walker's Product Launch Formula with AI — from the 3-part Prelaunch Content sequence and 7-day launch email series to post-launch analysis and evergreen funnel design.",
    framework: "Product Launch Formula",
    sourceBook: "Jeff Walker",
    icon: "⚙️",
    color: "from-cyan-500/20 to-blue-500/20",
    envKey: "NEXT_PUBLIC_LS_PRODUCT_5_URL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_VOL5",
    highlights: [
      "PLF 4-Phase Structure automated",
      "9 Mental Triggers embedded by AI",
      "7-Day Launch Email Sequence",
      "3 Launch Types (Seed, Internal, JV)",
    ],
    caseStudy: {
      result: "Food blogger: $210 first month → $3,700 in 3 days",
      detail: "PLF Seed Launch strategy with AI-generated content for every step of the sequence.",
    },
    frameworks: [
      "PLF 4-Phase Structure: AI auto-designs Pre-Prelaunch, PLC sequence, Launch, and Post-Launch",
      "9 Mental Triggers: AI embeds Authority, Reciprocity, Scarcity, Social Proof naturally into content",
      "The Sideways Sales Letter: AI generates your complete 3-part Prelaunch Content sequence",
      "7-Day Launch Email Sequence: AI writes every email from Cart Open through Final Close",
      "3 Launch Types: Seed Launch (50-200), Internal Launch (1,000-5,000), JV Launch (10,000+)",
    ],
    whatsInside: [
      "20-page premium PDF guide (A4 format)",
      "AI Startup Architect system prompt",
      "Prelaunch Content Generator prompt (3-part PLC sequence)",
      "Launch Email Sequence Generator prompt (7-day series)",
      "3 real case studies: food blogger, AI SaaS ($32K ARR month 1), real estate ($92K in 7 days)",
      "12-month PLF growth cycle scenario",
      "5-day quickstart checklist",
    ],
    relatedSlugs: ["ai-marketing-architect", "ai-brand-architect"],
  },
  {
    id: "content-architect",
    slug: "ai-content-architect",
    vol: 6,
    title: "AI Content Architect",
    subtitle: "Online Writing Strategies Automated with AI",
    tagline: "More content. Less time. An audience that grows while you sleep.",
    shortDescription:
      "Apply Nicolas Cole's online writing framework with AI — from category design and infinite idea generation to content atomization across 5 platforms and a monetization pipeline.",
    framework: "The Art and Business of Online Writing",
    sourceBook: "Nicolas Cole",
    icon: "✏️",
    color: "from-violet-500/20 to-purple-500/20",
    envKey: "NEXT_PUBLIC_LS_PRODUCT_6_URL",
    paddlePriceEnvKey: "PADDLE_PRICE_ID_VOL6",
    highlights: [
      "Category Design — become the obvious leader",
      "Infinite Ideas Matrix — 20 ideas from 1 topic",
      "Content Atomization — 1 article → 5 platforms",
      "Monetization Pipeline — free content → paid revenue",
    ],
    caseStudy: {
      result: "Newsletter writer: 0 → 2,400 subscribers in 90 days, $1,400/month",
      detail: "Nicolas Cole's framework applied with AI while working full-time — published 3x/week.",
    },
    frameworks: [
      "Category Design: AI analyzes your niche and designs a new category that makes you the obvious leader",
      "The 4 Content Types: Actionable, Educational, Aspirational, Entertaining — AI transforms any topic into all 4",
      "The 1-3-1 Structure: The format validated across hundreds of millions of views — AI applies it automatically",
      "Infinite Ideas Matrix: 4 types x 5 angles = 20 ideas per topic, 30-day calendar in one session",
      "Content Atomization: AI converts one article into Twitter thread, LinkedIn post, Instagram carousel, newsletter, YouTube Shorts",
    ],
    whatsInside: [
      "20-page premium PDF guide (A4 format)",
      "AI Content Architect system prompt",
      "Infinite Ideas Matrix Generator prompt",
      "Headline Optimizer prompt (4 formula categories, 12 headlines per topic)",
      "Content Atomizer prompt (1 article → 5 platforms)",
      "4 real case studies: newsletter writer, startup team (5x traffic), coding instructor ($600 → $6,000/month)",
      "12-month newsletter monetization ROI scenario",
      "5-day quickstart checklist",
    ],
    relatedSlugs: ["ai-story-architect", "ai-traffic-architect"],
    isNew: true,
  },
];

export const bundle: Bundle = {
  title: "AI Native Playbook Series — Complete Bundle",
  subtitle: "All 6 Books + Bonuses",
  price: 47,
  originalPrice: 102,
  discount: 54,
  envKey: "NEXT_PUBLIC_LS_BUNDLE_URL",
};

/** Bundle Paddle Price ID 환경변수 키 */
export const BUNDLE_PADDLE_PRICE_ENV_KEY = "PADDLE_PRICE_ID_BUNDLE";

export function getBundleUrl(): string {
  const base = process.env.NEXT_PUBLIC_LS_BUNDLE_URL ?? "#";
  if (base === "#") return "#";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com";
  const redirect = encodeURIComponent(
    `${siteUrl}/thank-you?product=Complete+Bundle`
  );
  return `${base}?checkout[custom][redirect_url]=${redirect}`;
}

export function getProductUrl(envKey: string): string {
  const base =
    (process.env[envKey as keyof typeof process.env] as string | undefined) ??
    "#";
  if (base === "#") return "#";
  const book = books.find((b) => b.envKey === envKey);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com";
  const productName = encodeURIComponent(book?.title ?? "AI Native Playbook");
  const redirect = encodeURIComponent(
    `${siteUrl}/thank-you?product=${productName}`
  );
  return `${base}?checkout[custom][redirect_url]=${redirect}`;
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

// ─────────────────────────────────────────
// Paddle 헬퍼: Price ID 조회
// ─────────────────────────────────────────

/**
 * 번들 Paddle Price ID를 환경변수에서 반환.
 * 미설정 시 undefined 반환 → BuyButton이 "#" 처리
 */
export function getBundlePaddlePriceId(): string | undefined {
  return process.env[BUNDLE_PADDLE_PRICE_ENV_KEY] as string | undefined;
}

/**
 * 책 paddlePriceEnvKey 기준으로 Paddle Price ID를 환경변수에서 반환.
 */
export function getBookPaddlePriceId(paddlePriceEnvKey: string): string | undefined {
  return process.env[paddlePriceEnvKey] as string | undefined;
}
