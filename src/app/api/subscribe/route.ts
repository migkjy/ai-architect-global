import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  isHoneypotFilled,
  checkRateLimit,
  validateSubscribeInput,
  verifyTurnstile,
} from "@/lib/spam-protection";
import { scheduleOnboardingSequence } from "@/lib/onboarding-sequence";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, website, turnstileToken } = body;

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

    // Layer 4: Turnstile verification
    if (turnstileToken) {
      const turnstileValid = await verifyTurnstile(turnstileToken);
      if (!turnstileValid) {
        return NextResponse.json(
          { error: "Verification failed" },
          { status: 400 }
        );
      }
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (brevoApiKey) {
      // Add contact to Brevo list 7
      const attributes: Record<string, string> = { SOURCE: "ai-architect" };
      if (name) attributes.FIRSTNAME = name;

      try {
        const res = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            email: sanitizedEmail,
            attributes,
            listIds: [
              process.env.BREVO_LIST_ID
                ? parseInt(process.env.BREVO_LIST_ID, 10)
                : 7,
            ],
            updateEnabled: true,
          }),
        });

        if (!res.ok && res.status !== 204) {
          await res.text();
        }
      } catch {
        // Brevo contact API error — continue
      }

      // Lead magnet transactional email (immediate, separate from onboarding)
      try {
        await fetch("https://api.brevo.com/v3/contacts", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
          body: JSON.stringify({
            email: sanitizedEmail,
            attributes: { LEAD_MAGNET_SENT: "true" },
          }),
        });

        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: { "Content-Type": "application/json", "api-key": brevoApiKey },
          body: JSON.stringify({
            to: [{ email: sanitizedEmail, name: name || sanitizedEmail }],
            sender: { name: "AI Native Playbook", email: "contact@apppro.kr" },
            subject: "Your Free AI Framework Preview + 3 System Prompts",
            htmlContent: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:24px"><h1 style="color:#1e3a5f;">Your AI Framework Preview is Ready</h1><p>Thanks for joining the AI Native Playbook community${name ? `, ${name}` : ""}!</p><p>Here's what you get:</p><ul style="line-height:2;"><li><strong>AI Framework Preview</strong> -- Core concepts from 6 world-class frameworks</li><li><strong>3 System Prompts</strong> -- Ready to paste into Claude or ChatGPT</li><li><strong>Early-bird discount</strong> -- When we launch</li></ul><div style="text-align:center;margin:28px 0;"><a href="https://ai-native-playbook.com/products" style="display:inline-block;background:#f59e0b;color:#1a1a1a;padding:14px 32px;border-radius:8px;font-weight:bold;text-decoration:none;">Explore AI Native Playbook Series</a></div><p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;text-align:center;"><a href="https://ai-native-playbook.com" style="color:#1e3a5f;text-decoration:none;">AI Native Playbook Series</a></p></div>`,
          }),
        });
      } catch {
        // Lead magnet email failed — non-critical
      }

      // Unified onboarding sequence (D+0/D+1/D+3/D+7 with dedup)
      void scheduleOnboardingSequence(sanitizedEmail, name ?? undefined);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
