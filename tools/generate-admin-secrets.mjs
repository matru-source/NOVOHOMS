import { createHash, randomBytes } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage: pnpm admin:secrets -- "your-password"');
  process.exit(1);
}

console.log(`ADMIN_PASSWORD_HASH=${createHash("sha256").update(password).digest("base64url")}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
