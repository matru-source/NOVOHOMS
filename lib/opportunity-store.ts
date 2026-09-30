import { neon } from "@neondatabase/serverless";
import { properties, type Property } from "@/data/site";

export type ManagedOpportunity = Property & {
  id: number;
  category: string;
  published: boolean;
  featured: boolean;
  sortOrder: number;
  updatedAt: string;
};

type OpportunityRow = {
  id: number; slug: string; name: string; eyebrow: string; location: string;
  tagline: string; summary: string; config: string; status: string; category: string;
  image: string; gallery_json: string; highlights_json: string; published: boolean;
  featured: boolean; sort_order: number; updated_at: string;
};

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

let schemaReady: Promise<void> | null = null;
function ensureSchema() {
  if (!schemaReady) schemaReady = (async () => {
    const sql = database();
    await sql`CREATE TABLE IF NOT EXISTS opportunities (
      id BIGSERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      eyebrow TEXT NOT NULL,
      location TEXT NOT NULL,
      tagline TEXT NOT NULL,
      summary TEXT NOT NULL,
      config TEXT NOT NULL,
      status TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Residential',
      image TEXT NOT NULL,
      gallery_json TEXT NOT NULL DEFAULT '[]',
      highlights_json TEXT NOT NULL DEFAULT '[]',
      published BOOLEAN NOT NULL DEFAULT TRUE,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await sql`CREATE INDEX IF NOT EXISTS idx_opportunities_listing ON opportunities (published, featured DESC, sort_order ASC)`;
    await sql`CREATE TABLE IF NOT EXISTS system_settings (key TEXT PRIMARY KEY, val TEXT NOT NULL)`;
  })().catch((error) => { schemaReady = null; throw error; });
  return schemaReady;
}

const safeJson = <T,>(value: string, fallback: T): T => {
  try { return JSON.parse(value) as T; } catch { return fallback; }
};

const toOpportunity = (row: OpportunityRow): ManagedOpportunity => ({
  id: Number(row.id), slug: row.slug, name: row.name, eyebrow: row.eyebrow, location: row.location,
  tagline: row.tagline, summary: row.summary, config: row.config, status: row.status,
  category: row.category, image: row.image, gallery: safeJson(row.gallery_json, []),
  highlights: safeJson(row.highlights_json, []), published: Boolean(row.published),
  featured: Boolean(row.featured), sortOrder: row.sort_order, updatedAt: String(row.updated_at),
});

export function normalizeOpportunity(value: Partial<ManagedOpportunity>) {
  const text = (key: keyof ManagedOpportunity, max = 4000) => String(value[key] ?? "").trim().slice(0, max);
  const name = text("name", 160);
  const slug = text("slug", 120).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const image = text("image", 2000);
  if (!name || !slug || !text("location", 240) || !image) throw new Error("Name, slug, location and primary image are required.");
  if (!/^(https?:\/\/|\/)/i.test(image)) throw new Error("Primary image must be a valid web URL or path.");
  const gallery = Array.isArray(value.gallery) ? value.gallery.slice(0, 12).map((item) => ({ label: String(item?.label ?? "").slice(0, 120), image: String(item?.image ?? "").slice(0, 2000) })).filter((item) => item.label && /^(https?:\/\/|\/)/i.test(item.image)) : [];
  const highlights = Array.isArray(value.highlights) ? value.highlights.slice(0, 8).map((item) => ({ title: String(item?.title ?? "").slice(0, 140), text: String(item?.text ?? "").slice(0, 800) })).filter((item) => item.title && item.text) : [];
  return { slug, name, eyebrow: text("eyebrow", 160), location: text("location", 240), tagline: text("tagline", 260), summary: text("summary", 4000), config: text("config", 160), status: text("status", 120), category: text("category", 80) || "Residential", image, gallery, highlights, published: value.published !== false, featured: Boolean(value.featured), sortOrder: Number.isFinite(Number(value.sortOrder)) ? Math.trunc(Number(value.sortOrder)) : 0 };
}

export async function ensureInitialOpportunities() {
  await ensureSchema();
  const sql = database();
  const settings = await sql`SELECT val FROM system_settings WHERE key = 'seeded' LIMIT 1` as { val: string }[];
  if (settings && settings[0]?.val === 'true') return;

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM opportunities` as { count: number }[];
  if (count === 0) {
    for (const [index, item] of properties.entries()) {
      await sql`INSERT INTO opportunities (slug,name,eyebrow,location,tagline,summary,config,status,category,image,gallery_json,highlights_json,published,featured,sort_order)
        VALUES (${item.slug},${item.name},${item.eyebrow},${item.location},${item.tagline},${item.summary},${item.config},${item.status},${"Residential"},${item.image},${JSON.stringify(item.gallery)},${JSON.stringify(item.highlights)},${true},${index === 0},${index})
        ON CONFLICT (slug) DO NOTHING`;
    }
  }
  await sql`INSERT INTO system_settings (key, val) VALUES ('seeded', 'true') ON CONFLICT (key) DO NOTHING`;
}

export async function listOpportunities(includeDrafts = false) {
  await ensureSchema(); const sql = database();
  const rows = includeDrafts
    ? await sql`SELECT * FROM opportunities ORDER BY featured DESC, sort_order ASC, updated_at DESC`
    : await sql`SELECT * FROM opportunities WHERE published = TRUE ORDER BY featured DESC, sort_order ASC, updated_at DESC`;
  return (rows as OpportunityRow[]).map(toOpportunity);
}

export async function getOpportunityBySlug(slug: string, includeDrafts = false) {
  await ensureSchema(); const sql = database();
  const rows = includeDrafts
    ? await sql`SELECT * FROM opportunities WHERE slug = ${slug} LIMIT 1`
    : await sql`SELECT * FROM opportunities WHERE slug = ${slug} AND published = TRUE LIMIT 1`;
  return rows[0] ? toOpportunity(rows[0] as OpportunityRow) : null;
}

import { recordActivity } from "@/lib/history-store";

export async function createOpportunity(value: Partial<ManagedOpportunity>) {
  await ensureSchema(); const item = normalizeOpportunity(value); const sql = database();
  const rows = await sql`INSERT INTO opportunities (slug,name,eyebrow,location,tagline,summary,config,status,category,image,gallery_json,highlights_json,published,featured,sort_order)
    VALUES (${item.slug},${item.name},${item.eyebrow},${item.location},${item.tagline},${item.summary},${item.config},${item.status},${item.category},${item.image},${JSON.stringify(item.gallery)},${JSON.stringify(item.highlights)},${item.published},${item.featured},${item.sortOrder}) RETURNING *`;
  const created = toOpportunity(rows[0] as OpportunityRow);
  await recordActivity({
    actionType: "OPPORTUNITY_CREATE",
    entityType: "opportunity",
    entityId: created.id,
    entityName: created.name,
    description: `Created new project "${created.name}" (${created.category}, ${created.location})`,
    afterState: created as unknown as Record<string, unknown>,
  });
  return created;
}

export async function updateOpportunity(id: number, value: Partial<ManagedOpportunity>) {
  await ensureSchema(); const item = normalizeOpportunity(value); const sql = database();
  const existingRows = await sql`SELECT * FROM opportunities WHERE id = ${id} LIMIT 1`;
  if (!existingRows[0]) throw new Error("Opportunity not found.");
  const before = toOpportunity(existingRows[0] as OpportunityRow);

  const rows = await sql`UPDATE opportunities SET slug=${item.slug},name=${item.name},eyebrow=${item.eyebrow},location=${item.location},tagline=${item.tagline},summary=${item.summary},config=${item.config},status=${item.status},category=${item.category},image=${item.image},gallery_json=${JSON.stringify(item.gallery)},highlights_json=${JSON.stringify(item.highlights)},published=${item.published},featured=${item.featured},sort_order=${item.sortOrder},updated_at=NOW() WHERE id=${id} RETURNING *`;
  if (!rows[0]) throw new Error("Opportunity not found.");
  const updated = toOpportunity(rows[0] as OpportunityRow);

  const changes: string[] = [];
  if (before.name !== updated.name) changes.push(`Name: "${updated.name}"`);
  if (before.status !== updated.status) changes.push(`Status: "${updated.status}"`);
  if (before.published !== updated.published) changes.push(updated.published ? "Published" : "Moved to Draft");
  if (before.featured !== updated.featured) changes.push(updated.featured ? "Marked Featured" : "Unmarked Featured");
  if (before.image !== updated.image) changes.push("Updated cover photo");
  if (before.gallery.length !== updated.gallery.length) changes.push(`Gallery count: ${updated.gallery.length}`);
  if (before.location !== updated.location) changes.push(`Location: "${updated.location}"`);

  const desc = changes.length > 0 
    ? `Updated "${updated.name}" (${changes.join(", ")})`
    : `Updated details for "${updated.name}"`;

  await recordActivity({
    actionType: "OPPORTUNITY_UPDATE",
    entityType: "opportunity",
    entityId: updated.id,
    entityName: updated.name,
    description: desc,
    beforeState: before as unknown as Record<string, unknown>,
    afterState: updated as unknown as Record<string, unknown>,
  });

  return updated;
}

export async function deleteOpportunity(id: number) {
  await ensureSchema(); const sql = database();
  const existingRows = await sql`SELECT * FROM opportunities WHERE id = ${id} LIMIT 1`;
  if (existingRows[0]) {
    const before = toOpportunity(existingRows[0] as OpportunityRow);
    await sql`DELETE FROM opportunities WHERE id = ${id}`;
    await recordActivity({
      actionType: "OPPORTUNITY_DELETE",
      entityType: "opportunity",
      entityId: id,
      entityName: before.name,
      description: `Deleted project "${before.name}" (${before.location})`,
      beforeState: before as unknown as Record<string, unknown>,
    });
  } else {
    await sql`DELETE FROM opportunities WHERE id = ${id}`;
  }
}

