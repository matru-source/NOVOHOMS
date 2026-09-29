import { NextResponse } from "next/server";
import { requireAdmin, sameOrigin } from "@/lib/admin-auth";
import { deleteEnquiry, updateEnquiryStatus } from "@/lib/enquiry-store";

const unauthorized = () => NextResponse.json({ error: "Please sign in again." }, { status: 401 });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    await requireAdmin();
    const id = Number((await params).id);
    if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
    const body = await request.json().catch(() => ({}));
    if (!body.status) return NextResponse.json({ error: "Status is required." }, { status: 400 });
    await updateEnquiryStatus(id, body.status);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized();
    return NextResponse.json({ error: "Unable to update enquiry." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    await requireAdmin();
    const id = Number((await params).id);
    if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
    await deleteEnquiry(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return unauthorized();
    return NextResponse.json({ error: "Unable to delete enquiry." }, { status: 500 });
  }
}
