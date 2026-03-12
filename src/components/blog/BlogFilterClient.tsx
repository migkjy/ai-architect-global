"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

type PostWithoutContent = Omit<BlogPost, "content">;

interface BlogFilterClientProps {
  posts: PostWithoutContent[];
  categories: string[];
  topTags: string[];
  activeCategory: string;
  activeTag: string;
  dateLocale: string;
}

export default function BlogFilterClient({
  posts,
  categories,
  topTags,
  activeCategory,
  activeTag,
  dateLocale,
}: BlogFilterClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      const qs = createQueryString({
        category: category === "All" ? null : category,
        tag: null,
      });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  };

  const handleTagToggle = (tag: string) => {
    startTransition(() => {
      const isActive = activeTag === tag;
      const qs = createQueryString({ tag: isActive ? null : tag });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    });
  };

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = !activeCategory || post.category === activeCategory;
    const tagMatch = !activeTag || post.tags.includes(activeTag);
    return categoryMatch && tagMatch;
  });

  const allCategories = ["All", ...categories];

  return (
    <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {/* Category filter */}
      <div className="mb-6" role="group" aria-label="Filter by category">
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const isActive = cat === "All" ? !activeCategory : activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                aria-pressed={isActive}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold text-navy-dark"
                    : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag filter */}
      {topTags.length > 0 && (
        <div className="mb-8" role="group" aria-label="Filter by tag">
          <p id="tag-filter-label" className="text-xs text-text-muted uppercase tracking-wider mb-3">Filter by tag</p>
          <div className="flex flex-wrap gap-2" aria-labelledby="tag-filter-label">
            {topTags.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  aria-pressed={isActive}
                  aria-label={isActive ? `Remove tag filter: ${tag}` : `Filter by tag: ${tag}`}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    isActive
                      ? "bg-gold/20 text-gold border border-gold/40"
                      : "bg-gold/5 text-text-secondary hover:bg-gold/10 hover:text-gold border border-white/5"
                  }`}
                >
                  {isActive ? `x ${tag}` : tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results count */}
      <p role="status" aria-live="polite" className="text-sm text-text-muted mb-6">
        {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
        {activeCategory ? ` in ${activeCategory}` : ""}
        {activeTag ? ` tagged "${activeTag}"` : ""}
      </p>

      {/* Post list */}
      <div className="grid gap-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            No articles found for the selected filters.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="border border-white/10 rounded-xl p-6 hover:border-gold/40 transition-colors group"
            >
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-3 flex-wrap">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(dateLocale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
                <span>&middot;</span>
                <button
                  onClick={() => handleCategoryChange(post.category)}
                  aria-pressed={activeCategory === post.category}
                  aria-label={`Filter by category: ${post.category}`}
                  className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full hover:bg-gold/20 transition-colors"
                >
                  {post.category}
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-gold transition-colors group-hover:text-gold/90"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-text-secondary mb-4 line-clamp-2">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    aria-pressed={activeTag === tag}
                    aria-label={activeTag === tag ? `Remove tag filter: ${tag}` : `Filter by tag: ${tag}`}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      activeTag === tag
                        ? "bg-gold/20 text-gold border border-gold/40"
                        : "bg-gold/5 text-gold/70 hover:bg-gold/10 hover:text-gold border border-white/5"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
