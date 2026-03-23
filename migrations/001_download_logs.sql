-- download_logs table: track downloads for refund prevention
-- Used by ainp (AI Native Playbook) download system
CREATE TABLE IF NOT EXISTS download_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_type TEXT NOT NULL,       -- 'pdf-vol1' .. 'pdf-vol6', 'skills', 'agents', 'notion', 'bundle'
  downloaded_at INTEGER NOT NULL,   -- Unix timestamp (ms)
  ip TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  UNIQUE(order_id, product_type, downloaded_at)
);

CREATE INDEX IF NOT EXISTS idx_download_logs_order ON download_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_product ON download_logs(product_type);
