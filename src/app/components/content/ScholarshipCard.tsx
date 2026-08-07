import React from "react";
import { ExternalLink, Award, Calendar, DollarSign } from "lucide-react";
import { UniversalContentItem } from "../../../types/cms";

interface ScholarshipCardProps {
  item: UniversalContentItem;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ item }) => {
  const funding = item.scholarshipDetails?.fundingAmount || "Full / Partial Grant";
  const deadline = item.scholarshipDetails?.deadline
    ? new Date(item.scholarshipDetails.deadline).toLocaleDateString()
    : "Open Applications";

  return (
    <article className="group p-5 aurora-card flex flex-col justify-between relative min-h-[300px] border border-white/10 bg-white/[0.02] backdrop-blur-lg hover:border-primary/40 hover:bg-white/[0.05] transition-all duration-300 rounded-2xl">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[9.5px] font-semibold text-purple-400 mono uppercase">
            <Award size={10} /> SCHOLARSHIP & GRANT
          </span>

          <span className="text-[9px] font-bold bg-white/5 border border-white/10 text-muted-foreground px-2 py-0.5 rounded-full mono flex items-center gap-1">
            <Calendar size={9} /> {deadline}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-4 font-medium flex-1">
          {item.summary}
        </p>

        {/* Funding Amount */}
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg mono">
            <DollarSign size={11} /> Funding: {funding}
          </span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
        <span className="text-[9px] font-bold text-muted-foreground/50 mono uppercase">
          ACADEMIC & CREATIVE
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 hover:bg-purple-500 hover:text-black transition-all duration-300 glass-sm"
        >
          VIEW GRANT <ExternalLink size={10} />
        </a>
      </div>
    </article>
  );
};
