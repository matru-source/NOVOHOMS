import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listEnquiries } from "@/lib/enquiry-store";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function GET() {
  try {
    await requireAdmin();
    const enquiries = await listEnquiries();
    return NextResponse.json({ enquiries });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized();
    console.error("Error listing enquiries:", error);
    return NextResponse.json({ error: "Unable to load enquiries." }, { status: 500 });
  }
}
