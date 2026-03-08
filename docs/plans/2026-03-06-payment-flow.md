# Payment Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the Lemon Squeezy payment -> PDF delivery flow so that when CEO registers LS products, purchases work end-to-end.

**Architecture:** LS handles checkout externally. After payment, LS sends a webhook to our API. We verify the webhook signature, record the order, generate a secure download token, and show a thank-you page with download links. Confirmation email is sent via Brevo transactional API. No database needed -- orders stored via LS API queries + local JSON log for backup.

**Tech Stack:** Next.js 16 App Router, TypeScript, Lemon Squeezy webhook, Brevo transactional email API, crypto (Node built-in) for token generation.

---

### Task 1: LS Webhook Handler API Route

**Files:**
- Create: `src/app/api/webhooks/lemonsqueezy/route.ts`
- Create: `src/lib/orders.ts`

**Step 1: Create order types and storage utility**

```typescript
// src/lib/orders.ts
import crypto from "crypto";

export interface Order {
  id: string;
  lsOrderId: string;
  customerEmail: string;
  customerName: string;
  productId: string;
  productName: string;
  variantId: string;
  amount: number;
  currency: string;
  downloadToken: string;
  downloadExpiry: string; // ISO date string
  createdAt: string;
}

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getDownloadExpiry(days: number = 30): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
```

**Step 2: Create webhook handler**

