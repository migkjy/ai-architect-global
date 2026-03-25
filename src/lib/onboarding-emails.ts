/**
 * Unified onboarding email templates for AI Native Playbook Series.
 *
 * 5-email sequence: D+0 Welcome, D+1 Tips, D+3 Case Study, D+5 Bundle Preview, D+7 CTA.
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
    preheader: "It's not about effort. It's about execution.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">You Read Marketing Secrets. Your Business Didn't Change. Here's Why.</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 0 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;">You read the book. Highlighted the best parts. Made notes. Told yourself, "This time I'm going to implement everything."</p>
<p style="color:#333;font-size:16px;line-height:1.7;">But a month later, nothing changed. The book sits on a shelf. Your business runs the same way it did before.</p>
<p style="color:#333;font-size:16px;line-height:1.7;"><strong style="color:${BRAND.color};">Sound familiar?</strong> You're not alone — and it's not your fault.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">Russell Brunson, Jim Edwards, Jeff Walker, Nicolas Cole — these experts do marketing <em>full-time</em>. You're running a business, handling customers, managing operations, AND trying to implement their complex strategies. It's physically impossible to do it all.</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:28px 0 12px 0;">AI changes everything.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">AI Native Playbook takes these experts' proven frameworks and <strong>AI applies them instantly to YOUR specific business.</strong> You just input your business info — AI executes the framework.</p>
<p style="color:#333;font-size:16px;line-height:1.7;">What used to take a consultant weeks (and cost $5,000+) now takes 90 minutes. The same quality. The same proven frameworks. Just executed by AI instead of waiting weeks.</p>
<div style="text-align:center;margin:28px 0;">
  <a href="${siteUrl}/en/free-guide" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};font-size:16px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;">Download Your Free AI Framework Guide</a>
</div>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:28px 0 12px 0;">6 expert frameworks, AI-powered</p>
<ul style="color:#555;font-size:15px;line-height:2;">
  <li><strong>AI Marketing Architect</strong> — Russell Brunson's funnel framework, applied to your business</li>
  <li><strong>AI Story Architect</strong> — Jim Edwards' copywriting secrets, writing your sales copy</li>
  <li><strong>AI Startup Architect</strong> — Jeff Walker's launch formula, customized to your product</li>
  <li><strong>AI Content Architect</strong> — Nicolas Cole's content framework, generating your content</li>
  <li><strong>AI Brand Architect</strong> — Expert brand strategy, built around your identity</li>
  <li><strong>AI Traffic Architect</strong> — Proven traffic systems, configured for your audience</li>
</ul>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:24px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <strong style="color:${BRAND.color};">Coming tomorrow</strong><br/>
  <span style="color:#555;">Why studying alone NEVER works — 3 structural reasons, and how AI solves each one instantly.</span>
</div>
<p style="color:#555;font-size:15px;margin:16px 0 0 0;">Welcome aboard,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+1 Tips ------------------------------------------------------------- */
export function getOnboardingTipsHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "3 reasons reading business books never changes your business.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  Why Reading Business Books Never Changes Your Business
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 1 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Yesterday I told you it's not your fault that studying business books hasn't transformed your business. Today, let me show you exactly why — and what actually works instead.
</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 24px 0;">
  There are 3 structural reasons why studying alone will <strong>never</strong> be enough:
