import { NextResponse } from "next/server";
import { getAIResponse, detectIntent } from "@/lib/sarvam";
import { resumeData } from "@/lib/resume-data";
import { ensureQuickRepliesSeeded } from "@/lib/seed-cache";
import { isCacheKey } from "@/lib/response-cache";
import { getCachedVoice, setCachedVoice } from "@/lib/voice-cache";

const TTS_SPEAKER = "aditya";
const TTS_LANGUAGE = "en-IN";
const TTS_MODEL = "bulbul:v3";

/**
 * Call Sarvam STT (Saaras v3) — converts audio blob to text.
 */
async function speechToText(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY?.trim();
  if (!apiKey) throw new Error("SARVAM_API_KEY is not configured");

  const baseUrl = process.env.SARVAM_API_BASE_URL || "https://api.sarvam.ai";

  // Determine file extension from mime type
  const ext = mimeType.includes("webm")
    ? "webm"
    : mimeType.includes("mp4")
    ? "mp4"
    : mimeType.includes("ogg")
    ? "ogg"
    : "wav";

  const formData = new FormData();
  const uint8 = new Uint8Array(audioBuffer);
  const blob = new Blob([uint8], { type: mimeType });
  formData.append("file", blob, `recording.${ext}`);
  formData.append("model", "saaras:v3");
  formData.append("language_code", "en-IN");

  const response = await fetch(`${baseUrl}/speech-to-text`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
    },
    body: formData,
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Sarvam STT error (${response.status}): ${rawText.slice(0, 300)}`);
  }

  let data: { transcript?: string };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Sarvam STT non-JSON: ${rawText.slice(0, 200)}`);
  }

  const transcript = data.transcript?.trim();
  if (!transcript) throw new Error("Sarvam STT returned empty transcript");

  return transcript;
}

/**
 * Call Sarvam TTS (Bulbul v3) — converts text to base64 audio.
 */
async function textToSpeech(text: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY?.trim();
  if (!apiKey) throw new Error("SARVAM_API_KEY is not configured");

  const baseUrl = process.env.SARVAM_API_BASE_URL || "https://api.sarvam.ai";

  // Truncate to 2500 chars (Sarvam TTS limit)
  const truncatedText = text.slice(0, 2500);

  const response = await fetch(`${baseUrl}/text-to-speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey,
    },
    body: JSON.stringify({
      text: truncatedText,
      speaker: TTS_SPEAKER,
      model: TTS_MODEL,
      language_code: TTS_LANGUAGE,
      pace: 1.0,
      speech_sample_rate: 24000,
    }),
  });

  const rawText = await response.text();

  if (!response.ok) {
    throw new Error(`Sarvam TTS error (${response.status}): ${rawText.slice(0, 300)}`);
  }

  let data: { audios?: string[] };
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Sarvam TTS non-JSON: ${rawText.slice(0, 200)}`);
  }

  const audioBase64 = data.audios?.[0];
  if (!audioBase64) throw new Error("Sarvam TTS returned no audio");

  return audioBase64;
}

/**
 * POST /api/voice
 *
 * Receives recorded audio from the user's mic.
 * Pipeline: STT → getAIResponse → TTS (with caching)
 * Returns: { transcript, answer, audioBase64 }
 */
export async function POST(request: Request) {
  try {
    await ensureQuickRepliesSeeded();

    // Read the audio blob from the request
    const contentType = request.headers.get("content-type") || "";

    let audioBuffer: Buffer;
    let mimeType: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const audioFile = formData.get("audio") as Blob | null;
      if (!audioFile) {
        return NextResponse.json(
          { error: "No audio file provided" },
          { status: 400 }
        );
      }
      const arrayBuffer = await audioFile.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
      mimeType = audioFile.type || "audio/webm";
    } else {
      // Raw binary body
      const arrayBuffer = await request.arrayBuffer();
      audioBuffer = Buffer.from(arrayBuffer);
      mimeType = contentType || "audio/webm";
    }

    if (audioBuffer.length === 0) {
      return NextResponse.json(
        { error: "Empty audio" },
        { status: 400 }
      );
    }

    // Step 1: Speech-to-Text
    console.log("[Voice] STT: converting audio to text...");
    const transcript = await speechToText(audioBuffer, mimeType);
    console.log("[Voice] Transcript:", transcript);

    // Step 2: Get AI response (uses existing cache pipeline)
    const result = await getAIResponse(resumeData, transcript);
    const answer = result.answer;
    const intent = result.meta?.intent;
    const source = result.meta?.source;
    console.log("[Voice] Intent:", intent, "| Source:", source);

    // Step 3: Text-to-Speech (with caching for cacheable intents)
    let audioBase64: string | null = null;

    if (intent && isCacheKey(intent)) {
      // Check voice cache first
      audioBase64 = await getCachedVoice(intent);
      if (audioBase64) {
        console.log("[Voice] TTS cache HIT for:", intent);
      } else {
        console.log("[Voice] TTS cache MISS for:", intent, "— calling Sarvam TTS");
        audioBase64 = await textToSpeech(answer);
        // Cache for future visitors
        await setCachedVoice(intent, audioBase64);
      }
    } else {
      // Non-cacheable (general/offtopic) — always call TTS
      console.log("[Voice] TTS: non-cacheable intent, calling Sarvam TTS");
      try {
        audioBase64 = await textToSpeech(answer);
      } catch (ttsError) {
        console.error("[Voice] TTS failed for non-cacheable:", ttsError);
        // Still return text answer even if TTS fails
        audioBase64 = null;
      }
    }

    return NextResponse.json({
      transcript,
      answer,
      audioBase64,
      intent,
      source,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown voice error";
    console.error("[Voice] Error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
