import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Architect Series";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LOCALE_TITLE: Record<string, string> = {
  en: "AI Architect Series",
  ko: "AI 아키텍트 시리즈",
  ja: "AIアーキテクトシリーズ",
};

const LOCALE_DESC: Record<string, string> = {
  en: "6 World-Class Frameworks, Fully Automated with AI",
  ko: "6가지 세계적 프레임워크, AI로 완전 자동화",
  ja: "6つの世界クラスフレームワーク、AIで完全自動化",
};

export default async function Image({ params }: { params: { locale: string } }) {
  const locale = params.locale || "en";
  const title = LOCALE_TITLE[locale] || LOCALE_TITLE.en;
  const desc = LOCALE_DESC[locale] || LOCALE_DESC.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
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
            marginBottom: "24px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          AI ARCHITECT SERIES
        </div>
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
          {title}
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "400",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
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
