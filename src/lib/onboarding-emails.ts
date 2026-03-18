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
    preheader: "Welcome — your free AI Business Framework Preview is ready. See how proven frameworks become automated systems.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;">Welcome to AI Native Playbook</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 0 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Thank you for joining the AI Native Playbook. We help entrepreneurs and business leaders turn world-class business frameworks into AI-powered automation systems — so you get expert-level strategy execution without the expert-level price tag.</p>
<div style="text-align:center;margin:28px 0;">
  <a href="${siteUrl}/resources/ai-framework-preview" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};font-size:16px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;">Download Your Free AI Business Framework Preview</a>
</div>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:28px 0 12px 0;">What you'll get as a subscriber</p>
<ul style="color:#555;font-size:15px;line-height:2;">
  <li>Insights from 6 AI business automation systems — each built on a proven expert framework</li>
  <li>Strategies for combining validated frameworks with AI execution</li>
  <li>Real-world case studies and ROI analysis from framework-driven automation</li>
</ul>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:24px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <strong style="color:${BRAND.color};">Why this is different</strong><br/>
  <span style="color:#555;">These aren't generic AI tips or simple instructions. Each of our 6 systems is built on a proven business framework from experts like Russell Brunson, Jim Edwards, Jeff Walker, and Nicolas Cole. The AI doesn't just assist — it executes the entire framework for you. Think of it as having a $5,000 consultant on call, 24/7, for a fraction of the cost.</span>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:24px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <strong style="color:${BRAND.color};">Coming tomorrow</strong><br/>
  <span style="color:#555;">3 ways to run your first AI-powered strategy session — and see results within 90 minutes.</span>
</div>
<p style="color:#555;font-size:15px;margin:16px 0 0 0;">Welcome aboard,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+1 Tips ------------------------------------------------------------- */
export function getOnboardingTipsHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "3 ways to run your first AI-powered strategy session — pick one system, get results in 90 minutes.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  3 Ways to Get Immediate Value From Your AI Business Systems
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 1 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Most people read about AI and think "interesting" — then change nothing. Here are three ways to get real results from framework-driven AI systems, starting today.
</p>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">1. Pick ONE system that matches your biggest bottleneck</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">We offer 6 AI business systems — Marketing, Brand, Traffic, Story, Startup, and Content. Which area is costing you the most time or money right now? Start there. One focused system beats six half-started ones.</p>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">2. Run your first strategy session in 90 minutes</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Set a timer. Load the framework into your AI tool. Answer the guided questions. Within 90 minutes you'll have a complete strategy document — the kind that used to take a consultant days to produce. Compare the output to your current approach.</p>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 32px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">3. Document the before vs. after</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Keep a simple log: what the AI system produced vs. how you used to do it. Time saved, quality difference, new insights uncovered. Within a week you'll see exactly why framework-driven AI execution is a fundamentally different approach.</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/blog" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
    Explore the 6 AI Business Systems
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">More coming in 2 days — a real story of how one founder used these framework-driven systems to automate 80% of their marketing.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Stay sharp,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+3 Case Study ------------------------------------------------------- */
export function getOnboardingCaseStudyHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "One founder, one AI business framework system, 4x output — here's exactly how he did it.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  How One Founder Automated 80% of Their Marketing — Using Framework-Driven AI Systems
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 3 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Marcus runs a 4-person B2B SaaS company. Six months ago his team spent 22 hours a week on
  marketing. Today, that same output takes under 5 hours. The difference? He stopped using AI as a tool and started using it as a system — powered by proven business frameworks.
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
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The 3 framework-driven systems he deployed</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;"><strong>1. AI Marketing Architect for funnel strategy.</strong> Instead of guessing, Marcus loaded Russell Brunson's proven funnel framework into AI. Within one session, he had a complete marketing funnel mapped — audience segments, offer stack, and conversion sequence.</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;"><strong>2. AI Content Architect for weekly output.</strong> Using Nicolas Cole's content framework, his team now generates a full week of strategic content in a single 2-hour Monday session. The AI executes the framework; his team reviews and publishes.</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 28px 0;"><strong>3. AI Story Architect for sales copy.</strong> Jim Edwards' copywriting framework, automated by AI, cut proposal writing from 4 hours to 35 minutes — with higher conversion rates.</p>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/blog" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
    See How the Systems Work
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">In 4 days I'll send the final email — showing you the exact next step for getting all 6 AI business systems working together.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Talk soon,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+7 CTA -------------------------------------------------------------- */
export function getOnboardingCtaHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "6 proven business frameworks, automated by AI. $5,000+ consulting value — yours for $49.",
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
  Sarah launched her consulting practice two years ago. Buried in admin. She deployed the AI Story Architect (Jim Edwards' copywriting framework) and AI Marketing Architect (Russell Brunson's funnel framework).
  90 days later: proposals take 35 minutes instead of 4 hours. She doubled her client roster without hiring. That's the power of proven frameworks executed by AI.
</p>
<div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:10px;padding:28px;margin:0 0 32px 0;">
  <p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The Complete AI Business Systems Bundle</p>
  <ul style="color:#555;font-size:15px;line-height:1.8;margin:0 0 20px 0;padding-left:20px;">
    <li>6 AI business automation systems — each built on a world-class expert framework</li>
    <li>Ready-to-run strategy sessions you can execute within 24 hours of purchase</li>
    <li>The 90-day AI transformation roadmap</li>
    <li>Frameworks from Russell Brunson, Jim Edwards, Jeff Walker &amp; Nicolas Cole</li>
  </ul>
  <div style="border-left:4px solid ${BRAND.gold};padding:12px 16px;margin:0 0 16px 0;background:#fff;border-radius:0 8px 8px 0;">
    <span style="color:${BRAND.color};font-size:14px;font-weight:700;">$5,000+ in consulting value</span>
    <span style="color:#888;font-size:14px;"> — these are the same frameworks top consultants charge thousands to implement. The AI does the execution for you.</span>
  </div>
  <p style="color:#888;font-size:13px;margin:0;">Designed for solo founders and small teams who want results — not theory.</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/bundle" style="display:inline-block;background:${BRAND.color};color:${BRAND.gold};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
    Get All 6 AI Business Systems
  </a>
  <p style="color:#999;font-size:13px;margin:12px 0 0 0;">No fluff. No theory. Just the system that works.</p>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">Whether you go further with the bundle or not — I hope these emails have shown you what's possible when proven business frameworks meet AI execution.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Go build something great,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}
