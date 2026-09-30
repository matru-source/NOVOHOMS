import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/admin-auth";
import { undoActivity } from "@/lib/history-store";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!sameOrigin(request)) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }
    const session = await requireAdmin();
    const rawId = (await params).id;
    const id = Number(rawId);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid history ID." }, { status: 400 });
    }

    const result = await undoActivity(id, session.email);
    return NextResponse.json({ ok: true, message: result.message });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }
    const msg = error instanceof Error ? error.message : "Unable to undo action.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
