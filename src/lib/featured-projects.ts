import { resumeData } from "@/lib/resume-data";

export type ProjectCard = {
  name: string;
  period: string;
  summary: string;
  metric: string;
  stackTags: string[];
  liveUrl?: string;
};

const FEATURED_ORDER = [
  "SlantPOS",
  "TechPlusNexus",
  "TutorPe",
  "CloudSaathi",
];

function toLiveUrl(live: string): string | undefined {
  const trimmed = live.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http")) return trimmed;
  return `https://${trimmed}`;
}

function stackTags(stack: string, max = 4): string[] {
  return stack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

/** Cards shown under project-related chat replies */
export function getFeaturedProjectCards(): ProjectCard[] {
  const cards: ProjectCard[] = [];
  for (const name of FEATURED_ORDER) {
    const p = resumeData.projects.find((proj) => proj.name === name);
    if (!p) continue;
    const liveUrl = toLiveUrl(p.live);
    cards.push({
      name: p.name,
      period: p.period,
      summary: p.blurb.split(";")[0]?.trim() ?? p.blurb,
      metric: p.metrics[0] ?? "",
      stackTags: stackTags(p.stack),
      ...(liveUrl ? { liveUrl } : {}),
    });
  }
  return cards;
}
