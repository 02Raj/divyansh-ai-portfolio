/** Quick-topic + voice cache lifetime (default 17 days, clamped 15–20). */

const MIN_DAYS = 15;
const MAX_DAYS = 20;
const DEFAULT_DAYS = 17;

export function getCacheTtlDays(): number {
  const raw = Number(process.env.CACHE_TTL_DAYS ?? String(DEFAULT_DAYS));
  if (!Number.isFinite(raw)) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, Math.max(MIN_DAYS, Math.round(raw)));
}

export function getCacheTtlMs(): number {
  return getCacheTtlDays() * 24 * 60 * 60 * 1000;
}

export function getCacheTtlSeconds(): number {
  return getCacheTtlDays() * 24 * 60 * 60;
}

export function isCacheStale(updatedAt: Date | string | undefined): boolean {
  if (!updatedAt) return true;
  const ts = updatedAt instanceof Date ? updatedAt.getTime() : Date.parse(updatedAt);
  if (!Number.isFinite(ts)) return true;
  return Date.now() - ts > getCacheTtlMs();
}

export function cacheExpiryCutoff(): Date {
  return new Date(Date.now() - getCacheTtlMs());
}
