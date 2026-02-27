import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <Link href="/blog" className="text-gold hover:underline text-sm">← Back to Blog</Link>
      </div>
      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
            <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-text-secondary">{post.description}</p>
        </header>
        <div className="prose prose-invert prose-gold max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
      <div className="mt-16 pt-8 border-t border-white/10 text-center">
        <p className="text-text-secondary mb-4">Ready to apply AI to your business?</p>
        <Link href="/bundle" className="inline-block bg-gold text-navy-dark px-6 py-3 rounded-lg hover:bg-gold-light transition-colors font-bold">
          Get the AI Architect Series →
        </Link>
      </div>
    </main>
  );
}
