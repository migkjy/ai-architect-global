import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #060a14 0%, #0a0f1e 50%, #060a14 100%)",
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
            marginBottom: "24px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          6 World-Class Frameworks + AI
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "800",
            color: "#f1f5f9",
            textAlign: "center",
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          AI Native Playbook Series
        </div>

        <div
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
            marginBottom: "48px",
          }}
        >
          Russell Brunson · Jeff Walker · Jim Edwards · Nicolas Cole
        </div>

        {/* Books row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {["🎯", "🔳", "📝", "🧠", "⚙️", "✏️"].map((icon, i) => (
            <div
              key={i}
              style={{
                width: "72px",
                height: "72px",
                background: "rgba(20,28,46,0.8)",
                border: "1px solid rgba(226,183,20,0.15)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #f0cc4a, #e2b714)",
              WebkitBackgroundClip: "text",
              color: "#e2b714",
            }}
          >
            Complete Bundle — $47
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
