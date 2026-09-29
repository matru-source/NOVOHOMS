import { NextResponse } from "next/server";
import { checkRateLimit, createSession, sameOrigin, verifyCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = (forwarded ? forwarded.split(",")[0].trim() : null) || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "local";
  if (!checkRateLimit(ip)) return NextResponse.json({ error: "Too many attempts. Please wait 15 minutes." }, { status: 429 });
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  if (!await verifyCredentials(body.email || "", body.password || "")) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  await createSession((body.email || "").trim().toLowerCase());
  return NextResponse.json({ ok: true });
}
