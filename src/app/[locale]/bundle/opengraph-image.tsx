import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Complete Bundle — 6 AI Playbooks for $47";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #060a14 0%, #0d1425 40%, #1a0f05 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Top gold accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #c8981e, #f0cc4a, #e2b714, #f0cc4a, #c8981e)",
          }}
        />

        {/* Save badge */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            background: "linear-gradient(135deg, #b8860b, #e2b714, #f5d442)",
            boxShadow: "0 0 40px rgba(226, 183, 20, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: "800",
                color: "#060a14",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              SAVE
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#060a14",
                lineHeight: 1,
              }}
            >
              54%
            </div>
          </div>
        </div>

        {/* Category label */}
        <div
          style={{
            color: "#e2b714",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "24px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          AI NATIVE PLAYBOOK SERIES
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "900",
            color: "#f1f5f9",
            lineHeight: 1.15,
            marginBottom: "16px",
            maxWidth: "850px",
          }}
        >
          Complete Bundle
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "#94a3b8",
            lineHeight: 1.4,
            marginBottom: "32px",
            maxWidth: "800px",
          }}
        >
          6 AI Business Automation Playbooks
        </div>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: "#64748b",
              textDecoration: "line-through",
            }}
          >
            $102
          </div>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "900",
              color: "#e2b714",
              lineHeight: 1,
            }}
          >
            $47
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#22c55e",
              fontWeight: "700",
              marginLeft: "8px",
            }}
          >
            Instant PDF Download
          </div>
        </div>

        {/* Bottom bar with site URL */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50px",
            background: "linear-gradient(90deg, rgba(226,183,20,0.1), rgba(226,183,20,0.05))",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "40px",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              color: "#e2b714",
              fontWeight: "600",
            }}
          >
            ai-native-playbook.com/bundle
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
