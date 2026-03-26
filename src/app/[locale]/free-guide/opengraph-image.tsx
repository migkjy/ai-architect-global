import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Free AI Marketing Blueprint - AI Native Playbook";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale || "en";

  const LOCALE_TITLE: Record<string, string> = {
    en: "Free AI Marketing Blueprint",
    ko: "무료 AI 마케팅 블루프린트",
    ja: "無料AIマーケティング設計図",
  };

  const LOCALE_SUBTITLE: Record<string, string> = {
    en: "Learn how AI automates 6 proven business frameworks — instant download",
    ko: "6가지 검증된 비즈니스 프레임워크를 AI로 자동화하는 방법",
    ja: "6つの実証済みフレームワークをAIで自動化する方法",
  };

  const LOCALE_CTA: Record<string, string> = {
    en: "Download Free — No Purchase Required",
    ko: "무료 다운로드 — 구매 불필요",
    ja: "無料ダウンロード — 購入不要",
  };

  const title = LOCALE_TITLE[locale] || LOCALE_TITLE.en;
  const subtitle = LOCALE_SUBTITLE[locale] || LOCALE_SUBTITLE.en;
  const cta = LOCALE_CTA[locale] || LOCALE_CTA.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #021a0a 0%, #032b12 40%, #021a0a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Green top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #16a34a, #4ade80, #16a34a)",
          }}
        />

        {/* 100% FREE badge */}
        <div
          style={{
            background: "linear-gradient(90deg, #16a34a, #22c55e)",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "800",
            padding: "10px 32px",
            borderRadius: "100px",
            marginBottom: "32px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          100% FREE
        </div>

        {/* Download icon circle */}
        <div
          style={{
            width: "72px",
            height: "72px",
            background: "rgba(34,197,94,0.12)",
            border: "2px solid rgba(34,197,94,0.3)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
            fontSize: "32px",
          }}
        >
          📥
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
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: "400",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "750px",
            lineHeight: 1.4,
            marginBottom: "36px",
          }}
        >
          {subtitle}
        </div>

        {/* CTA pill */}
        <div
          style={{
            background: "linear-gradient(90deg, #16a34a, #22c55e)",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "800",
            padding: "14px 40px",
            borderRadius: "100px",
            letterSpacing: "0.5px",
          }}
        >
          {cta}
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "15px",
            color: "#4ade80",
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
