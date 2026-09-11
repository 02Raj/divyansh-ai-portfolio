import { ExternalLink, GitBranch } from "lucide-react";
import { getProjectShowcaseCards } from "@/lib/featured-projects";
import { prepHub } from "@/lib/prep-hub";
import { trackedLinks } from "@/lib/site-config";

function BuildInPublicCard() {
  return (
    <article className="stat-card rounded-xl p-3.5 sm:p-4 text-left col-span-1 sm:col-span-2">
      <p className="text-[11px] sm:text-xs font-medium text-primary mb-1">
        🚀 {prepHub.tagline}
      </p>
      <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">
        {prepHub.name}
      </h3>
      <ul className="text-[11px] sm:text-xs text-muted-foreground space-y-1 mb-3 leading-relaxed list-none">
        {prepHub.chatBullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <a
          href={trackedLinks.prepHub("chat_projects")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          Live site
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href={trackedLinks.prepHubGithub("chat_projects")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80"
        >
          <GitBranch className="w-3 h-3" />
          {prepHub.githubRepo}
        </a>
      </div>
    </article>
  );
}

function ProductCard({ project }: { project: ReturnType<typeof getProjectShowcaseCards>[number] }) {
  const liveHref = project.liveUrl
    ? project.liveUrl.includes("utm_")
      ? project.liveUrl
      : `${project.liveUrl}${project.liveUrl.includes("?") ? "&" : "?"}utm_source=ai_portfolio&utm_medium=referral&utm_campaign=chat_projects&utm_content=${encodeURIComponent(project.name)}`
    : undefined;

  return (
    <article className="stat-card rounded-xl p-3.5 text-left">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="text-sm font-semibold text-foreground leading-tight">
          {project.name}
        </h3>
        <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
          {project.period.replace(" – Present", "+")}
        </span>
      </div>
      {project.metric && (
        <p className="text-xs text-emerald-400/90 font-medium mb-2">{project.metric}</p>
      )}
      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
        {project.summary}
      </p>
      <div className="flex flex-wrap gap-1 mb-2">
        {project.stackTags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary border border-border text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      {liveHref && (
        <a
          href={liveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          Live demo
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </article>
  );
}

export function ProjectShowcaseCards() {
  const cards = getProjectShowcaseCards();
  const products = cards.filter((c) => c.variant !== "buildInPublic");

  return (
    <div className="mt-3 w-full max-w-full">
      <p className="text-[11px] text-muted-foreground mb-2 px-0.5">
        Build-in-public & recent production work
      </p>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <BuildInPublicCard />
        {products.map((project) => (
          <ProductCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
}
