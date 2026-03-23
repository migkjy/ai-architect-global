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
    vi.stubEnv("BLOG_API_KEY", TEST_API_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    // 테스트 파일 정리
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE);
    }
  });

  // ── Validation tests (환경변수 무관) ──

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

  // ── Local (fs) mode: GITHUB_TOKEN 미설정 ──

  it("[로컬모드] 유효한 scheduledAt으로 파일 생성", async () => {
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
    expect(body.published).toBe(false);
    expect(body.scheduledAt).toBe(scheduledAt);

    // 파일 존재 + frontmatter 확인
    expect(fs.existsSync(TEST_FILE)).toBe(true);
    const raw = fs.readFileSync(TEST_FILE, "utf-8");
    expect(raw).toContain(`scheduledAt: "${scheduledAt}"`);
  });

  // ── GitHub mode: GITHUB_TOKEN 설정 ──

  it("[GitHub모드] 정상 커밋 시 201", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test_token_123");

    // Mock fetch: GET (중복체크) → 404, PUT (커밋) → 201
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(
      async (input: string | URL | globalThis.Request, init?: RequestInit) => {
        const url = typeof input === "string" ? input : input.toString();
        if (url.includes("/contents/") && (!init || init.method !== "PUT")) {
          return new Response("Not Found", { status: 404 });
        }
        if (init?.method === "PUT") {
          return new Response(JSON.stringify({ content: { sha: "abc123" } }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response("Not Found", { status: 404 });
      }
    );

    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({
        slug: "github-test-post",
        title: "GitHub Test",
        content: "Body via GitHub",
      }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.slug).toBe("github-test-post");
    expect(body.created).toBe(true);

    // fetch가 호출되었는지 확인 (GET 중복체크 + PUT 커밋)
    const ghCalls = fetchSpy.mock.calls.filter((call) => {
      const url = typeof call[0] === "string" ? call[0] : call[0].toString();
      return url.includes("api.github.com");
    });
    expect(ghCalls.length).toBe(2); // GET + PUT

    // fs 파일은 생성되지 않아야 함 (GitHub 모드)
    const testFile = path.join(BLOG_DIR, "github-test-post.md");
    expect(fs.existsSync(testFile)).toBe(false);
  });

  it("[GitHub모드] 중복 slug → 409", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test_token_123");

    // Mock fetch: GET → 200 (파일 이미 존재)
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => {
        return new Response(JSON.stringify({ sha: "existing" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    );

    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({
        slug: "duplicate-post",
        title: "Dup",
        content: "body",
      }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(409);
  });

  it("[GitHub모드] GitHub API 에러 시 500", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test_token_123");

    // Mock fetch: GET → 404 (없음), PUT → 500 (서버에러)
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async (_input: string | URL | globalThis.Request, init?: RequestInit) => {
        if (!init || init.method !== "PUT") {
          return new Response("Not Found", { status: 404 });
        }
        return new Response("Internal Server Error", { status: 500 });
      }
    );

    const { POST } = await import("@/app/api/blog/posts/route");
    const req = new Request("http://localhost/api/blog/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TEST_API_KEY,
      },
      body: JSON.stringify({
        slug: "error-post",
        title: "Error",
        content: "body",
      }),
    });
    const res = await POST(req as unknown as import("next/server").NextRequest);
    expect(res.status).toBe(500);
  });

  // ── GET tests (변경 없음) ──

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
