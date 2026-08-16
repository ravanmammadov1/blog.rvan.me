import React, { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useResumeEditor } from "../context/ResumeEditorContext";

interface CanvasSectionHeaderProps {
  title: string;
  onTitleChange?: (newTitle: string) => void;
  onAddEntry?: () => void;
  onDeleteSection?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CanvasSectionHeader: React.FC<CanvasSectionHeaderProps> = ({
  title,
  onTitleChange,
  onAddEntry,
  onDeleteSection,
  className = "",
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group flex items-center justify-between border-b pb-1 ${className}`}
      style={style}
    >
      <h2 className="text-xs font-black uppercase tracking-wider text-inherit font-sans select-none">
        {title}
      </h2>

      {/* Floating Contextual Actions Pill */}
      {isHovered && (
        <div className="flex items-center gap-1 bg-neutral-900/90 border border-white/20 px-2 py-0.5 rounded-lg shadow-xl text-[10px] font-mono text-white print:hidden animate-in fade-in">
          {onAddEntry && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddEntry();
              }}
              className="flex items-center gap-0.5 text-primary hover:text-white px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer font-bold"
              title="Add New Entry"
            >
              <Plus size={10} /> Add Entry
            </button>
          )}

          {onDeleteSection && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Remove the ${title} section?`)) {
                  onDeleteSection();
                }
              }}
              className="text-neutral-400 hover:text-red-400 p-0.5 rounded hover:bg-red-500/20 transition-colors cursor-pointer"
              title="Remove Section"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
