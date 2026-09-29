import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/admin-auth";
import { deleteOpportunity, updateOpportunity } from "@/lib/opportunity-store";

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    await requireAdmin();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid opportunity." }, { status: 400 });
    return NextResponse.json({ opportunity: await updateOpportunity(id, await request.json()) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized();
    const message = error instanceof Error && /required|valid/i.test(error.message) ? error.message : "Unable to save opportunity. Check that the slug is unique.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    await requireAdmin();
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Invalid opportunity." }, { status: 400 });
    await deleteOpportunity(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized();
    return NextResponse.json({ error: "Unable to delete opportunity." }, { status: 500 });
  }
}
