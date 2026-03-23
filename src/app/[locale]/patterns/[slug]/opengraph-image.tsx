import { ImageResponse } from "next/og";
import { getPatternBySlug } from "@/lib/patterns";

export const runtime = "edge";
export const alt = "AI Native Playbook Pattern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  const title = pattern?.title || slug.replace(/-/g, " ");
  const subtitle = pattern?.subtitle || "";

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
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "rgba(226,183,20,0.1)",
              border: "1px solid rgba(226,183,20,0.3)",
              color: "#e2b714",
              fontSize: "14px",
              fontWeight: "700",
              padding: "6px 16px",
              borderRadius: "100px",
              letterSpacing: "1px",
            }}
          >
            AI NATIVE PLAYBOOK — PATTERN
          </div>
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
            fontSize: "22px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "800px",
          }}
        >
          {subtitle}
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
          ai-native-playbook.com
        </div>
      </div>
    ),
    { ...size }
  );
}