</p>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">1. Time — Experts do this full-time. You don't.</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Russell Brunson spends 60+ hours a week on marketing funnels. That's his entire job. You? You're answering customer emails, managing inventory, handling payroll, fixing your website — and THEN trying to build a funnel in your "spare time." There is no spare time. The math doesn't work.</p>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 20px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">2. Context — Principles don't auto-translate to YOUR business.</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">You read "build a value ladder." Great concept. But what does YOUR value ladder look like? For YOUR customers, at YOUR price points, in YOUR market? The book gives you the framework. It doesn't give you the application. That gap between "I understand the principle" and "I know exactly what to do for MY business" is where everyone gets stuck.</p>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 28px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">3. Consistency — You can't sustain execution alone.</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">Even when you start implementing, life intervenes. A big client calls. A crisis hits. Your marketing plan dies on page 47 of your notebook. Consistency requires a system that executes whether you're busy or not. Willpower alone isn't a strategy.</p>
</div>
<div style="background:${BRAND.color};border-radius:10px;padding:24px 28px;margin:0 0 28px 0;">
  <p style="color:${BRAND.gold};font-size:15px;font-weight:700;margin:0 0 12px 0;">AI solves all 3 — instantly.</p>
  <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0 0 8px 0;"><strong style="color:#fff;">Time?</strong> AI executes an entire framework in 90 minutes. Not weeks. Not months.</p>
  <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0 0 8px 0;"><strong style="color:#fff;">Context?</strong> You input YOUR business info — your customers, your prices, your market. The AI applies the expert framework specifically to you.</p>
  <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0;"><strong style="color:#fff;">Consistency?</strong> The system runs the same way every time. No willpower required. No notebook required.</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/en/products" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
    Explore the AI Playbook Series
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">In 2 days, I'll share a real story — a solo founder who read the same books you did, got stuck in the same place, and finally broke through when AI did the execution for him.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Stay sharp,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+3 Case Study ------------------------------------------------------- */
export function getOnboardingCaseStudyHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "He read the books twice. Nothing changed. Then he tried this.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  "First Time I Got a Strategy That Actually Fit MY Business"
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 3 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  Daniel is a solo founder running an online education business. He'd read DotCom Secrets twice. Expert Secrets cover to cover. He understood the frameworks. He could explain them to anyone.
</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  But every time he sat down to actually implement? He'd stare at a blank screen. "What does MY value ladder look like? What's MY hook? How do I write copy for MY audience?" The gap between understanding the principle and applying it to his specific business felt impossible to cross.
</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The turning point</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 20px 0;">
  Daniel tried <strong>AI Marketing Architect</strong> — Russell Brunson's funnel framework, powered by AI. He input his business details: his audience (career-switching professionals), his price points ($47-$497), his core offer (video courses + coaching). In one 90-minute session, AI designed a complete funnel — not a generic template, but one built specifically for HIS business, HIS customers, HIS price points.
