import { isCacheStale } from "@/lib/cache-ttl";
import { STATIC_QUICK_REPLIES } from "@/lib/quick-replies";
import {
  CACHEABLE_KEYS,
  getCachedAnswer,
  setCachedAnswer,
  type CacheKey,
} from "@/lib/response-cache";

/** In-process cache with same TTL as Mongo (per serverless instance). */
const memoryCache = new Map<CacheKey, string>();
const memoryCachedAt = new Map<CacheKey, number>();

export function clearMemoryCache(): void {
  memoryCache.clear();
  memoryCachedAt.clear();
}

export function getMemoryCached(key: CacheKey): string | null {
  const cachedAt = memoryCachedAt.get(key);
  if (cachedAt !== undefined && isCacheStale(new Date(cachedAt))) {
    memoryCache.delete(key);
    memoryCachedAt.delete(key);
    return null;
  }
  return memoryCache.get(key) ?? null;
}

export function setMemoryCached(key: CacheKey, answer: string): void {
  memoryCache.set(key, answer);
  memoryCachedAt.set(key, Date.now());
}

/** Ensure every quick-topic has a fresh answer in memory (+ Mongo when available). */
export async function ensureQuickRepliesSeeded(): Promise<void> {
  for (const key of CACHEABLE_KEYS) {
    if (getMemoryCached(key)) continue;

    const fromMongo = await getCachedAnswer(key);
    if (fromMongo) {
      setMemoryCached(key, fromMongo);
      continue;
    }

    const staticAnswer = STATIC_QUICK_REPLIES[key];
    setMemoryCached(key, staticAnswer);
    await setCachedAnswer(key, staticAnswer, "static");
  }
}
