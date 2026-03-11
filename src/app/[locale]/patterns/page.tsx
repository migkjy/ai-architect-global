import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { patterns } from "@/lib/patterns";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata(): Metadata {
  return {
    title: "AI Architecture Patterns | AI Native Playbook",
    description:
      "Proven business frameworks automated with AI. Value Ladder, Mass Movement, Dream 100, Story-Driven Copy, and Product Launch patterns.",
    openGraph: {
      title: "AI Architecture Patterns | AI Native Playbook",
      description: "5 proven business frameworks automated with AI.",
      url: `${BASE_URL}/patterns`,
      type: "website",
      images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: "AI Architecture Patterns" }],
    },
    alternates: {
      canonical: `${BASE_URL}/patterns`,
    },
  };
}

function escapeJsonLd(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export default async function PatternsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Architecture Patterns",
    description: "Proven business frameworks automated with AI",
    url: `${BASE_URL}/patterns`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: patterns.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Article",
          name: p.title,
          description: p.description,
          url: `${BASE_URL}/patterns/${p.slug}`,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(jsonLd) }}
      />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold">AI Architecture Patterns</h1>
        <p className="mb-10 text-lg text-gray-600">
          Proven business frameworks from bestselling authors — automated with
          AI. Each pattern gives you a step-by-step system you can implement
          immediately.
        </p>

        <div className="space-y-6">
          {patterns.map((p) => (
            <Link
              key={p.slug}
              href={`/patterns/${p.slug}`}
              className="group block rounded-xl border border-gray-200 p-6 transition hover:border-blue-300 hover:shadow-md"
            >
              <h2 className="mb-1 text-xl font-semibold group-hover:text-blue-600">
                {p.title}
              </h2>
              <p className="mb-2 text-sm text-gray-500">{p.subtitle}</p>
              <p className="mb-3 text-gray-600 line-clamp-2">
                {p.description}
              </p>
              <p className="text-xs text-gray-400">
                Based on <em>{p.sourceBook}</em> by {p.sourceAuthor}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
