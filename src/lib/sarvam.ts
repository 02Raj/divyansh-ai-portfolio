import { contextForIntent, type ResumeData } from "@/lib/resume-data";
import { STATIC_QUICK_REPLIES } from "@/lib/quick-replies";
import {
  getCachedAnswer,
  isCacheKey,
  setCachedAnswer,
  type CacheKey,
} from "@/lib/response-cache";
import { getMemoryCached, setMemoryCached } from "@/lib/seed-cache";

const DEFAULT_CHAT_MODEL = "sarvam-105b";
const DEPRECATED_CHAT_MODELS = new Set([
  "sarvam-30b",
  "sarvam-m",
  "sarvam-30b-16k",
  "sarvam-105b-32k",
]);

const SYSTEM =
  "Speak as Divyansh Raj (1st person). Use ONLY the given facts. Be concise. No fluff.";

export type Intent =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "goals"
  | "hire"
  | "offtopic"
  | "general";

interface SarvamChatResponse {
  choices?: Array<{
    message?: { content?: string | null };
    finish_reason?: string | null;
  }>;
  error?: { message?: string; code?: string };
}

function resolveModel(): string {
  const model = process.env.SARVAM_MODEL?.trim() || DEFAULT_CHAT_MODEL;
  if (DEPRECATED_CHAT_MODELS.has(model)) return DEFAULT_CHAT_MODEL;
  return model;
}

function isHireIntent(prompt: string): boolean {
  if (prompt.includes("✨ I want to hire you")) return true;

  const p = prompt.toLowerCase().trim();

  const patterns = [
    /\bhire\s+(you|me|him|her|divyansh)\b/,
    /\b(i|we)\s+(want|wanna)\s+to\s+hire\b/,
    /\bcan\s+(i|we)\s+hire\b/,
    /\blooking\s+to\s+hire\b/,
    /\bwant\s+to\s+hire\b/,
    /\bhiring\b/,
    /\binterested\s+in\s+hiring\b/,
    /\boffer\s+(you|him|divyansh)\s+(a\s+)?(job|role|position)\b/,
    /\bjoin\s+(my|our)\s+team\b/,
    /\bbring\s+you\s+on\b/,
    /\brecruit\b/,
    /\bopen\s+position\b.*\bfor\s+you\b/,
  ];

  return patterns.some((re) => re.test(p));
}

export function detectIntent(userPrompt: string): Intent {
  const p = userPrompt.toLowerCase();

  if (isHireIntent(userPrompt)) {
    return "hire";
  }
  if (
    p.includes("tell me about yourself") ||
    p.includes("about you") ||
    userPrompt.includes("👋 Tell me about yourself")
  ) {
    return "about";
  }
  if (
    p.includes("technical skills") ||
    userPrompt.includes("🔧 Technical skills") ||
    userPrompt.includes("⚙️ Technical skills")
  ) {
    return "skills";
  }
  if (
    p.includes("recent projects") ||
    userPrompt.includes("🚀 Recent projects")
  ) {
    return "projects";
  }
  if (
    p.includes("work experience") ||
    userPrompt.includes("💼 Work experience")
  ) {
    return "experience";
  }
  if (p.includes("career goals") || userPrompt.includes("🎯 Career goals")) {
    return "goals";
  }

  if (/\bskills?\b/.test(p)) return "skills";
  if (/\bprojects?\b/.test(p)) return "projects";
  if (/\bexperience\b/.test(p) || /\bwork\b/.test(p)) return "experience";
  if (/\bgoals?\b/.test(p) || /\bcareer\b/.test(p)) return "goals";

  const resumeKeywords = [
    "job",
    "java",
    "angular",
    "spring",
    "resume",
    "background",
    "education",
  ];
  if (resumeKeywords.some((k) => p.includes(k))) return "general";
  return "offtopic";
}

function instructionFor(intent: Intent): string {
  switch (intent) {
    case "about":
      return "Write a short intro (max ~120 words): role, company, 1–2 projects, education, one personal touch (cricket/biryani ok).";
    case "skills":
      return "List skills in short bullets by category (Languages, Frontend, Backend, DB, Cloud, Tools). Max ~100 words.";
    case "projects":
      return "List each project: name, stack, 1–2 line overview, outcome if clear. Max ~150 words.";
    case "experience":
      return "Summarize current role + bullets from facts. Max ~120 words.";
    case "goals":
      return "1 short paragraph on career goals from facts. Max ~60 words.";
    case "general":
    default:
      return "Answer briefly from facts only. Max ~100 words.";
  }
}

