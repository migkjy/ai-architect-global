import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  isHoneypotFilled,
  checkRateLimit,
  validateSubscribeInput,
  verifyTurnstile,
} from "@/lib/spam-protection";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, website, turnstileToken } = body;

    // Layer 1: Honeypot
    if (isHoneypotFilled(website)) {
      // Silent success to not reveal detection
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
      // Brevo 구독자 추가
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
        // Brevo API error - subscriber still saved
      }

      // 리드마그넷 transactional email (AI 건축 설계 샘플 패키지)
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
            htmlContent: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:24px"><h1 style="color:#1e3a5f;">Your AI Framework Preview is Ready</h1><p>Thanks for joining the AI Native Playbook community${name ? `, ${name}` : ""}!</p><p>Here's what you get:</p><ul style="line-height:2;"><li><strong>AI Framework Preview</strong> -- Core concepts from 6 world-class frameworks</li><li><strong>3 System Prompts</strong> -- Ready to paste into Claude or ChatGPT</li><li><strong>Early-bird discount</strong> -- When we launch</li></ul><div style="text-align:center;margin:28px 0;"><a href="https://ai-driven-architect.com/products" style="display:inline-block;background:#f59e0b;color:#1a1a1a;padding:14px 32px;border-radius:8px;font-weight:bold;text-decoration:none;">Explore AI Native Playbook Series</a></div><p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;text-align:center;"><a href="https://ai-driven-architect.com" style="color:#1e3a5f;text-decoration:none;">AI Native Playbook Series</a></p></div>`,
          }),
        });
      } catch {
        // Lead magnet email failed - subscriber still saved
      }

      // Welcome sequence (D+0, D+3, D+7) — English only
      const greeting = name ? `Hi ${name},` : "Hi there,";
      const sender = { name: "AI Native Playbook Series", email: "contact@apppro.kr" };
      const to = [{ email: sanitizedEmail, name: name || sanitizedEmail }];
      const brand = { color: "#0B1426", gold: "#D4A843", url: "https://ai-driven-architect.com" };
      const footer = `<hr style="border:none;border-top:1px solid #e8e4dc;margin:40px 0 24px;" /><p style="color:#999;font-size:12px;text-align:center;margin:0;line-height:1.8;">AI Native Playbook Series &bull; ai-driven-architect.com<br />You're receiving this because you subscribed to our newsletter.<br /><a href="{{ unsubscribe }}" style="color:#999;text-decoration:underline;">Unsubscribe</a></p>`;

      const sequence = [
        {
          delayDays: 0,
          subject: "Welcome to AI Native Playbook",
          htmlContent: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;"><div style="background:${brand.color};border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;"><p style="margin:0;color:${brand.gold};font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">AI Native Playbook Series</p></div><div style="background:#fff;border-radius:0 0 12px 12px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);"><p style="color:#333;font-size:16px;line-height:1.7;">${greeting}</p><p style="color:#333;font-size:16px;line-height:1.7;">Thanks for subscribing to the AI Native Playbook newsletter! We share practical insights on how AI is transforming business operations — every week.</p><p style="color:${brand.color};font-size:17px;font-weight:700;margin:28px 0 12px 0;">What you'll get as a subscriber</p><ul style="color:#555;font-size:15px;line-height:2;"><li>Latest AI business automation trends</li><li>Ready-to-use prompt templates</li><li>Expert frameworks and case studies</li></ul><div style="border-left:4px solid ${brand.gold};padding:16px 20px;margin:24px 0;background:#faf8f5;border-radius:0 8px 8px 0;"><strong style="color:${brand.color};">Coming in 3 days</strong><br/><span style="color:#555;">3 principles every AI-native business gets right — and how to apply them.</span></div><p style="color:#555;font-size:15px;margin:16px 0 0 0;">Welcome aboard,<br /><strong style="color:${brand.color};">The AI Native Playbook Team</strong></p>${footer}</div></div>`,
        },
        {
          delayDays: 3,
          subject: "3 Principles Every AI-Native Business Gets Right",
          htmlContent: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;"><div style="background:${brand.color};border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;"><p style="margin:0;color:${brand.gold};font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">AI Native Playbook Series</p></div><div style="background:#fff;border-radius:0 0 12px 12px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);"><p style="color:${brand.color};font-size:22px;font-weight:700;margin:0 0 8px 0;">3 Principles Every AI-Native Business Gets Right</p><p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 3 &bull; AI Native Playbook Series</p><p style="color:#333;font-size:16px;line-height:1.7;">${greeting}</p><p style="color:#333;font-size:16px;line-height:1.7;">Here are three principles that separate businesses thriving with AI from those still experimenting.</p><div style="border-left:4px solid ${brand.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;"><p style="color:${brand.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">1. Context determines quality</p><p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Structure your requirements, constraints, and goals before feeding them to AI. Better input = dramatically better output.</p></div><div style="border-left:4px solid ${brand.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;"><p style="color:${brand.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">2. Automate the repetitive, not the creative</p><p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Use AI to handle repeatable workflows — drafting, analysis, scheduling — so you can focus on strategy and decisions.</p></div><div style="border-left:4px solid ${brand.gold};padding:16px 20px;margin:0 0 32px 0;background:#faf8f5;border-radius:0 8px 8px 0;"><p style="color:${brand.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">3. AI proposes, you decide</p><p style="color:#555;font-size:15px;line-height:1.6;margin:0;">The most effective AI users treat it as a thought partner, not a replacement. Evaluate AI suggestions with your domain expertise.</p></div><p style="color:#555;font-size:15px;margin:16px 0 0 0;">More coming in a few days,<br /><strong style="color:${brand.color};">The AI Native Playbook Team</strong></p>${footer}</div></div>`,
        },
        {
          delayDays: 7,
          subject: "Ready to Go AI-Native? Here's Your Next Step",
          htmlContent: `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;"><div style="background:${brand.color};border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;"><p style="margin:0;color:${brand.gold};font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">AI Native Playbook Series</p></div><div style="background:#fff;border-radius:0 0 12px 12px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);"><p style="color:${brand.color};font-size:22px;font-weight:700;margin:0 0 8px 0;">Ready to Go AI-Native?</p><p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 7 &bull; AI Native Playbook Series</p><p style="color:#333;font-size:16px;line-height:1.7;">${greeting}</p><p style="color:#333;font-size:16px;line-height:1.7;">Over the past week, we've explored how AI can transform your business operations. Now it's time to take the next step.</p><div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:10px;padding:28px;margin:0 0 32px 0;"><p style="color:${brand.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The AI Native Playbook Bundle</p><ul style="color:#555;font-size:15px;line-height:1.8;margin:0 0 20px 0;padding-left:20px;"><li>6 expert framework playbooks (PDF)</li><li>300+ ready-to-use prompt templates</li><li>AI workflow systems for every business function</li><li>Step-by-step transformation roadmap</li></ul><p style="color:#888;font-size:13px;margin:0;">Designed for solo founders and small teams who want results — not theory.</p></div><div style="text-align:center;margin:0 0 32px 0;"><a href="${brand.url}/bundle" style="display:inline-block;background:${brand.color};color:${brand.gold};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">Explore the Full Bundle</a></div><p style="color:#555;font-size:15px;line-height:1.7;">Whether you go further with the bundle or not — we hope these emails have been useful. You now have the foundation.</p><p style="color:#555;font-size:15px;margin:16px 0 0 0;">Go build something great,<br /><strong style="color:${brand.color};">The AI Native Playbook Team</strong></p>${footer}</div></div>`,
        },
      ];

      for (const mail of sequence) {
        const body: Record<string, unknown> = {
          to,
          sender,
          subject: mail.subject,
          htmlContent: mail.htmlContent,
        };
        if (mail.delayDays > 0) {
          body.scheduledAt = new Date(
            Date.now() + mail.delayDays * 24 * 60 * 60 * 1000,
          ).toISOString();
        }
        fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify(body),
        }).catch(() => {});
      }
    } else {
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
