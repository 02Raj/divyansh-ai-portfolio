import { siteLinks } from "@/lib/site-config";

/** Learn with Divyansh — build-in-public prep portal (single source of truth) */
export const prepHub = {
  name: "Learn with Divyansh (Prep Hub)",
  shortName: "Prep Hub",
  tagline: "Build-in-Public Learning Portal",
  liveUrl: siteLinks.prepHub,
  liveHost: "learn-with-divyansh.vercel.app",
  githubUrl: siteLinks.prepHubGithub,
  githubRepo: "02Raj/divyansh-s-prep-hub",
  purposes: [
    "Documenting learnings — open digital notebook & living portfolio extension",
    "Interview prep — DSA, System Design, Java, Spring Boot, Angular, etc.",
    "Community — open-source notes, network, collective learning",
  ],
  /** Short lines for chat project cards */
  chatBullets: [
    "📝 Documenting learnings — open notebook & portfolio extension",
    "🎯 Interview prep — DSA, System Design, Java, Spring Boot, more",
    "🤝 Community — open-source notes & collective learning",
  ],
} as const;

export function prepHubContextBlock(): string {
  return [
    `${prepHub.name} (${prepHub.tagline})`,
    `Live: ${prepHub.liveHost}`,
    `Source: ${prepHub.githubRepo}`,
    ...prepHub.purposes.map((p) => `• ${p}`),
  ].join("\n");
}
