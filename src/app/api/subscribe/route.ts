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
            sender: { name: "AI Architect", email: "contact@apppro.kr" },
            subject: "Your Free AI Framework Preview + 3 System Prompts",
            htmlContent: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:24px"><h1 style="color:#1e3a5f;">Your AI Framework Preview is Ready</h1><p>Thanks for joining the AI Architect community${name ? `, ${name}` : ""}!</p><p>Here's what you get:</p><ul style="line-height:2;"><li><strong>AI Framework Preview</strong> -- Core concepts from 6 world-class frameworks</li><li><strong>3 System Prompts</strong> -- Ready to paste into Claude or ChatGPT</li><li><strong>Early-bird discount</strong> -- When we launch</li></ul><div style="text-align:center;margin:28px 0;"><a href="https://ai-driven-architect.com/products" style="display:inline-block;background:#f59e0b;color:#1a1a1a;padding:14px 32px;border-radius:8px;font-weight:bold;text-decoration:none;">Explore AI Architect Series</a></div><p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;text-align:center;"><a href="https://ai-driven-architect.com" style="color:#1e3a5f;text-decoration:none;">AI Architect Series</a></p></div>`,
          }),
        });
      } catch {
        // Lead magnet email failed - subscriber still saved
      }

      // Welcome 시퀀스 (D+0, D+3, D+7)
      const greeting = name ? `${name}님, 환영합니다!` : "환영합니다!";
      const sender = { name: "AI Architect", email: "contact@apppro.kr" };
      const to = [{ email: sanitizedEmail, name: name || sanitizedEmail }];
      const brand = { color: "#1e3a5f", url: "https://ai-architect.io" };
      const footer = `<p style="color:#888;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;text-align:center;"><a href="${brand.url}" style="color:${brand.color};text-decoration:none;">AI Architect</a>에서 발송했습니다. <a href="{{ unsubscribe }}" style="color:${brand.color};text-decoration:none;">구독 해지</a></p>`;

      const sequence = [
        {
          delayDays: 0,
          subject: "AI Architect에 오신 것을 환영합니다",
          htmlContent: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:24px"><h2>${greeting}</h2><p>AI Architect 뉴스레터를 구독해주셔서 감사합니다.</p><p>AI가 건축 설계를 어떻게 바꾸고 있는지, 실전 활용법을 매주 공유합니다.</p><h3 style="color:${brand.color}">구독자가 받는 혜택</h3><ul style="line-height:2;"><li>AI 건축 설계 최신 트렌드</li><li>실전 프롬프트 템플릿</li><li>업계 전문가 인사이트</li></ul><div style="background:#f0f4f8;padding:20px;border-radius:8px;border-left:4px solid ${brand.color};margin:24px 0;"><strong>3일 후 예고</strong><br/><span style="color:#555;">AI 건축 설계의 3가지 핵심 원칙을 공유합니다.</span></div>${footer}</div>`,
        },
        {
          delayDays: 3,
          subject: "AI 건축 설계의 3가지 핵심 원칙",
          htmlContent: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:24px"><h2>${greeting}</h2><p>AI를 건축 설계에 활용할 때 반드시 알아야 할 3가지 원칙입니다.</p><h3 style="color:${brand.color}">1. 컨텍스트가 품질을 결정한다</h3><p style="color:#555;">대지 조건, 법규, 클라이언트 요구사항을 구조화해서 AI에 전달하면 결과물의 질이 달라집니다.</p><h3 style="color:${brand.color}">2. 반복 설계의 자동화</h3><p style="color:#555;">평면 배치, 일조 분석, 동선 최적화 같은 반복 작업을 AI로 자동화하세요.</p><h3 style="color:${brand.color}">3. AI는 도구, 판단은 건축가</h3><p style="color:#555;">AI가 제안하는 옵션을 건축가의 전문성으로 평가하고 선택하는 것이 핵심입니다.</p>${footer}</div>`,
        },
        {
          delayDays: 7,
          subject: "AI 건축 설계, 지금 시작하세요",
          htmlContent: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;padding:24px"><h2>${greeting}</h2><p>지난 일주일간 AI 건축 설계의 가능성을 살펴보았습니다.</p><p>이제 직접 실행에 옮길 차례입니다.</p><h3 style="color:${brand.color}">AI Architect 시리즈 안내</h3><ul style="line-height:2;"><li>6권의 전문가 프레임워크 PDF</li><li>즉시 사용 가능한 프롬프트 300+</li><li>측정 가능한 결과 시스템</li></ul><div style="text-align:center;margin:28px 0;"><a href="${brand.url}" style="display:inline-block;background:${brand.color};color:#fff;padding:14px 32px;border-radius:8px;font-weight:bold;text-decoration:none;">자세히 보기</a></div>${footer}</div>`,
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
