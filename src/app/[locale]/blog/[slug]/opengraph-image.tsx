import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const alt = "AI Native Playbook Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title || slug.replace(/-/g, " ");
  const category = post?.category || "Blog";
  const readTime = post?.readingTime || "";

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
        {/* Top accent bar */}
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

        {/* Category badge + reading time */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(226,183,20,0.15)",
              border: "1px solid rgba(226,183,20,0.4)",
              color: "#e2b714",
              fontSize: "14px",
              fontWeight: "700",
              padding: "6px 18px",
              borderRadius: "100px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
          {readTime ? (
            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {readTime}
            </div>
          ) : null}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "36px" : "44px",
            fontWeight: "800",
            color: "#f1f5f9",
            lineHeight: 1.25,
            marginBottom: "24px",
            maxWidth: "950px",
          }}
        >
          {title}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "80px",
            right: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#e2b714",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            AI NATIVE PLAYBOOK
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            ai-native-playbook.com/blog
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
