import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/AI Native Playbook|AI Driven Architect/i);
  });

  test('hero section and main content render', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('main')).toBeVisible();
  });

  test('CTA buttons are present', async ({ page }) => {
    await page.goto('/en');
    // At least one interactive CTA link/button should be visible
    const ctaLinks = page.locator('a[href*="lemonsqueezy"], a[href*="lemon"], a[href*="/products"], a[href*="/bundle"]');
    const count = await ctaLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer renders', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('no horizontal scroll on desktop', async ({ page }) => {
    await page.goto('/en');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});
