import { Schema, models, model, type InferSchemaType } from "mongoose";
import { connectMongo } from "@/lib/mongo";

const CachedResponseSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    source: { type: String, enum: ["sarvam", "static", "manual"], default: "sarvam" },
  },
  { timestamps: true }
);

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
    const doc = await CachedResponse.findOne({ key }).lean();
    return doc?.answer?.trim() || null;
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
