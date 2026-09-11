import { ExternalLink } from "lucide-react";
import { getFeaturedProjectCards } from "@/lib/featured-projects";

export function ProjectShowcaseCards() {
  const cards = getFeaturedProjectCards();

  return (
    <div className="mt-3 grid gap-2.5 sm:grid-cols-2 w-full max-w-full">
      {cards.map((project) => (
        <article
          key={project.name}
          className="stat-card rounded-xl p-3.5 text-left"
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-sm font-semibold text-foreground leading-tight">
              {project.name}
            </h3>
            <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
              {project.period.replace(" – Present", "+")}
            </span>
          </div>
          {project.metric && (
            <p className="text-xs text-emerald-400/90 font-medium mb-2">
              {project.metric}
            </p>
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
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
            >
              Live demo
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
