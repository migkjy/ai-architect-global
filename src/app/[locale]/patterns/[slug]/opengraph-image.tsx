import { ImageResponse } from "next/og";
import { getPatternBySlug } from "@/lib/patterns";

export const runtime = "edge";
export const alt = "AI Business Framework Pattern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PALETTE = [
  { primary: "#3b82f6", accent: "#1d4ed8", bg: "#0a1628" }, // blue
  { primary: "#8b5cf6", accent: "#6d28d9", bg: "#120a28" }, // violet
  { primary: "#06b6d4", accent: "#0891b2", bg: "#061a1e" }, // cyan
  { primary: "#f59e0b", accent: "#d97706", bg: "#1a150a" }, // amber
  { primary: "#10b981", accent: "#059669", bg: "#061a14" }, // emerald
  { primary: "#ef4444", accent: "#dc2626", bg: "#1a0a0a" }, // red
  { primary: "#ec4899", accent: "#db2777", bg: "#1a0a14" }, // pink
  { primary: "#14b8a6", accent: "#0d9488", bg: "#0a1a18" }, // teal
];

function slugToColor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = ((hash % PALETTE.length) + PALETTE.length) % PALETTE.length;
  return PALETTE[idx];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  const title = pattern?.title || slug.replace(/-/g, " ");
  const subtitle = pattern?.subtitle || "";
  const { primary, bg, accent } = slugToColor(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, #060a14 0%, ${bg} 50%, #060a14 100%)`,
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
            background: `linear-gradient(90deg, ${accent}, ${primary}, ${accent})`,
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
              background: `${primary}18`,
              border: `1px solid ${primary}50`,
              color: primary,
              fontSize: "14px",
              fontWeight: "700",
              padding: "6px 16px",
              borderRadius: "100px",
              letterSpacing: "1px",
            }}
          >
            AI BUSINESS FRAMEWORK
          </div>
          <div
            style={{
              color: "#64748b",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            PATTERN
          </div>
        </div>
        <div
          style={{
            fontSize: title.length > 40 ? "36px" : "44px",
            fontWeight: "800",
            color: "#f1f5f9",
            lineHeight: 1.2,
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        {subtitle && (
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
        )}
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
              width: "40px",
              height: "3px",
              background: `linear-gradient(90deg, ${primary}, transparent)`,
            }}
          />
          <div
            style={{
              fontSize: "16px",
              color: primary,
              fontWeight: "600",
            }}
          >
            ai-native-playbook.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
