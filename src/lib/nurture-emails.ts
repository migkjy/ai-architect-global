/**
 * Nurture email HTML templates for AI Native Playbook Series.
 *
 * 3-email sequence triggered after free guide download (Brevo List 12).
 * All templates are plain HTML — no external images required.
 *
 * Brand colours:
 *   Navy  : #0B1426
 *   Gold  : #D4A843
 *   Light : #f5f3ef
 */

export interface NurtureEmailParams {
  firstName?: string;
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-driven-architect.com";

const SENDER_NAME = "AI Native Playbook Series";
const FOOTER_DOMAIN = "ai-driven-architect.com";

/** Shared wrapper / chrome used by every template. */
function wrapHtml({
  preheader,
  subject,
  body,
}: {
  preheader: string;
  subject: string;
  body: string;
}): string {
  void subject; // subject is set at the API call level; kept here for reference
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f5f3ef;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#f5f3ef;line-height:1px;">
    ${preheader}&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;‌&zwnj;&nbsp;
  </div>

  <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;">
    <!-- Header bar -->
    <div style="background:#0B1426;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
      <p style="margin:0;color:#D4A843;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">
        AI Native Playbook Series
      </p>
    </div>

    <!-- Main card -->
    <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
      ${body}

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid #e8e4dc;margin:40px 0 24px;" />

      <!-- Footer -->
      <p style="color:#999;font-size:12px;text-align:center;margin:0;line-height:1.8;">
        ${SENDER_NAME} &bull; ${FOOTER_DOMAIN}<br />
        You're receiving this because you downloaded our free guide.<br />
        <a href="{{ unsubscribe }}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/* -------------------------------------------------------------------------
 * Email 1 — D+1
 * Subject: "3 Ways to Get More From Your AI Framework Guide"
 * ------------------------------------------------------------------------- */
export function getNurtureEmail1Html(params: NurtureEmailParams): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hi there,";
  const preheader =
    "Quick tips to put your AI framework guide to work — starting today.";

  const body = `
<p style="color:#0B1426;font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  3 Ways to Get More From Your AI Framework Guide
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 1 &bull; AI Native Playbook Series</p>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${greeting}</p>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  You downloaded the AI Framework Guide — great first step. Most people skim it once and move on.
  Here are three ways to make it actually work for your business.
</p>

<!-- Tip 1 -->
<div style="border-left:4px solid #D4A843;padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:#0B1426;font-size:15px;font-weight:700;margin:0 0 8px 0;">1. Map the framework to ONE workflow first</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">
    Don't try to overhaul everything at once. Pick your most repetitive task — content drafts,
    customer responses, data summaries — and apply the framework there first. One win builds momentum.
  </p>
</div>

<!-- Tip 2 -->
<div style="border-left:4px solid #D4A843;padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:#0B1426;font-size:15px;font-weight:700;margin:0 0 8px 0;">2. Time-box your first experiment to 90 minutes</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">
    Set a timer. Pick a prompt, run it through the guide's structure, measure the output quality vs.
    your old approach. 90 minutes is enough to see whether it clicks — and short enough to commit to.
  </p>
</div>

<!-- Tip 3 -->
<div style="border-left:4px solid #D4A843;padding:16px 20px;margin:0 0 32px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:#0B1426;font-size:15px;font-weight:700;margin:0 0 8px 0;">3. Document what worked</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">
    Keep a simple running doc of prompts that delivered results. Within two weeks you'll have a
    personal AI playbook — tailored to your specific business context.
  </p>
</div>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 32px 0;">
  Want to go deeper? Our blog has free breakdowns on each of these tactics:
</p>

<!-- CTA -->
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/blog"
     style="display:inline-block;background:#D4A843;color:#0B1426;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em;">
    Read Our Latest Blog Posts
  </a>
</div>

<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">
  More coming in a few days — I'll share a real story of how one founder automated 80% of their
  marketing with these exact techniques.
</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">
  Stay sharp,<br />
  <strong style="color:#0B1426;">The AI Native Playbook Team</strong>
</p>
`;

  return wrapHtml({ preheader, subject: "3 Ways to Get More From Your AI Framework Guide", body });
}

/* -------------------------------------------------------------------------
 * Email 2 — D+3
 * Subject: "How TechVenture Co. Automated 80% of Their Marketing with AI"
 * ------------------------------------------------------------------------- */
export function getNurtureEmail2Html(params: NurtureEmailParams): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hi there,";
  const preheader =
    "One bootstrapped founder, one AI framework, a 4x output increase — here's the full story.";

