/**
 * Download API route for AI Native Playbook
 *
 * GET /api/download?type={productType}&token={downloadToken}
 *
 * Flow:
 * 1. Validate type and token params
 * 2. Verify HMAC download token
 * 3. Look up R2 file URL
 * 4. Log download (async, non-blocking)
 * 5. Redirect to R2 file URL
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyDownloadToken,
  getProductFile,
  isValidProductType,
} from "@/lib/download";
import { logDownload } from "@/lib/download-log";
import { isRefunded } from "@/lib/refund-guard";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const token = searchParams.get("token");

  if (!type || !token) {
    return NextResponse.json(
      { error: "type and token are required." },
      { status: 400 }
    );
  }

  if (!isValidProductType(type)) {
    return NextResponse.json(
      { error: "Invalid product type." },
      { status: 404 }
    );
  }

  const { valid, orderId } = verifyDownloadToken(token);
  if (!valid || !orderId) {
    return NextResponse.json(
      { error: "Download link expired or invalid." },
      { status: 403 }
    );
  }

  // Block download if order has been refunded
  const refunded = await isRefunded(orderId);
  if (refunded) {
    return NextResponse.json(
      {
        error:
          "Download access revoked due to refund. Contact hello@ai-native-playbook.com if you believe this is an error.",
      },
      { status: 403 }
    );
  }

  const product = getProductFile(type);
  if (!product || !product.url) {
    return NextResponse.json(
      {
        error:
          "File not ready yet. Contact hello@ai-native-playbook.com",
      },
      { status: 503 }
    );
  }

  // Log download asynchronously (don't block the redirect)
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";
  const userAgent = request.headers.get("user-agent") || "";

  logDownload({ orderId, productType: type, ip, userAgent }).catch((err) =>
    console.error("[download] log failed:", err)
  );

  return NextResponse.redirect(product.url);
}
