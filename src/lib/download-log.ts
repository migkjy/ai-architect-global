/**
 * Download tracking and refund guard for AI Native Playbook
 *
 * Records every download in the download_logs table (Turso/LibSQL).
 * Used to:
 * - Track download counts per order
 * - Prevent refunds after download (Paddle 14-day policy)
 * - Audit trail for digital product delivery
 */

import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

function getDb(): Client | null {
  if (_db) return _db;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) return null;

  _db = createClient({ url, authToken });
  return _db;
}

// ─── Types ───

interface LogDownloadParams {
  orderId: string;
  productType: string;
  ip: string;
  userAgent: string;
}

export interface DownloadRecord {
  product_type: string;
  downloaded_at: number;
  ip: string;
}

// ─── Log a Download ───

export async function logDownload({
  orderId,
  productType,
  ip,
  userAgent,
}: LogDownloadParams): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db.execute({
    sql: `INSERT INTO download_logs (order_id, product_type, downloaded_at, ip, user_agent)
          VALUES (?, ?, ?, ?, ?)`,
    args: [orderId, productType, Date.now(), ip, userAgent],
  });
}

// ─── Check if Order Has Downloads ───

export async function hasDownloaded(orderId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const result = await db.execute({
    sql: "SELECT COUNT(*) as count FROM download_logs WHERE order_id = ?",
    args: [orderId],
  });

  const count = Number(result.rows[0]?.count ?? 0);
  return count > 0;
}

// ─── Get Download History ───

export async function getDownloadHistory(
  orderId: string
): Promise<DownloadRecord[]> {
  const db = getDb();
  if (!db) return [];

  const result = await db.execute({
    sql: "SELECT product_type, downloaded_at, ip FROM download_logs WHERE order_id = ? ORDER BY downloaded_at DESC",
    args: [orderId],
  });

  return result.rows.map((row) => ({
    product_type: String(row.product_type),
    downloaded_at: Number(row.downloaded_at),
    ip: String(row.ip),
  }));
}

// ─── Refund Eligibility ───

/**
 * Returns true if the order is eligible for a refund.
 * Once a download has been made, refund is no longer possible.
 */
export async function isRefundable(orderId: string): Promise<boolean> {
  return !(await hasDownloaded(orderId));
}
