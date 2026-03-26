import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

type Tier = "beginner" | "adopter" | "native";

const tierMeta: Record<
  Tier,
  { label: string; color: string; ring: string; bg: string }
> = {
  beginner: {
    label: "Beginner",
    color: "#fb923c",
    ring: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
  },
  adopter: {
    label: "Adopter",
    color: "#60a5fa",
    ring: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
  },
  native: {
    label: "Native",
    color: "#34d399",
    ring: "#34d399",
    bg: "rgba(52,211,153,0.12)",
  },
};

function getTier(score: number): Tier {
  if (score <= 10) return "beginner";
  if (score <= 20) return "adopter";
  return "native";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawScore = parseInt(searchParams.get("s") || "", 10);
  const score = isNaN(rawScore) ? null : Math.max(0, Math.min(30, rawScore));

  // If no valid score, show generic image
  if (score === null) {
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
          <div
            style={{
              fontSize: "52px",
              fontWeight: "800",
              color: "#f1f5f9",
              textAlign: "center",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            AI Native Score
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              textAlign: "center",
            }}
          >
            How AI-ready is your business? Take the 2-minute quiz.
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
            AI Native Playbook
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  // Personalized score image
  const tier = getTier(score);
  const meta = tierMeta[tier];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #060a14 0%, #0a0f1e 50%, #060a14 100%)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
          gap: "80px",
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

        {/* Left: Score circle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              border: `8px solid ${meta.ring}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: meta.bg,
            }}
          >
            <div
              style={{
                fontSize: "80px",
                fontWeight: "800",
                color: meta.color,
                lineHeight: 1,
              }}
            >
              {score}
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#94a3b8",
                marginTop: "4px",
              }}
            >
              / 30
            </div>
          </div>

          {/* Tier badge */}
          <div
            style={{
              background: meta.bg,
              border: `1px solid ${meta.ring}`,
              color: meta.color,
              fontSize: "18px",
              fontWeight: "700",
              padding: "8px 24px",
              borderRadius: "100px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {meta.label}
          </div>
        </div>

        {/* Right: Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "520px",
          }}
        >
          <div
            style={{
              background: "rgba(226,183,20,0.1)",
              border: "1px solid rgba(226,183,20,0.3)",
              color: "#e2b714",
              fontSize: "13px",
              fontWeight: "700",
              padding: "5px 16px",
              borderRadius: "100px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              alignSelf: "flex-start",
            }}
          >
            AI NATIVE SCORE
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: "800",
              color: "#f1f5f9",
              lineHeight: 1.2,
            }}
          >
            My AI Readiness:
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: meta.color,
              lineHeight: 1.2,
            }}
          >
            {score}/30 — {meta.label}
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              lineHeight: 1.4,
              marginTop: "8px",
            }}
          >
            How AI-ready is YOUR business? Take the free 2-minute assessment.
          </div>
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
          ai-native-playbook.com/score
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
