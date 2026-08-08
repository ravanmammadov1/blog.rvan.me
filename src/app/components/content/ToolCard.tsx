import React from "react";
import { ExternalLink } from "lucide-react";
import { UniversalContentItem } from "../../../types/cms";
import { formatHumanTitle } from "./ContentCard";

interface ToolCardProps {
  item: UniversalContentItem;
}

export const ToolCard: React.FC<ToolCardProps> = ({ item }) => {
  const displayTitle = formatHumanTitle(item.title);

  return (
    <article className="group p-5 aurora-card flex flex-col justify-between relative min-h-[220px] border border-white/10 bg-white/[0.02] backdrop-blur-lg hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 rounded-2xl">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Category Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-primary mono">
            AI & Automation Tool
          </span>
        </div>

        {/* Display Title */}
        <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
          {displayTitle}
        </h3>

        {/* Human Description (max 2 short lines) */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 mb-4 font-medium flex-1">
          {item.summary || "Smart AI utility engineered to accelerate creative workflows and technical automation."}
        </p>
      </div>

      {/* Footer Explore CTA */}
      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-bold text-muted-foreground/60 mono uppercase truncate max-w-[150px]">
          {item.sourceName || "AI Tool"}
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors cursor-pointer shrink-0"
        >
          EXPLORE <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
};
