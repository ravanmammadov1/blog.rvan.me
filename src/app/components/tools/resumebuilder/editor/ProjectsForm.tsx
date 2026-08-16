import React, { useState } from "react";
import { ResumeData, ProjectItem } from "../resumeTypes";
import { FolderGit2, Plus, Trash2 } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const ProjectsForm: React.FC<Props> = ({ data, onChange }) => {
  const projects = data.projects;

  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      role: "",
      techStack: [],
      link: "",
      github: "",
      description: [""],
    };
    onChange({ ...data, projects: [...projects, newProj] });
  };

  const handleRemoveProject = (idx: number) => {
    const updated = projects.filter((_, i) => i !== idx);
    onChange({ ...data, projects: updated });
  };

  const handleUpdate = (idx: number, field: keyof ProjectItem, val: any) => {
    const updated = [...projects];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, projects: updated });
  };

  const handleUpdateTechStack = (idx: number, rawString: string) => {
    const list = rawString.split(",").map((s) => s.trim()).filter(Boolean);
    handleUpdate(idx, "techStack", list);
  };

  const handleAddBullet = (projIdx: number) => {
    const updated = [...projects];
    updated[projIdx] = {
      ...updated[projIdx],
      description: [...updated[projIdx].description, ""],
    };
    onChange({ ...data, projects: updated });
  };

  const handleUpdateBullet = (projIdx: number, bIdx: number, val: string) => {
    const updated = [...projects];
    const desc = [...updated[projIdx].description];
    desc[bIdx] = val;
    updated[projIdx] = { ...updated[projIdx], description: desc };
    onChange({ ...data, projects: updated });
  };

  const handleRemoveBullet = (projIdx: number, bIdx: number) => {
    const updated = [...projects];
    const desc = updated[projIdx].description.filter((_, i) => i !== bIdx);
    updated[projIdx] = { ...updated[projIdx], description: desc };
    onChange({ ...data, projects: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <FolderGit2 size={16} className="text-primary" />
          <span>Key Projects ({projects.length})</span>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus size={13} /> ADD PROJECT
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div key={proj.id || idx} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-primary uppercase">Project #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveProject(idx)}
                className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Project Name *</label>
                <input
                  type="text"
                  value={proj.name}
                  onChange={(e) => handleUpdate(idx, "name", e.target.value)}
                  placeholder="e.g. HyperScale Analytics"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Your Role</label>
                <input
                  type="text"
                  value={proj.role || ""}
                  onChange={(e) => handleUpdate(idx, "role", e.target.value)}
                  placeholder="e.g. Lead Creator, Core Contributor"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={proj.techStack?.join(", ") || ""}
                  onChange={(e) => handleUpdateTechStack(idx, e.target.value)}
                  placeholder="e.g. React, TypeScript, Docker, PostgreSQL"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Live URL or GitHub Link</label>
                <input
                  type="url"
                  value={proj.link || proj.github || ""}
                  onChange={(e) => handleUpdate(idx, "link", e.target.value)}
                  placeholder="e.g. https://project.demo.dev"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Description Bullets */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Project Impact & Details</label>
                <button
                  type="button"
                  onClick={() => handleAddBullet(idx)}
                  className="text-[11px] font-mono text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus size={11} /> Add Bullet
                </button>
              </div>

              {proj.description?.map((desc, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2">
                  <span className="text-primary font-bold text-xs">•</span>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => handleUpdateBullet(idx, bIdx, e.target.value)}
                    placeholder="e.g. Open-source distributed analytics pipeline indexing 100M+ events..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                  {proj.description.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx, bIdx)}
                      className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
