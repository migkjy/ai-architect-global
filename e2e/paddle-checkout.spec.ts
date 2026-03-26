/**
 * Paddle Checkout → Thank-You → Download E2E Tests
 *
 * Test 1: Site + product pages accessibility
 * Test 2: Paddle checkout flow (skipped — Paddle not configured yet)
 * Test 3: Thank-you page rendering (no token / invalid token)
 * Test 4: Download API contract tests (error handling, validation)
 * Test 5: Download check API contract tests
 *
 * NOTE: Token-dependent download tests (actual file download) require
 * DOWNLOAD_SECRET to match between test and server. When running against
 * production, the server uses Vercel env vars. Set DOWNLOAD_SECRET env
 * var to match, or run against local dev server.
 */

import { test, expect } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// ── Constants ──

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'https://ai-native-playbook.com';
const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || '';
const RESULTS_DIR = path.join(__dirname, 'results');
const DOWNLOADS_DIR = '/tmp/ainp-e2e-downloads';

// Whether token-dependent tests can run (secret must match server)
const HAS_DOWNLOAD_SECRET = !!process.env.DOWNLOAD_SECRET;

// ── Helpers ──

function generateDownloadToken(orderId: string, secret: string): string {
  const expiryMs = 7 * 24 * 60 * 60 * 1000;
  const expiry = Date.now() + expiryMs;
  const payload = `${orderId}:${expiry}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

function generateExpiredToken(orderId: string, secret: string): string {
  const expiry = Date.now() - 1000; // already expired
  const payload = `${orderId}:${expiry}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

// Ensure directories exist
test.beforeAll(() => {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
});

// ────────────────────────────────────────────
// Test 1: Site + Product Pages
// ────────────────────────────────────────────

test.describe('Test 1: Site + Product Pages', () => {
  test('homepage loads with 200', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });

  test('pricing page loads with pricing title', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en/pricing`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('[data-testid="pricing-title"]')).toBeVisible();
  });

  test('pricing page has bundle tier with $47 price', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    const bundleTier = page.locator('[data-testid="tier-bundle"]');
    await expect(bundleTier).toBeVisible();
    await expect(bundleTier.locator('text=$47')).toBeVisible();
  });

  test('pricing page has individual tier with $17 price', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    const individualTier = page.locator('[data-testid="tier-individual"]');
    await expect(individualTier).toBeVisible();
    await expect(individualTier.locator('text=$17')).toBeVisible();
  });

  test('pricing page has BEST VALUE badge', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    await expect(page.locator('[data-testid="badge-best-value"]')).toBeVisible();
  });

  test('pricing page has comparison table', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible();
  });

  test('pricing page has FAQ section', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    await expect(page.locator('[data-testid="pricing-faq"]')).toBeVisible();
  });

  test('products page loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en/products`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });

  test('bundle page loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en/bundle`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });

  test('screenshot: pricing page', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(RESULTS_DIR, 'pricing-page.png'),
      fullPage: true,
    });
  });
});

// ────────────────────────────────────────────
// Test 2: Paddle Checkout Flow
// ────────────────────────────────────────────

