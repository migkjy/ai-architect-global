/**
 * 4-layer bot spam protection for subscribe forms
 * Layer 1: Honeypot field detection
 * Layer 2: Rate limiting (IP-based, in-memory)
 * Layer 3: Input validation (disposable email, URL in fields)
 * Layer 4: Cloudflare Turnstile verification (when keys are configured)
 */

// --- Layer 1: Honeypot ---
export function isHoneypotFilled(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

// --- Layer 2: Rate Limiting ---
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per minute per IP

// Clean up old entries every 5 minutes
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60_000);
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// --- Layer 3: Input Validation ---

/** Check if email is from a disposable email provider */
export function isDisposableEmail(email: string): boolean {
  const disposableDomains = [
    "mailinator.com",
    "guerrillamail.com",
    "tempmail.com",
    "throwaway.email",
    "yopmail.com",
    "sharklasers.com",
    "guerrillamailblock.com",
    "grr.la",
    "dispostable.com",
    "trashmail.com",
    "maildrop.cc",
    "temp-mail.org",
    "fakeinbox.com",
    "mailnesia.com",
    "10minutemail.com",
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}

/** Check if value contains URL patterns */
export function containsUrl(value: string): boolean {
  return /https?:\/\/|www\.|\.com\/|\.net\/|\.org\/|\.io\//i.test(value);
}

/** Validate subscribe form inputs */
export function validateSubscribeInput(fields: {
  email: string;
  name?: string;
}): { valid: boolean; reason?: string } {
  const { email, name } = fields;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return { valid: false, reason: "Invalid email" };
  }

  if (isDisposableEmail(email)) {
    return { valid: false, reason: "Please use a valid work email" };
  }

  // Name should not contain URLs if provided
  if (name && containsUrl(name)) {
    return { valid: false, reason: "Invalid name" };
  }

  return { valid: true };
}

// --- Layer 4: Cloudflare Turnstile ---
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Turnstile not configured — graceful skip
    return true;
  }

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }),
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    // On network error, allow through (don't block real users)
    return true;
  }
}
