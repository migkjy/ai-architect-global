import Link from "next/link";

interface BlogInlineCTAProps {
  locale?: string;
}

/**
 * Inline CTA banner for blog posts — Hook-Story-Offer principle.
 * Inserted at approximately the midpoint of blog post content.
 * Links to /free-guide page for email capture.
 */
export default function BlogInlineCTA({ locale = "en" }: BlogInlineCTAProps) {
  const freeGuideHref = locale === "en" ? "/free-guide" : `/${locale}/free-guide`;

  return (
    <div
      className="my-8 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/10 to-gold/5 p-6 not-prose"
      role="complementary"
      aria-label="Free guide offer"
    >
      {/* Hook */}
      <p className="text-base font-bold text-gold leading-snug mb-2">
        Stop reading about AI. Start running it.
      </p>

      {/* Story */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Most entrepreneurs spend hours researching AI strategies — then never implement them.
        This free guide gives you the exact system prompts and frameworks to put AI to work{" "}
        <em>today</em>.
      </p>

      {/* Offer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Link
          href={freeGuideHref}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-navy-dark transition-colors hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold/60"
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0-3-3m3 3 3-3m2 8H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
            />
          </svg>
          Get the Free AI Starter Guide
        </Link>
        <span className="text-xs text-text-muted">Free · No spam · Instant download</span>
      </div>
    </div>
  );
}
