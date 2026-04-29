/**
 * Download utilities for AI Native Playbook (EN)
 *
 * - Product file mapping (EN v3 Playbook → R2 keys)
 * - HMAC-based download token generation/verification (7-day expiry)
 * - Download link builder for bundle and individual purchases
 */

import crypto from "crypto";

const DOWNLOAD_SECRET =
  process.env.DOWNLOAD_SECRET || "ainp-download-secret-2026";
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// ─── Types ───

export interface ProductFile {
  url: string;
  filename: string;
}

// ─── EN v3 Playbook Product Mapping ───

const PDF_VOL_MAP: Record<string, { r2Key: string; filename: string }> = {
  "pdf-vol1": {
    r2Key: "en/vols/vol1-ai-marketing-architect.zip",
    filename: "AI-Marketing-Architect-Vol1.zip",
  },
  "pdf-vol2": {
    r2Key: "en/vols/vol2-ai-brand-architect.zip",
    filename: "AI-Brand-Architect-Vol2.zip",
  },
  "pdf-vol3": {
    r2Key: "en/vols/vol3-ai-traffic-architect.zip",
    filename: "AI-Traffic-Architect-Vol3.zip",
  },
  "pdf-vol4": {
    r2Key: "en/vols/vol4-ai-story-architect.zip",
    filename: "AI-Story-Architect-Vol4.zip",
  },
  "pdf-vol5": {
    r2Key: "en/vols/vol5-ai-startup-architect.zip",
    filename: "AI-Startup-Architect-Vol5.zip",
  },
  "pdf-vol6": {
    r2Key: "en/vols/vol6-ai-content-architect.zip",
    filename: "AI-Content-Architect-Vol6.zip",
  },
};

const OTHER_PRODUCTS: Record<string, { r2Key: string; filename: string }> = {
  skills: {
    r2Key: "en/skills/ai-playbook-skills.zip",
    filename: "AI-Playbook-Skills.zip",
  },
  agents: {
    r2Key: "en/agents/ai-playbook-agents.zip",
    filename: "AI-Playbook-Agents.zip",
  },
  notion: {
    r2Key: "en/notion/ai-playbook-notion-templates.zip",
    filename: "AI-Playbook-Notion-Templates.zip",
  },
  bundle: {
    r2Key: "en/bundles/ai-native-playbook-bundle.zip",
    filename: "AI-Native-Playbook-Bundle.zip",
  },
  "getting-started": {
    r2Key: "en/pdf/getting-started.pdf",
    filename: "AI-Native-Playbook-Getting-Started.pdf",
  },
};

const ALL_PRODUCTS = { ...PDF_VOL_MAP, ...OTHER_PRODUCTS };

// ─── Product File Lookup ───

export function getProductFile(type: string): ProductFile | null {
  const product = ALL_PRODUCTS[type];
  if (!product) return null;
  return {
    url: `${R2_PUBLIC_URL}/${product.r2Key}`,
    filename: product.filename,
  };
}

// ─── Token Generation & Verification ───

export function generateDownloadToken(orderId: string): string {
  const expiry = Date.now() + TOKEN_EXPIRY_MS;
  const payload = `${orderId}:${expiry}`;
  const hmac = crypto
    .createHmac("sha256", DOWNLOAD_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

export function verifyDownloadToken(
  token: string
): { valid: boolean; orderId?: string } {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return { valid: false };

    const [orderId, expiryStr, providedHmac] = parts;
    const expiry = parseInt(expiryStr, 10);
    if (Date.now() > expiry) return { valid: false };

    const payload = `${orderId}:${expiryStr}`;
    const expectedHmac = crypto
      .createHmac("sha256", DOWNLOAD_SECRET)
      .update(payload)
      .digest("hex");
    if (providedHmac !== expectedHmac) return { valid: false };

    return { valid: true, orderId };
  } catch {
    return { valid: false };
  }
}

// ─── Download Link Builders ───

export function buildDownloadUrl(
  baseUrl: string,
  type: string,
  token: string
): string {
  return `${baseUrl}/api/download?type=${type}&token=${token}`;
}

/**
 * Return all download links based on order type.
 * - bundle → bundle ZIP + getting-started guide
 * - pdf-volN → that vol ZIP + getting-started guide
 * - other → only that product
 */
export function getAllDownloadLinks(
  _orderId: string,
  token: string,
  productType: string,
  baseUrl: string
): Record<string, string> {
  const links: Record<string, string> = {};

  if (productType === "bundle") {
    links.bundle = buildDownloadUrl(baseUrl, "bundle", token);
    links["getting-started"] = buildDownloadUrl(baseUrl, "getting-started", token);
  } else if (productType.startsWith("pdf-vol")) {
    links[productType] = buildDownloadUrl(baseUrl, productType, token);
    links["getting-started"] = buildDownloadUrl(baseUrl, "getting-started", token);
  } else {
    links[productType] = buildDownloadUrl(baseUrl, productType, token);
  }

  return links;
}

// ─── Validation ───

export function isValidProductType(type: string): boolean {
  return type in ALL_PRODUCTS;
}

/**
 * EN title keyword → product type fallback.
 * Used when priceId and vol-number detection both fail.
 */
const EN_TITLE_KEYWORDS: Array<[RegExp, string]> = [
  [/marketing architect|dotcom secrets/i, "pdf-vol1"],
  [/brand architect|expert secrets/i, "pdf-vol2"],
  [/traffic architect|traffic secrets/i, "pdf-vol3"],
  [/story architect|storytelling/i, "pdf-vol4"],
  [/startup architect|launch/i, "pdf-vol5"],
  [/content architect|content/i, "pdf-vol6"],
];

/**
 * Detect product type from multiple sources (Paddle product name + optional price ID).
 *
 * Priority:
 * 1. Paddle Price ID direct mapping (most reliable)
 * 2. Vol number in product name string
 * 3. Bundle keyword explicit match
 * 4. English title keyword match
 *
 * Returns "bundle" as safe default only when no other signal matches.
 */
export function detectProductType(
  productName: string,
  priceId?: string | null
): string {
  // 1. Paddle Price ID direct mapping
  if (priceId) {
    const priceMap: Record<string, string> = {
      [process.env.PADDLE_PRICE_ID_VOL1 || ""]: "pdf-vol1",
      [process.env.PADDLE_PRICE_ID_VOL2 || ""]: "pdf-vol2",
      [process.env.PADDLE_PRICE_ID_VOL3 || ""]: "pdf-vol3",
      [process.env.PADDLE_PRICE_ID_VOL4 || ""]: "pdf-vol4",
      [process.env.PADDLE_PRICE_ID_VOL5 || ""]: "pdf-vol5",
      [process.env.PADDLE_PRICE_ID_VOL6 || ""]: "pdf-vol6",
      [process.env.PADDLE_PRICE_ID_BUNDLE || ""]: "bundle",
    };
    delete priceMap[""];
    if (priceMap[priceId]) return priceMap[priceId];
  }

  // 2. Vol number in product name
  const volMatch = productName.match(/vol\.?\s*(\d)/i);
  if (volMatch) return `pdf-vol${volMatch[1]}`;

  // 3. Bundle keyword explicit match
  if (/bundle|complete/i.test(productName)) return "bundle";

  // 4. English title keyword match
  for (const [pattern, productType] of EN_TITLE_KEYWORDS) {
    if (pattern.test(productName)) return productType;
  }

  return "bundle";
}
