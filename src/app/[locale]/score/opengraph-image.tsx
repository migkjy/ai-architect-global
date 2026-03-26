import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Native Score — AI Readiness Assessment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Tier = "beginner" | "adopter" | "native";

interface TierStyle {
  label: string;
  color: string;
  bgAccent: string;
  borderAccent: string;
}

const tierStyles: Record<Tier, TierStyle> = {
  beginner: {
    label: "Beginner",
    color: "#fb923c",
    bgAccent: "rgba(251,146,60,0.12)",
    borderAccent: "rgba(251,146,60,0.35)",
  },
  adopter: {
    label: "Adopter",
    color: "#60a5fa",
    bgAccent: "rgba(96,165,250,0.12)",
    borderAccent: "rgba(96,165,250,0.35)",
  },
  native: {
    label: "Native",
    color: "#34d399",
    bgAccent: "rgba(52,211,153,0.12)",
    borderAccent: "rgba(52,211,153,0.35)",
  },
};

function getTier(score: number): Tier {
  if (score <= 10) return "beginner";
  if (score <= 20) return "adopter";
  return "native";
}

export default async function Image({
  params,
}: {
  params: { locale: string };
  searchParams?: { s?: string; t?: string };
}) {
  // Note: Next.js opengraph-image.tsx does NOT receive searchParams.
  // Dynamic OG with score requires a route handler (see /api/og/score).
  // This file generates the default OG image for /score without personalized score.

  const locale = (params?.locale as string) || "en";
  const isJa = locale === "ja";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #060a14 0%, #0a0f1e 50%, #060a14 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Gold accent bar */}
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

        {/* Badge */}
        <div
          style={{
            background: "rgba(226,183,20,0.1)",
            border: "1px solid rgba(226,183,20,0.3)",
            color: "#e2b714",
            fontSize: "14px",
            fontWeight: "700",
            padding: "6px 20px",
            borderRadius: "100px",
            marginBottom: "32px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          FREE AI READINESS ASSESSMENT
        </div>

        {/* Score circle placeholder */}
        <div
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            border: "6px solid rgba(226,183,20,0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            background: "rgba(226,183,20,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "#e2b714",
            }}
          >
            ?
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "#94a3b8",
            }}
          >
            / 30
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#f1f5f9",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}
        >
          AI Native Score
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: "400",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          {isJa
            ? "あなたのビジネスのAI準備度を2分で診断"
            : "How AI-ready is your business? Take the 2-minute quiz."}
        </div>

        {/* Branding */}
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
          AI Native Playbook
        </div>
      </div>
    ),
    { ...size },
  );
}
