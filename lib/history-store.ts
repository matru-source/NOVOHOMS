import { neon } from "@neondatabase/serverless";

export type ActionType =
  | "OPPORTUNITY_CREATE"
  | "OPPORTUNITY_UPDATE"
  | "OPPORTUNITY_DELETE"
  | "ENQUIRY_STATUS_UPDATE"
  | "ENQUIRY_DELETE"
  | "UNDO";

export type EntityType = "opportunity" | "enquiry" | "media";

export type ActivityLog = {
  id: number;
  actionType: ActionType;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  description: string;
  actorEmail: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  isUndone: boolean;
  undoneAt: string | null;
  createdAt: string;
};

type HistoryRow = {
  id: number | string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  description: string;
  actor_email: string;
  before_state: string | null;
  after_state: string | null;
  is_undone: boolean;
  undone_at: string | Date | null;
  created_at: string | Date;
};

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

let schemaReady: Promise<void> | null = null;
export async function ensureHistorySchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = database();
      await sql`CREATE TABLE IF NOT EXISTS activity_history (
        id BIGSERIAL PRIMARY KEY,
        action_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        entity_name TEXT NOT NULL,
        description TEXT NOT NULL,
        actor_email TEXT NOT NULL DEFAULT 'Admin',
        before_state JSONB,
        after_state JSONB,
        is_undone BOOLEAN NOT NULL DEFAULT FALSE,
        undone_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_activity_history_created ON activity_history (created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_activity_history_entity ON activity_history (entity_type, entity_id)`;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

