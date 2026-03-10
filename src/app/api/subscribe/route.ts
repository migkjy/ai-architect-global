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
            listIds: [12], // ai-architect 전용 리스트 12번 고정
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

      // Welcome sequence (D+0, D+3, D+7) — English
      const firstName = name ? name.split(" ")[0] : "";
      const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
      const sender = { name: "AI Native Playbook", email: "contact@apppro.kr" };
      const to = [{ email: sanitizedEmail, name: name || sanitizedEmail }];
      const brand = { color: "#1e3a5f", accent: "#f59e0b", url: "https://ai-driven-architect.com" };
      const footer = `<p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;text-align:center;">You received this because you subscribed at <a href="${brand.url}" style="color:${brand.color};text-decoration:none;">AI Native Playbook</a>. <a href="{{ unsubscribe }}" style="color:#888;">Unsubscribe</a></p>`;

      const sequence = [
        {
          delayDays: 0,
          subject: "Welcome to AI Native Playbook!",
          htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:32px 24px;background:#ffffff"><div style="text-align:center;margin-bottom:32px"><h1 style="color:${brand.color};font-size:28px;margin:0;">AI Native Playbook</h1></div><p style="font-size:16px;line-height:1.6;">${greeting}</p><p style="font-size:16px;line-height:1.6;">Thank you for subscribing to <strong>AI Native Playbook</strong> — frameworks and playbooks built for AI practitioners who want to work smarter, not harder.</p><div style="background:#f0f4f8;border-left:4px solid ${brand.color};padding:20px 24px;border-radius:0 8px 8px 0;margin:28px 0;"><h3 style="margin:0 0 12px;color:${brand.color};">What you'll get:</h3><ul style="margin:0;padding-left:20px;line-height:2;color:#333;"><li>Practical AI frameworks used by top practitioners</li><li>Ready-to-use system prompts and playbooks</li><li>Early access &amp; launch notifications</li></ul></div><div style="background:#fffbeb;border:1px solid ${brand.accent};padding:20px 24px;border-radius:8px;margin:28px 0;"><p style="margin:0;font-size:15px;color:#92400e;"><strong>Payment system coming soon.</strong> You'll be the first to know when AI Native Playbook Series goes live — and you'll get an exclusive subscriber discount.</p></div><div style="text-align:center;margin:32px 0;"><a href="${brand.url}" style="display:inline-block;background:${brand.color};color:#fff;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:bold;text-decoration:none;">Explore AI Native Playbook</a></div><p style="font-size:15px;line-height:1.6;color:#555;">In the meantime, check out what we're building — AI frameworks that turn complex concepts into actionable playbooks for real-world practitioners.</p><p style="font-size:15px;color:#555;">Talk soon,<br/><strong>The AI Native Playbook Team</strong></p>${footer}</div>`,
        },
        {
          delayDays: 3,
          subject: "3 principles every AI practitioner needs to know",
          htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:32px 24px;background:#ffffff"><p style="font-size:16px;line-height:1.6;">${greeting}</p><p style="font-size:16px;line-height:1.6;">Three days ago you joined AI Native Playbook. Today I want to share three principles that separate AI practitioners who get results from those who don't.</p><h2 style="color:${brand.color};font-size:20px;margin-top:32px;">1. Context determines quality</h2><p style="line-height:1.7;color:#333;">Most people give AI vague instructions and get vague output. Structure your inputs — constraints, objectives, examples — and the output quality multiplies.</p><h2 style="color:${brand.color};font-size:20px;margin-top:28px;">2. Automate repetition, amplify judgment</h2><p style="line-height:1.7;color:#333;">Identify the repetitive 80% of your workflow and systematize it with AI. Free your attention for the high-judgment 20% where experience truly matters.</p><h2 style="color:${brand.color};font-size:20px;margin-top:28px;">3. AI is a co-pilot, not autopilot</h2><p style="line-height:1.7;color:#333;">The best practitioners use AI to generate options, then apply domain expertise to evaluate and decide. The human judgment loop is non-negotiable.</p><div style="text-align:center;margin:36px 0;"><a href="${brand.url}" style="display:inline-block;background:${brand.accent};color:#1a1a1a;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:bold;text-decoration:none;">See Our Frameworks</a></div><p style="font-size:15px;color:#555;">Next up (Day 7): The exact playbook structure we use across all six AI Native books.</p><p style="font-size:15px;color:#555;">Talk soon,<br/><strong>The AI Native Playbook Team</strong></p>${footer}</div>`,
        },
        {
          delayDays: 7,
          subject: "The playbook structure that actually works",
          htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:32px 24px;background:#ffffff"><p style="font-size:16px;line-height:1.6;">${greeting}</p><p style="font-size:16px;line-height:1.6;">One week in. You've been thinking about how AI fits into your practice — here's the structure we've found works across every domain we've covered.</p><h2 style="color:${brand.color};font-size:20px;margin-top:28px;">The AI Native Playbook Framework</h2><div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:24px 0;"><div style="background:${brand.color};color:#fff;padding:12px 20px;font-weight:bold;">6-Layer Practitioner Stack</div><div style="padding:20px;"><ol style="margin:0;padding-left:20px;line-height:2.2;color:#333;"><li><strong>Context Layer</strong> — Define constraints and objectives</li><li><strong>Framework Layer</strong> — Select the right mental model</li><li><strong>Prompt Layer</strong> — Structured inputs for reliable outputs</li><li><strong>Iteration Layer</strong> — Refine with feedback loops</li><li><strong>Evaluation Layer</strong> — Apply domain judgment</li><li><strong>Integration Layer</strong> — Embed into your workflow</li></ol></div></div><p style="font-size:15px;line-height:1.7;color:#555;">Each of our six books in the AI Native Playbook Series is built around this stack — applied to a specific professional domain.</p><div style="background:#fffbeb;border:1px solid ${brand.accent};padding:20px 24px;border-radius:8px;margin:28px 0;"><p style="margin:0;font-size:15px;color:#92400e;"><strong>Launch is coming soon.</strong> As a subscriber, you'll get first access and an exclusive discount before we open to the public.</p></div><div style="text-align:center;margin:32px 0;"><a href="${brand.url}" style="display:inline-block;background:${brand.color};color:#fff;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:bold;text-decoration:none;">Explore AI Native Playbook</a></div><p style="font-size:15px;color:#555;">Talk soon,<br/><strong>The AI Native Playbook Team</strong></p>${footer}</div>`,
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
