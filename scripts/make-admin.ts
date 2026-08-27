/**
 * Promotes an existing user to the "admin" role.
 *
 * Usage:
 *   npx tsx scripts/make-admin.ts <email>
 *
 * The user must have signed in at least once (via Google OAuth) so their
 * User row exists. Run `npx prisma migrate deploy` first so the auth
 * tables exist.
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

// Minimal .env loader so the script works standalone (no secrets are printed).
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"([^"]*)"\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  }
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Check your .env file.");
    process.exit(1);
  }

  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {});
  const prisma = new PrismaClient({ adapter } as never);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(
        `No user found with email "${email}". Sign in once at /admin/login first, then run this script.`
      );
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });
    console.log(`Done. "${email}" now has the admin role.`);
  } finally {
    await prisma.$disconnect();
  }
}

main();
