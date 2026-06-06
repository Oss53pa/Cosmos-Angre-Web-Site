/**
 * Rate limit basique en mémoire (per-instance).
 * Pour de la prod multi-instance, brancher Upstash ou Redis.
 */
type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Nombre de requêtes max par fenêtre */
  max: number;
  /** Fenêtre en ms */
  windowMs: number;
  /** Identifiant (IP, email, user id) */
  key: string;
}

export function rateLimit({ max, windowMs, key }: RateLimitOptions): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}
