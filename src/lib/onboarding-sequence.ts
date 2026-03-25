/**
 * Unified onboarding email sequence for AI Native Playbook Series.
 *
 * Replaces both the old Welcome sequence (subscribe/route.ts inline)
 * and the Nurture sequence (nurture-sequence.ts).
 *
 * Schedule: D+0 Welcome, D+1 Tips, D+3 Case Study, D+5 Bundle Preview, D+7 CTA.
 * Dedup: checks Brevo contact attribute ONBOARDING_SENT before scheduling.
 */

import {
  getOnboardingWelcomeHtml,
  getOnboardingTipsHtml,
  getOnboardingCaseStudyHtml,
  getOnboardingBundlePreviewHtml,
  getOnboardingCtaHtml,
} from "./onboarding-emails";

const SENDER = {
  name: "AI Native Playbook Series",
  email: "contact@apppro.kr",
} as const;

interface SequenceStep {
  delayDays: number;
  subject: string;
  buildHtml: (params: { firstName?: string }) => string;
}

const SEQUENCE: SequenceStep[] = [
  {
    delayDays: 0,
    subject: "Welcome — here's why reading business books never works",
    buildHtml: getOnboardingWelcomeHtml,
  },
  {
    delayDays: 1,
    subject: "The 3 reasons your marketing strategy stays on paper",
    buildHtml: getOnboardingTipsHtml,
  },
  {
    delayDays: 3,
    subject: "He read DotCom Secrets twice. Nothing changed. Then this happened.",
    buildHtml: getOnboardingCaseStudyHtml,
  },
  {
    delayDays: 5,
    subject: "What's inside the Complete AI Playbook Bundle (save 54%)",
    buildHtml: getOnboardingBundlePreviewHtml,
  },
  {
    delayDays: 7,
    subject: "You've studied enough. Time to let AI execute.",
    buildHtml: getOnboardingCtaHtml,
  },
];

/**
 * Check if a contact has already received the onboarding sequence.
 * Returns true if ONBOARDING_SENT attribute is "true".
 */
async function hasAlreadyReceivedOnboarding(
  email: string,
  apiKey: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) return false; // Contact doesn't exist yet — proceed
    const data = await res.json();
    return data?.attributes?.ONBOARDING_SENT === "true";
  } catch {
    return false; // Network error — proceed (better to send than miss)
  }
}

/**
 * Mark a contact as having received the onboarding sequence.
 */
async function markOnboardingSent(
  email: string,
  apiKey: string
): Promise<void> {
  try {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "PUT",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: { ONBOARDING_SENT: "true" },
      }),
    });
  } catch {
    // Non-critical — log only
    console.error("[onboarding-sequence] Failed to mark ONBOARDING_SENT for:", email);
  }
}

/**
 * Schedule the full 5-email onboarding sequence.
 *
 * Dedup: if the contact already has ONBOARDING_SENT=true, skip entirely.
 * D+0 is sent immediately; D+1/D+3/D+5/D+7 use Brevo's scheduledAt.
 */
export async function scheduleOnboardingSequence(
  email: string,
  firstName?: string
): Promise<void> {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error("[onboarding-sequence] BREVO_API_KEY not configured");
    return;
  }

  // Dedup check
  const alreadySent = await hasAlreadyReceivedOnboarding(email, brevoKey);
  if (alreadySent) {
    console.log("[onboarding-sequence] Already sent to:", email, "— skipping");
    return;
  }

  // Mark as sent before scheduling (prevent race condition)
  await markOnboardingSent(email, brevoKey);

  const now = Date.now();
  const to = [{ email, name: firstName ?? undefined }];

  for (const step of SEQUENCE) {
    const htmlContent = step.buildHtml({ firstName });
    const payload: Record<string, unknown> = {
      sender: SENDER,
      to,
      subject: step.subject,
      htmlContent,
    };

    if (step.delayDays > 0) {
      payload.scheduledAt = new Date(
        now + step.delayDays * 24 * 60 * 60 * 1000
      ).toISOString();
    }

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(
          `[onboarding-sequence] D+${step.delayDays} failed:`,
          res.status,
          errText
        );
      } else {
        const data = await res.json();
        console.log(
          `[onboarding-sequence] D+${step.delayDays} scheduled — messageId:`,
          data.messageId
        );
      }
    } catch (err) {
      console.error(`[onboarding-sequence] D+${step.delayDays} error:`, err);
    }
  }
}
