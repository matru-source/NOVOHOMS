import { neon } from "@neondatabase/serverless";

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

let schemaReady: Promise<void> | null = null;
export function ensureMediaSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = database();
      await sql`CREATE TABLE IF NOT EXISTS uploaded_media (
        id BIGSERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_uploaded_media_created ON uploaded_media (created_at DESC)`;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export async function saveUploadedMedia(
  filename: string,
  mimeType: string,
  size: number,
  base64Data: string
): Promise<{ id: number; url: string; filename: string }> {
  await ensureMediaSchema();
  const sql = database();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200) || "image.jpg";
  const cleanMime = mimeType.slice(0, 100) || "image/jpeg";

  const rows = (await sql`
    INSERT INTO uploaded_media (filename, mime_type, size, data)
    VALUES (${cleanFilename}, ${cleanMime}, ${size}, ${base64Data})
    RETURNING id, filename
  `) as { id: string | number; filename: string }[];

  const id = Number(rows[0].id);
  return {
    id,
    url: `/api/media/${id}`,
    filename: rows[0].filename,
  };
}

export async function getUploadedMedia(id: number): Promise<{
  filename: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
} | null> {
  await ensureMediaSchema();
  const sql = database();
  const rows = (await sql`
    SELECT filename, mime_type, size, data
    FROM uploaded_media
    WHERE id = ${id}
    LIMIT 1
  `) as { filename: string; mime_type: string; size: number; data: string }[];

  if (!rows || rows.length === 0) return null;
  const row = rows[0];
  const buffer = Buffer.from(row.data, "base64");
  return {
    filename: row.filename,
    mimeType: row.mime_type,
    size: Number(row.size),
    buffer,
  };
}
