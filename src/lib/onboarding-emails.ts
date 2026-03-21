/**
 * Unified onboarding email templates for AI Native Playbook Series.
 *
 * 4-email sequence: D+0 Welcome, D+1 Tips, D+3 Case Study, D+7 CTA.
 * Replaces the old Welcome (subscribe/route.ts) + Nurture (nurture-emails.ts) split.
 *
 * Brand colours:
 *   Navy  : #0B1426
 *   Gold  : #D4A843
 *   Light : #f5f3ef
 */

export interface OnboardingEmailParams {
  firstName?: string;
}

const BRAND = {
  color: "#0B1426",
  gold: "#D4A843",
  light: "#f5f3ef",
} as const;

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-native-playbook.com"
).trim();

const SENDER_NAME = "AI Native Playbook Series";
const FOOTER_DOMAIN = "ai-native-playbook.com";

/** Shared HTML wrapper used by every template. */
function wrapHtml({
  preheader,
  body,
  footerReason,
}: {
  preheader: string;
  body: string;
  footerReason?: string;
}): string {
  const reason =
    footerReason ?? "You're receiving this because you subscribed to our newsletter.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:${BRAND.light};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:${BRAND.light};line-height:1px;">
    ${preheader}&nbsp;\u200C&nbsp;\u200C&nbsp;\u200C&nbsp;\u200C&nbsp;\u200C&nbsp;\u200C&nbsp;\u200C&nbsp;
  </div>
  <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 16px;">
    <div style="background:${BRAND.color};border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
      <p style="margin:0;color:${BRAND.gold};font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">
        AI Native Playbook Series
      </p>
    </div>
    <div style="background:#ffffff;border-radius:0 0 12px 12px;padding:40px 32px;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
      ${body}
      <hr style="border:none;border-top:1px solid #e8e4dc;margin:40px 0 24px;" />
      <p style="color:#999;font-size:12px;text-align:center;margin:0;line-height:1.8;">
        ${SENDER_NAME} &bull; ${FOOTER_DOMAIN}<br />
        ${reason}<br />
        <a href="{{ unsubscribe }}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

function greeting(firstName?: string): string {
  return firstName ? `Hi ${firstName},` : "Hi there,";
}

/* -- D+0 Welcome --------------------------------------------------------- */
export function getOnboardingWelcomeHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "Welcome to AI Native Playbook — here's what to expect.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;">Welcome to AI Native Playbook</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 0 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Thanks for joining the AI Native Playbook community! We share practical insights on how AI is transforming business operations — every week.</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:28px 0 12px 0;">What you'll get as a subscriber</p>
<ul style="color:#555;font-size:15px;line-height:2;">
  <li>Latest AI business automation trends</li>
  <li>Ready-to-use prompt templates</li>
  <li>Expert frameworks and case studies</li>
</ul>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:24px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <strong style="color:${BRAND.color};">Coming tomorrow</strong><br/>
  <span style="color:#555;">3 quick ways to put your AI framework knowledge to work — starting today.</span>
</div>
<p style="color:#555;font-size:15px;margin:16px 0 0 0;">Welcome aboard,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+1 Tips ------------------------------------------------------------- */
export function getOnboardingTipsHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "Quick tips to put your AI framework guide to work — starting today.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  3 Ways to Get More From Your AI Framework Guide
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 1 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Most people skim a guide once and move on. Here are three ways to make it actually work for your business.
</p>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">1. Map the framework to ONE workflow first</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Pick your most repetitive task — content drafts, customer responses, data summaries — and apply the framework there first. One win builds momentum.</p>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">2. Time-box your first experiment to 90 minutes</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Set a timer. Pick a prompt, run it through the framework's structure, measure the output quality vs. your old approach. 90 minutes is enough to see whether it clicks.</p>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 32px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">3. Document what worked</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Keep a simple running doc of prompts that delivered results. Within two weeks you'll have a personal AI playbook — tailored to your specific business context.</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/blog" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
    Read Our Latest Blog Posts
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">More coming in 2 days — a real story of how one founder automated 80% of their marketing.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Stay sharp,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+3 Case Study ------------------------------------------------------- */
export function getOnboardingCaseStudyHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "One bootstrapped founder, one AI framework, a 4x output increase — here's the full story.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  How One Founder Automated 80% of Their Marketing — in 6 Weeks
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 3 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Marcus runs a 4-person B2B SaaS company. Six months ago his team spent 22 hours a week on
  marketing. Today, that same output takes under 5 hours. Here's exactly what changed.
</p>
<div style="background:${BRAND.color};border-radius:10px;padding:24px 28px;margin:0 0 32px 0;">
  <p style="color:${BRAND.gold};font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px 0;">Results After 6 Weeks</p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;">Weekly hours on marketing</td><td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;">22h &rarr; 4.5h</td></tr>
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Blog posts / month</td><td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">2 &rarr; 12</td></tr>
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Email open rate</td><td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">18% &rarr; 31%</td></tr>
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Inbound leads / month</td><td style="color:${BRAND.gold};font-size:15px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">11 &rarr; 47</td></tr>
  </table>
</div>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The 3-part system he built</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;"><strong>1. Prompt library tied to brand voice.</strong> Marcus spent one afternoon building 20 reusable prompts — each pre-loaded with his brand tone and audience pain points.</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;"><strong>2. AI-assisted first drafts, human final edit.</strong> They use AI for structure + first draft (10 min), then a human does a focused 15-minute edit pass.</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 28px 0;"><strong>3. Weekly "AI sprint" instead of scattered sessions.</strong> Every Monday morning, one person runs a 2-hour AI sprint: batch-generate the week's content, schedule it, done.</p>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/blog" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
    See More Success Stories
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">In 4 days I'll send the final email — about the exact next step for turning these tactics into a complete AI business system.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Talk soon,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+7 CTA -------------------------------------------------------------- */
export function getOnboardingCtaHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "The opportunity cost of not going AI-native is doubling every quarter.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  Your AI Business Transformation Starts Here
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 7 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The cost of waiting is compounding</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  Right now, your AI-native competitors are shipping faster, scaling cheaper, and closing deals
  you should be winning. The gap compounds. Every quarter you wait, the gap doubles.
</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">From overwhelmed to AI-native in 90 days</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  Sarah launched her consulting practice two years ago. Buried in admin. She used the full playbook bundle.
  90 days later: proposals take 35 minutes instead of 4 hours. She doubled her client roster without hiring.
</p>
<div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:10px;padding:28px;margin:0 0 32px 0;">
  <p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The Complete AI Playbook Bundle</p>
  <ul style="color:#555;font-size:15px;line-height:1.8;margin:0 0 20px 0;padding-left:20px;">
    <li>5 in-depth playbooks covering every core business function</li>
    <li>50+ battle-tested prompt templates</li>
    <li>AI workflow diagrams for sales, marketing, ops, and product</li>
    <li>The 90-day AI transformation roadmap</li>
  </ul>
  <p style="color:#888;font-size:13px;margin:0;">Designed for solo founders and small teams who want results — not theory.</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/bundle" style="display:inline-block;background:${BRAND.color};color:${BRAND.gold};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
    Get the Complete AI Playbook Bundle
  </a>
  <p style="color:#999;font-size:13px;margin:12px 0 0 0;">No fluff. No theory. Just the system that works.</p>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">Whether you go further with the bundle or not — I hope these emails have been genuinely useful.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Go build something great,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}