function maxTokensFor(intent: Intent): number {
  switch (intent) {
    case "projects":
      return 420;
    case "about":
    case "experience":
      return 360;
    case "skills":
      return 320;
    case "goals":
      return 180;
    default:
      return 300;
  }
}

async function callSarvam(
  userContent: string,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY?.trim();
  if (!apiKey || apiKey.includes("your_sarvam")) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  const baseUrl = process.env.SARVAM_API_BASE_URL || "https://api.sarvam.ai";
  const model = resolveModel();

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": apiKey,
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userContent },
      ],
      temperature: 0.35,
      max_tokens: maxTokens,
      stream: false,
      reasoning_effort: null,
    }),
  });

  const rawText = await response.text();
  let data: SarvamChatResponse;
  try {
    data = JSON.parse(rawText) as SarvamChatResponse;
  } catch {
    throw new Error(
      `Sarvam non-JSON (${response.status}): ${rawText.slice(0, 200)}`
    );
  }

  if (!response.ok) {
    const msg =
      data.error?.message ||
      JSON.stringify(data).slice(0, 200) ||
      response.statusText;
    throw new Error(`Sarvam API error (${response.status}): ${msg}`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Sarvam returned an empty response");
  return text;
}

async function resolveCacheableAnswer(
  key: CacheKey,
  resumeData: ResumeData,
  userPrompt: string
): Promise<{ answer: string; source: string }> {
  const fromMemory = getMemoryCached(key);
  if (fromMemory) {
    return { answer: fromMemory, source: "memory" };
  }

  const fromMongo = await getCachedAnswer(key);
  if (fromMongo) {
    setMemoryCached(key, fromMongo);
    return { answer: fromMongo, source: "mongo" };
  }

  // Optional: regenerate via Sarvam then persist (costs tokens)
  const useSarvam =
    process.env.SARVAM_FOR_QUICK === "true" ||
    process.env.SARVAM_FOR_QUICK === "1";

  if (useSarvam && key !== "hire") {
    try {
      const facts = contextForIntent(resumeData, key);
      const userContent = `FACTS:\n${facts}\n\nTASK: ${instructionFor(key)}\nQ: ${userPrompt.slice(0, 200)}`;
      const answer = await callSarvam(userContent, maxTokensFor(key));
      setMemoryCached(key, answer);
      await setCachedAnswer(key, answer, "sarvam");
      return { answer, source: "sarvam" };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Sarvam error";
      console.warn(`Sarvam miss for ${key}, using static:`, message);
    }
  }

  const staticAnswer = STATIC_QUICK_REPLIES[key];
  setMemoryCached(key, staticAnswer);
  await setCachedAnswer(key, staticAnswer, "static");
  return { answer: staticAnswer, source: "static" };
}

export async function getAIResponse(
  resumeData: ResumeData,
  userPrompt: string,
  sessionId?: string
): Promise<{ answer: string; meta?: { intent: Intent; source: string } }> {
  console.log("User Prompt:", userPrompt);
  console.log("Session ID:", sessionId);

  const intent = detectIntent(userPrompt);

  if (intent === "offtopic") {
    return {
      answer: `😅 "${userPrompt}" isn’t really resume-related. Ask about my Java/Angular work, SlantPOS, TechPlusNexus, skills, or experience — happy to dive in.`,
      meta: { intent, source: "static" },
    };
  }

  if (isCacheKey(intent)) {
    const result = await resolveCacheableAnswer(intent, resumeData, userPrompt);
    return {
      answer: result.answer,
      meta: { intent, source: result.source },
    };
  }

  const facts = contextForIntent(resumeData, "general");
  const userContent = `FACTS:\n${facts}\n\nTASK: ${instructionFor("general")}\nQ: ${userPrompt.slice(0, 200)}`;

  try {
    const answer = await callSarvam(userContent, maxTokensFor("general"));
    return { answer, meta: { intent, source: "sarvam" } };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Sarvam error";
    console.error("Sarvam API Error:", message);
    return {
      answer:
        "⚠️ AI is briefly unavailable. Try a Quick Topic below (skills, projects, experience) — those answers are cached.",
      meta: { intent, source: "error" },
    };
  }
}
