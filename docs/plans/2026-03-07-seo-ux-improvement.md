# ai-native-playbook.com SEO/UX Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Increase organic traffic to ai-native-playbook.com by adding multilingual blog content, improving internal linking, and optimizing performance.

**Architecture:** Add 3 new SEO-optimized blog posts (en/ko/ja topics), add a "Latest from Blog" section to the landing page linking blog to products, strengthen blog-to-product CTAs, and optimize font loading + critical CSS.

**Tech Stack:** Next.js 16, next-intl, Tailwind CSS, gray-matter, react-markdown

---

## Current State Analysis

- Blog system: EXISTS (9 posts, markdown in content/blog/, /blog route with JSON-LD)
- FAQ: EXISTS (9 questions with FAQPage JSON-LD on landing page)
- Footer links: EXISTS (books, info, related services sections)
- Header nav: EXISTS (All Books, Bundle, Blog, About)
- Performance: Font preload EXISTS (Pretendard via CDN), preconnect EXISTS
- Missing: Landing page has NO blog section. Blog posts lack product CTAs.

## Tasks

### Task 1: Add 3 SEO Blog Posts (en, ko, ja focused)

**Files:**
- Create: `content/blog/ai-marketing-strategy-2026.md`
- Create: `content/blog/ai-business-framework-korean-guide.md`
- Create: `content/blog/ai-startup-automation-japanese-guide.md`

**Step 1: Create English blog post — "How to Create an AI Marketing Strategy in 2026"**

Create `content/blog/ai-marketing-strategy-2026.md` with frontmatter:

```markdown
---
title: "How to Create an AI Marketing Strategy in 2026 — A Step-by-Step Framework"
description: "Learn how to build a complete AI marketing strategy using proven frameworks from Russell Brunson and Jeff Walker. Practical steps for entrepreneurs and small business owners."
date: "2026-03-07"
tags: ["AI marketing strategy", "AI marketing 2026", "marketing automation", "AI business framework", "Russell Brunson AI", "digital marketing AI"]
---
```

Content: ~1,200 words covering:
1. Why traditional marketing strategies fail in 2026
2. The AI Marketing Framework (5 steps)
3. How to use AI tools (Claude, ChatGPT) with proven frameworks
4. Real implementation: Value Ladder + AI
5. CTA linking to AI Marketing Architect product

**Step 2: Create Korean blog post — "AI 비즈니스 프레임워크 완전 가이드"**

Create `content/blog/ai-business-framework-korean-guide.md` with frontmatter:

```markdown
---
title: "AI 비즈니스 프레임워크 완전 가이드 2026 — 러셀 브런슨부터 제프 워커까지"
description: "AI를 활용한 비즈니스 프레임워크 실전 가이드. DotCom Secrets, Product Launch Formula을 AI로 자동화하는 방법을 단계별로 설명합니다."
date: "2026-03-07"
tags: ["AI 비즈니스", "AI 마케팅", "러셀 브런슨", "제프 워커", "비즈니스 프레임워크", "AI 자동화"]
---
```

Content: ~1,200 words in Korean covering:
1. AI 시대의 비즈니스 프레임워크가 중요한 이유
2. 6가지 핵심 프레임워크 소개
3. AI + 프레임워크 실전 적용법
4. 성공 사례
5. CTA to bundle page

**Step 3: Create Japanese blog post — "AIスタートアップ自動化ガイド"**

Create `content/blog/ai-startup-automation-japanese-guide.md` with frontmatter:

```markdown
---
title: "2026年 AIスタートアップ自動化ガイド — ビジネスフレームワークをAIで実行する方法"
description: "Russell BrunsonやJeff Walkerのフレームワークをaiで自動化する実践ガイド。起業家のためのステップバイステップ解説。"
date: "2026-03-07"
tags: ["AI スタートアップ", "AI マーケティング", "ビジネス自動化", "AI フレームワーク", "起業家 AI"]
---
```

Content: ~1,200 words in Japanese covering:
1. なぜ2026年にAIビジネスフレームワークが必要か
2. 6つのフレームワーク概要
3. AI実装の具体的手順
4. 成功事例
5. CTA to products page

**Step 4: Commit**

```bash
git add content/blog/ai-marketing-strategy-2026.md content/blog/ai-business-framework-korean-guide.md content/blog/ai-startup-automation-japanese-guide.md
git commit -m "feat: add 3 SEO blog posts (en/ko/ja) for traffic growth"
```

### Task 2: Add "Latest from Blog" Section to Landing Page

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Add blog section between Testimonials and Bundle CTA**

Import `getAllPosts` from `@/lib/blog` and add a section showing the 3 latest posts with:
- Section title: "Latest from the Blog"
- 3 post cards (title, description, date, reading time, tags)
- "View all articles" link to /blog
- Each card links to `/blog/[slug]`

