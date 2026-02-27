import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "AI Business Blog | AI Architect Series",
  description: "Practical AI tools, marketing automation, and business growth strategies for entrepreneurs and small business owners.",
};

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts();
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Business Blog</h1>
        <p className="text-lg text-text-secondary">Practical AI strategies for entrepreneurs and small business owners</p>
      </div>
      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-white/10 rounded-xl p-6 hover:border-gold/40 transition-colors">
            <div className="flex items-center gap-3 text-sm text-text-secondary mb-3">
              <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-gold transition-colors">{post.title}</Link>
            </h2>
            <p className="text-text-secondary mb-4">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
