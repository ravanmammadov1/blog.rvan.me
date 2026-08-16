import React, { useState } from "react";
import { Plus, Briefcase, GraduationCap, Code, FolderGit2, Users, Award, Globe, Star } from "lucide-react";
import { useResumeEditor } from "../context/ResumeEditorContext";

export const CanvasAddSectionDivider: React.FC = () => {
  const { addExperience, addEducation, addSkillCategory, addProject, addReference } = useResumeEditor();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative my-2 group print:hidden">
      {/* Subtle Horizontal Hover Line */}
      <div className="h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-full border-t border-dashed border-primary/50" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute bg-primary text-black font-mono font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 hover:scale-105 transition-transform cursor-pointer"
        >
          <Plus size={10} /> Add Section
        </button>
      </div>

      {/* Add Section Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-6 w-52 bg-neutral-900 border border-white/20 p-2 rounded-2xl shadow-2xl z-50 space-y-1 font-mono text-xs text-white animate-in fade-in zoom-in-95">
          <button
            type="button"
            onClick={() => {
              addExperience();
              setIsOpen(false);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Briefcase size={12} className="text-primary" />
            <span>Work Experience</span>
          </button>

          <button
            type="button"
            onClick={() => {
              addEducation();
              setIsOpen(false);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap size={12} className="text-primary" />
            <span>Education</span>
          </button>

          <button
            type="button"
            onClick={() => {
              addSkillCategory();
              setIsOpen(false);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Code size={12} className="text-primary" />
            <span>Skills Group</span>
          </button>

          <button
            type="button"
            onClick={() => {
              addProject();
              setIsOpen(false);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <FolderGit2 size={12} className="text-primary" />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => {
              addReference();
              setIsOpen(false);
            }}
            className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Users size={12} className="text-primary" />
            <span>References</span>
          </button>
        </div>
      )}
    </div>
  );
};
