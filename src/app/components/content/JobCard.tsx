import React from "react";
import { ExternalLink, Briefcase, MapPin, DollarSign, Globe } from "lucide-react";
import { UniversalContentItem } from "../../../types/cms";

interface JobCardProps {
  item: UniversalContentItem;
}

export const JobCard: React.FC<JobCardProps> = ({ item }) => {
  const company = item.jobDetails?.company || item.sourceName || "Global Employer";
  const salary = item.jobDetails?.salaryRange || "Competitive";
  const locationType = item.jobDetails?.locationType || "100% Remote";

  return (
    <article className="group p-5 aurora-card flex flex-col justify-between relative min-h-[300px] border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-lg hover:border-primary/40 hover:bg-slate-50/50 dark:hover:bg-white/[0.05] transition-all duration-300 rounded-3xl">
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400 mono uppercase shadow-2xs">
            <Briefcase size={10} /> REMOTE OPPORTUNITY
          </span>

          <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full mono flex items-center gap-1">
            <Globe size={9} /> GLOBAL
          </span>
        </div>

        {/* Company & Title */}
        <p className="text-[11px] font-bold text-muted-foreground/80 mono uppercase mb-1">
          {company}
        </p>
        <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {item.title}
        </h3>

        {/* Summary */}
        <p className="text-xs leading-relaxed text-muted-foreground/80 line-clamp-3 mb-4 font-medium flex-1">
          {item.summary}
        </p>

        {/* Salary & Location Info */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg mono">
            <DollarSign size={11} /> {salary}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-slate-50 dark:bg-white/5 border border-[#DDE1E0] dark:border-white/10 px-2.5 py-1 rounded-lg mono">
            <MapPin size={11} /> {locationType}
          </span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="relative z-10 border-t border-[#DDE1E0] dark:border-white/10 pt-4 flex items-center justify-between mt-auto">
        <span className="text-[9px] font-bold text-muted-foreground/50 mono uppercase">
          VERIFIED JOB
        </span>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:text-black transition-all duration-300 glass-sm"
        >
          APPLY NOW <ExternalLink size={10} />
        </a>
      </div>
    </article>
  );
};
