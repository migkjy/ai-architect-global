import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Business Blog — Latest Insights & Frameworks | AI Native Playbook";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params.locale || "en";

  const LOCALE_TITLE: Record<string, string> = {
    en: "AI Business Blog",
    ko: "AI 비즈니스 블로그",
    ja: "AIビジネスブログ",
  };

  const LOCALE_SUBTITLE: Record<string, string> = {
    en: "Latest Insights & Frameworks for AI-Powered Entrepreneurs",
    ko: "AI 기반 기업가를 위한 최신 인사이트 및 프레임워크",
    ja: "AIを活用する起業家のための最新インサイト",
  };

  const title = LOCALE_TITLE[locale] || LOCALE_TITLE.en;
  const subtitle = LOCALE_SUBTITLE[locale] || LOCALE_SUBTITLE.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #060a14 0%, #0d1529 50%, #060a14 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Gold top bar */}
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

        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            background: "linear-gradient(180deg, #3b82f6, #1d4ed8, #3b82f6)",
          }}
        />

        {/* Blog label */}
        <div
          style={{
            background: "rgba(59,130,246,0.15)",
            border: "1px solid rgba(59,130,246,0.35)",
            color: "#60a5fa",
            fontSize: "13px",
            fontWeight: "700",
            padding: "6px 20px",
            borderRadius: "100px",
            marginBottom: "28px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          AI NATIVE PLAYBOOK — BLOG
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "58px",
            fontWeight: "800",
            color: "#f1f5f9",
            lineHeight: 1.1,
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "780px",
            marginBottom: "40px",
          }}
        >
          {subtitle}
        </div>

        {/* Topic pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {["AI Marketing", "Sales Funnels", "Copywriting", "Business Growth"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#cbd5e1",
                fontSize: "14px",
                fontWeight: "600",
                padding: "8px 18px",
                borderRadius: "8px",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "15px",
            color: "#e2b714",
            fontWeight: "600",
            opacity: 0.8,
          }}
        >
          AI Native Playbook Series
        </div>
      </div>
    ),
    { ...size }
  );
}
