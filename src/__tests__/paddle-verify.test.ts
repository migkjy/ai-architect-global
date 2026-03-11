/**
 * Paddle signature verification tests (src/lib/paddle.ts)
 */

import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verifyPaddleWebhook } from "@/lib/paddle";

const SECRET = "whsec_test_secret";

function sign(body: string, secret: string, timestamp?: string): string {
  const ts = timestamp ?? Math.floor(Date.now() / 1000).toString();
  const signedPayload = `${ts}:${body}`;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(signedPayload).digest("hex");
  return `ts=${ts};h1=${digest}`;
}

describe("verifyPaddleWebhook", () => {
  it("should return true for valid signature", () => {
    const body = '{"event_type":"test"}';
    const sig = sign(body, SECRET);
    expect(verifyPaddleWebhook(body, sig, SECRET)).toBe(true);
  });

  it("should return false for wrong secret", () => {
    const body = '{"event_type":"test"}';
    const sig = sign(body, "wrong-secret");
    expect(verifyPaddleWebhook(body, sig, SECRET)).toBe(false);
  });

  it("should return false for tampered body", () => {
    const body = '{"event_type":"test"}';
    const sig = sign(body, SECRET);
    expect(verifyPaddleWebhook(body + "x", sig, SECRET)).toBe(false);
  });

  it("should return false for missing ts or h1", () => {
    expect(verifyPaddleWebhook("{}", "h1=abc", SECRET)).toBe(false);
    expect(verifyPaddleWebhook("{}", "ts=123", SECRET)).toBe(false);
  });

  it("should return false for empty signature header", () => {
    expect(verifyPaddleWebhook("{}", "", SECRET)).toBe(false);
  });

  it("should return false for malformed hex in signature", () => {
    // Non-hex characters should cause timingSafeEqual to fail gracefully
    expect(verifyPaddleWebhook("{}", "ts=1;h1=not_hex_zzzz", SECRET)).toBe(false);
  });
});
