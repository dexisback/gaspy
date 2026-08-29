import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Server-side admin check. Sign-up is currently open: every authenticated
 * user has access. Rate limiting will be layered on later.
 * Never trust the client — always call this in admin pages and API routes.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  return session;
}

/**
 * Guard for admin API route handlers.
 * Returns `{ error: NextResponse }` (401 unauthenticated)
 * or `{ session }` when the caller is authenticated.
 */
export async function guardAdminApi() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}
