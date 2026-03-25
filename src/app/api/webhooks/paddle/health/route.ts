/**
 * Paddle Webhook Health Check
 *
 * GET /api/webhooks/paddle/health
 *
 * Returns the status of all webhook-related env vars and
 * fetches Paddle notification settings to verify webhook URL.
 *
 * Auth: Bearer PADDLE_API_KEY
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const expectedKey = process.env.PADDLE_API_KEY;

  if (!expectedKey) {
    return NextResponse.json(
      { error: "PADDLE_API_KEY not configured" },
      { status: 500 }
    );
  }

  const providedToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!providedToken || providedToken !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";
  const paddleBaseUrl =
    paddleEnv === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com";

  // Check env vars
  const envStatus = {
    PADDLE_WEBHOOK_SECRET: !!process.env.PADDLE_WEBHOOK_SECRET,
    PADDLE_API_KEY: !!process.env.PADDLE_API_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL || "(not set)",
    DOWNLOAD_SECRET: !!process.env.DOWNLOAD_SECRET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "(not set)",
    NEXT_PUBLIC_PADDLE_ENVIRONMENT: paddleEnv,
    TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: !!process.env.TELEGRAM_CHAT_ID,
    TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
  };

  // Fetch Paddle notification settings
  let paddleNotifications: unknown = null;
  let paddleError: string | null = null;
  try {
    const res = await fetch(`${paddleBaseUrl}/notification-settings`, {
      headers: {
        Authorization: `Bearer ${expectedKey}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();
      // Extract just the URLs and subscribed events
      paddleNotifications = (json.data ?? []).map(
        (ns: Record<string, unknown>) => ({
          id: ns.id,
          description: ns.description,
          destination: ns.destination,
          active: ns.active,
          subscribed_events: ns.subscribed_events,
          api_version: ns.api_version,
        })
      );
    } else {
      paddleError = `Paddle API error: ${res.status} ${await res.text()}`;
    }
  } catch (err) {
    paddleError =
      err instanceof Error ? err.message : "Failed to fetch Paddle settings";
  }

  // Check R2 accessibility
  let r2Status = "not tested";
  const r2Url = process.env.R2_PUBLIC_URL;
  if (r2Url) {
    try {
      const testUrl = `${r2Url}/en/pdf/ai-marketing-playbook.pdf`;
      const r2Res = await fetch(testUrl, { method: "HEAD" });
      r2Status = `${r2Res.status} ${r2Res.statusText}`;
    } catch (err) {
      r2Status = `error: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: paddleEnv,
    envVars: envStatus,
    paddleNotifications: paddleNotifications ?? paddleError,
    r2FileAccess: r2Status,
    expectedWebhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ai-native-playbook.com"}/api/webhooks/paddle`,
  });
}