The section should go between the Testimonials section and the "Choose Your Path" pricing section.

```tsx
// Add import at top
import { getAllPosts } from "@/lib/blog";

// Inside the component, before the return:
const latestPosts = getAllPosts().slice(0, 3);

// Section JSX (between Testimonials and Bundle CTA):
{/* Latest Blog Posts */}
<section className="py-20">
  <div className="max-w-5xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from the Blog</h2>
      <p className="text-text-secondary">AI strategies, frameworks, and case studies for entrepreneurs.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {latestPosts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group bg-surface/60 border border-white/5 rounded-2xl p-6 hover:border-gold/20 transition-all card-glow"
        >
          <div className="text-xs text-text-muted mb-3">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</time>
            <span className="mx-2">·</span>
            <span>{post.readingTime}</span>
          </div>
          <h3 className="font-bold text-text-primary mb-2 group-hover:text-gold transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-sm text-text-secondary line-clamp-3">{post.description}</p>
        </Link>
      ))}
    </div>
    <div className="text-center mt-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold"
      >
        View all articles
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: add latest blog posts section to landing page"
```

### Task 3: Add Product CTA to Blog Post Pages

**Files:**
- Modify: `src/app/[locale]/blog/[slug]/page.tsx`

**Step 1: Add product CTA banner after article content, before newsletter text**

Between the article closing tag and the newsletter text div, add a product CTA:

```tsx
{/* Product CTA */}
<div className="mt-12 p-6 bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl">
  <h3 className="text-lg font-bold mb-2">Ready to Execute These Frameworks with AI?</h3>
  <p className="text-text-secondary text-sm mb-4">
    The AI Native Playbook Series gives you ready-to-use system prompts that turn these strategies into actionable AI workflows for your business.
  </p>
  <div className="flex flex-col sm:flex-row gap-3">
    <Link
      href="/bundle"
      className="inline-flex items-center justify-center px-6 py-3 bg-gold text-navy-dark rounded-xl font-bold text-sm hover:bg-gold-light transition-colors"
    >
      Get All 6 Books — $47
    </Link>
    <Link
      href="/products"
      className="inline-flex items-center justify-center px-6 py-3 border border-white/10 rounded-xl font-semibold text-sm text-text-secondary hover:border-gold/30 hover:text-gold transition-all"
    >
      View Individual Books
    </Link>
  </div>
</div>
```

**Step 2: Commit**

```bash
git add src/app/[locale]/blog/[slug]/page.tsx
git commit -m "feat: add product CTA banner to blog post pages"
```

### Task 4: Add Blog Link to Product Pages (Cross-linking)

**Files:**
- Modify: `src/app/[locale]/products/[slug]/page.tsx`

**Step 1: Read current product detail page to understand structure**

Read the file first, then add a "Related Articles" section at the bottom showing 2-3 blog posts that match by tags.

Import `getAllPosts` from `@/lib/blog` and add a related articles section before the closing of the page component.

**Step 2: Commit**

```bash
git add src/app/[locale]/products/[slug]/page.tsx
git commit -m "feat: add related blog articles to product pages"
```

### Task 5: Build and Verify

**Step 1: Run build**

```bash
cd /Users/nbs22/(Claude)/(claude).projects/business-builder/projects/ai-architect-global
npm run build
```

Expected: Build succeeds with no errors.

**Step 2: Fix any build errors**

If build fails, fix TypeScript/import errors and rebuild.

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors"
```

### Task 6: Push and Create PR

**Step 1: Push to main**

```bash
git push origin main
```

**Step 2: Create PR to production**

```bash
gh pr create --base production --head main --title "feat: SEO/UX improvements — blog posts, internal links, product CTAs" --body "$(cat <<'EOF'
## Summary
- Add 3 new SEO blog posts (en/ko/ja) targeting long-tail keywords
- Add "Latest from Blog" section to landing page
- Add product CTA banners to all blog post pages
- Add related blog articles to product detail pages
- Strengthens internal linking for SEO crawlability

## Changes
- 3 new markdown blog posts in content/blog/
- Landing page: new blog section between testimonials and pricing
- Blog [slug]: product CTA after article content
- Products [slug]: related articles section

## Test plan
- [ ] Build passes (`npm run build`)
- [ ] Landing page shows latest 3 blog posts
- [ ] Blog posts show product CTA banner
- [ ] Product pages show related articles
- [ ] All new blog posts render correctly at /blog/[slug]
- [ ] Sitemap includes new blog post URLs

Generated with Claude Code
EOF
)"
```

**Step 3: Report PR URL**
