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
    r2Key: "en/pdf/ai-marketing-playbook.pdf",
    filename: "AI-Marketing-Playbook.pdf",
  },
  "pdf-vol2": {
    r2Key: "en/pdf/ai-brand-playbook.pdf",
    filename: "AI-Brand-Playbook.pdf",
  },
  "pdf-vol3": {
    r2Key: "en/pdf/ai-traffic-playbook.pdf",
    filename: "AI-Traffic-Playbook.pdf",
  },
  "pdf-vol4": {
    r2Key: "en/pdf/ai-story-playbook.pdf",
    filename: "AI-Story-Playbook.pdf",
  },
  "pdf-vol5": {
    r2Key: "en/pdf/ai-startup-playbook.pdf",
    filename: "AI-Startup-Playbook.pdf",
  },
  "pdf-vol6": {
    r2Key: "en/pdf/ai-content-playbook.pdf",
    filename: "AI-Content-Playbook.pdf",
  },
};

const OTHER_PRODUCTS: Record<string, { r2Key: string; filename: string }> = {
  skills: {
    r2Key: "en/skills/",
    filename: "AI-Playbook-Skills.zip",
  },
  agents: {
    r2Key: "en/agents/",
    filename: "AI-Playbook-Agents.zip",
  },
  notion: {
    r2Key: "en/notion/",
    filename: "AI-Playbook-Notion-Templates.zip",
  },
  bundle: {
    r2Key: "en/bundles/ai-native-playbook-bundle.zip",
    filename: "AI-Native-Playbook-Bundle.zip",
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
 * Generate all download links for a purchase.
 * - bundle: all products (individual PDFs + skills + agents + notion + bundle ZIP)
 * - individual: only the purchased product
 */
export function getAllDownloadLinks(
  orderId: string,
  token: string,
  productType: string,
  baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://ai-native-playbook.com"
): Record<string, string> {
  const links: Record<string, string> = {};

  if (productType === "bundle") {
    for (const key of Object.keys(ALL_PRODUCTS)) {
      links[key] = buildDownloadUrl(baseUrl, key, token);
    }
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
 * Detect product type from Paddle product name.
 * Used by webhook handler to determine what was purchased.
 */
export function detectProductType(productName: string): string {
  if (
    productName.toLowerCase().includes("bundle") ||
    productName.toLowerCase().includes("complete")
  ) {
    return "bundle";
  }
  const volMatch = productName.match(/vol\.?\s*(\d)/i);
  if (volMatch) return `pdf-vol${volMatch[1]}`;
  return "bundle"; // default to bundle
}
