// src/lib/notion-crm.ts
// Notion CRM integration — registers subscribers/leads to shared CRM DB
// Lightweight fetch-based implementation (no SDK)

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const CRM_DATABASE_ID = "327f075404ae81878471c065a4ac2117";

export interface CrmEntry {
  customerName: string; // Customer name (title property)
  email: string; // Email address
  source?: string; // Lead source (select) — e.g. "ainp-free-guide", "ainp-subscribe"
  project?: string; // Project identifier (select) — "ai-native-playbook"
}

/**
 * Create a customer entry in the shared Notion CRM (fire-and-forget).
 * Runs in mock mode when NOTION_TOKEN is not set.
 */
export async function createCrmEntry(
  entry: CrmEntry
): Promise<{ success: boolean; pageId?: string; error?: string }> {
  if (!NOTION_TOKEN) {
    console.log(
      "[notion-crm:mock] NOTION_TOKEN not set, mock mode:",
      entry.customerName
    );
    return { success: true, pageId: "mock" };
  }

  const properties: Record<string, unknown> = {
    고객명: {
      title: [{ text: { content: entry.customerName } }],
    },
    이메일: { email: entry.email },
  };

  if (entry.source) {
    properties["출처"] = { select: { name: entry.source } };
  }
  if (entry.project) {
    properties["프로젝트"] = { select: { name: entry.project } };
  }

  // Record submission date automatically
  properties["접수일"] = { date: { start: new Date().toISOString() } };

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: CRM_DATABASE_ID },
        properties,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[notion-crm] API error:", res.status, body);
      return { success: false, error: `${res.status}: ${body.slice(0, 200)}` };
    }

    const data = await res.json();
    return { success: true, pageId: data.id };
  } catch (err) {
    console.error("[notion-crm] Network error:", err);
    return { success: false, error: String(err) };
  }
}
