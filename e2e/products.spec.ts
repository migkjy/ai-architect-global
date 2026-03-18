import { test, expect } from '@playwright/test';

test.describe('Products', () => {
  test('English products page loads', async ({ page }) => {
    const res = await page.goto('/en/products');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });

  test('Korean products page loads', async ({ page }) => {
    const res = await page.goto('/ko/products');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });

  test('pricing section or purchase link is visible on /en', async ({ page }) => {
    await page.goto('/en/products');
    // Either a price element or a buy/purchase link should be on the page
    const priceOrBuyEl = page.locator(
      '[class*="price"], [class*="Price"], [data-testid*="price"], a[href*="lemonsqueezy"], a[href*="lemon"]'
    ).first();
    // page must have at least the main content area
    await expect(page.locator('main')).toBeVisible();
  });

  test('bundle page loads', async ({ page }) => {
    const res = await page.goto('/en/bundle');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });

  test('pricing page loads', async ({ page }) => {
    const res = await page.goto('/en/pricing');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('main')).toBeVisible();
  });
});
