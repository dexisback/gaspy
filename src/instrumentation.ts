/**
 * The host environment has no working IPv6 route, but Neon's pooler
 * advertises AAAA records. Without this, server-side fetches (Neon HTTP
 * driver) can pick an IPv6 address and time out. Prefer IPv4 globally.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setDefaultResultOrder("ipv4first");
  }
}