```typescript
// src/app/api/webhooks/lemonsqueezy/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateDownloadToken, getDownloadExpiry, type Order } from "@/lib/orders";

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: Request) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[webhook] LEMONSQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") ?? "";

    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      console.error("[webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;

    if (eventName !== "order_created") {
      // Acknowledge but ignore non-order events
      return NextResponse.json({ received: true });
    }

    const attrs = event.data?.attributes;
    const customerEmail = attrs?.user_email ?? "";
    const customerName = attrs?.user_name ?? "";
    const lsOrderId = String(event.data?.id ?? "");
    const productName = attrs?.first_order_item?.product_name ?? "AI Architect";
    const productId = String(attrs?.first_order_item?.product_id ?? "");
    const variantId = String(attrs?.first_order_item?.variant_id ?? "");
    const amount = attrs?.total ?? 0;
    const currency = attrs?.currency ?? "USD";

    const order: Order = {
      id: crypto.randomUUID(),
      lsOrderId,
      customerEmail,
      customerName,
      productId,
      productName,
      variantId,
      amount,
      currency,
      downloadToken: generateDownloadToken(),
      downloadExpiry: getDownloadExpiry(30),
      createdAt: new Date().toISOString(),
    };

    // Log order (primary record is in LS dashboard; this is backup)
    console.log(`[order] New order: ${JSON.stringify(order)}`);

    // Send confirmation email (best-effort, don't fail webhook on email error)
    try {
      await sendConfirmationEmail(order);
    } catch (emailErr) {
      console.error("[order] Email send failed:", emailErr);
    }

    return NextResponse.json({ received: true, orderId: order.id });
  } catch (err) {
    console.error("[webhook] Error processing webhook:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

async function sendConfirmationEmail(order: Order): Promise<void> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.warn("[email] BREVO_API_KEY not set, skipping confirmation email");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com";
  const downloadUrl = `${siteUrl}/download?token=${order.downloadToken}`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": brevoKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "AI Native Playbook Series", email: "hello@ai-native-playbook.com" },
      to: [{ email: order.customerEmail, name: order.customerName }],
      subject: `Your ${order.productName} is ready to download`,
      htmlContent: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e;">Thank you for your purchase!</h1>
          <p>Hi ${order.customerName || "there"},</p>
          <p>Your order for <strong>${order.productName}</strong> has been confirmed.</p>
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> ${order.lsOrderId}</p>
            <p style="margin: 0;"><strong>Amount:</strong> $${(order.amount / 100).toFixed(2)} ${order.currency}</p>
          </div>
          <a href="${downloadUrl}" style="display: inline-block; background: #d4a574; color: #1a1a2e; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Download Your PDF
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This download link is valid for 30 days. If you need a new link, reply to this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">AI Native Playbook Series | ai-native-playbook.com</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Brevo API error: ${res.status} ${errText}`);
  }
}
```

**Step 3: Update middleware to allow webhook API route**

The current middleware already excludes `/api` paths via the matcher pattern:
```
matcher: ["/((?!api|_next|_vercel|og-image|.*\\..*).*)"]
```
No change needed.

**Step 4: Commit**

```bash
git add src/lib/orders.ts src/app/api/webhooks/lemonsqueezy/route.ts
git commit -m "feat: add Lemon Squeezy webhook handler + order recording"
```

---

### Task 2: Thank-You / Success Page

**Files:**
- Create: `src/app/[locale]/thank-you/page.tsx`

**Step 1: Create thank-you page**

This page is where LS redirects after successful checkout (configured in LS product settings).
It shows a confirmation message. If the `order_id` query param is present, it links to LS receipt.

```typescript
// src/app/[locale]/thank-you/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Thank You for Your Purchase | AI Native Playbook Series",
  description: "Your AI Architect PDF is ready. Check your email for the download link.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const productName = sp.product ?? "AI Native Playbook Series";

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-gold">Thank You for Your Purchase!</span>
        </h1>

        <p className="text-text-secondary text-lg mb-8 leading-relaxed">
          Your copy of <strong className="text-text-primary">{productName}</strong> is on its way.
        </p>

        <div className="bg-surface/60 border border-gold/20 rounded-2xl p-8 mb-8 text-left card-glow">
          <h2 className="font-bold text-lg mb-4">What happens next:</h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Check your email",
                desc: "You'll receive a confirmation email with your download link within a few minutes.",
              },
              {
                step: "2",
                title: "Download your PDF",
                desc: "Click the download link in the email. You can also download directly from your Lemon Squeezy receipt.",
              },
              {
                step: "3",
                title: "Load the system prompt",
                desc: "Open the PDF, copy the AI system prompt, and paste it into Claude, ChatGPT, or Gemini.",
              },
              {
                step: "4",
                title: "Start executing",
                desc: "Tell the AI about your business and watch the framework come alive with personalized strategies.",
              },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-gold/10 border border-gold/20 rounded-lg flex items-center justify-center font-bold text-gold text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary text-sm">{s.title}</h3>
                  <p className="text-text-secondary text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface/40 border border-white/5 rounded-xl p-6 mb-8">
          <p className="text-text-secondary text-sm mb-3">
            Didn&apos;t receive your email? Check your spam folder, or contact us:
          </p>
          <a
            href="mailto:hello@ai-native-playbook.com"
            className="text-gold hover:text-gold-light transition-colors font-semibold"
          >
            hello@ai-native-playbook.com
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm"
          >
            Browse More Books
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-text-secondary border border-white/10 hover:border-gold/30 hover:text-gold transition-all text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/[locale]/thank-you/page.tsx
git commit -m "feat: add thank-you page for post-purchase flow"
```

---

### Task 3: Download API Route with Token Verification

**Files:**
- Create: `src/app/api/download/route.ts`
- Create: `src/app/[locale]/download/page.tsx`

**Step 1: Create download API route**

The download route validates a token and redirects to the actual Google Drive PDF URL.
Since we don't have a DB, we use the LS API to verify order status.
For MVP, the download page shows links to Google Drive v2/ PDFs (already uploaded).

```typescript
// src/app/api/download/route.ts
import { NextResponse } from "next/server";

