// Simple in-memory rate limiter for Google GenAI free tier (1500 requests/day, 60 RPM)
// Tracks per minute and per day. Reset happens on serverless cold start.

const WINDOW_MS = 60 * 1000; // 1 minute
const DAY_MS = 24 * 60 * 60 * 1000;

interface LimitEntry {
  count: number;
  resetAt: number;
}

const perMinute = new Map<string, LimitEntry>();
const perDay = new Map<string, LimitEntry>();

function isExpired(entry: LimitEntry, windowMs: number): boolean {
  return Date.now() >= entry.resetAt + windowMs;
}

function getAndUpdate(
  store: Map<string, LimitEntry>,
  key: string,
  windowMs: number,
  max: number
): { allowed: boolean; remaining: number } {
  let entry = store.get(key);

  if (!entry || isExpired(entry, windowMs)) {
    entry = { count: 0, resetAt: Date.now() };
    store.set(key, entry);
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count };
}

interface CheckResult {
  allowed: boolean;
  reason?: string;
  perMinuteRemaining: number;
  perDayRemaining: number;
}

export function checkRateLimit(key: string): CheckResult {
  // Per-minute: 60 requests
  const minute = getAndUpdate(perMinute, key, WINDOW_MS, 60);
  if (!minute.allowed) {
    return {
      allowed: false,
      reason: "Rate limit exceeded: 60 requests per minute",
      perMinuteRemaining: 0,
      perDayRemaining: 0,
    };
  }

  // Per-day: 1500 requests (Google GenAI free tier)
  const day = getAndUpdate(perDay, key, DAY_MS, 1500);
  if (!day.allowed) {
    return {
      allowed: false,
      reason: "Rate limit exceeded: 1500 requests per day",
      perMinuteRemaining: minute.remaining,
      perDayRemaining: 0,
    };
  }

  return {
    allowed: true,
    perMinuteRemaining: minute.remaining,
    perDayRemaining: day.remaining,
  };
}
