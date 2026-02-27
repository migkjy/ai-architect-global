import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INDEXNOW_KEY = "aiarchitectglobal2026indexnow";
const INDEXNOW_HOST = "ai-architect.io";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// GET: 모든 블로그 포스트 URL을 IndexNow에 일괄 제출 (en locale 기준)
export async function GET() {
  const blogDir = path.join(process.cwd(), "content/blog");

  let slugs: string[] = [];
  if (fs.existsSync(blogDir)) {
    slugs = fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(".md", ""));
  }

  const urls = [
    `https://${INDEXNOW_HOST}`,
    `https://${INDEXNOW_HOST}/en/blog`,
    ...slugs.map((slug) => `https://${INDEXNOW_HOST}/en/blog/${slug}`),
  ];

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: INDEXNOW_HOST, key: INDEXNOW_KEY, urlList: urls }),
  });

  return NextResponse.json({ submitted: urls.length, status: res.status });
}