// Google Drive PDF links (v2/ folder, already uploaded)
// These will be configured via env vars by CEO
const PDF_LINKS: Record<string, string> = {
  "bundle": process.env.DOWNLOAD_BUNDLE_URL ?? "",
  "vol1": process.env.DOWNLOAD_VOL1_URL ?? "",
  "vol2": process.env.DOWNLOAD_VOL2_URL ?? "",
  "vol3": process.env.DOWNLOAD_VOL3_URL ?? "",
  "vol4": process.env.DOWNLOAD_VOL4_URL ?? "",
  "vol5": process.env.DOWNLOAD_VOL5_URL ?? "",
  "vol6": process.env.DOWNLOAD_VOL6_URL ?? "",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get("product");
  const token = searchParams.get("token");

  if (!product || !token) {
    return NextResponse.json(
      { error: "Missing product or token parameter" },
      { status: 400 }
    );
  }

  // Validate token format (64 hex chars)
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const downloadUrl = PDF_LINKS[product];
  if (!downloadUrl) {
    return NextResponse.json(
      { error: "Product not found or download URL not configured" },
      { status: 404 }
    );
  }

  // For MVP: redirect to Google Drive link
  // Future: verify token against DB, check expiry, log download
  return NextResponse.redirect(downloadUrl);
}
```

**Step 2: Create download landing page**

```typescript
// src/app/[locale]/download/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Download Your Purchase | AI Native Playbook Series",
  description: "Access your AI Architect PDF downloads.",
  robots: { index: false, follow: false },
};

export default async function DownloadPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const token = sp.token;

  if (!token) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Download Access</h1>
          <p className="text-text-secondary mb-6">
            Please use the download link from your confirmation email to access your purchase.
          </p>
          <p className="text-text-secondary text-sm">
            Need help? Contact{" "}
            <a href="mailto:hello@ai-native-playbook.com" className="text-gold hover:text-gold-light">
              hello@ai-native-playbook.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">
          <span className="gradient-gold">Your Downloads</span>
        </h1>
        <p className="text-text-secondary mb-8">
          Click below to download your purchased PDF guides.
        </p>

        <div className="bg-surface/60 border border-gold/20 rounded-2xl p-6 card-glow">
          <p className="text-text-secondary text-sm mb-4">
            Your download links were sent to your email. If you purchased the bundle, all 6 PDFs are accessible from the Lemon Squeezy receipt page.
          </p>
          <a
            href="https://app.lemonsqueezy.com/my-orders"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-bold bg-gold text-navy-dark hover:bg-gold-light shadow-lg shadow-gold/20 transition-all transform hover:scale-105"
          >
            Access My Orders on Lemon Squeezy
          </a>
          <p className="text-xs text-text-muted mt-4">
            Lemon Squeezy provides secure download links for all your purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/api/download/route.ts src/app/[locale]/download/page.tsx
git commit -m "feat: add download API route + download landing page"
```

---

### Task 4: Environment Variables Documentation

**Files:**
- Modify: `projects/ai-architect-global/.env.example`

**Step 1: Update .env.example with all required variables**

Add the new env vars needed for webhook, email, and download flow:

```env
# Lemon Squeezy Checkout URLs
# Set these after creating products in your Lemon Squeezy store

# Bundle (all 6 books) -- $47
NEXT_PUBLIC_LS_BUNDLE_URL=https://your-store.lemonsqueezy.com/checkout/buy/bundle-product-id

# Individual books -- $17 each
NEXT_PUBLIC_LS_PRODUCT_1_URL=https://your-store.lemonsqueezy.com/checkout/buy/vol1-product-id
NEXT_PUBLIC_LS_PRODUCT_2_URL=https://your-store.lemonsqueezy.com/checkout/buy/vol2-product-id
NEXT_PUBLIC_LS_PRODUCT_3_URL=https://your-store.lemonsqueezy.com/checkout/buy/vol3-product-id
NEXT_PUBLIC_LS_PRODUCT_4_URL=https://your-store.lemonsqueezy.com/checkout/buy/vol4-product-id
NEXT_PUBLIC_LS_PRODUCT_5_URL=https://your-store.lemonsqueezy.com/checkout/buy/vol5-product-id
NEXT_PUBLIC_LS_PRODUCT_6_URL=https://your-store.lemonsqueezy.com/checkout/buy/vol6-product-id

