/**
 * Download check API for AI Native Playbook
 *
 * GET /api/download/check?orderId={orderId}
 *
 * Returns download history and refund eligibility for an order.
 * Used by:
 * - Paddle refund webhook to check if download occurred
 * - Admin dashboard to verify delivery status
 */

import { NextRequest, NextResponse } from "next/server";
import { hasDownloaded, getDownloadHistory } from "@/lib/download-log";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "orderId is required." },
      { status: 400 }
    );
  }

  const downloaded = await hasDownloaded(orderId);
  const history = downloaded ? await getDownloadHistory(orderId) : [];

  return NextResponse.json({
    orderId,
    downloaded,
    refundable: !downloaded,
    downloadCount: history.length,
    history: history.slice(0, 10), // Last 10 entries only
  });
}