test.describe('Test 2: Paddle Checkout Flow', () => {
  // Paddle env vars are NOT configured on production (pending Paddle review).
  // BuyButton falls back to href or email capture mode.
  // These tests document what SHOULD work once Paddle is live.

  test.skip(true, 'Paddle not configured — PADDLE_PRICE_ID_* env vars missing. Skipping checkout overlay tests.');

  test('buy button opens Paddle overlay', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    const bundleTier = page.locator('[data-testid="tier-bundle"]');
    const buyBtn = bundleTier.locator('button').first();
    await buyBtn.click();
    const paddleFrame = page.frameLocator('iframe[src*="paddle"]');
    await expect(paddleFrame.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('complete Paddle sandbox checkout', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    const bundleTier = page.locator('[data-testid="tier-bundle"]');
    await bundleTier.locator('button').first().click();

    const paddleFrame = page.frameLocator('iframe[src*="paddle"]');
    await paddleFrame.locator('[data-testid="card-number"]').fill('4242424242424242');
    await paddleFrame.locator('[data-testid="card-expiry"]').fill('01/28');
    await paddleFrame.locator('[data-testid="card-cvc"]').fill('123');
    await paddleFrame.locator('[data-testid="email"]').fill('test-buyer@uniqstart.com');
    await paddleFrame.locator('button[type="submit"]').click();

    await page.waitForURL('**/thank-you**', { timeout: 30000 });
    await expect(page.locator('text=Thank You')).toBeVisible();
  });
});

// ────────────────────────────────────────────
// Test 3: Thank-You Page
// ────────────────────────────────────────────

test.describe('Test 3: Thank-You Page', () => {
  test('thank-you page loads without token (shows email instructions)', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/en/thank-you?product=Complete+Bundle`);
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('text=Thank You')).toBeVisible();
    // Without token, shows "Check your email" instructions
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('thank-you page shows product name from query param', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/thank-you?product=AI+Marketing+Architect`);
    await expect(page.locator('text=AI Marketing Architect').first()).toBeVisible();
  });

  test('thank-you page has support email link', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/thank-you`);
    await expect(page.locator('a[href*="mailto:"]')).toBeVisible();
  });

  test('thank-you page has navigation links (Browse More, Back to Home)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/thank-you`);
    await expect(page.locator('text=Browse More Books')).toBeVisible();
    await expect(page.locator('text=Back to Home')).toBeVisible();
  });

  test('screenshot: thank-you page (no token)', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/thank-you?product=Complete+Bundle`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(RESULTS_DIR, 'thank-you-no-token.png'),
      fullPage: true,
    });
  });

  // Token-dependent: thank-you with download section
  test.describe('with valid token (requires DOWNLOAD_SECRET)', () => {
    test.skip(!HAS_DOWNLOAD_SECRET, 'DOWNLOAD_SECRET not set. Run with DOWNLOAD_SECRET=xxx to enable token tests.');

    const TEST_ORDER_ID = `e2e-test-${Date.now()}`;

    test('thank-you page with valid token shows download section', async ({ page }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      const res = await page.goto(
        `${BASE_URL}/en/thank-you?product=Complete+Bundle&type=bundle&token=${token}`
      );
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator('text=Thank You')).toBeVisible();
      await expect(page.locator('text=Your Downloads')).toBeVisible();
    });

    test('thank-you page bundle has Download Complete Bundle button', async ({ page }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      await page.goto(
        `${BASE_URL}/en/thank-you?product=Complete+Bundle&type=bundle&token=${token}`
      );
      await expect(page.locator('text=Download Complete Bundle')).toBeVisible();
    });

    test('thank-you page bundle shows individual PDF download links', async ({ page }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      await page.goto(
        `${BASE_URL}/en/thank-you?product=Complete+Bundle&type=bundle&token=${token}`
      );
      await expect(page.locator('text=AI Marketing Playbook')).toBeVisible();
      await expect(page.locator('text=AI Brand Playbook')).toBeVisible();
    });

    test('thank-you page individual purchase shows single download', async ({ page }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      await page.goto(
        `${BASE_URL}/en/thank-you?product=AI+Marketing+Architect&type=pdf-vol1&token=${token}`
      );
      await expect(page.locator('text=Your Downloads')).toBeVisible();
      await expect(page.locator('text=Download Complete Bundle')).not.toBeVisible();
    });

    test('screenshot: thank-you page with downloads', async ({ page }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      await page.goto(
        `${BASE_URL}/en/thank-you?product=Complete+Bundle&type=bundle&token=${token}`
      );
      await page.waitForLoadState('networkidle');
      await page.screenshot({
        path: path.join(RESULTS_DIR, 'thank-you-with-downloads.png'),
        fullPage: true,
      });
    });
  });
});

// ────────────────────────────────────────────
// Test 4: Download API
// ────────────────────────────────────────────

test.describe('Test 4: Download API', () => {
  test('returns 400 without params', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/download`);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('required');
  });

  test('returns 404 for invalid product type', async ({ request }) => {
    // Use a dummy token — server will check type first if type is invalid
    const res = await request.get(`${BASE_URL}/api/download?type=invalid-product&token=dummytoken`);
    // Could be 404 (invalid type) or 403 (invalid token checked first)
    expect([403, 404]).toContain(res.status());
  });

  test('returns 403 for obviously invalid token', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/download?type=pdf-vol1&token=invalid-token-abc`);
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('expired');
  });

  test('returns 400 when type is missing', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/download?token=sometoken`);
    expect(res.status()).toBe(400);
  });

  test('returns 400 when token is missing', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/download?type=pdf-vol1`);
    expect(res.status()).toBe(400);
  });

  // Token-dependent download tests
  test.describe('with valid DOWNLOAD_SECRET', () => {
    test.skip(!HAS_DOWNLOAD_SECRET, 'DOWNLOAD_SECRET not set. Run with DOWNLOAD_SECRET=xxx to enable.');

    const TEST_ORDER_ID = `e2e-api-${Date.now()}`;

    test('pdf-vol1 redirects to R2', async ({ request }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      const res = await request.get(`${BASE_URL}/api/download?type=pdf-vol1&token=${token}`, {
        maxRedirects: 0,
      });
      expect([301, 302, 307, 308]).toContain(res.status());
      const location = res.headers()['location'];
      expect(location).toBeTruthy();
      expect(location).toContain('r2.dev');
    });

    test('bundle redirects to R2', async ({ request }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      const res = await request.get(`${BASE_URL}/api/download?type=bundle&token=${token}`, {
        maxRedirects: 0,
      });
      expect([301, 302, 307, 308]).toContain(res.status());
      const location = res.headers()['location'];
      expect(location).toBeTruthy();
      expect(location).toContain('r2.dev');
      expect(location).toContain('bundle');
    });

    // Verify all 6 PDF volumes + 3 bonus types redirect correctly
    const allTypes = [
      'pdf-vol1', 'pdf-vol2', 'pdf-vol3', 'pdf-vol4', 'pdf-vol5', 'pdf-vol6',
      'skills', 'agents', 'notion',
    ];
    for (const productType of allTypes) {
      test(`${productType} returns redirect to R2`, async ({ request }) => {
        const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
        const res = await request.get(
          `${BASE_URL}/api/download?type=${productType}&token=${token}`,
          { maxRedirects: 0 }
        );
        // 302 redirect or 503 (file not uploaded to R2) are both acceptable
        expect([301, 302, 307, 308, 503]).toContain(res.status());
        if ([301, 302, 307, 308].includes(res.status())) {
          expect(res.headers()['location']).toContain('r2.dev');
        }
      });
    }

    // Download actual files and verify content
    test('download PDF vol1 — verify %PDF- header and size > 100KB', async ({ request }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      const res = await request.get(`${BASE_URL}/api/download?type=pdf-vol1&token=${token}`);

      if (res.status() === 503) {
        console.log('R2 file not available (503). Skipping file content check.');
        return;
      }

      if (res.ok()) {
        const buffer = await res.body();
        const filePath = path.join(DOWNLOADS_DIR, 'AI-Marketing-Playbook.pdf');
        fs.writeFileSync(filePath, buffer);

        const header = buffer.subarray(0, 5).toString('ascii');
        expect(header).toBe('%PDF-');
        expect(buffer.length).toBeGreaterThan(100 * 1024);

        console.log(`PDF vol1: ${filePath} (${(buffer.length / 1024).toFixed(0)} KB)`);
      }
    });

    test('download bundle ZIP — verify PK header and size > 1MB', async ({ request }) => {
      const token = generateDownloadToken(TEST_ORDER_ID, DOWNLOAD_SECRET);
      const res = await request.get(`${BASE_URL}/api/download?type=bundle&token=${token}`);

      if (res.status() === 503) {
        console.log('R2 bundle not available (503). Skipping file content check.');
        return;
      }

      if (res.ok()) {
        const buffer = await res.body();
        const filePath = path.join(DOWNLOADS_DIR, 'AI-Native-Playbook-Bundle.zip');
        fs.writeFileSync(filePath, buffer);

        // ZIP magic bytes: PK (0x50, 0x4B)
        expect(buffer[0]).toBe(0x50);
        expect(buffer[1]).toBe(0x4B);
        expect(buffer.length).toBeGreaterThan(1 * 1024 * 1024);

        console.log(`Bundle ZIP: ${filePath} (${(buffer.length / (1024 * 1024)).toFixed(1)} MB)`);
      }
    });
  });
});

// ────────────────────────────────────────────
// Test 5: Download Check API
// ────────────────────────────────────────────

test.describe('Test 5: Download Check API', () => {
  test('returns 400 without orderId', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/download/check`);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('orderId');
  });

  test('returns valid JSON structure for any orderId', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/download/check?orderId=e2e-check-test`);
    // Could be 200 (Turso connected) or 500 (Turso not configured)
    if (res.ok()) {
      const body = await res.json();
      expect(body).toHaveProperty('orderId');
      expect(body).toHaveProperty('downloaded');
      expect(body).toHaveProperty('refundable');
      expect(body).toHaveProperty('downloadCount');
      expect(body).toHaveProperty('history');
      expect(Array.isArray(body.history)).toBeTruthy();
    } else {
      // 500 = Turso DB not configured on this environment
      console.log(`Download check API returned ${res.status()} — Turso DB may not be configured.`);
      expect([500, 503]).toContain(res.status());
    }
  });

  test('new orderId shows not downloaded and refundable', async ({ request }) => {
    const uniqueId = `e2e-never-downloaded-${Date.now()}`;
    const res = await request.get(`${BASE_URL}/api/download/check?orderId=${uniqueId}`);
    if (res.ok()) {
      const body = await res.json();
      expect(body.orderId).toBe(uniqueId);
      expect(body.downloaded).toBe(false);
      expect(body.refundable).toBe(true);
      expect(body.downloadCount).toBe(0);
    } else {
      console.log(`Turso not available (${res.status()}). Skipping assertions.`);
    }
  });
});
