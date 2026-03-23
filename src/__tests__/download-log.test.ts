/**
 * Download log (tracking) tests for AI Native Playbook
 *
 * Covers:
 * - logDownload() inserts into download_logs
 * - hasDownloaded() returns true when records exist
 * - hasDownloaded() returns false when no records
 * - getDownloadHistory() returns ordered history
 * - isRefundable() returns inverse of hasDownloaded
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const mockExecute = vi.fn();
vi.mock("@libsql/client", () => ({
  createClient: vi.fn(() => ({ execute: mockExecute })),
}));

describe("download-log", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    vi.stubEnv("TURSO_DATABASE_URL", "libsql://test.turso.io");
    vi.stubEnv("TURSO_AUTH_TOKEN", "test-token");
  });

  it("logDownload() inserts a record into download_logs", async () => {
    mockExecute.mockResolvedValue({ rowsAffected: 1 });
    const { logDownload } = await import("@/lib/download-log");

    await logDownload({
      orderId: "txn_paddle_123",
      productType: "pdf-vol1",
      ip: "1.2.3.4",
      userAgent: "Mozilla/5.0",
    });

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({
        sql: expect.stringContaining("INSERT INTO download_logs"),
        args: expect.arrayContaining(["txn_paddle_123", "pdf-vol1"]),
      })
    );
  });

  it("hasDownloaded() returns true when download records exist", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 3 }] });
    const { hasDownloaded } = await import("@/lib/download-log");

    const result = await hasDownloaded("txn_paddle_123");
    expect(result).toBe(true);
  });

  it("hasDownloaded() returns false when no download records", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 0 }] });
    const { hasDownloaded } = await import("@/lib/download-log");

    const result = await hasDownloaded("txn_new_order");
    expect(result).toBe(false);
  });

  it("getDownloadHistory() returns ordered download history", async () => {
    mockExecute.mockResolvedValue({
      rows: [
        { product_type: "bundle", downloaded_at: 1711000001000, ip: "1.2.3.4" },
        { product_type: "pdf-vol1", downloaded_at: 1711000000000, ip: "1.2.3.4" },
      ],
    });
    const { getDownloadHistory } = await import("@/lib/download-log");

    const history = await getDownloadHistory("txn_paddle_123");
    expect(history).toHaveLength(2);
    expect(history[0].product_type).toBe("bundle");
    expect(history[1].product_type).toBe("pdf-vol1");
  });

  it("isRefundable() returns true when no downloads exist", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 0 }] });
    const { isRefundable } = await import("@/lib/download-log");

    expect(await isRefundable("txn_new")).toBe(true);
  });

  it("isRefundable() returns false when downloads exist", async () => {
    mockExecute.mockResolvedValue({ rows: [{ count: 1 }] });
    const { isRefundable } = await import("@/lib/download-log");

    expect(await isRefundable("txn_downloaded")).toBe(false);
  });
});
