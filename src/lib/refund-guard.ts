/**
 * Refund guard for AI Native Playbook
 *
 * Tracks refunded Paddle transactions in the refunded_orders table (Turso/LibSQL).
 * Used by the download API to block access after a refund is processed.
 *
 * Design decisions:
 * - isRefunded() fails open (returns false) when DB is unavailable — prevents
 *   accidental download blocks due to DB outages.
 * - markRefunded() uses INSERT OR IGNORE for idempotency — safe for Paddle retries.
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

export interface MarkRefundedParams {
  transactionId: string;
  customerEmail: string;
  productName: string;
  amount: number;
  currency: string;
}

// ─── Mark Order as Refunded ───

/**
 * Record a refunded Paddle transaction.
 * Safe to call multiple times — INSERT OR IGNORE prevents duplicates.
 */
export async function markRefunded({
  transactionId,
  customerEmail,
  productName,
  amount,
  currency,
}: MarkRefundedParams): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db.execute({
    sql: `INSERT OR IGNORE INTO refunded_orders
            (transaction_id, customer_email, product_name, amount, currency, refunded_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [transactionId, customerEmail, productName, amount, currency, Date.now()],
  });
}

// ─── Check Refund Status ───

/**
 * Returns true if the given Paddle transaction has been refunded.
 * Fails open (returns false) on DB error to avoid blocking legitimate downloads
 * due to infrastructure issues.
 */
export async function isRefunded(transactionId: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const result = await db.execute({
      sql: "SELECT COUNT(*) as count FROM refunded_orders WHERE transaction_id = ?",
      args: [transactionId],
    });

    const count = Number(result.rows[0]?.count ?? 0);
    return count > 0;
  } catch {
    // Fail open: if DB is down, don't block downloads
    return false;
  }
}
