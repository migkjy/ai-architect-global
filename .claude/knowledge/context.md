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

## 최근 주요 변경 (2026-03-07~08)
- 리브랜딩 전면 실행 (rebrand-code-pl, rebrand-pdf-pl)
- Paddle 상품 7개 + Price 7개 + Webhook + 환경변수 설정
- 법적 페이지 /terms /privacy /refund 직접 200 반환
- 블로그 3편 + 랜딩 블로그 섹션 + 크로스링크
- 블로그 SEO 심화: CollectionPage+BlogPosting+sitemap+IndexNow
- sitemap 법적 3페이지 추가 + IndexNow 104URLs

## 알려진 이슈
- Paddle Client Token (waiting_external — Paddle 심사 1-3일)
- CEO 블로커: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
- 일본어 제품 추가 제작 금지 (CEO 지시)

## 다음 과업 후보
- Paddle Client Token 적용 (심사 완료 시)
- 신규 도메인 DNS 연결
- 추가 블로그 콘텐츠

---
*마지막 업데이트: 2026-03-08 (Phase 1 초기화)*
