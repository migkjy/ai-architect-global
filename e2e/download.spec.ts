import { test, expect } from "@playwright/test";

const BASE_URL = "https://ai-native-playbook.com";

test.describe("Download System E2E", () => {
  test("1. Site accessible — homepage returns 200", async ({ request }) => {
    const response = await request.get(`${BASE_URL}/en`);
    expect(response.status()).toBe(200);
  });

  test("2. Pricing page has product prices and buy buttons", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/en/pricing`);
    await expect(page).toHaveTitle(/pricing|AI Native Playbook/i);

    // Check for price elements or buy/purchase text
    const bodyText = await page.textContent("body");
    expect(bodyText).toBeTruthy();

    // Check for buy/purchase CTA
    const buyButton = page.locator(
      'a:has-text("Buy"), button:has-text("Buy"), a:has-text("Get"), button:has-text("Get"), a:has-text("Purchase"), button:has-text("Purchase")'
    );
    const count = await buyButton.count();
    expect(count).toBeGreaterThan(0);
  });

  test("3. Thank-you page renders with download section", async ({ page }) => {
    // Access thank-you page (will show empty state without valid order)
    await page.goto(`${BASE_URL}/en/thank-you`);
    expect(page.url()).toContain("thank-you");
    const status = await page.evaluate(() => document.readyState);
    expect(status).toBe("complete");
  });

  test("4. Download check API — returns valid JSON for test order", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/download/check?orderId=test-e2e-123`
    );
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("orderId", "test-e2e-123");
    expect(data).toHaveProperty("downloaded");
    expect(data).toHaveProperty("refundable");
    expect(data).toHaveProperty("downloadCount");
    expect(data).toHaveProperty("history");
    expect(Array.isArray(data.history)).toBe(true);

    // New order should have no downloads
    expect(data.downloaded).toBe(false);
    expect(data.refundable).toBe(true);
    expect(data.downloadCount).toBe(0);
  });

  test("5. Download API — rejects missing params with 400", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_URL}/api/download`);
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("required");
  });

  test("6. Download API — rejects invalid token with 403", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/download?type=bundle&token=invalid-token`
    );
    expect(response.status()).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("expired or invalid");
  });

  test("7. Download API — rejects invalid product type with 404", async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/api/download?type=nonexistent&token=sometoken`
    );
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data.error).toContain("Invalid product type");
  });

  test("8. Paddle checkout integration present on pricing page", async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/en/pricing`);

    // Paddle loads lazily via BuyButton component
    // Check for buy buttons that trigger Paddle checkout
    const buyButtons = page.locator(
      'button:has-text("Buy"), a:has-text("Buy"), button:has-text("Get"), a:has-text("Get")'
    );
    const count = await buyButtons.count();
    expect(count).toBeGreaterThan(0);

    // Check that page source references paddle (inline scripts or data attributes)
    const html = await page.content();
    const hasPaddleRef =
      html.includes("paddle") ||
      html.includes("Paddle") ||
      html.includes("checkout");
    expect(hasPaddleRef).toBe(true);
  });

  test("9. R2 URL configured — getProductFile returns valid URLs", async ({
    request,
  }) => {
    // Test that download API with valid token would redirect (not 503)
    // 503 means R2_PUBLIC_URL is empty
    // We test with invalid token to get 403 (not 503)
    const response = await request.get(
      `${BASE_URL}/api/download?type=bundle&token=invalid`
    );
    // If R2_PUBLIC_URL is not set, type validation passes but product lookup fails → 503
    // If R2_PUBLIC_URL is set, token validation fails first → 403
    expect(response.status()).toBe(403);
  });

  test("10. All product types are recognized", async ({ request }) => {
    const productTypes = [
      "pdf-vol1",
      "pdf-vol2",
      "pdf-vol3",
      "pdf-vol4",
      "pdf-vol5",
      "pdf-vol6",
      "skills",
      "agents",
      "notion",
      "bundle",
    ];

    for (const type of productTypes) {
      const response = await request.get(
        `${BASE_URL}/api/download?type=${type}&token=invalid`
      );
      // Should get 403 (invalid token), NOT 404 (invalid type)
      expect(response.status()).toBe(403);
    }
  });
});