</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 12px 0;">Then he added two more systems:</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 8px 0;"><strong>AI Story Architect</strong> (Jim Edwards' copywriting framework) wrote his sales page, email sequences, and ad copy — all tailored to his audience's specific pain points.</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 20px 0;"><strong>AI Content Architect</strong> (Nicolas Cole's content framework) generated a full content calendar — topics his audience actually searched for, in his voice, positioned around his offers.</p>
<div style="background:${BRAND.color};border-radius:10px;padding:24px 28px;margin:0 0 28px 0;">
  <p style="color:${BRAND.gold};font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px 0;">Daniel's Results — 3 Months Later</p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;">Revenue</td><td style="color:${BRAND.gold};font-size:15px;font-weight:700;text-align:right;padding:6px 0;">3.2x increase</td></tr>
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Content output</td><td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">4x more pieces/month</td></tr>
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Qualified leads</td><td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">3x increase</td></tr>
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;border-top:1px solid #1e2d45;">Time spent on marketing</td><td style="color:#fff;font-size:14px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">5 hrs/week (down from 20+)</td></tr>
  </table>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 28px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">The key insight</p>
  <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">"The AI didn't just help me brainstorm — it executed the entire framework. I went from understanding Brunson's concepts to having a complete, personalized funnel in a single session. That's the difference between reading about strategy and actually having one."</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/en/pricing" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
    See Pricing &amp; Packages
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">In 2 days, I'll show you exactly what's inside the Complete AI Playbook Bundle — and why it's the fastest way to go from studying to executing.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Talk soon,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+5 Bundle Preview --------------------------------------------------- */
export function getOnboardingBundlePreviewHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "6 expert frameworks. One bundle. Here's what's inside.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  What's Inside the Complete AI Native Playbook Bundle
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 5 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">
  On Day 3, you saw how Daniel transformed his business using 3 AI frameworks. Today, I want to show you exactly what you get when you go all-in with the complete bundle.
</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 16px 0;">The Complete Bundle includes:</p>
<table style="width:100%;border-collapse:collapse;margin:0 0 24px 0;">
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e8e4dc;vertical-align:top;">
      <strong style="color:${BRAND.color};">1. AI Marketing Architect</strong><br/>
      <span style="color:#666;font-size:14px;">Russell Brunson's funnel framework — build your complete sales funnel</span>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e8e4dc;vertical-align:top;">
      <strong style="color:${BRAND.color};">2. AI Story Architect</strong><br/>
      <span style="color:#666;font-size:14px;">Jim Edwards' copywriting secrets — write sales copy that converts</span>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e8e4dc;vertical-align:top;">
      <strong style="color:${BRAND.color};">3. AI Startup Architect</strong><br/>
      <span style="color:#666;font-size:14px;">Jeff Walker's launch formula — plan and execute your product launch</span>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e8e4dc;vertical-align:top;">
      <strong style="color:${BRAND.color};">4. AI Content Architect</strong><br/>
      <span style="color:#666;font-size:14px;">Nicolas Cole's content framework — fill your content calendar</span>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 16px;border-bottom:1px solid #e8e4dc;vertical-align:top;">
      <strong style="color:${BRAND.color};">5. AI Brand Architect</strong><br/>
      <span style="color:#666;font-size:14px;">Expert brand strategy — define your brand identity and positioning</span>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 16px;vertical-align:top;">
      <strong style="color:${BRAND.color};">6. AI Traffic Architect</strong><br/>
      <span style="color:#666;font-size:14px;">Proven traffic systems — drive qualified visitors to your offers</span>
    </td>
  </tr>
</table>
<div style="background:${BRAND.color};border-radius:10px;padding:24px 28px;margin:0 0 28px 0;">
  <p style="color:${BRAND.gold};font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px 0;">Bundle vs. Individual</p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#ccc;font-size:14px;padding:6px 0;">6 playbooks individually</td><td style="color:#ccc;font-size:14px;text-align:right;padding:6px 0;text-decoration:line-through;">$102</td></tr>
    <tr><td style="color:${BRAND.gold};font-size:15px;font-weight:700;padding:6px 0;border-top:1px solid #1e2d45;">Complete Bundle</td><td style="color:${BRAND.gold};font-size:15px;font-weight:700;text-align:right;padding:6px 0;border-top:1px solid #1e2d45;">$47 (save 54%)</td></tr>
  </table>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:16px 20px;margin:0 0 28px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <p style="color:${BRAND.color};font-size:15px;font-weight:700;margin:0 0 8px 0;">Each playbook includes:</p>
  <ul style="color:#555;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
    <li>Step-by-step PDF guide (30+ pages)</li>
    <li>AI Agent Skills (ready to paste into Claude/ChatGPT)</li>
    <li>Agent Settings for immediate use</li>
    <li>Notion templates for tracking</li>
  </ul>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/en/bundle" style="display:inline-block;background:${BRAND.gold};color:${BRAND.color};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
    Preview the Complete Bundle
  </a>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">In 2 days, I'll send you one final email with everything you need to make your decision.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">To your success,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}

