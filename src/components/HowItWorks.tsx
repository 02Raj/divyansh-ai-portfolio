"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  "Next.js app with grounded answers from my résumé data (not a generic ChatGPT wrapper).",
  "Sarvam AI for chat; MongoDB caches quick topics so repeat questions are instant.",
  "Voice: browser mic → STT → answer → optional TTS replay on assistant messages.",
  "Intent routing for skills, projects, experience, hiring, and off-topic guardrails.",
];

export function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 text-left text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-2 px-1"
        aria-expanded={open}
      >
        <span>How this site works (engineering)</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="text-[11px] sm:text-xs text-muted-foreground space-y-2 pb-2 px-1 leading-relaxed list-disc list-inside">
          {items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
