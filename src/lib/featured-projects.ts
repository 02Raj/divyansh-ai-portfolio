import { prepHub } from "@/lib/prep-hub";
import { siteLinks } from "@/lib/site-config";
import { resumeData } from "@/lib/resume-data";

export type ProjectCard = {
  name: string;
  period: string;
  summary: string;
  metric: string;
  stackTags: string[];
  liveUrl?: string;
  githubUrl?: string;
  variant?: "default" | "buildInPublic";
  badge?: string;
  bullets?: string[];
};

const FEATURED_ORDER = [
  "KitchenPulse",
  "SlantPOS",
  "CiteMind",
  "Kirana Voice Assistant",
  "TechPlusNexus",
  "TutorPe",
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

function prepHubCard(): ProjectCard {
  return {
    variant: "buildInPublic",
    badge: prepHub.tagline,
    name: prepHub.name,
    period: "Open source",
    summary: "",
    metric: "",
    bullets: [
      "📝 Documenting learnings — open notebook & portfolio extension",
      "🎯 Interview prep — DSA, System Design, Java, Spring Boot, more",
      "🤝 Community — open-source notes & collective learning",
    ],
    stackTags: ["Build in public", "Interview prep", "Docs"],
    liveUrl: siteLinks.prepHub,
    githubUrl: siteLinks.prepHubGithub,
  };
}

/** Shown under chat when user asks about recent projects / prep hub */
export function getProjectShowcaseCards(): ProjectCard[] {
  const cards: ProjectCard[] = [prepHubCard()];

  for (const name of FEATURED_ORDER) {
    const p = resumeData.projects.find((proj) => proj.name === name);
    if (!p) continue;
    const liveUrl = toLiveUrl(p.live);
    const isGithub = liveUrl?.includes("github.com");
    cards.push({
      name: p.name,
      period: p.period,
      summary: p.blurb.split(";")[0]?.trim() ?? p.blurb,
      metric: p.metrics[0] ?? "",
      stackTags: stackTags(p.stack),
      ...(liveUrl && !isGithub ? { liveUrl } : {}),
      ...(isGithub && liveUrl ? { githubUrl: liveUrl } : {}),
    });
  }
  return cards;
}

/** @deprecated use getProjectShowcaseCards */
export function getFeaturedProjectCards(): ProjectCard[] {
  return getProjectShowcaseCards().filter((c) => c.variant !== "buildInPublic");
}
