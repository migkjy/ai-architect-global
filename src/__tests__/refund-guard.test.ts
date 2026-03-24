/**
 * Refund guard tests for AI Native Playbook
 *
 * Covers:
 * - markRefunded() inserts into refunded_orders
 * - isRefunded() returns true when transaction is in refunded_orders
 * - isRefunded() returns false when transaction not refunded
 * - markRefunded() is idempotent (no error on duplicate)
 * - DB unavailable → isRefunded() returns false (fail-open for safety)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockExecute = vi.fn();
vi.mock("@libsql/client", () => ({
  createClient: vi.fn(() => ({ execute: mockExecute })),
}));

describe("refund-guard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("TURSO_DATABASE_URL", "libsql://test.turso.io");
    vi.stubEnv("TURSO_AUTH_TOKEN", "test-token");
  });

  it("markRefunded() inserts a record into refunded_orders", async () => {
    mockExecute.mockResolvedValue({ rowsAffected: 1 });
    const { markRefunded } = await import("@/lib/refund-guard");

    await markRefunded({
      transactionId: "txn_refund_001",
      customerEmail: "buyer@example.com",
      productName: "AI Native Playbook Vol.1",
      amount: 2900,
      currency: "USD",
    });

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining("INSERT OR IGNORE INTO refunded_orders"),
        args: expect.arrayContaining(["txn_refund_001", "buyer@example.com"]),
      })
    );
  });

  it("isRefunded() returns true when transaction is in refunded_orders", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 1 }] });
    const { isRefunded } = await import("@/lib/refund-guard");

    const result = await isRefunded("txn_refund_001");
    expect(result).toBe(true);
  });

  it("isRefunded() returns false when transaction not refunded", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 0 }] });
    const { isRefunded } = await import("@/lib/refund-guard");

    const result = await isRefunded("txn_valid_purchase");
    expect(result).toBe(false);
  });

  it("isRefunded() queries correct table and column", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 0 }] });
    const { isRefunded } = await import("@/lib/refund-guard");

    await isRefunded("txn_check_123");

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining("refunded_orders"),
        args: expect.arrayContaining(["txn_check_123"]),
      })
    );
  });

  it("markRefunded() uses INSERT OR IGNORE for idempotency", async () => {
    mockExecute.mockResolvedValue({ rowsAffected: 0 }); // already exists
    const { markRefunded } = await import("@/lib/refund-guard");

    // Should not throw on duplicate
    await expect(
      markRefunded({
        transactionId: "txn_duplicate",
        customerEmail: "buyer@example.com",
        productName: "AI Native Playbook",
        amount: 2900,
        currency: "USD",
      })
    ).resolves.not.toThrow();
  });

  it("isRefunded() returns false when DB is unavailable (fail-open)", async () => {
    vi.stubEnv("TURSO_DATABASE_URL", "");
    const { isRefunded } = await import("@/lib/refund-guard");

    const result = await isRefunded("txn_any");
    // fail-open: no DB means we can't verify refund status, return false
    expect(result).toBe(false);
  });

  it("isRefunded() returns false when DB query throws", async () => {
    mockExecute.mockRejectedValue(new Error("DB connection error"));
    const { isRefunded } = await import("@/lib/refund-guard");

    const result = await isRefunded("txn_error");
    expect(result).toBe(false);
  });
});
