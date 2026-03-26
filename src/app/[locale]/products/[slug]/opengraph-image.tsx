import { ImageResponse } from "next/og";
import { getBookBySlug } from "@/lib/products";

export const runtime = "edge";
export const alt = "AI Native Playbook Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Per-product color themes — accent color + gradient stops */
const productThemes: Record<string, { accent: string; gradientFrom: string; gradientTo: string; badge: string }> = {
  "ai-marketing-architect": {
    accent: "#818cf8",        // indigo
    gradientFrom: "#3b82f6",  // blue-500
    gradientTo: "#a855f7",    // purple-500
    badge: "Vol. 1 — DotCom Secrets",
  },
  "ai-brand-architect": {
    accent: "#c084fc",        // purple
    gradientFrom: "#a855f7",  // purple-500
    gradientTo: "#ec4899",    // pink-500
    badge: "Vol. 2 — Expert Secrets",
  },
  "ai-traffic-architect": {
    accent: "#34d399",        // emerald
    gradientFrom: "#22c55e",  // green-500
    gradientTo: "#14b8a6",    // teal-500
    badge: "Vol. 3 — Traffic Secrets",
  },
  "ai-story-architect": {
    accent: "#fb923c",        // orange
    gradientFrom: "#f97316",  // orange-500
    gradientTo: "#ef4444",    // red-500
    badge: "Vol. 4 — Copywriting Secrets",
  },
  "ai-startup-architect": {
    accent: "#22d3ee",        // cyan
    gradientFrom: "#06b6d4",  // cyan-500
    gradientTo: "#3b82f6",    // blue-500
    badge: "Vol. 5 — Product Launch Formula",
  },
  "ai-content-architect": {
    accent: "#a78bfa",        // violet
    gradientFrom: "#8b5cf6",  // violet-500
    gradientTo: "#a855f7",    // purple-500
    badge: "Vol. 6 — Online Writing",
  },
};

const defaultTheme = {
  accent: "#e2b714",
  gradientFrom: "#e2b714",
  gradientTo: "#f0cc4a",
  badge: "AI Native Playbook",
};

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  const title = book?.title || slug.replace(/-/g, " ");
  const subtitle = book?.subtitle || "";
  const theme = productThemes[slug] || defaultTheme;
  const icon = book?.icon || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #060a14 0%, #0a0f1e 50%, #060a14 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar — product-specific gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: `linear-gradient(90deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
          }}
        />

        {/* Decorative glow — product color */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.gradientFrom}15, transparent 70%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.gradientTo}10, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 70px 40px 70px",
            flex: 1,
          }}
        >
          {/* Volume badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${theme.gradientFrom}25, ${theme.gradientTo}25)`,
                border: `1px solid ${theme.accent}40`,
                color: theme.accent,
                fontSize: "14px",
                fontWeight: "700",
                padding: "6px 16px",
                borderRadius: "100px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {theme.badge}
            </div>
          </div>

          {/* Product icon + Title */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "16px",
            }}
          >
            {icon && (
              <div
                style={{
                  fontSize: "52px",
                  lineHeight: 1,
                  display: "flex",
                }}
              >
                {icon}
              </div>
            )}
            <div
              style={{
                fontSize: "46px",
                fontWeight: "800",
                color: "#f1f5f9",
                lineHeight: 1.15,
                maxWidth: "850px",
                display: "flex",
              }}
            >
              {title}
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: "750px",
              marginBottom: "28px",
              display: "flex",
            }}
          >
            {subtitle}
          </div>

          {/* Price + Bundle badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                color: "#ffffff",
                fontSize: "22px",
                fontWeight: "800",
                padding: "10px 28px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
              }}
            >
              $17
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: "16px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
              }}
            >
              PDF Guide &middot; Instant Download
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 70px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#475569",
              fontWeight: "500",
              display: "flex",
            }}
          >
            Part of the Complete Bundle &middot; All 6 Books $47
          </div>
          <div
            style={{
              fontSize: "15px",
              color: theme.accent,
              fontWeight: "600",
              display: "flex",
            }}
          >
            ai-native-playbook.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
