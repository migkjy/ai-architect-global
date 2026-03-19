import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function checkAuth(req: NextRequest): boolean {
  const apiKey = req.headers.get("x-api-key");
  return apiKey === process.env.BLOG_API_KEY;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      slug,
      title,
      description,
      date,
      category,
      tags,
      locale,
      content,
      published,
      scheduledAt,
    } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "slug, title, content are required" },
        { status: 400 }
      );
    }

    // slug 검증: 영문 소문자, 숫자, 하이픈만 허용
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    const filePath = path.join(BLOG_DIR, `${slug}.md`);

    // 중복 slug 방지
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `Post with slug '${slug}' already exists` },
        { status: 409 }
      );
    }

    // scheduledAt 유효성 검증
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return NextResponse.json(
          { error: "Invalid scheduledAt format. Use ISO 8601." },
          { status: 400 }
        );
      }
    }

    // frontmatter 구성
    const frontmatter: Record<string, unknown> = {
      title,
      description: description || "",
      date: date || new Date().toISOString().split("T")[0],
      category: category || "General",
      tags: tags || [],
    };
    if (locale) frontmatter.locale = locale;
    if (published === false) frontmatter.published = false;
    if (scheduledAt) frontmatter.scheduledAt = scheduledAt;

    // YAML frontmatter 생성
    const yamlLines = Object.entries(frontmatter).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${(value as string[]).map((v) => `"${v}"`).join(", ")}]`;
      }
      if (typeof value === "boolean") return `${key}: ${value}`;
      return `${key}: "${value}"`;
    });

    const fileContent = `---\n${yamlLines.join("\n")}\n---\n\n${content}\n`;

    // 디렉토리 보장
    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    fs.writeFileSync(filePath, fileContent, "utf-8");

    // ISR 재검증 트리거
    revalidatePath("/en/blog");
    revalidatePath("/ko/blog");
    revalidatePath("/ja/blog");

    return NextResponse.json(
      {
        slug,
        created: true,
        published:
          published !== false &&
          (!scheduledAt || new Date(scheduledAt).getTime() <= Date.now()),
        scheduledAt: scheduledAt || null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[api/blog/posts] POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 내부용: 모든 포스트 (hidden 포함) 목록 반환
  const files = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
    : [];

  const matter = (await import("gray-matter")).default;

  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title ?? "",
      published: data.published !== false,
      scheduledAt: data.scheduledAt || null,
      date: data.date ?? "",
      locale: data.locale ?? "en",
    };
  });

  return NextResponse.json({ posts, total: posts.length });
}
