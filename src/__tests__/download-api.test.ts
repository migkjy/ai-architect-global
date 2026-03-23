/**
 * Download API route tests for AI Native Playbook
 *
 * Covers:
 * - Missing type/token returns 400
 * - Invalid product type returns 404
 * - Invalid/expired token returns 403
 * - Valid request logs download and redirects to R2
 * - Download check API returns correct refund status
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/download", () => ({
  verifyDownloadToken: vi.fn(),
  getProductFile: vi.fn(),
  isValidProductType: vi.fn(),
}));

vi.mock("@/lib/download-log", () => ({
  logDownload: vi.fn().mockResolvedValue(undefined),
  hasDownloaded: vi.fn(),
  getDownloadHistory: vi.fn(),
}));

describe("GET /api/download", () => {
  let GET: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Re-mock after resetModules
    vi.doMock("@/lib/download", () => ({
      verifyDownloadToken: vi.fn(),
      getProductFile: vi.fn(),
      isValidProductType: vi.fn(),
    }));
    vi.doMock("@/lib/download-log", () => ({
      logDownload: vi.fn().mockResolvedValue(undefined),
      hasDownloaded: vi.fn(),
      getDownloadHistory: vi.fn(),
    }));

    const mod = await import("@/app/api/download/route");
    GET = mod.GET;
  });

  it("returns 400 when type and token are missing", async () => {
    const req = new NextRequest("http://localhost/api/download");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 for invalid product type", async () => {
    const { isValidProductType } = await import("@/lib/download");
    (isValidProductType as ReturnType<typeof vi.fn>).mockReturnValue(false);

    const req = new NextRequest(
      "http://localhost/api/download?type=fake&token=abc"
    );
    const res = await GET(req);
    expect(res.status).toBe(404);
  });

  it("returns 403 for invalid/expired token", async () => {
    const { isValidProductType, verifyDownloadToken } = await import(
      "@/lib/download"
    );
    (isValidProductType as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (verifyDownloadToken as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: false,
    });

    const req = new NextRequest(
      "http://localhost/api/download?type=pdf-vol1&token=expired"
    );
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("redirects to R2 URL and logs download on valid request", async () => {
    const { isValidProductType, verifyDownloadToken, getProductFile } =
      await import("@/lib/download");
    const { logDownload } = await import("@/lib/download-log");

    (isValidProductType as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (verifyDownloadToken as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: true,
      orderId: "txn_123",
    });
    (getProductFile as ReturnType<typeof vi.fn>).mockReturnValue({
      url: "https://files.ai-native-playbook.com/en/pdf/ai-marketing-playbook.pdf",
      filename: "AI-Marketing-Playbook.pdf",
    });

    const req = new NextRequest(
      "http://localhost/api/download?type=pdf-vol1&token=valid-token"
    );
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("ai-marketing-playbook.pdf");
    expect(logDownload).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: "txn_123",
        productType: "pdf-vol1",
      })
    );
  });

  it("returns 503 when product file URL is not available", async () => {
    const { isValidProductType, verifyDownloadToken, getProductFile } =
      await import("@/lib/download");

    (isValidProductType as ReturnType<typeof vi.fn>).mockReturnValue(true);
    (verifyDownloadToken as ReturnType<typeof vi.fn>).mockReturnValue({
      valid: true,
      orderId: "txn_123",
    });
    (getProductFile as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const req = new NextRequest(
      "http://localhost/api/download?type=pdf-vol1&token=valid"
    );
    const res = await GET(req);
    expect(res.status).toBe(503);
  });
});

describe("GET /api/download/check", () => {
  let GET: (req: NextRequest) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.doMock("@/lib/download-log", () => ({
      hasDownloaded: vi.fn(),
      getDownloadHistory: vi.fn(),
    }));

    const mod = await import("@/app/api/download/check/route");
    GET = mod.GET;
  });

  it("returns 400 when orderId is missing", async () => {
    const req = new NextRequest("http://localhost/api/download/check");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns refundable=true when no downloads exist", async () => {
    const { hasDownloaded, getDownloadHistory } = await import(
      "@/lib/download-log"
    );
    (hasDownloaded as ReturnType<typeof vi.fn>).mockResolvedValue(false);
    (getDownloadHistory as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const req = new NextRequest(
      "http://localhost/api/download/check?orderId=txn_new"
    );
    const res = await GET(req);
    const json = await res.json();

    expect(json.orderId).toBe("txn_new");
    expect(json.downloaded).toBe(false);
    expect(json.refundable).toBe(true);
  });

  it("returns refundable=false when downloads exist", async () => {
    const { hasDownloaded, getDownloadHistory } = await import(
      "@/lib/download-log"
    );
    (hasDownloaded as ReturnType<typeof vi.fn>).mockResolvedValue(true);
    (getDownloadHistory as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        product_type: "pdf-vol1",
        downloaded_at: 1711000000000,
        ip: "1.2.3.4",
      },
    ]);

    const req = new NextRequest(
      "http://localhost/api/download/check?orderId=txn_downloaded"
    );
    const res = await GET(req);
    const json = await res.json();

    expect(json.downloaded).toBe(true);
    expect(json.refundable).toBe(false);
    expect(json.downloadCount).toBe(1);
  });
});
