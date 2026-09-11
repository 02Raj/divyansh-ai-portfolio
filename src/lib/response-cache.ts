import { Schema, models, model, type InferSchemaType } from "mongoose";
import {
  cacheExpiryCutoff,
  getCacheTtlSeconds,
  isCacheStale,
} from "@/lib/cache-ttl";
import { connectMongo } from "@/lib/mongo";

const CachedResponseSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    source: { type: String, enum: ["sarvam", "static", "manual"], default: "sarvam" },
  },
  { timestamps: true }
);

CachedResponseSchema.index(
  { updatedAt: 1 },
  {
    expireAfterSeconds: getCacheTtlSeconds(),
    name: "cache_ttl_updatedAt",
  }
);

let responseTtlIndexSynced = false;

export async function ensureResponseCacheTtlIndex(): Promise<void> {
  if (responseTtlIndexSynced) return;
  const conn = await connectMongo();
  if (!conn) return;
  try {
    await CachedResponse.syncIndexes();
    responseTtlIndexSynced = true;
  } catch (error) {
    console.error("Response cache TTL index sync failed:", error);
  }
}

export async function purgeStaleResponseCache(): Promise<number> {
  const conn = await connectMongo();
  if (!conn) return 0;
  await ensureResponseCacheTtlIndex();
  const cutoff = cacheExpiryCutoff();
  const result = await CachedResponse.deleteMany({
    updatedAt: { $lt: cutoff },
  });
  return result.deletedCount;
}

export type CachedResponseDoc = InferSchemaType<typeof CachedResponseSchema>;

const CachedResponse =
  models.CachedResponse ||
  model("CachedResponse", CachedResponseSchema);

/** Quick-topic keys we persist so Sarvam is not called every time. */
export const CACHEABLE_KEYS = [
  "about",
  "skills",
  "projects",
  "experience",
  "goals",
  "hire",
] as const;

export type CacheKey = (typeof CACHEABLE_KEYS)[number];

export function isCacheKey(value: string): value is CacheKey {
  return (CACHEABLE_KEYS as readonly string[]).includes(value);
}

export async function getCachedAnswer(key: CacheKey): Promise<string | null> {
  const conn = await connectMongo();
  if (!conn) return null;

  try {
    await ensureResponseCacheTtlIndex();
    const doc = await CachedResponse.findOne({ key }).lean();
    if (!doc?.answer?.trim()) return null;

    const updatedAt = (doc as { updatedAt?: Date }).updatedAt;
    if (isCacheStale(updatedAt)) {
      await CachedResponse.deleteOne({ key });
      return null;
    }

    return doc.answer.trim();
  } catch (error) {
    console.error("Cache read failed:", error);
    return null;
  }
}

export async function setCachedAnswer(
  key: CacheKey,
  answer: string,
  source: "sarvam" | "static" | "manual" = "sarvam"
): Promise<void> {
  const conn = await connectMongo();
  if (!conn) return;

  const trimmed = answer.trim();
  if (!trimmed) return;

  try {
    await CachedResponse.findOneAndUpdate(
      { key },
      { key, answer: trimmed, source },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.error("Cache write failed:", error);
  }
}
