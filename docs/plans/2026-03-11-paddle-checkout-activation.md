# Paddle Checkout Activation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** /en/pricing 페이지에서 Paddle overlay checkout이 직접 작동하도록 활성화

**Architecture:** next.config.ts의 /pricing → /products 리다이렉트를 제거하고, pricing 페이지의 Individual Volume 티어에 개별 상품 Buy 버튼을 Paddle priceId와 연동한다. Paddle.js SDK는 이미 layout.tsx에서 로드 중이며, BuyButton 컴포넌트도 Paddle overlay를 지원한다.

**Tech Stack:** Next.js 16, TypeScript, Paddle.js v2 (CDN), 기존 BuyButton 컴포넌트

---

## 현재 상태 요약

- Paddle.js 로딩: `src/app/[locale]/layout.tsx` (NEXT_PUBLIC_PADDLE_CLIENT_TOKEN 조건부)
- BuyButton: `src/components/BuyButton.tsx` (paddlePriceId prop → Paddle.Checkout.open())
- 상품 config: `src/lib/products.ts` (paddlePriceEnvKey 매핑 완료)
- Webhook: `src/app/api/webhooks/paddle/route.ts` (완료)
- **블로커**: .env에 Paddle 키 없음 → Vercel에는 설정되어 있을 수 있으나 로컬 미확인
- **리다이렉트**: next.config.ts에서 /pricing → /products 301 리다이렉트 활성 중

---

## Chunk 1: Paddle Checkout 활성화

### Task 1: /pricing 리다이렉트 제거

**Files:**
- Modify: `next.config.ts:33-38` (redirects 함수에서 pricing 관련 2개 항목 제거)

- [ ] **Step 1: next.config.ts에서 pricing 리다이렉트 제거**

```typescript
// 변경 전 (next.config.ts redirects)
async redirects() {
  return [
    { source: "/pricing", destination: "/en/products", permanent: true },
    { source: "/:locale/pricing", destination: "/:locale/products", permanent: true },
  ];
},

// 변경 후 — 빈 배열 반환 (다른 리다이렉트 없음)
async redirects() {
  return [];
},
```

- [ ] **Step 2: 빌드 테스트**

Run: `npm run build`
Expected: 성공 (pricing 페이지가 정상 빌드됨)

- [ ] **Step 3: 커밋**

```bash
git add next.config.ts
git commit -m "fix: remove /pricing → /products redirect to enable direct pricing page access"
```

---

### Task 2: Pricing 페이지에 개별 상품 Buy 버튼 추가

**Files:**
- Modify: `src/app/[locale]/pricing/page.tsx` (Individual Volume 티어의 Link → 개별 상품 선택 드롭다운 또는 첫 번째 볼륨 Buy 버튼)

현재 Individual Volume 티어는 `<Link href="/products">Start with Volume 1</Link>`로 되어 있음.
이를 Vol 1의 Paddle Buy 버튼으로 교체하고, 하단에 "Browse all volumes" 링크 유지.

- [ ] **Step 1: pricing/page.tsx 상단에 getBookPaddlePriceId import 추가**

```typescript
// 변경 전
import { books, bundle, getBundleUrl, getBundlePaddlePriceId } from "@/lib/products";

// 변경 후
import { books, bundle, getBundleUrl, getBundlePaddlePriceId, getBookPaddlePriceId, getProductUrl } from "@/lib/products";
```

- [ ] **Step 2: PricingPage 함수 내에서 Vol 1 priceId 조회**

`const bundlePaddlePriceId = getBundlePaddlePriceId();` 아래에 추가:

```typescript
const vol1 = books[0]; // AI Marketing Architect (Vol 1)
const vol1PaddlePriceId = getBookPaddlePriceId(vol1.paddlePriceEnvKey);
const vol1Url = getProductUrl(vol1.envKey);
```

- [ ] **Step 3: Individual Volume 티어의 Link를 BuyButton으로 교체**

```tsx
// 변경 전
<Link
  href="/products"
  className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 bg-surface border-2 border-gold/30 text-gold hover:border-gold/60 hover:bg-gold/5 w-full text-center"
  data-testid="cta-individual"
>
  Start with Volume 1
</Link>

// 변경 후
<BuyButton
  href={vol1Url}
  paddlePriceId={vol1PaddlePriceId}
  paddleSuccessUrl={`${SITE_URL}/thank-you?product=${encodeURIComponent(vol1.title)}`}
  variant="secondary"
  className="w-full"
>
  Start with Volume 1 — $17
</BuyButton>
<Link
  href="/products"
  className="block text-center text-sm text-text-secondary hover:text-gold transition-colors mt-3"
>
  Browse all volumes →
</Link>
```

- [ ] **Step 4: 빌드 테스트**

Run: `npm run build`
Expected: 성공

- [ ] **Step 5: 커밋**

```bash
git add src/app/[locale]/pricing/page.tsx
git commit -m "feat: add Paddle Buy button for Vol 1 on pricing page individual tier"
```

---

### Task 3: 빌드 검증 및 main push

- [ ] **Step 1: 최종 빌드 확인**

Run: `npm run build`
Expected: 성공 (에러 0)

- [ ] **Step 2: main push**

```bash
git pull --rebase origin main
git push origin main
```

**주의: production 브랜치 push/머지 절대 금지**

---

### Task 4: 완료 보고

- [ ] **Step 1: shared-memory 보고 파일 작성**

`/Users/nbs22/(Claude)/(claude).projects/shared-memory/pl-to-jarvis/pl-paddle-reply.md`에 작업 결과 보고.

- [ ] **Step 2: context.md 업데이트**

`.claude/knowledge/context.md`에 작업 내용 반영.
