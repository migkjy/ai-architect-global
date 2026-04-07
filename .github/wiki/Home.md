# AI Native Playbook (ai-architect-global)

## 서비스 개요
- **무엇을**: AI Native Playbook 시리즈 — 영문 디지털 제품(가이드/플레이북) 판매 플랫폼
- **누구에게**: 글로벌 솔로프리너, AI 네이티브 빌더
- **왜**: AI를 활용한 1인 비즈니스 구축 방법론을 체계적 플레이북으로 제공

## URL / 도메인
- 프로덕션: https://ai-native-playbook.com
- 기존 도메인: https://ai-driven-architect.com (308 리다이렉트)
- Staging: Vercel Preview (staging 브랜치)
- 배포 브랜치: production (main push만으로는 배포 안 됨)

## 기술 스택
- 프레임워크: Next.js 16 (App Router)
- 언어: TypeScript
- 스타일링: Tailwind CSS v3
- 국제화: next-intl (다국어 지원)
- DB: Turso (LibSQL/SQLite)
- 결제: Paddle (현재 sandbox — production 전환 대기)
- 에러 모니터링: Sentry
- 분석: PostHog, Vercel Analytics + Speed Insights
- 블로그: Markdown 기반 (gray-matter + react-markdown + reading-time)
- 번들 분석: @next/bundle-analyzer
- 테스트: Vitest (유닛), Playwright (E2E)
- 배포: Vercel

## 아키텍처
```
src/
├── app/
│   ├── [locale]/         — 다국어 라우트
│   │   ├── about/        — 소개
│   │   ├── blog/         — 블로그
│   │   ├── bundle/       — 번들 상품
│   │   ├── faq/          — FAQ
│   │   ├── free-guide/   — 무료 가이드
│   │   ├── getting-started/ — 시작 가이드
│   │   ├── patterns/     — AI 패턴
│   │   ├── pricing/      — 가격
│   │   ├── products/     — 상품 목록
│   │   ├── score/        — AI 점수
│   │   ├── skill-guide/  — 스킬 가이드
│   │   └── privacy/terms/refund/ — 법적 페이지
│   ├── api/              — API 라우트
│   ├── og-image/         — OG 이미지 생성
│   └── sitemap*.xml      — 사이트맵
├── components/           — UI 컴포넌트
├── i18n/                 — 국제화 설정
├── lib/                  — 유틸리티
└── messages/             — 번역 파일
```

## 현재 상태
운영중 (Paddle sandbox — production 전환 대기)

## 기획 방향
- 글로벌 솔로프리너 대상 영문 AI 플레이북 판매
- 한국어 브랜드명 "설계자 시리즈"는 변경 금지
- SEO/AEO 최적화로 유기 트래픽 확보
- Paddle 결제 연동으로 글로벌 판매

## 제한사항
- 일본어 제품 추가 제작 금지 (영어/한국어만)
- 기존 일본어 SEO 메타데이터는 현행 유지
- Paddle API key CEO 제공 필요 (sandbox → production 전환 블로킹)
- 도메인 마이그레이션 HOLD (Paddle 심사 대기)
- 브랜치: main → staging → production (직행 금지)

## 연관 시스템
- Turso DB
- Paddle (결제 — sandbox)
- Lemon Squeezy (대체 결제 채널)
- Sentry (에러 모니터링)
- PostHog (사용자 분석)
