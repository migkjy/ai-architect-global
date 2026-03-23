import { NextResponse } from "next/server";

export async function GET() {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const checks: Record<string, { ok: boolean; detail?: string }> = {};

  // Brevo API key health check
  if (!brevoApiKey) {
    checks.brevo = { ok: false, detail: "BREVO_API_KEY not set" };
  } else {
    try {
      const res = await fetch("https://api.brevo.com/v3/account", {
        headers: { "api-key": brevoApiKey },
      });
      if (res.ok) {
        const data = await res.json();
        checks.brevo = {
          ok: true,
          detail: `Account: ${data.companyName ?? data.email ?? "valid"}`,
        };
      } else {
        const errorText = await res.text();
        checks.brevo = {
          ok: false,
          detail: `HTTP ${res.status}: ${errorText.slice(0, 200)}`,
        };
      }
    } catch (err) {
      checks.brevo = {
        ok: false,
        detail: `Fetch error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    { status: allOk ? "healthy" : "degraded", checks },
    { status: allOk ? 200 : 503 }
  );
}
