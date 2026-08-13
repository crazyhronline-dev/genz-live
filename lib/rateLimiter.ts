// ================================================================
// GenZ Live — In-Memory Rate Limiter for Login Brute-Force Defense
// Hostinger Node.js shared host compatible (No external Redis required)
// ================================================================

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

const attemptMap = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 50;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 Minutes

export function checkRateLimit(key: string): { allowed: boolean; remainingMs?: number } {
  const now = Date.now();
  const record = attemptMap.get(key);

  if (!record) {
    return { allowed: true };
  }

  if (now > record.resetAt) {
    attemptMap.delete(key);
    return { allowed: true };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { allowed: false, remainingMs: record.resetAt - now };
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = attemptMap.get(key);

  if (!record || now > record.resetAt) {
    attemptMap.set(key, {
      attempts: 1,
      resetAt: now + LOCKOUT_MS,
    });
  } else {
    record.attempts += 1;
  }
}

export function resetRateLimit(key: string): void {
  attemptMap.delete(key);
}