# Lemon Squeezy Webhook (set in LS Dashboard > Settings > Webhooks)
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-signing-secret

# Brevo Transactional Email (for purchase confirmation emails)
BREVO_API_KEY=xkeysib-your-brevo-api-key

# Site URL (used for OG images, sitemap, email links, etc.)
NEXT_PUBLIC_SITE_URL=https://ai-native-playbook.com

# Lemon Squeezy Thank You redirect URL (set per product in LS dashboard):
# https://ai-native-playbook.com/thank-you?product=AI+Architect+Series
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: update .env.example with webhook, email, and download env vars"
```

---

### Task 5: LS Checkout URL Configuration in Product Cards

**Files:**
- Modify: `src/lib/products.ts` (add thank-you redirect param)

**Step 1: Add checkout URL helper with redirect param**

Update `getProductUrl` and `getBundleUrl` to append the thank-you redirect URL:

In `src/lib/products.ts`, modify:

```typescript
export function getBundleUrl(): string {
  const base = process.env.NEXT_PUBLIC_LS_BUNDLE_URL ?? "#";
  if (base === "#") return "#";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com";
  const redirectUrl = encodeURIComponent(`${siteUrl}/thank-you?product=Complete+Bundle`);
  return `${base}?checkout[custom][redirect_url]=${redirectUrl}`;
}

export function getProductUrl(envKey: string): string {
  const base = (process.env[envKey as keyof typeof process.env] as string | undefined) ?? "#";
  if (base === "#") return "#";
  const book = books.find((b) => b.envKey === envKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com";
  const productName = encodeURIComponent(book?.title ?? "AI Architect");
  const redirectUrl = encodeURIComponent(`${siteUrl}/thank-you?product=${productName}`);
  return `${base}?checkout[custom][redirect_url]=${redirectUrl}`;
}
```

**Step 2: Build test**

Run: `cd projects/ai-architect-global && npm run build`
Expected: Build succeeds without errors.

**Step 3: Commit**

```bash
git add src/lib/products.ts
git commit -m "feat: append thank-you redirect URL to LS checkout links"
```

---

### Task 6: Sitemap Update

**Files:**
- Modify: `src/app/sitemap.ts`

**Step 1: Verify thank-you and download pages are NOT in sitemap**

Read the sitemap.ts and confirm these new pages are excluded (they should be -- they have `robots: { index: false }`).
No changes needed unless sitemap explicitly lists all routes.

**Step 2: Verify build**

Run: `cd projects/ai-architect-global && npm run build`
Expected: Build succeeds.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete payment-to-delivery flow for Lemon Squeezy integration"
```

---

## CEO Action Items (Post-Implementation)

These items require CEO action and cannot be implemented by the PL:

1. **Lemon Squeezy Product Registration**: Create 7 products (6 individual + 1 bundle) in LS dashboard
2. **LS Webhook Setup**: In LS Dashboard > Settings > Webhooks, add endpoint `https://ai-native-playbook.com/api/webhooks/lemonsqueezy` with `order_created` event
3. **LS Thank-You Redirect**: Set redirect URL per product to `https://ai-native-playbook.com/thank-you?product={ProductName}`
4. **Environment Variables**: Set `LEMONSQUEEZY_WEBHOOK_SECRET` and all `NEXT_PUBLIC_LS_PRODUCT_*_URL` in Vercel
5. **Brevo**: Set `BREVO_API_KEY` in Vercel (already exists for other projects)
6. **LS PDF Upload**: Upload PDF files to each LS product (LS handles file delivery natively)

## Note on LS Native Download

Lemon Squeezy natively handles digital file delivery -- when CEO uploads PDFs to LS products, buyers automatically get download access via LS receipt page. Our webhook + email flow is a **supplement** to ensure customers have multiple access points, not a replacement for LS's built-in delivery.
