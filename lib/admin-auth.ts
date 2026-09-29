import { cookies } from "next/headers";

const COOKIE = "novohoms_admin";
const encoder = new TextEncoder();
const attempts = new Map<string, { count: number; resetAt: number }>();
const configured = () => ({
  email: process.env.ADMIN_EMAIL || "",
  passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
  sessionSecret: process.env.SESSION_SECRET || "",
});

function base64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url");
}

async function sha256(value: string) {
  return base64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value))));
}

async function sign(value: string) {
  const { sessionSecret } = configured();
  const key = await crypto.subtle.importKey("raw", encoder.encode(sessionSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return base64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function checkRateLimit(key: string) {
  const now = Date.now(); const current = attempts.get(key);
  if (!current || current.resetAt < now) { attempts.set(key, { count: 1, resetAt: now + 15 * 60_000 }); return true; }
  if (current.count >= 8) return false; current.count += 1; return true;
}

export async function verifyCredentials(email: string, password: string) {
  const config = configured();
  if (!config.email || !config.passwordHash || !config.sessionSecret) return false;
  return safeEqual(email.trim().toLowerCase(), config.email.trim().toLowerCase()) && safeEqual(await sha256(password), config.passwordHash);
}

export async function createSession(email: string) {
  const payload = base64Url(encoder.encode(JSON.stringify({ email, exp: Date.now() + 8 * 60 * 60_000 })));
  const token = `${payload}.${await sign(payload)}`;
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
}

export async function clearSession() {
  (await cookies()).set(COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getAdminSession() {
  if (!configured().sessionSecret) return null;
  const token = (await cookies()).get(COOKIE)?.value; if (!token) return null;
  const [payload, signature] = token.split("."); if (!payload || !signature || !safeEqual(await sign(payload), signature)) return null;
  try { const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; exp: number }; return data.exp > Date.now() ? data : null; } catch { return null; }
}

export async function requireAdmin() { const session = await getAdminSession(); if (!session) throw new Error("UNAUTHORIZED"); return session; }
export function sameOrigin(request: Request) { const origin = request.headers.get("origin"); return !origin || origin === new URL(request.url).origin; }
