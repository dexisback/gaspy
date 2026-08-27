import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Server-side admin check. Returns the session when the caller is
 * authenticated AND has the "admin" role; otherwise returns null.
 * Never trust the client — always call this in admin pages and API routes.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}

/**
 * Guard for admin API route handlers.
 * Returns `{ error: NextResponse }` (401 unauthenticated / 403 non-admin)
 * or `{ session }` when the caller is an admin.
 */
export async function guardAdminApi() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { session };
}
