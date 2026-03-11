/**
 * Nurture email sequence scheduler for AI Native Playbook Series.
 *
 * Triggered after a contact subscribes via /api/subscribe-guide (Brevo List 12).
 * Schedules three follow-up emails at D+1, D+3, D+7 using Brevo's scheduledAt field.
 *
 * SAFETY GATE: NURTURE_ENABLED must be true before any email is sent.
 * ⚠️  CEO 승인 후 NURTURE_ENABLED=true로 변경.
 */

import {
  getNurtureEmail1Html,
  getNurtureEmail2Html,
  getNurtureEmail3Html,
} from "@/lib/nurture-emails";

/** Master kill-switch. Flip to true only after CEO approval. */
const NURTURE_ENABLED = false;

const SENDER = {
  name: "AI Native Playbook Series",
  email: "hello@ai-driven-architect.com",
} as const;

interface ScheduledEmailDef {
  /** Days from now when the email should be delivered */
  delayDays: number;
  subject: string;
  buildHtml: (params: { firstName?: string }) => string;
}

const SEQUENCE: ScheduledEmailDef[] = [
  {
    delayDays: 1,
    subject: "3 Ways to Get More From Your AI Framework Guide",
    buildHtml: getNurtureEmail1Html,
  },
  {
    delayDays: 3,
    subject: "How TechVenture Co. Automated 80% of Their Marketing with AI",
    buildHtml: getNurtureEmail2Html,
  },
  {
    delayDays: 7,
    subject: "Your AI Business Transformation Starts Here",
    buildHtml: getNurtureEmail3Html,
  },
];

/**
 * Schedule the full 3-email nurture sequence for a new guide subscriber.
 *
 * When NURTURE_ENABLED is false the function is a no-op — it only logs.
 * Each email is sent as a separate Brevo SMTP call with scheduledAt set.
 *
 * @param email     Subscriber's email address
 * @param firstName Optional first name for personalisation
 */
export async function scheduleNurtureSequence(
  email: string,
  firstName?: string
): Promise<void> {
  // ── SAFETY GATE ──────────────────────────────────────────────────────────
  if (!NURTURE_ENABLED) {
    console.log(
      "[nurture-sequence] NURTURE_ENABLED=false — sequence not scheduled for:",
      email
    );
    return;
  }
  // ─────────────────────────────────────────────────────────────────────────

  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error("[nurture-sequence] BREVO_API_KEY not configured — aborting");
    return;
  }

  const now = Date.now();

  for (const step of SEQUENCE) {
    const scheduledAt = new Date(
      now + step.delayDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const htmlContent = step.buildHtml({ firstName });

    const payload = {
      sender: SENDER,
      to: [{ email, name: firstName ?? undefined }],
      subject: step.subject,
      htmlContent,
      scheduledAt,
    };

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
          `[nurture-sequence] Failed to schedule D+${step.delayDays} email:`,
          res.status,
          errText
        );
      } else {
        const data = await res.json();
        console.log(
          `[nurture-sequence] D+${step.delayDays} email scheduled — messageId:`,
          data.messageId,
          "scheduledAt:",
          scheduledAt
        );
      }
    } catch (err) {
      console.error(
        `[nurture-sequence] Network error scheduling D+${step.delayDays} email:`,
        err
      );
    }
  }
}
