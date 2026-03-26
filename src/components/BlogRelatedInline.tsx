import Link from "next/link";

interface RelatedPost {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
}

interface BlogRelatedInlineProps {
  posts: RelatedPost[];
  locale: string;
}

/**
 * Inline related-posts crosslink block for blog articles.
 * Rendered inside the article body (before midpoint CTA) to boost
 * internal linking, dwell time, and crawl depth.
 *
 * Shows up to 2 related posts in a compact card format.
 */
export default function BlogRelatedInline({
  posts,
  locale,
}: BlogRelatedInlineProps) {
  if (posts.length === 0) return null;

  const displayed = posts.slice(0, 2);

  return (
    <nav
      className="my-8 rounded-xl border border-white/10 bg-navy-light/40 p-5 not-prose"
      aria-label="Related reading"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
        Related Reading
      </p>
      <ul className="space-y-2.5">
        {displayed.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-white/5"
            >
              <span
                className="mt-0.5 shrink-0 w-6 h-6 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  className="w-3.5 h-3.5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-text-primary group-hover:text-gold transition-colors leading-snug">
                  {post.title}
                </span>
                <span className="block text-xs text-text-muted mt-0.5">
                  {post.category} · {post.readingTime}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
