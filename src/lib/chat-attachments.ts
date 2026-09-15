export type MessageAttachment = "projects" | "hire";

/** Decide when to show rich UI below an assistant reply */
export function attachmentForPrompt(prompt: string): MessageAttachment | undefined {
  if (prompt.includes("✨ I want to hire you")) return "hire";

  if (prompt.includes("🚀 Recent projects")) return "projects";

  const p = prompt.toLowerCase();

  if (
    /\b(prep hub|learn with divyansh|interview prep hub|build[- ]?in[- ]?public|learn-with-divyansh)\b/.test(
      p
    )
  ) {
    return "projects";
  }

  if (/\bhire\b|\bhiring\b|\brecruit\b/.test(p)) return "hire";

  if (
    /\b(slantpos|techplusnexus|tutorpe|cloudsaathi|doctorflow|clinicdesk|citemind|citmind|kirana|razorpay)\b/.test(
      p
    )
  ) {
    return "projects";
  }

  if (/\bprojects?\b/.test(p) && /\b(recent|tell|show|list|about|my)\b/.test(p)) {
    return "projects";
  }

  return undefined;
}