const safeParseJson = (val: unknown): Record<string, unknown> | null => {
  if (!val) return null;
  if (typeof val === "object") return val as Record<string, unknown>;
  try {
    return JSON.parse(String(val)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const toActivityLog = (row: HistoryRow): ActivityLog => ({
  id: Number(row.id),
  actionType: row.action_type as ActionType,
  entityType: row.entity_type as EntityType,
  entityId: String(row.entity_id || ""),
  entityName: String(row.entity_name || ""),
  description: String(row.description || ""),
  actorEmail: String(row.actor_email || "Admin"),
  beforeState: safeParseJson(row.before_state),
  afterState: safeParseJson(row.after_state),
  isUndone: Boolean(row.is_undone),
  undoneAt: row.undone_at ? new Date(row.undone_at).toISOString() : null,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
});

export async function recordActivity(data: {
  actionType: ActionType;
  entityType: EntityType;
  entityId: string | number;
  entityName: string;
  description: string;
  actorEmail?: string;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
}): Promise<ActivityLog | null> {
  try {
    await ensureHistorySchema();
    const sql = database();
    const actor = data.actorEmail || "Jigyasha Singh";
    const beforeJson = data.beforeState ? JSON.stringify(data.beforeState) : null;
    const afterJson = data.afterState ? JSON.stringify(data.afterState) : null;

    const rows = (await sql`
      INSERT INTO activity_history (
        action_type, entity_type, entity_id, entity_name, description, actor_email, before_state, after_state
      ) VALUES (
        ${data.actionType}, ${data.entityType}, ${String(data.entityId)}, ${data.entityName},
        ${data.description}, ${actor}, ${beforeJson}::jsonb, ${afterJson}::jsonb
      )
      RETURNING *
    `) as HistoryRow[];

    return rows[0] ? toActivityLog(rows[0]) : null;
  } catch (err) {
    console.error("Failed to record activity:", err);
    return null;
  }
}

export async function listHistory(limit = 100): Promise<ActivityLog[]> {
  try {
    await ensureHistorySchema();
    const sql = database();
    const rows = (await sql`
      SELECT * FROM activity_history
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as HistoryRow[];
    return rows.map(toActivityLog);
  } catch (err) {
    console.error("Failed to list activity history:", err);
    return [];
  }
}

export async function getHistoryById(id: number): Promise<ActivityLog | null> {
  await ensureHistorySchema();
  const sql = database();
  const rows = (await sql`
    SELECT * FROM activity_history
    WHERE id = ${id}
    LIMIT 1
  `) as HistoryRow[];
  return rows[0] ? toActivityLog(rows[0]) : null;
}

export async function undoActivity(
  historyId: number,
  actorEmail = "Admin"
): Promise<{ success: boolean; message: string }> {
  await ensureHistorySchema();
  const log = await getHistoryById(historyId);
  if (!log) throw new Error("Activity record not found.");
  if (log.isUndone) throw new Error("This action has already been reverted.");

  const sql = database();

  switch (log.actionType) {
    case "OPPORTUNITY_UPDATE": {
      if (!log.beforeState) throw new Error("No previous state available to restore.");
      const b = log.beforeState;
      const oppId = Number(log.entityId);

      await sql`
        UPDATE opportunities SET
          slug = ${String(b.slug || "")},
          name = ${String(b.name || "")},
          eyebrow = ${String(b.eyebrow || "")},
          location = ${String(b.location || "")},
          tagline = ${String(b.tagline || "")},
          summary = ${String(b.summary || "")},
          config = ${String(b.config || "")},
          status = ${String(b.status || "")},
          category = ${String(b.category || "Residential")},
          image = ${String(b.image || "")},
          gallery_json = ${JSON.stringify(b.gallery || [])},
          highlights_json = ${JSON.stringify(b.highlights || [])},
          published = ${Boolean(b.published)},
          featured = ${Boolean(b.featured)},
          sort_order = ${Number(b.sortOrder) || 0},
          updated_at = NOW()
        WHERE id = ${oppId}
      `;

      await recordActivity({
        actionType: "UNDO",
        entityType: "opportunity",
        entityId: oppId,
        entityName: log.entityName,
        description: `Reverted updates to "${log.entityName}" back to state from ${new Date(log.createdAt).toLocaleDateString("en-IN")}`,
        actorEmail,
        afterState: b,
      });
      break;
    }

    case "OPPORTUNITY_DELETE": {
      if (!log.beforeState) throw new Error("No previous state available to restore.");
      const b = log.beforeState;

      // Re-insert the deleted opportunity
      const inserted = (await sql`
        INSERT INTO opportunities (
          slug, name, eyebrow, location, tagline, summary, config, status, category,
          image, gallery_json, highlights_json, published, featured, sort_order
        ) VALUES (
          ${String(b.slug || "")},
          ${String(b.name || "")},
          ${String(b.eyebrow || "")},
          ${String(b.location || "")},
          ${String(b.tagline || "")},
          ${String(b.summary || "")},
          ${String(b.config || "")},
          ${String(b.status || "")},
          ${String(b.category || "Residential")},
          ${String(b.image || "")},
          ${JSON.stringify(b.gallery || [])},
          ${JSON.stringify(b.highlights || [])},
          ${Boolean(b.published)},
          ${Boolean(b.featured)},
          ${Number(b.sortOrder) || 0}
        )
        RETURNING id
      `) as { id: string | number }[];

      const newId = Number(inserted[0].id);

      await recordActivity({
        actionType: "UNDO",
        entityType: "opportunity",
        entityId: newId,
        entityName: log.entityName,
        description: `Restored deleted opportunity "${log.entityName}"`,
        actorEmail,
      });
      break;
    }

    case "OPPORTUNITY_CREATE": {
      const oppId = Number(log.entityId);
      // Soft-delete or remove the created opportunity
      await sql`DELETE FROM opportunities WHERE id = ${oppId}`;

      await recordActivity({
        actionType: "UNDO",
        entityType: "opportunity",
        entityId: oppId,
        entityName: log.entityName,
        description: `Reverted creation of opportunity "${log.entityName}" (removed)`,
        actorEmail,
      });
      break;
    }

    case "ENQUIRY_STATUS_UPDATE": {
      if (!log.beforeState || !log.beforeState.status) {
        throw new Error("No previous status available to restore.");
      }
      const prevStatus = String(log.beforeState.status);
      const enqId = Number(log.entityId);

      await sql`UPDATE enquiries SET status = ${prevStatus} WHERE id = ${enqId}`;

      await recordActivity({
        actionType: "UNDO",
        entityType: "enquiry",
        entityId: enqId,
        entityName: log.entityName,
        description: `Reverted enquiry status of "${log.entityName}" back to "${prevStatus}"`,
        actorEmail,
      });
      break;
    }

    case "ENQUIRY_DELETE": {
      if (!log.beforeState) throw new Error("No previous state available to restore.");
      const b = log.beforeState;

      const inserted = (await sql`
        INSERT INTO enquiries (
          name, phone, email, category, message, source_page, status
        ) VALUES (
          ${String(b.name || "")},
          ${String(b.phone || "")},
          ${String(b.email || "")},
          ${String(b.category || "Residential")},
          ${String(b.message || "")},
          ${String(b.sourcePage || "")},
          ${String(b.status || "New")}
        )
        RETURNING id
      `) as { id: string | number }[];

      await recordActivity({
        actionType: "UNDO",
        entityType: "enquiry",
        entityId: Number(inserted[0].id),
        entityName: log.entityName,
        description: `Restored deleted enquiry from "${log.entityName}"`,
        actorEmail,
      });
      break;
    }

    default:
      throw new Error(`Undo not supported for action type: ${log.actionType}`);
  }

  // Mark original log as undone
  await sql`
    UPDATE activity_history
    SET is_undone = TRUE, undone_at = NOW()
    WHERE id = ${historyId}
  `;

  return { success: true, message: `Reverted ${log.description}` };
}
