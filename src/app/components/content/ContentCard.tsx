import React from "react";
import { ExternalLink } from "lucide-react";
import { UniversalContentItem } from "../../../types/cms";

interface ContentCardProps {
  item: UniversalContentItem;
}

export function formatHumanTitle(rawTitle: string): string {
  if (!rawTitle) return "Creative Resource";
  const trimmed = rawTitle.trim();

  const KNOWN_MAP: Record<string, string> = {
    "Javis603/token-monitor": "AI Token Monitor",
    "h0x91b/dev-3.0": "Dev 3 Workflow Manager",
    "Caplet1989/Brokies-AI-Foundry": "AI Developer Toolkit",
  };

  if (KNOWN_MAP[trimmed]) return KNOWN_MAP[trimmed];

  if (trimmed.includes("/") && !trimmed.includes(" ")) {
    const parts = trimmed.split("/");
    const repoName = parts[parts.length - 1];
    return repoName
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return trimmed;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const categoryLabel = typeof item.category?.name === "string" ? item.category.name : "Resource";
  const displayTitle = formatHumanTitle(item.title);

  return (
    <article className="group p-5 flex flex-col justify-between relative min-h-[220px] rounded-2xl liquid-glass-card liquid-glass-interactive">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Category Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase mono liquid-glass-pill liquid-glass-pill-active">
            {categoryLabel}
          </span>
        </div>

        {/* Display Title */}
        <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
          {displayTitle}
        </h3>

        {/* Human Description (max 2 short lines) */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mb-4 font-medium flex-1">
          {item.summary || item.whoShouldUseIt || "Explore this creative resource to streamline your design and development workflow."}
        </p>
      </div>

      {/* Footer Explore CTA */}
      <div className="relative z-10 border-t border-border/50 dark:border-white/5 pt-4 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-bold text-muted-foreground/70 mono uppercase truncate max-w-[150px]">
          {item.sourceName || "Resource"}
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider liquid-glass-btn-primary text-white cursor-pointer shrink-0"
        >
          EXPLORE <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
};
