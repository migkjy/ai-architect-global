import { describe, it, expect, afterEach, vi, beforeEach } from "vitest";
import fs from "fs";
import path from "path";

const TEST_API_KEY = "test-key-for-unit-tests";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const TEST_SLUG = "test-scheduled-post-unit";
const TEST_FILE = path.join(BLOG_DIR, `${TEST_SLUG}.md`);

// next/cache mock: revalidatePath는 런타임(Vercel)에서만 동작하므로 테스트에서 mock
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("/api/blog/posts", () => {
  beforeEach(() => {
    // 각 테스트 전에 env 설정
    vi.stubEnv("BLOG_API_KEY", TEST_API_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    // 테스트 파일 정리
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE);
    }
  });

  it("인증 없이 요청 시 401", async () => {
    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: TEST_SLUG, title: "Test", content: "body" }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(401);
  });

  it("slug 필수 필드 누락 시 400", async () => {
    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({ title: "Test", content: "body" }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(400);
  });

  it("유효한 scheduledAt으로 파일 생성", async () => {
    const { POST } = await import("@/app/api/blog/posts/route");
    const scheduledAt = "2026-12-25T00:00:00Z";
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({
        slug: TEST_SLUG,
        title: "Test Scheduled Post",
        content: "Test body content",
        scheduledAt,
      }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.slug).toBe(TEST_SLUG);
    expect(body.created).toBe(true);
    expect(body.published).toBe(false); // 미래 예약이므로 아직 미공개
    expect(body.scheduledAt).toBe(scheduledAt);

    // 파일 존재 + frontmatter 확인
    expect(fs.existsSync(TEST_FILE)).toBe(true);
    const raw = fs.readFileSync(TEST_FILE, "utf-8");
    expect(raw).toContain(`scheduledAt: "${scheduledAt}"`);
  });

  it("잘못된 scheduledAt 형식 → 400", async () => {
    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({
        slug: TEST_SLUG,
        title: "Test",
        content: "body",
        scheduledAt: "not-a-date",
      }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(400);
  });

  it("slug에 대문자 포함 시 400", async () => {
    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({
        slug: "Invalid-Slug-With-Capital",
        title: "Test",
        content: "body",
      }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(400);
  });

  it("GET 인증 없이 요청 시 401", async () => {
    const { GET } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "GET",
    });
    const res = await GET(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(401);
  });

  it("GET 인증 성공 시 posts 목록 반환", async () => {
    const { GET } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "GET",
      headers: { "x-api-key": TEST_API_KEY },
    });
    const res = await GET(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.posts)).toBe(true);
    expect(typeof body.total).toBe("number");
  });
});
