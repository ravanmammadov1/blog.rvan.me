import React, { useState } from "react";
import { ResumeData, SkillCategory } from "../resumeTypes";
import { Code, Plus, Trash2, X } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const SkillsForm: React.FC<Props> = ({ data, onChange }) => {
  const skills = data.skills;
  const [newSkillInput, setNewSkillInput] = useState<{ [catIdx: number]: string }>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `sk-${Date.now()}`,
      name: "New Skill Group",
      items: [],
    };
    onChange({ ...data, skills: [...skills, newCat] });
  };

  const handleRemoveCategory = (idx: number) => {
    const updated = skills.filter((_, i) => i !== idx);
    onChange({ ...data, skills: updated });
  };

  const handleUpdateCategoryName = (idx: number, name: string) => {
    const updated = [...skills];
    updated[idx] = { ...updated[idx], name };
    onChange({ ...data, skills: updated });
  };

  const handleAddSkillItem = (catIdx: number) => {
    const item = newSkillInput[catIdx]?.trim();
    if (!item) return;

    const updated = [...skills];
    updated[catIdx] = {
      ...updated[catIdx],
      items: [...updated[catIdx].items, item],
    };
    onChange({ ...data, skills: updated });
    setNewSkillInput({ ...newSkillInput, [catIdx]: "" });
  };

  const handleRemoveSkillItem = (catIdx: number, itemIdx: number) => {
    const updated = [...skills];
    const items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
    updated[catIdx] = { ...updated[catIdx], items };
    onChange({ ...data, skills: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Code size={16} className="text-primary" />
          <span>Technical Skills & Core Competencies</span>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus size={13} /> ADD SKILL GROUP
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((cat, catIdx) => (
          <div key={cat.id || catIdx} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-center gap-2">
              <input
                id={`skill-category-${catIdx}`}
                name={`skillCategory_${catIdx}`}
                type="text"
                value={cat.name}
                onChange={(e) => handleUpdateCategoryName(catIdx, e.target.value)}
                placeholder="Category Name (e.g. Languages, Frameworks, Cloud)"
                className="font-bold text-xs text-foreground bg-transparent border-b border-white/10 pb-1 focus:border-primary focus:outline-none w-64"
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(catIdx)}
                className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Skill Tags */}
            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl bg-black/20 border border-white/5">
              {cat.items.map((item, itemIdx) => (
                <span
                  key={itemIdx}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold bg-white/10 text-neutral-200 px-2 py-0.5 rounded-lg border border-white/10"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkillItem(catIdx, itemIdx)}
                    className="text-muted-foreground hover:text-red-400 cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              {cat.items.length === 0 && (
                <span className="text-[11px] text-muted-foreground/50 italic py-0.5">No skills added yet in this group.</span>
              )}
            </div>

            {/* Add Skill Input */}
            <div className="flex items-center gap-2">
              <input
                id={`new-skill-input-${catIdx}`}
                name={`newSkill_${catIdx}`}
                type="text"
                value={newSkillInput[catIdx] || ""}
                onChange={(e) => setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkillItem(catIdx);
                  }
                }}
                placeholder="Type skill & press Enter (e.g. TypeScript, Docker, SQL)..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSkillItem(catIdx)}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-primary text-black rounded-xl hover:bg-primary/90 transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
