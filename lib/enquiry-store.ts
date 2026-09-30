import { neon } from "@neondatabase/serverless";

export type Enquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  sourcePage: string;
  status: "New" | "Contacted" | "Follow-up" | "Closed";
  createdAt: string;
};

type EnquiryRow = {
  id: number | string;
  name: string;
  phone: string;
  email: string;
  category: string;
  message: string;
  source_page: string;
  status: string;
  created_at: string | Date;
};

// In-memory fallback if database is temporarily unavailable
let fallbackEnquiries: Enquiry[] = [];

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

let schemaReady: Promise<void> | null = null;
async function ensureSchema() {
  const sql = database();
  if (!sql) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS enquiries (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT 'Residential',
        message TEXT NOT NULL DEFAULT '',
        source_page TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'New',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at DESC)`;
    })().catch((error) => {
      schemaReady = null;
      console.error("Enquiry schema error:", error);
    });
  }
  return schemaReady;
}

const toEnquiry = (row: EnquiryRow): Enquiry => ({
  id: Number(row.id),
  name: String(row.name || ""),
  phone: String(row.phone || ""),
  email: String(row.email || ""),
  category: String(row.category || "Residential"),
  message: String(row.message || ""),
  sourcePage: String(row.source_page || ""),
  status: (row.status as Enquiry["status"]) || "New",
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
});

export async function createEnquiry(data: {
  name: string;
  phone: string;
  email?: string;
  category?: string;
  message?: string;
  sourcePage?: string;
}): Promise<Enquiry> {
  const name = String(data.name || "").trim().slice(0, 160);
  const phone = String(data.phone || "").trim().slice(0, 40);
  const email = String(data.email || "").trim().slice(0, 160);
  const category = String(data.category || "Residential").trim().slice(0, 80);
  const message = String(data.message || "").trim().slice(0, 2000);
  const sourcePage = String(data.sourcePage || "").trim().slice(0, 200);

  if (!name || !phone) {
    throw new Error("Name and phone number are required.");
  }

  const sql = database();
  if (sql) {
    try {
      await ensureSchema();
      const rows = await sql`
        INSERT INTO enquiries (name, phone, email, category, message, source_page, status)
        VALUES (${name}, ${phone}, ${email}, ${category}, ${message}, ${sourcePage}, 'New')
        RETURNING *
      `;
      if (rows && rows[0]) {
        return toEnquiry(rows[0] as EnquiryRow);
      }
    } catch (err) {
      console.error("Failed to insert enquiry into DB, saving to fallback:", err);
    }
  }

  const item: Enquiry = {
    id: Date.now(),
    name,
    phone,
    email,
    category,
    message,
    sourcePage,
    status: "New",
    createdAt: new Date().toISOString(),
  };
  fallbackEnquiries.unshift(item);
  return item;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const sql = database();
  if (sql) {
    try {
      await ensureSchema();
      const rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC`;
      return (rows as EnquiryRow[]).map(toEnquiry);
    } catch (err) {
      console.error("Failed to list enquiries from DB, using fallback:", err);
    }
  }
  return fallbackEnquiries;
}

import { recordActivity } from "@/lib/history-store";

export async function updateEnquiryStatus(
  id: number,
  status: "New" | "Contacted" | "Follow-up" | "Closed"
): Promise<boolean> {
  const sql = database();
  if (sql) {
    try {
      await ensureSchema();
      const existing = (await sql`SELECT * FROM enquiries WHERE id = ${id} LIMIT 1`) as EnquiryRow[];
      if (existing[0]) {
        const before = toEnquiry(existing[0]);
        await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
        await recordActivity({
          actionType: "ENQUIRY_STATUS_UPDATE",
          entityType: "enquiry",
          entityId: id,
          entityName: before.name,
          description: `Changed status of "${before.name}" from "${before.status}" to "${status}"`,
          beforeState: before as unknown as Record<string, unknown>,
          afterState: { ...before, status } as unknown as Record<string, unknown>,
        });
        return true;
      }
    } catch (err) {
      console.error("Failed to update enquiry status in DB:", err);
    }
  }
  const item = fallbackEnquiries.find((e) => e.id === id);
  if (item) {
    item.status = status;
    return true;
  }
  return false;
}

export async function deleteEnquiry(id: number): Promise<boolean> {
  const sql = database();
  if (sql) {
    try {
      await ensureSchema();
      const existing = (await sql`SELECT * FROM enquiries WHERE id = ${id} LIMIT 1`) as EnquiryRow[];
      if (existing[0]) {
        const before = toEnquiry(existing[0]);
        await sql`DELETE FROM enquiries WHERE id = ${id}`;
        await recordActivity({
          actionType: "ENQUIRY_DELETE",
          entityType: "enquiry",
          entityId: id,
          entityName: before.name,
          description: `Deleted enquiry from "${before.name}" (${before.phone})`,
          beforeState: before as unknown as Record<string, unknown>,
        });
        return true;
      } else {
        await sql`DELETE FROM enquiries WHERE id = ${id}`;
        return true;
      }
    } catch (err) {
      console.error("Failed to delete enquiry in DB:", err);
    }
  }
  fallbackEnquiries = fallbackEnquiries.filter((e) => e.id !== id);
  return true;
}

