# ai-architect-global /blog 섹션 추가 플랜

**날짜**: 2026-02-27
**목표**: 글로벌 SEO 트래픽 기반 마련 — /blog 목록 + /blog/[slug] 상세

## 기술 스택
- Next.js 16, TypeScript, Tailwind CSS v3
- 패키지 매니저: npm (pnpm 아님)
- 현재 없는 패키지: gray-matter, reading-time, react-markdown, remark-gfm, @tailwindcss/typography

---

## Task 1: 패키지 설치 + src/lib/blog.ts 유틸리티

```bash
npm install gray-matter reading-time react-markdown remark-gfm @tailwindcss/typography
```

**src/lib/blog.ts** 생성:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  content: string;
}

export function getAllPosts(): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      const stats = readingTime(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        readingTime: stats.text,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    tags: data.tags ?? [],
    readingTime: stats.text,
    content,
  };
}
```

완료 후:
```bash
npx tsc --noEmit  # 타입 체크
git add src/lib/blog.ts package.json package-lock.json
git commit -m "feat(blog): add gray-matter blog utility"
```

---

## Task 2: content/blog/ 초기 포스트 5편

`mkdir -p content/blog` 후 다음 5편 작성 (각 1200-1800자 영문):

### Post 1: ai-tools-for-small-business-2026.md
```markdown
---
title: "Best AI Tools for Small Business in 2026 — Complete Guide"
description: "ChatGPT, Claude, and other AI tools compared for small business owners. Practical guide to choosing and using AI to save time and grow revenue."
date: "2026-02-18"
tags: ["AI tools", "small business", "ChatGPT", "Claude", "productivity"]
---
```
내용: AI 도구 5개 비교 (ChatGPT, Claude, Midjourney, Notion AI, Zapier) + 선택 가이드

### Post 2: ai-marketing-automation-guide.md
```markdown
---
title: "AI Marketing Automation for Small Business — Save 10 Hours Per Week"
description: "Practical AI marketing automation strategies for small business owners. Email sequences, social media content, and customer follow-up on autopilot."
date: "2026-02-19"
tags: ["AI marketing", "marketing automation", "email marketing", "social media", "small business"]
---
```
내용: 이메일 자동화, SNS 일정, 고객 팔로업 자동화 실전 가이드

### Post 3: chatgpt-prompts-for-entrepreneurs.md
```markdown
---
title: "50 ChatGPT Prompts Every Entrepreneur Needs in 2026"
description: "Ready-to-use ChatGPT prompts for marketing copy, customer service, business planning, and content creation. Copy and customize for your business."
date: "2026-02-20"
tags: ["ChatGPT prompts", "entrepreneur", "business prompts", "AI copywriting", "productivity"]
---
```
내용: 카테고리별 프롬프트 50개 (마케팅, 고객응대, 기획, 콘텐츠)

### Post 4: russell-brunson-ai-framework.md
```markdown
---
title: "How to Use AI with Russell Brunson's DotCom Secrets Framework"
description: "Apply Russell Brunson's Value Ladder, Hook-Story-Offer, and Soap Opera Sequence using AI tools. Step-by-step guide for online entrepreneurs."
date: "2026-02-21"
tags: ["Russell Brunson", "DotCom Secrets", "AI funnel", "Value Ladder", "marketing"]
---
```
내용: DotCom Secrets 프레임워크 + AI 활용법 (제품 홍보용)

### Post 5: product-launch-formula-ai.md
```markdown
---
title: "Product Launch Formula with AI — Jeff Walker's PLF Automated"
description: "Use AI to execute Jeff Walker's Product Launch Formula. Automate your prelaunch content, email sequences, and post-launch follow-up."
date: "2026-02-22"
tags: ["Jeff Walker", "Product Launch Formula", "AI launch", "email sequence", "launch strategy"]
---
```
내용: PLF 4단계 + AI 자동화 방법 (제품 홍보용)

완료 후:
```bash
git add content/blog/
git commit -m "content(blog): add 5 initial English blog posts"
```

---

## Task 3: src/app/blog/page.tsx — 블로그 목록

`mkdir -p src/app/blog`

```tsx
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Business Blog | AI Native Playbook Series",
  description: "Practical AI tools, marketing automation, and business growth strategies for entrepreneurs and small business owners.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Business Blog</h1>
        <p className="text-lg text-gray-600">Practical AI strategies for entrepreneurs and small business owners</p>
      </div>
      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">{post.title}</Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
```

완료 후:
```bash
git add src/app/blog/page.tsx
git commit -m "feat(blog): add blog listing page"
```

---

## Task 4: src/app/blog/[slug]/page.tsx — 상세 페이지

`mkdir -p src/app/blog/[slug]`

ReactMarkdown + remark-gfm 사용.
`tailwind.config.ts`에 `@tailwindcss/typography` 플러그인 추가.

```tsx
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
        <Link href="/blog" className="text-blue-600 hover:underline text-sm">← Back to Blog</Link>
      </div>
      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <time>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-gray-600">{post.description}</p>
        </header>
        <div className="prose prose-gray max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>
      <div className="mt-16 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-600 mb-4">Ready to apply AI to your business?</p>
        <Link href="/bundle" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Get the AI Native Playbook Series →
        </Link>
      </div>
    </main>
  );
}
```

완료 후:
```bash
npm run build
git add src/app/blog/ tailwind.config.ts
git commit -m "feat(blog): add blog post detail page with ReactMarkdown"
```

---

## Task 5: sitemap.ts + Header 네비 + 최종 build + push

**src/app/sitemap.ts** 에 `/blog` 및 `/blog/{slug}` 추가:

기존 `sitemap.ts` 읽고 `/blog` 섹션 추가:
```typescript
// import { getAllPosts } from "@/lib/blog";
// getAllPosts()로 각 포스트 URL 추가
```

**src/components/Header.tsx** — 데스크탑/모바일 nav에 "Blog" 링크 추가:
```tsx
<Link href="/blog" className="...">Blog</Link>
```

```bash
npm run build  # 최종 확인
git add src/app/sitemap.ts src/components/Header.tsx
git commit -m "feat(blog): add blog to sitemap + header nav"
git pull --rebase origin main
git push origin main
```

---

## 완료 기준
- [ ] gray-matter + reading-time + react-markdown 설치
- [ ] src/lib/blog.ts 생성
- [ ] content/blog/ 5편 영문 포스트
- [ ] /blog 목록 페이지
- [ ] /blog/[slug] 상세 페이지 + ReactMarkdown
- [ ] sitemap.ts 업데이트
- [ ] Header nav "Blog" 추가
- [ ] npm run build 성공
- [ ] git push 완료
