# ai-architect-global 완전체 MVP 플랜

**날짜**: 2026-02-27
**목표**: KR3-3 5번째 브랜드 채널 달성 — ai-architect-global 완전체 (Performance + Mobile)

## 현황 파악
- Next.js 16 + TypeScript + Tailwind CSS v3 ✅
- 빌드 성공: 14페이지 정적 생성 ✅
- Vercel 배포 연결됨 (prj_FHoCFiCLPu44j9iCB5utzkhMTF1E) ✅
- 미설치: @vercel/analytics, @vercel/speed-insights
- 미확인: 모바일 헤더 (햄버거 메뉴)

---

## Task 1: Performance — @vercel/analytics + @vercel/speed-insights

```bash
npm install @vercel/analytics @vercel/speed-insights
```

**src/app/layout.tsx** 수정 — `<body>` 닫기 전에 추가:

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// <body> 내 Footer 아래에 추가
<Analytics />
<SpeedInsights />
```

완료 후:
```bash
npm run build  # 빌드 성공 확인
git add package.json package-lock.json src/app/layout.tsx
git commit -m "perf: add Vercel Analytics + Speed Insights"
```

---

## Task 2: Mobile 헤더 햄버거 메뉴 확인 및 구현

**파일**: `src/components/Header.tsx` 확인

현재 Header에 모바일 햄버거 메뉴(md:hidden)가 없으면 추가:
- `"use client"` 선언 + useState
- 모바일 (<768px): 햄버거 아이콘 (Menu/X 토글)
- 데스크탑: 기존 nav 그대로

내비게이션 링크:
- Home → `/`
- Products → `/products`
- Bundle → `/bundle`
- About → `/about`

완료 후:
```bash
npm run build
git add src/components/Header.tsx
git commit -m "feat: mobile hamburger menu for header"
```

---

## Task 3: 최종 빌드 + git push

```bash
npm run build  # 최종 확인
git pull --rebase origin main
git push origin main
```

push 완료 후 Vercel 자동 배포 트리거됨.

---

## 완료 기준
- [ ] @vercel/analytics + @vercel/speed-insights 설치 + layout.tsx 연동
- [ ] 모바일 헤더 햄버거 메뉴 작동
- [ ] npm run build 성공
- [ ] git push 완료
