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

## 최근 주요 변경 (2026-03-11)
- Paddle Checkout 활성화 (커밋 2659f58):
  - /pricing → /products 301 리다이렉트 제거 → /en/pricing 직접 접근 가능
  - Individual 티어에 Vol 1 Paddle Buy 버튼 추가 ($17)
  - Bundle 티어 Paddle Buy 버튼 유지 ($47)
  - Paddle 코드 인프라 전체 확인: Paddle.js, BuyButton, Webhook, Email, Telegram 완료

## 이전 주요 변경 (2026-03-07~10)
- 리브랜딩 전면 실행, Paddle 상품 7개 + Webhook + 환경변수 설정
- 법적 페이지, 블로그 3편, SEO 심화, Technical SEO 강화

## 알려진 이슈
- Paddle Client Token (waiting_external — Paddle 심사 대기)
- CEO 블로커: .env에 Paddle 환경변수 미설정 (NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 등)
- 일본어 제품 추가 제작 금지 (CEO 지시)

## 다음 과업 후보
- Paddle 환경변수 설정 (.env + Vercel) — 키 발급 후 즉시
- 신규 도메인 DNS 연결
- 추가 블로그 콘텐츠

---
*마지막 업데이트: 2026-03-11 (Paddle Checkout 활성화)*
