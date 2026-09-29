import { NextResponse } from "next/server";
import { clearSession, sameOrigin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  await clearSession();
  return NextResponse.json({ ok: true });
}
