/**
 * A/B Test CTA Configuration for AI Native Playbook
 *
 * Variant A = Control (current copy)
 * Variant B = Treatment (improved copy with urgency/specificity)
 */

export type CtaVariant = "A" | "B";

export const CTA_VARIANTS = {
  emailCapture: {
    A: {
      badge: "1,800+ subscribers",
      benefits: [
        "AI architecture trends & new templates",
        "3 ready-to-use system prompts weekly",
        "Exclusive subscriber discounts",
      ],
      buttonText: "Buy Now",
      footer: "Free \u00B7 No spam \u00B7 Unsubscribe anytime",
    },
    B: {
      badge: "Join 1,800+ AI builders",
      benefits: [
        "Weekly AI system architecture breakdowns",
        "3 production-ready prompts every week",
        "Early access to new playbooks & templates",
      ],
      buttonText: "Get Free AI Playbook Updates \u2192",
      footer: "100% free \u00B7 Zero spam \u00B7 Cancel anytime",
    },
  },
  scrollBanner: {
    A: {
      title: "AI Native Playbook Newsletter",
      badge: "1,800+ subscribers",
      cta: "Subscribe Free",
      success: "You're in! Check your email.",
      error: "Something went wrong. Try again.",
    },
    B: {
      title: "Get Weekly AI Architecture Insights",
      badge: "Trusted by 1,800+ builders",
      cta: "Join Free \u2192",
      success: "Welcome! Check your inbox.",
      error: "Something went wrong. Try again.",
    },
  },
  exitIntent: {
    A: {
      badge: "1,800+ subscribers",
      title: "Don\u2019t miss out!",
      subtitle: "Get weekly AI architecture insights & 3 ready-to-use prompts.",
      benefit1: "AI architecture trends & new templates",
      benefit2: "3 ready-to-use system prompts weekly",
      benefit3: "Exclusive subscriber discounts",
      cta: "Get Free Updates \u2192",
      noSpam: "Free \u00B7 No spam \u00B7 Unsubscribe anytime",
      dismiss: "No thanks, I\u2019ll skip the insights",
      successTitle: "You\u2019re in!",
      successDesc: "Check your email for a welcome message.",
    },
    B: {
      badge: "Join 1,800+ AI builders",
      title: "Wait \u2014 grab your free AI playbook updates",
      subtitle:
        "1,800+ builders already get weekly architecture breakdowns & production prompts.",
      benefit1: "Weekly AI system design deep-dives",
      benefit2: "3 production-ready prompts every week",
      benefit3: "Early access to new playbooks & tools",
      cta: "Yes, Send Me Updates \u2192",
      noSpam: "100% free \u00B7 Zero spam \u00B7 Cancel anytime",
      dismiss: "I\u2019ll pass on the free insights",
      successTitle: "Welcome aboard!",
      successDesc: "Your first insights are on the way.",
    },
  },
  freeGuide: {
    A: {
      heading: "Get Your Free Guide",
      subheading: "Instant access. No credit card required.",
      ctaButton: "Get Your Free Guide",
    },
    B: {
      heading: "Download Your Free AI Starter Kit",
      subheading: "Includes 3 ready-to-use system prompts + 5-day action plan.",
      ctaButton: "Get Your Free AI Framework + 3 System Prompts",
    },
  },
  pricingPage: {
    A: {
      bundleCta: "Get the Bundle — Save 54%",
      volumeCta: "Start with Volume 1",
      enterpriseCta: "Contact Us",
      bundleBadge: "BEST VALUE",
      popularBadge: "MOST POPULAR",
    },
    B: {
      bundleCta: "Unlock All 6 Frameworks — Save 54%",
      volumeCta: "Try Volume 1 — Just $17",
      enterpriseCta: "Get Custom Package",
      bundleBadge: "SAVE $55",
      popularBadge: "RECOMMENDED",
    },
  },
} as const;

const VARIANT_KEY = "ai_architect_cta_variant";

export function getCtaVariant(): CtaVariant {
  if (typeof window === "undefined") return "A";

  try {
    const stored = localStorage.getItem(VARIANT_KEY);
    if (stored === "A" || stored === "B") return stored;

    const variant: CtaVariant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem(VARIANT_KEY, variant);
    return variant;
  } catch {
    return new Date().getDate() % 2 === 0 ? "A" : "B";
  }
}
