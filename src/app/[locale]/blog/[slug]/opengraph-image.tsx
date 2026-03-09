import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const alt = "AI Native Playbook Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string; locale: string } }) {
  const post = getPostBySlug(params.slug);
  const title = post?.title || params.slug.replace(/-/g, " ");
  const desc = post?.description || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #060a14 0%, #0a0f1e 50%, #060a14 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #e2b714, #f0cc4a, #e2b714)",
          }}
        />
        <div
          style={{
            color: "#e2b714",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "20px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          AI ARCHITECT SERIES — BLOG
        </div>
        <div
          style={{
            fontSize: "44px",
            fontWeight: "800",
            color: "#f1f5f9",
            lineHeight: 1.2,
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          {desc}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "16px",
            color: "#e2b714",
            fontWeight: "600",
          }}
        >
          ai-driven-architect.com
        </div>
      </div>
    ),
    { ...size }
  );
}
