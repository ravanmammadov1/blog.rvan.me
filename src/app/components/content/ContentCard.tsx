import React from "react";
import { ExternalLink, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { UniversalContentItem } from "../../../types/cms";

interface ContentCardProps {
  item: UniversalContentItem;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const categoryLabel = typeof item.category?.name === "string" ? item.category.name : "Resource";
  const categoryIcon = item.category?.icon || "⚡";

  return (
    <article className="group p-5 aurora-card flex flex-col justify-between relative min-h-[300px] border border-white/10 bg-white/[0.02] backdrop-blur-lg hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 rounded-2xl">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9.5px] font-semibold text-primary mono uppercase">
            <span>{categoryIcon}</span>
            <span>{categoryLabel}</span>
          </span>

          {item.qualityScore && item.qualityScore >= 80 && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mono">
              <CheckCircle2 size={10} /> {item.qualityScore} SCORE
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-4 font-medium flex-1">
          {item.summary}
        </p>

        {/* Why It Matters Badge */}
        {item.whyItMatters && (
          <div className="mb-4 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[11px] leading-relaxed text-foreground/90 font-medium">
            <span className="font-bold text-primary flex items-center gap-1 mb-0.5 mono text-[9.5px] uppercase">
              <Sparkles size={10} /> Why It Matters
            </span>
            {item.whyItMatters}
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-semibold text-muted-foreground/75 mb-4">
            {item.tags.slice(0, 3).map((tag, idx) => {
              const tagLabel = typeof tag.name === "string" ? tag.name : "";
              return (
                <span key={idx} className="flex items-center gap-0.5 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-foreground/70">
                  <Tag size={8} /> #{tagLabel}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
        <span className="text-[9px] font-bold text-muted-foreground/50 mono uppercase">
          {item.sourceName || "VERIFIED RESOURCE"}
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground hover:border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 glass-sm"
        >
          EXPLORE <ExternalLink size={10} />
        </a>
      </div>
    </article>
  );
};
