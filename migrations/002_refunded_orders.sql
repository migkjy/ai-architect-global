-- refunded_orders table: tracks Paddle transaction refunds
-- Used by ainp download API to block access after refund
-- Populated by Paddle webhook transaction.refunded event
CREATE TABLE IF NOT EXISTS refunded_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id TEXT NOT NULL UNIQUE,  -- Paddle transaction ID (txn_xxx)
  customer_email TEXT DEFAULT '',
  product_name TEXT DEFAULT '',
  amount INTEGER DEFAULT 0,             -- in cents
  currency TEXT DEFAULT 'USD',
  refunded_at INTEGER NOT NULL,         -- Unix timestamp (ms)
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);

CREATE INDEX IF NOT EXISTS idx_refunded_orders_txn ON refunded_orders(transaction_id);
CREATE INDEX IF NOT EXISTS idx_refunded_orders_email ON refunded_orders(customer_email);
