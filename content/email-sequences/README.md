# AI Native Playbook Email Sequences

| 파일명 | 상태 | Subject | 타이밍 | 비고 |
|--------|------|---------|--------|------|
| [LIVE] d0-welcome.html | CEO승인 | You Read Marketing Secrets. Your Business Didn't Change. Here's Why. | D+0 | 온보딩 |
| [LIVE] d1-tips.html | CEO승인 | The AI Business Gap Is Growing. Here's Proof. | D+1 | 온보딩 |
| [LIVE] d3-marketing-case.html | CEO승인 | How Sarah Went From Overworked Solopreneur to AI-Powered Growth Machine | D+3 | 온보딩 |
| [LIVE] d7-cta.html | CEO승인 | Every Week You Wait, Your Competitors Get Further Ahead | D+7 | 온보딩 CTA |
| [LIVE] d0-payment-failed.html | CEO승인 | Action needed: Payment issue for {productName} | 즉시 | 트랜잭션 (Resend) |
| [DRAFT] d0-purchase-confirm.html | 미승인 | Your {productName} is ready to download | 즉시 | Paddle 트랜잭션 |

## 상태 설명

- **[LIVE]** = CEO 승인 + 운영 중
- **[DRAFT]** = AI 작성 완료, CEO 검수 대기
- **[INACTIVE]** = 비활성/보류

## 발신 정보

- **발신자**: AI Native Playbook
- **발신 이메일**: contact@apppro.kr
- **브랜드 색상**: #1a1a2e (다크 네이비), #e94560 (액센트 레드)

## 이메일 도구 분리

| 이메일 | 도구 | 이유 |
|--------|------|------|
| d0-welcome, d1-tips, d3-marketing-case, d7-cta | Brevo | 마케팅 온보딩 시퀀스 |
| d0-payment-failed | Resend | 트랜잭션 (결제 실패 알림) |
| d0-purchase-confirm | Resend | 트랜잭션 (구매 확인) |

## 트리거 조건

| 파일명 | 트리거 | 플랫폼 |
|--------|--------|--------|
| d0-welcome.html | 구독 완료 즉시 | Brevo 자동화 |
| d1-tips.html | 구독 후 D+1 | Brevo 자동화 |
| d3-marketing-case.html | 구독 후 D+3 | Brevo 자동화 |
| d7-cta.html | 구독 후 D+7 | Brevo 자동화 |
| d0-payment-failed.html | Paddle payment_failed 웹훅 | Resend API |
| d0-purchase-confirm.html | Paddle transaction_completed 웹훅 | Resend API (미구현 — Paddle sandbox 미세팅) |

## 템플릿 변수

| 변수 | 설명 | 적용 파일 |
|------|------|-----------|
| `{{unsubscribeUrl}}` | 수신 거부 URL | 전체 |
| `{{productName}}` | 상품명 | d0-payment-failed, d0-purchase-confirm |
| `{{transactionId}}` | Paddle 트랜잭션 ID | d0-purchase-confirm |
| `{{amount}}` | 결제 금액 | d0-purchase-confirm |
| `{{purchaseDate}}` | 구매 일자 | d0-purchase-confirm |
| `{{siteUrl}}` | 사이트 URL | d0-payment-failed |
