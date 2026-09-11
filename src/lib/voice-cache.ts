import { Schema, models, model, type InferSchemaType } from "mongoose";
import {
  cacheExpiryCutoff,
  getCacheTtlSeconds,
  isCacheStale,
} from "@/lib/cache-ttl";
import { connectMongo } from "@/lib/mongo";
import type { CacheKey } from "@/lib/response-cache";

const CachedVoiceSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    audioBase64: { type: String, required: true },
    speaker: { type: String, default: "aditya" },
    source: {
      type: String,
      enum: ["sarvam", "manual"],
      default: "sarvam",
    },
  },
  { timestamps: true }
);

CachedVoiceSchema.index(
  { updatedAt: 1 },
  {
    expireAfterSeconds: getCacheTtlSeconds(),
    name: "voice_cache_ttl_updatedAt",
  }
);

let voiceTtlIndexSynced = false;

export async function ensureVoiceCacheTtlIndex(): Promise<void> {
  if (voiceTtlIndexSynced) return;
  const conn = await connectMongo();
  if (!conn) return;
  try {
    await CachedVoice.syncIndexes();
    voiceTtlIndexSynced = true;
  } catch (error) {
    console.error("Voice cache TTL index sync failed:", error);
  }
}

export async function purgeStaleVoiceCache(): Promise<number> {
  const conn = await connectMongo();
  if (!conn) return 0;
  await ensureVoiceCacheTtlIndex();
  const cutoff = cacheExpiryCutoff();
  const result = await CachedVoice.deleteMany({
    updatedAt: { $lt: cutoff },
  });
  return result.deletedCount;
}

export type CachedVoiceDoc = InferSchemaType<typeof CachedVoiceSchema>;

const CachedVoice =
  models.CachedVoice || model("CachedVoice", CachedVoiceSchema);

/**
 * Retrieve cached TTS audio for a quick-topic intent.
 * Returns base64-encoded WAV string or null.
 */
export async function getCachedVoice(
  key: CacheKey
): Promise<string | null> {
  const conn = await connectMongo();
  if (!conn) return null;

  try {
    await ensureVoiceCacheTtlIndex();
    const doc = await CachedVoice.findOne({ key }).lean();
    const audio = (doc as CachedVoiceDoc & { audioBase64: string })
      ?.audioBase64;
    if (!audio) return null;

    const updatedAt = (doc as { updatedAt?: Date }).updatedAt;
    if (isCacheStale(updatedAt)) {
      await CachedVoice.deleteOne({ key });
      return null;
    }

    return audio;
  } catch (error) {
    console.error("Voice cache read failed:", error);
    return null;
  }
}

/**
 * Persist TTS audio so future visitors skip the TTS call entirely.
 */
export async function setCachedVoice(
  key: CacheKey,
  audioBase64: string,
  speaker = "aditya"
): Promise<void> {
  const conn = await connectMongo();
  if (!conn) return;

  if (!audioBase64) return;

  try {
    await CachedVoice.findOneAndUpdate(
      { key },
      { key, audioBase64, speaker, source: "sarvam" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.error("Voice cache write failed:", error);
  }
}
