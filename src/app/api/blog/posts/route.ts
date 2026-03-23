import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

/**
 * GitHub Contents API로 블로그 markdown 파일을 커밋한다.
 * GITHUB_TOKEN이 없으면 호출하지 않는다 (로컬 fallback).
 * 중복 slug는 CONFLICT 에러를 던진다.
 */
async function commitToGitHub(slug: string, content: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN!;
  const repo = process.env.GITHUB_REPO || "migkjy/ai-architect-global";
  const branch = process.env.GITHUB_BLOG_BRANCH || "main";
  const filePath = `content/blog/${slug}.md`;
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

  // 중복 체크: GET으로 파일 존재 여부 확인
  const checkRes = await fetch(`${url}?ref=${branch}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (checkRes.ok) {
    throw new Error("CONFLICT");
  }

  // PUT으로 파일 커밋
  const putRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `blog: add ${slug}`,
      content: Buffer.from(content).toString("base64"),
      branch,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub API error ${putRes.status}: ${err}`);
  }
}

/** 로컬 fs에 블로그 파일을 저장한다 (개발 환경 fallback). */
function saveToLocalFs(slug: string, fileContent: string): void {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);

  if (fs.existsSync(filePath)) {
    throw new Error("CONFLICT");
  }

  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, fileContent, "utf-8");
}

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

    // 영속성: GITHUB_TOKEN 있으면 GitHub API, 없으면 로컬 fs
    const useGitHub = !!process.env.GITHUB_TOKEN;

    try {
      if (useGitHub) {
        await commitToGitHub(slug, fileContent);
      } else {
        saveToLocalFs(slug, fileContent);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "CONFLICT") {
        return NextResponse.json(
          { error: `Post with slug '${slug}' already exists` },
          { status: 409 }
        );
      }
      throw err;
    }

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
