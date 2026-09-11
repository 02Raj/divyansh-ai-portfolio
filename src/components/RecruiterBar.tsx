import { GitBranch, Mail, FileText, Briefcase } from "lucide-react";
import { siteLinks, trackedLinks } from "@/lib/site-config";
import { XLogo } from "@/components/icons/XLogo";
import { getExperienceLabel } from "@/lib/resume-data";

export function RecruiterBar() {
  return (
    <div
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 relative z-10"
      role="navigation"
      aria-label="Recruiter links"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground border border-border/80 rounded-xl bg-card/60 px-3 py-2.5 sm:px-4">
        <span className="inline-flex items-center gap-1.5 text-foreground/90 font-medium">
          <Briefcase className="w-3.5 h-3.5 text-primary" aria-hidden />
          Open to roles · {getExperienceLabel()} yrs
        </span>
        <span className="hidden sm:inline text-border">|</span>
        <a
          href={`mailto:${siteLinks.email}`}
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </a>
        <a
          href={trackedLinks.github()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5" />
          GitHub
        </a>
        <a
          href={trackedLinks.x()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          title={siteLinks.xHandle}
        >
          <XLogo className="w-3.5 h-3.5" />
          X
        </a>
        <a
          href={trackedLinks.resume()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Résumé
        </a>
      </div>
    </div>
  );
}
