import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  isHoneypotFilled,
  checkRateLimit,
  validateSubscribeInput,
} from "@/lib/spam-protection";
import { scheduleOnboardingSequence } from "@/lib/onboarding-sequence";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, website } = body;

    // Layer 1: Honeypot
    if (isHoneypotFilled(website)) {
      return NextResponse.json({ success: true });
    }

    // Layer 2: Rate limiting
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Layer 3: Input validation
    const validation = validateSubscribeInput({ email, name });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    // Add contact to Brevo list 7 (unified list)
    const attributes: Record<string, string> = {
      SOURCE: "ai-architect-free-guide",
    };
    if (name) attributes.FIRSTNAME = name;

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        email: sanitizedEmail,
        attributes,
        listIds: [7],
        updateEnabled: true,
      }),
    });

    if (!res.ok && res.status !== 204) {
      const errorText = await res.text();
      if (res.status === 400 && errorText.includes("already exist")) {
        return NextResponse.json({ success: true });
      }
      console.error("[subscribe-guide] Brevo API error:", res.status, errorText);
      // Intentional: still return success below to avoid breaking user flow.
      // The contact may not have been added — check Brevo logs.
    }

    // Unified onboarding sequence (D+0/D+1/D+3/D+7 with dedup)
    void scheduleOnboardingSequence(sanitizedEmail, name ?? undefined);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe-guide] Unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
