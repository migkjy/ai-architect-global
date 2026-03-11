import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { patterns, getPatternBySlug } from "@/lib/patterns";
import { books } from "@/lib/products";

function escapeJsonLd(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    patterns.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) return {};

  const title = `${pattern.title} | AI Native Playbook`;
  const description = pattern.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/patterns/${slug}`,
      type: "article",
      siteName: "AI Native Playbook",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/patterns/${slug}`,
    },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const pattern = getPatternBySlug(slug);
  if (!pattern) notFound();

  const relatedBook = books.find((b) => b.slug === pattern.relatedBookSlug);
  const otherPatterns = patterns.filter((p) => p.slug !== slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pattern.title,
    description: pattern.description,
    url: `${BASE_URL}/patterns/${slug}`,
    author: {
      "@type": "Organization",
      name: "AI Native Playbook",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AI Native Playbook",
      url: BASE_URL,
    },
    about: {
      "@type": "Thing",
      name: `${pattern.sourceBook} by ${pattern.sourceAuthor}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "AI Native Playbook",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Patterns",
        item: `${BASE_URL}/patterns`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pattern.title,
        item: `${BASE_URL}/patterns/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(breadcrumbJsonLd) }}
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/patterns" className="hover:text-gray-700">
            Patterns
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{pattern.title}</span>
        </nav>

        <h1 className="mb-2 text-3xl font-bold">{pattern.title}</h1>
        <p className="mb-2 text-lg text-gray-500">{pattern.subtitle}</p>
        <p className="mb-4 text-sm text-gray-400">
          Based on <em>{pattern.sourceBook}</em> by {pattern.sourceAuthor}
        </p>
        <p className="mb-10 text-lg text-gray-600">{pattern.description}</p>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Key Steps</h2>
          <ol className="space-y-3">
            {pattern.keySteps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {i + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold">Use Cases</h2>
          <ul className="space-y-2">
            {pattern.useCases.map((uc, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-gray-600"
              >
                <span className="mt-1 text-green-500">&#10003;</span>
                {uc}
              </li>
            ))}
          </ul>
        </section>

        {relatedBook && (
          <section className="mb-12 rounded-xl border border-gray-200 p-6">
            <h2 className="mb-2 text-lg font-semibold">Related Playbook</h2>
            <Link
              href={`/products/${relatedBook.slug}`}
              className="group flex items-center gap-3 text-blue-600 hover:text-blue-800"
            >
              <span className="text-2xl">{relatedBook.icon}</span>
              <div>
                <p className="font-medium group-hover:underline">
                  {relatedBook.title}
                </p>
                <p className="text-sm text-gray-500">{relatedBook.subtitle}</p>
              </div>
            </Link>
          </section>
        )}

        <section>
          <h2 className="mb-6 text-xl font-semibold">
            Explore More Patterns
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherPatterns.map((p) => (
              <Link
                key={p.slug}
                href={`/patterns/${p.slug}`}
                className="rounded-lg border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <h3 className="font-medium">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <nav className="mt-12 pt-8 border-t border-gray-200" aria-label="Related pages">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/bundle" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Bundle Package</Link>
            <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">All Products</Link>
            <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">Blog</Link>
            <Link href="/faq" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">FAQ</Link>
          </div>
        </nav>
      </main>
    </>
  );
}
