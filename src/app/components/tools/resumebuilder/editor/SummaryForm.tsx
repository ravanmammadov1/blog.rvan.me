import React from "react";
import { ResumeData } from "../resumeTypes";
import { FileText, Sparkles } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const SummaryForm: React.FC<Props> = ({ data, onChange }) => {
  const wordCount = data.summary?.trim() ? data.summary.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <FileText size={16} className="text-primary" />
          <span>Professional Summary</span>
        </div>
        <span className={`text-[11px] font-mono font-bold ${wordCount >= 25 && wordCount <= 100 ? "text-emerald-400" : "text-muted-foreground"}`}>
          {wordCount} words (Ideal: 30-90)
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Write a concise, 2-4 sentence summary highlighting your key achievements, years of experience, and primary expertise.
      </p>

      <textarea
        id="resume-summary-input"
        name="summary"
        rows={4}
        value={data.summary}
        onChange={(e) => onChange({ ...data, summary: e.target.value })}
        placeholder="e.g. Performance-driven Senior Software Engineer with 6+ years of experience architecting distributed cloud applications..."
        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none leading-relaxed"
      />
    </div>
  );
};
