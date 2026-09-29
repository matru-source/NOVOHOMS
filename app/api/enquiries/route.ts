import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/enquiry-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }
    const enquiry = await createEnquiry({
      name: body.name,
      phone: body.phone,
      email: body.email,
      category: body.category,
      message: body.message,
      sourcePage: body.sourcePage,
    });
    return NextResponse.json({ ok: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit enquiry." },
      { status: 500 }
    );
  }
}
