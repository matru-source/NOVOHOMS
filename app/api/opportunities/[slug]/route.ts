import { NextResponse } from "next/server";
import { getOpportunityBySlug } from "@/lib/opportunity-store";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const item = await getOpportunityBySlug((await params).slug, false);
    return item ? NextResponse.json({ opportunity: item }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) { console.error("Unable to load opportunity", error); return NextResponse.json({ error: "Opportunity is temporarily unavailable." }, { status: 503 }); }
}
