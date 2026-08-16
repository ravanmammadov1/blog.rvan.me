import React from "react";
import { ResumeData, ExperienceItem } from "../resumeTypes";
import { ACTION_VERBS } from "../atsEngine";
import { Briefcase, Plus, Trash2, Sparkles } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const ExperienceForm: React.FC<Props> = ({ data, onChange }) => {
  const experiences = data.experiences;

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    onChange({
      ...data,
      experiences: [...experiences, newItem],
    });
  };

  const handleRemoveExperience = (idx: number) => {
    const updated = experiences.filter((_, i) => i !== idx);
    onChange({ ...data, experiences: updated });
  };

  const handleUpdateField = (idx: number, field: keyof ExperienceItem, val: any) => {
    const updated = [...experiences];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, experiences: updated });
  };

  const handleAddBullet = (expIdx: number) => {
    const updated = [...experiences];
    updated[expIdx] = {
      ...updated[expIdx],
      bullets: [...updated[expIdx].bullets, ""],
    };
    onChange({ ...data, experiences: updated });
  };

  const handleUpdateBullet = (expIdx: number, bulletIdx: number, val: string) => {
    const updated = [...experiences];
    const bullets = [...updated[expIdx].bullets];
    bullets[bulletIdx] = val;
    updated[expIdx] = { ...updated[expIdx], bullets };
    onChange({ ...data, experiences: updated });
  };

  const handleRemoveBullet = (expIdx: number, bulletIdx: number) => {
    const updated = [...experiences];
    const bullets = updated[expIdx].bullets.filter((_, i) => i !== bulletIdx);
    updated[expIdx] = { ...updated[expIdx], bullets };
    onChange({ ...data, experiences: updated });
  };

  const handleInsertActionVerb = (expIdx: number, bulletIdx: number, verb: string) => {
    const current = experiences[expIdx].bullets[bulletIdx] || "";
    const updatedVal = current ? `${verb} ${current}` : `${verb} `;
    handleUpdateBullet(expIdx, bulletIdx, updatedVal);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Briefcase size={16} className="text-primary" />
          <span>Work Experience ({experiences.length})</span>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus size={13} /> ADD POSITION
        </button>
      </div>

      <div className="space-y-5">
        {experiences.map((exp, expIdx) => (
          <div
            key={exp.id || expIdx}
            className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all space-y-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-primary uppercase">
                Position #{expIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExperience(expIdx)}
                className="text-red-400 hover:text-red-300 p-1 transition-colors cursor-pointer"
                title="Delete position"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Job Title *</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => handleUpdateField(expIdx, "title", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Company / Organization *</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdateField(expIdx, "company", e.target.value)}
                  placeholder="e.g. Stripe, Google, Acme Corp"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleUpdateField(expIdx, "location", e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleUpdateField(expIdx, "startDate", e.target.value)}
                    placeholder="e.g. 2022-03 or Mar 2022"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">End Date</label>
                  <input
                    type="text"
                    disabled={exp.current}
                    value={exp.current ? "Present" : exp.endDate}
                    onChange={(e) => handleUpdateField(expIdx, "endDate", e.target.value)}
                    placeholder="e.g. 2024-05"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${expIdx}`}
                checked={exp.current}
                onChange={(e) => handleUpdateField(expIdx, "current", e.target.checked)}
                className="h-3.5 w-3.5 accent-primary rounded cursor-pointer"
              />
              <label htmlFor={`current-${expIdx}`} className="text-xs text-muted-foreground cursor-pointer font-medium select-none">
                I currently work here
              </label>
            </div>

            {/* Bullets List */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">
                  Key Achievements & Responsibilities
                </label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(expIdx)}
                  className="text-[11px] font-mono text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={11} /> Add Bullet
                </button>
              </div>

              {exp.bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-xs">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                      placeholder="e.g. Architected high-throughput microservice reducing latency by 45%..."
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                    />
                    {exp.bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(expIdx, bIdx)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  {/* Action Verbs Quick Helper Chips */}
                  <div className="flex items-center gap-1 pl-4 flex-wrap">
                    <span className="text-[10px] text-muted-foreground/60 flex items-center gap-0.5 font-mono">
                      <Sparkles size={10} className="text-primary" /> Action Verbs:
                    </span>
                    {["Architected", "Spearheaded", "Optimized", "Scaled", "Engineered", "Automated", "Delivered"].map((verb) => (
                      <button
                        key={verb}
                        type="button"
                        onClick={() => handleInsertActionVerb(expIdx, bIdx, verb)}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                      >
                        +{verb}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
