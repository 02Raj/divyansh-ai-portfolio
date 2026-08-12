import { STATIC_QUICK_REPLIES } from "@/lib/quick-replies";
import {
  CACHEABLE_KEYS,
  getCachedAnswer,
  setCachedAnswer,
  type CacheKey,
} from "@/lib/response-cache";

/** Process-level cache when Mongo is unreachable (Vercel/cold starts still use Mongo when up). */
const memoryCache = new Map<CacheKey, string>();

export function getMemoryCached(key: CacheKey): string | null {
  return memoryCache.get(key) ?? null;
}

export function setMemoryCached(key: CacheKey, answer: string): void {
  memoryCache.set(key, answer);
}

let seedPromise: Promise<void> | null = null;

/** Ensure every quick-topic has an answer in memory (+ Mongo when available). */
export async function ensureQuickRepliesSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      for (const key of CACHEABLE_KEYS) {
        if (memoryCache.has(key)) continue;

        const fromMongo = await getCachedAnswer(key);
        if (fromMongo) {
          memoryCache.set(key, fromMongo);
          continue;
        }

        const staticAnswer = STATIC_QUICK_REPLIES[key];
        memoryCache.set(key, staticAnswer);
        await setCachedAnswer(key, staticAnswer, "static");
      }
    })().catch((error) => {
      console.error("Cache seed failed:", error);
      // Still seed memory so Quick Topics work offline
      for (const key of CACHEABLE_KEYS) {
        if (!memoryCache.has(key)) {
          memoryCache.set(key, STATIC_QUICK_REPLIES[key]);
        }
      }
      seedPromise = null;
    });
  }
  await seedPromise;
}
