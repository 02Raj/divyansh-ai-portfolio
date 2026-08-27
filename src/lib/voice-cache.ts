import { Schema, models, model, type InferSchemaType } from "mongoose";
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
    const doc = await CachedVoice.findOne({ key }).lean();
    return (doc as CachedVoiceDoc & { audioBase64: string })?.audioBase64 || null;
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
