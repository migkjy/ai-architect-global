import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | AI Native Playbook Series",
  robots: {
    index: false,
    follow: false,
  },
};

// Static blog post data — hardcoded to avoid filesystem reads at root layout level
const featuredPosts = [
  {
    slug: "ai-marketing-strategy-2026",
    title: "How to Create an AI Marketing Strategy in 2026",
    description:
      "Build a complete AI marketing strategy using Russell Brunson and Jeff Walker frameworks. Actionable steps for entrepreneurs.",
    category: "AI Marketing",
  },
  {
    slug: "ai-business-blueprint-2026",
    title: "The Complete AI Business Blueprint for 2026",
    description:
      "A step-by-step guide to building AI-powered revenue streams. Automate content, customer acquisition, and sales.",
    category: "Business Strategy",
  },
  {
    slug: "ai-marketing-automation-guide",
    title: "AI Marketing Automation for Small Business",
    description:
      "Save 10 hours per week with practical AI marketing automation: email sequences, social media, and customer follow-up.",
    category: "AI Marketing",
  },
] as const;

const recommendedPages = [
  {
    href: "/pricing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    ),
    title: "Pricing & Plans",
    description:
      "Find the right AI Playbook for your business stage — from starter to full bundle.",
  },
  {
    href: "/products",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
    title: "Products",
    description:
      "6 AI Native Playbooks — each one turns a world-class business framework into AI-executable prompts.",
  },
  {
    href: "/free-guide",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    ),
    title: "Free Guide",
    description:
      "Get our free AI Business Starter guide — no credit card required.",
  },
  {
    href: "/blog",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
    ),
    title: "Blog",
    description:
      "Practical guides on AI business automation, marketing frameworks, and growth strategies.",
  },
] as const;

export default function NotFound() {
  const SITE_DOMAIN = "ai-native-playbook.com";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16 bg-navy">
      <div className="max-w-4xl w-full mx-auto">

        {/* Hero section */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <span className="text-9xl font-bold text-gold opacity-15 select-none" aria-hidden="true">404</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Page Not Found
          </h1>

          <div className="text-text-secondary mb-8 max-w-md mx-auto space-y-1">
            <p>The page you requested does not exist or has been moved.</p>
            <p className="text-sm opacity-75">
              <span className="text-text-secondary/50">KR</span>{" "}
              요청하신 페이지를 찾을 수 없습니다.
            </p>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-gold text-navy-dark px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all"
            >
              Back to Home
            </Link>
            <Link
              href="/pricing"
              className="border border-gold/30 text-gold px-6 py-3 rounded-xl font-semibold hover:bg-gold/5 hover:border-gold/50 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Conversion CTA — Free Guide */}
        <div className="rounded-2xl bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 p-8 text-center mb-14">
          <p className="text-xs font-semibold text-gold/70 uppercase tracking-widest mb-2">
            While You&apos;re Here
          </p>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Get Your Free AI Business Starter Guide
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            Join 1,800+ entrepreneurs already using our playbook to apply world-class business frameworks with AI — completely free, no credit card required.
          </p>
          <Link
            href="/free-guide"
            className="inline-flex items-center gap-2 bg-gold text-navy-dark px-7 py-3 rounded-xl font-bold text-sm hover:bg-gold-light transition-all"
          >
            Download the Free Guide
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </Link>
        </div>

        {/* Recommended pages */}
        <div className="mb-14">
          <h2 className="text-center text-sm font-semibold text-text-secondary uppercase tracking-widest mb-6">
            Recommended Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group flex flex-col gap-3 rounded-xl border border-gold/10 bg-navy-dark p-5 hover:border-gold/30 hover:bg-gold/5 transition-all card-glow"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gold">{page.icon}</span>
                  <svg
                    className="w-4 h-4 text-text-secondary/30 group-hover:text-gold/60 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-1 group-hover:text-gold transition-colors">
                    {page.title}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {page.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Search section */}
        <div className="mb-14">
          <h2 className="text-center text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">
            Search This Site
          </h2>
          <form
            action="https://www.google.com/search"
            method="get"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 max-w-lg mx-auto"
          >
            <input type="hidden" name="q" value={`site:${SITE_DOMAIN}`} />
            <div className="relative flex-1">
              <label htmlFor="site-search" className="sr-only">
                Search AI Native Playbook Series
              </label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50 pointer-events-none" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                id="site-search"
                type="text"
                name="q"
                placeholder="Search AI Native Playbook..."
                className="w-full rounded-xl border border-gold/20 bg-navy-dark pl-9 pr-3 py-3 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-navy-dark hover:bg-gold-light transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
          <p className="text-center text-xs text-text-secondary/40 mt-2">
            Opens Google search scoped to this site
          </p>
        </div>

        {/* Popular blog posts */}
        <div className="mb-14">
          <h2 className="text-center text-sm font-semibold text-text-secondary uppercase tracking-widest mb-6">
            Popular Content
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 rounded-xl border border-white/5 bg-navy-dark p-5 hover:border-gold/20 hover:bg-gold/5 transition-all card-glow"
              >
                <span className="text-xs font-medium text-gold/70 uppercase tracking-wide">
                  {post.category}
                </span>
                <p className="font-semibold text-text-primary text-sm leading-snug group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 flex-1">
                  {post.description}
                </p>
                <span className="text-xs text-gold/50 group-hover:text-gold/80 transition-colors mt-1 inline-flex items-center gap-1">
                  Read article
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Pricing CTA */}
        <div className="rounded-2xl border border-gold/15 bg-navy-dark p-8 text-center">
          <p className="text-xs font-semibold text-gold/70 uppercase tracking-widest mb-2">
            Ready to Get Started?
          </p>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Turn AI Into Your Business Advantage
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
            Choose the AI Playbook that fits your business — from solo entrepreneur to growing team. One-time purchase, lifetime access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gold text-navy-dark px-7 py-3 rounded-xl font-bold text-sm hover:bg-gold-light transition-all"
            >
              See Pricing & Plans
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/free-guide"
              className="inline-flex items-center gap-2 border border-gold/30 text-gold px-7 py-3 rounded-xl font-semibold text-sm hover:bg-gold/5 hover:border-gold/50 transition-all"
            >
              Or Start Free
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
