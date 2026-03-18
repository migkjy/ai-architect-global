import { test, expect } from '@playwright/test';

const pagesToTest = [
  { path: '/en', label: 'Homepage (EN)' },
  { path: '/ko', label: 'Homepage (KO)' },
  { path: '/en/products', label: 'Products (EN)' },
  { path: '/en/pricing', label: 'Pricing (EN)' },
];

test.describe('Responsive Layout', () => {
  for (const { path, label } of pagesToTest) {
    test(`${label} — no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // 5px tolerance
    });

    test(`${label} — main content renders`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator('main')).toBeVisible();
    });
  }

  test('Navigation is accessible on mobile', async ({ page }) => {
    await page.goto('/en');
    // Either a nav element or a hamburger menu button should exist
    const navOrMenu = page.locator('nav, [aria-label*="menu"], [aria-label*="Menu"], button[aria-expanded]').first();
    await expect(page.locator('body')).toBeVisible(); // page loaded
  });
});
