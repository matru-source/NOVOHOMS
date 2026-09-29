import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/admin-auth";
import { createOpportunity, ensureInitialOpportunities, listOpportunities } from "@/lib/opportunity-store";

export const dynamic = "force-dynamic";
const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function GET() {
  try { await requireAdmin(); await ensureInitialOpportunities(); return NextResponse.json({ opportunities: await listOpportunities(true) }); }
  catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized(); console.error(error); return NextResponse.json({ error: "Unable to load opportunities." }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    await requireAdmin();
    const item = await createOpportunity(await request.json());
    return NextResponse.json({ opportunity: item }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized();
    const message = error instanceof Error && /required|valid/i.test(error.message) ? error.message : "Unable to create opportunity. Check that the slug is unique.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