/* -- D+7 CTA -------------------------------------------------------------- */
export function getOnboardingCtaHtml(params: OnboardingEmailParams): string {
  const g = greeting(params.firstName);
  return wrapHtml({
    preheader: "You've studied enough. It's time to execute.",
    body: `
<p style="color:${BRAND.color};font-size:22px;font-weight:700;margin:0 0 8px 0;line-height:1.3;">
  You've Studied Enough. It's Time to Execute.
</p>
<p style="color:#666;font-size:14px;margin:0 0 32px 0;">Day 7 &bull; AI Native Playbook Series</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 20px 0;">${g}</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 16px 0;">
  How many business books have you read this year? 3? 5? 10?
</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 16px 0;">
  Each time, you thought: "This is the one. This time I'll implement everything." You highlighted. You took notes. You made plans. And one month later? New book. Same cycle.
</p>
<p style="color:#333;font-size:16px;line-height:1.7;margin:0 0 24px 0;">
  <strong style="color:${BRAND.color};">The problem was never knowledge. It was always execution.</strong>
</p>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 16px 0;">6 proven frameworks. AI executes them for you.</p>
<div style="border-left:4px solid ${BRAND.gold};padding:12px 20px;margin:0 0 8px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <span style="color:${BRAND.color};font-weight:700;">AI Marketing Architect</span> <span style="color:#555;">— Brunson's funnel framework → your complete funnel in 90 min</span>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:12px 20px;margin:0 0 8px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <span style="color:${BRAND.color};font-weight:700;">AI Story Architect</span> <span style="color:#555;">— Edwards' copywriting secrets → your sales copy, done</span>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:12px 20px;margin:0 0 8px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <span style="color:${BRAND.color};font-weight:700;">AI Startup Architect</span> <span style="color:#555;">— Walker's launch formula → your launch plan, ready to go</span>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:12px 20px;margin:0 0 8px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <span style="color:${BRAND.color};font-weight:700;">AI Content Architect</span> <span style="color:#555;">— Cole's content framework → your content calendar, filled</span>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:12px 20px;margin:0 0 8px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <span style="color:${BRAND.color};font-weight:700;">AI Brand Architect</span> <span style="color:#555;">— Expert brand strategy → your brand identity, defined</span>
</div>
<div style="border-left:4px solid ${BRAND.gold};padding:12px 20px;margin:0 0 28px 0;background:#faf8f5;border-radius:0 8px 8px 0;">
  <span style="color:${BRAND.color};font-weight:700;">AI Traffic Architect</span> <span style="color:#555;">— Proven traffic systems → your traffic plan, activated</span>
</div>
<p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">From 3-day proposals to half-day results</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 16px 0;">
  Sarah is a brand consultant. Her client proposals used to take 3 full days — research, strategy, positioning, copy. She'd read every branding book, knew the frameworks cold.
</p>
<p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 24px 0;">
  With <strong>AI Brand Architect</strong>, she inputs the client's business details and gets a complete brand strategy in half a day. Same depth. Same quality. The framework does the heavy lifting — she adds her expertise on top. Her client capacity doubled without hiring anyone.
</p>
<div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:10px;padding:28px;margin:0 0 32px 0;">
  <p style="color:${BRAND.color};font-size:17px;font-weight:700;margin:0 0 12px 0;">The Complete AI Native Playbook Bundle</p>
  <ul style="color:#555;font-size:15px;line-height:1.8;margin:0 0 20px 0;padding-left:20px;">
    <li>All 6 AI business systems — each built on a world-class expert framework</li>
    <li>Input your business info once, get strategies tailored to YOU</li>
    <li>90-minute execution per system (vs. weeks with a consultant)</li>
    <li>Frameworks from Brunson, Edwards, Walker &amp; Cole</li>
  </ul>
  <div style="border-left:4px solid ${BRAND.gold};padding:12px 16px;margin:0 0 16px 0;background:#fff;border-radius:0 8px 8px 0;">
    <span style="color:${BRAND.color};font-size:14px;font-weight:700;">$5,000+ in consulting value</span>
    <span style="color:#888;font-size:14px;"> — the same frameworks top consultants charge thousands to implement. The AI does the execution.</span>
  </div>
  <p style="color:#888;font-size:13px;margin:0;">For business owners who are done studying and ready to execute.</p>
</div>
<div style="text-align:center;margin:0 0 32px 0;">
  <a href="${siteUrl}/bundle" style="display:inline-block;background:${BRAND.color};color:${BRAND.gold};padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
    Get All 6 AI Business Systems
  </a>
  <p style="color:#999;font-size:13px;margin:12px 0 0 0;">You've studied enough. Let AI execute for you.</p>
</div>
<p style="color:#555;font-size:15px;line-height:1.7;margin:0;">Whether you go further with the bundle or not — I hope these emails have shown you what's possible when you stop trying to implement alone and let AI execute proven frameworks for your specific business.</p>
<p style="color:#555;font-size:15px;line-height:1.7;margin:16px 0 0 0;">Go build something great,<br /><strong style="color:${BRAND.color};">The AI Native Playbook Team</strong></p>
`,
  });
}