  const body = `
<p style="color:#0B1426;font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  How One Founder Automated 80% of Their Marketing — in 6 Weeks
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 3 &bull; AI Native Playbook Series</p>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${greeting}</p>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Marcus runs a 4-person B2B SaaS company. Six months ago his team spent 22 hours a week on
  marketing: writing copy, scheduling posts, drafting nurture emails, and pulling performance reports.
</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 28px 0;">
  Today, that same output takes under 5 hours. Here's exactly what changed.
</p>

<!-- Stats block -->
<div style="background:#0B1426;border-radius:10px;padding:24px 28px;margin:0 0 32px 0;">
  <p style="color:#D4A843;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px 0;">Results After 6 Weeks</p>
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="color:#ccc;font-size:14px;padding:6px 0;">Weekly hours on marketing</td>
      <td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;">22h &rarr; 4.5h</td>
    </tr>
    <tr>
      <td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Blog posts published / month</td>
      <td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">2 &rarr; 12</td>
    </tr>
    <tr>
      <td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Email open rate</td>
      <td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">18% &rarr; 31%</td>
    </tr>
    <tr>
      <td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Inbound leads / month</td>
      <td style="color:#D4A843;font-size:15px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">11 &rarr; 47</td>
    </tr>
  </table>
</div>

<p style="color:#0B1426;font-size:17px;font-weight:700;margin:0 0 12px 0;">The 3-part system he built</p>

<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;">
  <strong>1. Prompt library tied to brand voice.</strong> Marcus spent one afternoon building
  20 reusable prompts — each pre-loaded with his brand tone, audience pain points, and product
  differentiators. That single session replaced 80% of the blank-page time his team faced every week.
</p>

<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;">
  <strong>2. AI-assisted first drafts, human final edit.</strong> They stopped trying to get
  AI to produce finished copy. Instead they use it for structure + first draft (10 min), then a
  human does a focused 15-minute edit pass. Output quality went up, not down.
</p>

<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
  <strong>3. Weekly "AI sprint" instead of scattered sessions.</strong> Every Monday morning,
  one person runs a 2-hour AI sprint: batch-generate the week's content, schedule it, done.
  No context-switching. No tool fatigue.
</p>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 32px 0;">
  The framework Marcus used is the same one in the guide you downloaded. Want to see more
  breakdowns like this?
</p>

<!-- CTA -->
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/blog"
     style="display:inline-block;background:#D4A843;color:#0B1426;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em;">
    See More Success Stories
  </a>
</div>

<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">
  In 4 days I'll send you the final email in this series — it's about the exact next step
  for turning these tactics into a complete AI business system.
</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">
  Talk soon,<br />
  <strong style="color:#0B1426;">The AI Native Playbook Team</strong>
</p>
`;

  return wrapHtml({
    preheader,
    subject: "How TechVenture Co. Automated 80% of Their Marketing with AI",
    body,
  });
}

/* -------------------------------------------------------------------------
 * Email 3 — D+7 (Hook-Story-Offer)
 * Subject: "Your AI Business Transformation Starts Here"
 * ------------------------------------------------------------------------- */
export function getNurtureEmail3Html(params: NurtureEmailParams): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hi there,";
  const preheader =
    "The opportunity cost of not going AI-native is doubling every quarter. Here's the path forward.";

  const body = `
<p style="color:#0B1426;font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  Your AI Business Transformation Starts Here
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 7 &bull; AI Native Playbook Series</p>

<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${greeting}</p>

<!-- HOOK -->
<p style="color:#0B1426;font-size:17px;font-weight:700;margin:0 0 12px 0;">The cost of waiting is compounding</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  Right now, your AI-native competitors are shipping faster, scaling cheaper, and closing deals
  you should be winning. The gap between AI-native businesses and everyone else is not linear —
  it compounds. Every quarter you wait, the gap doubles.
</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
  The question is no longer "should I adopt AI?" It's "how fast can I make my entire business AI-native?"
</p>

<!-- STORY -->
<p style="color:#0B1426;font-size:17px;font-weight:700;margin:0 0 12px 0;">From overwhelmed to AI-native in 90 days</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  Sarah launched her consulting practice two years ago. Smart, motivated — but buried. She was
  spending 60% of her working hours on admin, proposals, and follow-ups instead of actual consulting.
</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  She downloaded the same free guide you have. Then she went further: she built a complete
  AI system around her practice using the full playbook bundle.
</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  90 days later: proposals that used to take 4 hours now take 35 minutes. Her client onboarding
  runs on autopilot. She doubled her client roster without hiring anyone.
</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 28px 0;">
  Her words: <em style="color:#0B1426;">"I feel like I finally have leverage. The business works for me, not the other way around."</em>
</p>

<!-- OFFER -->
<div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:10px;padding:28px;margin:0 0 32px 0;">
  <p style="color:#0B1426;font-size:17px;font-weight:700;margin:0 0 12px 0;">Introducing the Complete AI Playbook Bundle</p>
  <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
    The free guide you downloaded is chapter one. The full bundle is the complete system:
  </p>
  <ul style="color:#555;font-size:15px;line-height:1.8;margin:0 0 20px 0;padding-left:20px;">
    <li>5 in-depth playbooks covering every core business function</li>
    <li>50+ battle-tested prompt templates with brand-voice customisation</li>
    <li>AI workflow diagrams for sales, marketing, ops, and product</li>
    <li>The 90-day AI transformation roadmap (the one Sarah followed)</li>
  </ul>
  <p style="color:#888;font-size:13px;margin:0;">
    Designed for solo founders, small teams, and operators who want results — not theory.
  </p>
</div>

<!-- CTA -->
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/bundle"
     style="display:inline-block;background:#0B1426;color:#D4A843;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:0.02em;">
    Get the Complete AI Playbook Bundle
  </a>
  <p style="color:#999;font-size:13px;margin:12px 0 0 0;">No fluff. No theory. Just the system that works.</p>
</div>

<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">
  Whether you go further with the bundle or not — I hope the free guide and these emails
  have been genuinely useful. You now have the foundation.
</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">
  Go build something great,<br />
  <strong style="color:#0B1426;">The AI Native Playbook Team</strong>
</p>
`;

  return wrapHtml({
    preheader,
    subject: "Your AI Business Transformation Starts Here",
    body,
  });
}
