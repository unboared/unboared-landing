/**
 * Best-effort in-memory sliding-window limiter.
 *
 * State lives in the serverless instance: it resets when the instance recycles
 * and is not shared between instances. Good enough to stop a naive loop from
 * one IP; a distributed attacker needs a shared store (Upstash / Vercel KV).
 */
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return function limited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    // Keep the map from growing forever under a flood of unique keys.
    if (hits.size > 5_000) {
      for (const [k, ts] of hits) {
        if (ts.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }
    return recent.length > max;
  };
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
