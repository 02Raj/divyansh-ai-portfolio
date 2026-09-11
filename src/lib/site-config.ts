/** Public links — single place for recruiter bar & hire cards */
export const siteLinks = {
  siteUrl: "https://ai.divyanshraj.in",
  standardPortfolio: "https://portfolio.divyanshraj.in",
  github: "https://github.com/02Raj",
  email: "divyanshraj02@gmail.com",
  phone: "7236998742",
  /** Résumé / CV on standard portfolio */
  resume: "https://portfolio.divyanshraj.in",
  x: "https://x.com/Divyans50724144",
  xHandle: "@Divyans50724144",
  prepHub: "https://learn-with-divyansh.vercel.app",
  prepHubGithub: "https://github.com/02Raj/divyansh-s-prep-hub",
} as const;

const UTM_SOURCE = "ai_portfolio";

type TrackedOpts = {
  campaign: string;
  medium?: string;
  content?: string;
};

/** Append UTM params so you can see traffic from ai.divyanshraj.in in analytics */
export function trackedUrl(url: string, opts: TrackedOpts): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", UTM_SOURCE);
    u.searchParams.set("utm_medium", opts.medium ?? "referral");
    u.searchParams.set("utm_campaign", opts.campaign);
    if (opts.content) {
      u.searchParams.set("utm_content", opts.content);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export const trackedLinks = {
  github: (campaign = "recruiter_bar") =>
    trackedUrl(siteLinks.github, { campaign, content: "github" }),
  resume: (campaign = "recruiter_bar") =>
    trackedUrl(siteLinks.resume, { campaign, content: "resume" }),
  standardPortfolio: (campaign = "hero") =>
    trackedUrl(siteLinks.standardPortfolio, {
      campaign,
      content: "standard_portfolio",
    }),
  x: (campaign = "recruiter_bar") =>
    trackedUrl(siteLinks.x, { campaign, content: "x" }),
  prepHub: (campaign = "footer") =>
    trackedUrl(siteLinks.prepHub, { campaign, content: "prep_hub" }),
  prepHubGithub: (campaign = "footer") =>
    trackedUrl(siteLinks.prepHubGithub, { campaign, content: "prep_hub_source" }),
} as const;
