import type { ResumeData } from "@/lib/resume-data";
import { getExperienceLabel } from "@/lib/resume-data";

/** Simple resume facts — answered from data, no Sarvam call. */
export function getStaticResumeAnswer(
  prompt: string,
  data: ResumeData
): string | null {
  const p = prompt.toLowerCase().trim();

  if (
    /\b(email|e-?mail|mail id|contact)\b/.test(p) &&
    !/\b(project|company)\b/.test(p)
  ) {
    return `You can reach me at ${data.email} or ${data.phone}. Happy to connect!`;
  }

  if (/\b(phone|mobile|number|call|whatsapp)\b/.test(p)) {
    return `My number is ${data.phone}. You can also email me at ${data.email}.`;
  }

  if (/\b(github|git hub|repo)\b/.test(p)) {
    return `Here's my GitHub: ${data.github} — you'll find my projects and code there.`;
  }

  if (/\b(where.*(live|based)|location|city)\b/.test(p)) {
    return `I'm based in ${data.location}, currently working at ${data.company}.`;
  }

  if (/\b(notice period|join|availability|available|when can you start)\b/.test(p)) {
    return `I'm open to discussing timelines — reach out at ${data.email} or ${data.phone} and we can talk specifics about the role and notice period.`;
  }

  if (/\b(salary|ctc|package|compensation|pay)\b/.test(p)) {
    return `Compensation depends on the role and scope — let's connect at ${data.email} to discuss details privately.`;
  }

  if (/\b(how many years|years of experience|experience years)\b/.test(p)) {
    return `I have ${getExperienceLabel()} years of hands-on experience as a Java Full-Stack Developer, mostly at ${data.company} since Nov 2022.`;
  }

  if (/\b(education|degree|college|university|b\.?tech)\b/.test(p)) {
    return data.education;
  }

  if (/\b(current company|where do you work|employer|slantco)\b/.test(p)) {
    return `I'm a ${data.role} at ${data.company} (${data.duration}).`;
  }

  return null;
}

/** True when the question should use resume context (Sarvam or cache), not off-topic deflect. */
export function isResumeRelated(prompt: string): boolean {
  const p = prompt.toLowerCase().trim();

  const signals = [
    /\b(resume|cv|portfolio|background|profile)\b/,
    /\b(skill|stack|tech|technology|framework|language)\b/,
    /\b(project|slantpos|techplusnexus|tms|pos|blog)\b/,
    /\b(experience|work|role|job|career|company|slantco)\b/,
    /\b(current|present|ongoing|latest)\b.*\b(project|work|role)\b/,
    /\b(what are you (working on|building)|working on now)\b/,
    /\b(java|angular|spring|react|next\.?js|mongodb|postgresql|aws|hibernate|jpa)\b/,
    /\b(full.?stack|backend|frontend|developer|engineer|software)\b/,
    /\b(education|degree|college|b\.?tech)\b/,
    /\b(goal|aspir|future plans)\b/,
    /\b(interview|referral|open to|relocate)\b/,
    /\b(tell me about|describe your|explain your)\b/,
    /\b(responsibilit|achiev|built|developed|shipped)\b/,
    /\b(microservice|rest api|api|websocket|jwt|docker|ci\/?cd)\b/,
    /\b(divyansh|you|your)\b.*\b(do|did|build|know|use)\b/,
  ];

  return signals.some((re) => re.test(p));
}
