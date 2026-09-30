import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listHistory } from "@/lib/history-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const history = await listHistory(100);
    return NextResponse.json({ history });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    }
    console.error("Failed to load history:", error);
    return NextResponse.json({ error: "Unable to load activity history." }, { status: 500 });
  }
}
