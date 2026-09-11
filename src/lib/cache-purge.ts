import { getCacheTtlDays } from "@/lib/cache-ttl";
import { ensureResponseCacheTtlIndex, purgeStaleResponseCache } from "@/lib/response-cache";
import { ensureVoiceCacheTtlIndex, purgeStaleVoiceCache } from "@/lib/voice-cache";
import { clearMemoryCache } from "@/lib/seed-cache";

export async function ensureCacheTtlIndexes(): Promise<void> {
  await Promise.all([ensureResponseCacheTtlIndex(), ensureVoiceCacheTtlIndex()]);
}

/** Delete stale text + voice cache (used by Vercel cron). */
export async function purgeStaleCaches(): Promise<{
  ok: boolean;
  ttlDays: number;
  deletedResponses: number;
  deletedVoices: number;
  error?: string;
}> {
  const ttlDays = getCacheTtlDays();

  try {
    await ensureCacheTtlIndexes();
    const deletedResponses = await purgeStaleResponseCache();
    const deletedVoices = await purgeStaleVoiceCache();

    if (deletedResponses > 0 || deletedVoices > 0) {
      clearMemoryCache();
    }

    return {
      ok: true,
      ttlDays,
      deletedResponses,
      deletedVoices,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown purge error";
    return {
      ok: false,
      ttlDays,
      deletedResponses: 0,
      deletedVoices: 0,
      error: message,
    };
  }
}
