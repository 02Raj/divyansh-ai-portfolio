import { Mail, Phone } from "lucide-react";
import { siteLinks, trackedLinks } from "@/lib/site-config";
import { XLogo } from "@/components/icons/XLogo";

export function HireContactCard() {
  return (
    <div className="mt-3 stat-card rounded-xl p-4 w-full">
      <p className="text-sm font-semibold text-foreground mb-1">
        Let&apos;s talk
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        Open to full-stack roles (Java, Spring Boot, Angular/React). Happy to
        share more on SlantPOS, SaaS work, or AWS deploys.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${siteLinks.email}?subject=Opportunity%20%E2%80%94%20Divyansh%20Raj`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </a>
        <a
          href={`tel:+91${siteLinks.phone}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
        <a
          href={trackedLinks.resume("hire_card")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors"
        >
          Résumé & portfolio
        </a>
        <a
          href={trackedLinks.x("hire_card")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label={`Message on X ${siteLinks.xHandle}`}
          title={siteLinks.xHandle}
        >
          <XLogo className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
