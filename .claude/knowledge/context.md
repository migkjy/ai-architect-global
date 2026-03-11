# ai-architect-global 프로젝트 컨텍스트

## 프로젝트 요약
- **서비스**: AI Native Playbook 글로벌 SaaS (리브랜딩 완료 2026-03-08)
- **기술스택**: Next.js 16, TypeScript, Tailwind CSS, Paddle(결제), Neon(DB)
- **배포**: Vercel (git push 트리거)
- **도메인**: ai-driven-architect.com (기존), ai-native-playbook.com (신규 DNS 대기)

## 리브랜딩 (2026-03-08)
- AI Driven Architect -> AI Native Playbook
- 코드/콘텐츠/SEO 전면 교체 완료
- 신규 도메인 DNS 연결 대기 중

## 브랜치 규칙
- 개발: `main` -> staging: `staging` -> production: `production`
- main->production 직행 PR 절대 금지, staging 경유 필수

## Paddle 결제 시스템 (2026-03-12 검증 완료)
- **상태**: 코드 완전 통합, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 대기 중 (CEO 블로커)
- `/pricing` 페이지 BuyButton 완전 활성화:
  - Individual Volume (Vol 1): `getBookPaddlePriceId(vol1.paddlePriceEnvKey)` → PADDLE_PRICE_ID_VOL1
  - Complete Bundle: `getBundlePaddlePriceId()` → PADDLE_PRICE_ID_BUNDLE
  - "Browse all volumes" 링크 → /products
- `next.config.ts` redirects: empty array (pricing redirect 없음)
- BuyButton 동작: Paddle 로드 시 overlay checkout, 미로드 시 href 폴백, href도 없으면 이메일 캡처

## 빌드/테스트 현황 (2026-03-12)
- `npm run build`: 95 pages, 0 errors
- `npm test`: 52 tests, 7 files, all passed

## 최근 주요 변경 (2026-03-07~12)
- 리브랜딩 전면 실행 (rebrand-code-pl, rebrand-pdf-pl)
- Paddle 상품 7개 + Price 7개 + Webhook + 환경변수 설정
- 법적 페이지 /terms /privacy /refund 직접 200 반환
- 블로그 3편 + 랜딩 블로그 섹션 + 크로스링크
- 블로그 SEO 심화: CollectionPage+BlogPosting+sitemap+IndexNow
- sitemap 법적 3페이지 추가 + IndexNow 104URLs
- free-guide 리드마그넷 퍼널 (PR#107, production 머지 완료)
- Lighthouse 최적화 (TBT, PostHog 격리 등, PR#113)
- /ja/ /ko/ sitemap URL 제거 (116 GSC 에러 해소)
- 너처 이메일 시퀀스 (NURTURE_ENABLED=false)
- Paddle checkout /pricing 페이지 Vol1 BuyButton 완전 통합

## 알려진 이슈
- Paddle Client Token (waiting_external — Paddle 심사 완료 대기)
- CEO 블로커: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN (이 키만 있으면 즉시 결제 활성화)
- 일본어 제품 추가 제작 금지 (CEO 지시)
- ai-native-playbook.com 도메인 마이그레이션 HOLD (Paddle 심사 대기)

## 다음 과업 후보
- NEXT_PUBLIC_PADDLE_CLIENT_TOKEN Vercel 등록 (Paddle 심사 완료 시)
- 신규 도메인 DNS 연결 (Paddle 심사 완료 시)
- 추가 블로그 콘텐츠 (게리 에이전트 담당)

---
*마지막 업데이트: 2026-03-12 (Paddle checkout activation 검증 완료)*
