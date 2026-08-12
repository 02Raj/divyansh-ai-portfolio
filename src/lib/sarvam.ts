import { contextForIntent, type ResumeData } from "@/lib/resume-data";

const DEFAULT_CHAT_MODEL = "sarvam-105b";
const DEPRECATED_CHAT_MODELS = new Set([
  "sarvam-30b",
  "sarvam-m",
  "sarvam-30b-16k",
  "sarvam-105b-32k",
]);

const SYSTEM =
  "Speak as Divyansh Raj (1st person). Use ONLY the given facts. Be concise. No fluff.";

const HIRE_REPLY = `That's fantastic to hear! I'm excited about the opportunity. Could you share more about the role and the team? Happy to discuss how my Java + Angular experience at SlantCo (SlantPOS, TechPlusNexus) can help. You can reach me at divyanshraj02@gmail.com or 7236998742 — we can also set up a quick call.`;

type Intent =
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

function detectIntent(userPrompt: string): Intent {
  const p = userPrompt.toLowerCase();

  if (
    p.includes("hire you") ||
    p.includes("i want to hire") ||
    userPrompt.includes("✨ I want to hire you")
  ) {
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
    p.includes("skills") ||
    userPrompt.includes("🔧 Technical skills") ||
    userPrompt.includes("⚙️ Technical skills")
  ) {
    return "skills";
  }
  if (
    p.includes("recent projects") ||
    p.includes("projects") ||
    userPrompt.includes("🚀 Recent projects")
  ) {
    return "projects";
  }
  if (
    p.includes("work experience") ||
    p.includes("experience") ||
    userPrompt.includes("💼 Work experience")
  ) {
    return "experience";
  }
  if (
    p.includes("career goals") ||
    p.includes("goals") ||
    userPrompt.includes("🎯 Career goals")
  ) {
    return "goals";
  }

  const resumeKeywords = [
    "skill",
    "project",
    "experience",
    "career",
    "work",
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
  if (!apiKey) throw new Error("SARVAM_API_KEY is not configured");

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

export async function getAIResponse(
  resumeData: ResumeData,
  userPrompt: string,
  sessionId?: string
): Promise<string> {
  console.log("User Prompt:", userPrompt);
  console.log("Session ID:", sessionId);

  const intent = detectIntent(userPrompt);

  // Zero-token paths (no Sarvam call)
  if (intent === "hire") return HIRE_REPLY;
  if (intent === "offtopic") {
    return `😅 "${userPrompt}" isn’t really resume-related. Ask about my Java/Angular work, SlantPOS, TechPlusNexus, skills, or experience — happy to dive in.`;
  }

  const facts = contextForIntent(
    resumeData,
    intent === "general" ? "general" : intent
  );
  const userContent = `FACTS:\n${facts}\n\nTASK: ${instructionFor(intent)}\nQ: ${userPrompt.slice(0, 200)}`;

  try {
    return await callSarvam(userContent, maxTokensFor(intent));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Sarvam error";
    console.error("Sarvam API Error:", message);
    return "⚠️ Sorry, I couldn’t generate a response right now. Please try again.";
  }
}
