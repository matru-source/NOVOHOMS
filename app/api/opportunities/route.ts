import { NextResponse } from "next/server";
import { ensureInitialOpportunities, listOpportunities } from "@/lib/opportunity-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try { await ensureInitialOpportunities(); return NextResponse.json({ opportunities: await listOpportunities(false) }); }
  catch (error) { console.error("Unable to list opportunities", error); return NextResponse.json({ error: "Opportunities are temporarily unavailable." }, { status: 503 }); }
}
