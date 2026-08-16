import React, { useState, useEffect } from "react";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Trash2, X } from "lucide-react";

export const FloatingFormatToolbar: React.FC = () => {
  const { selectedElement, selectElement } = useResumeEditor();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!selectedElement || selectedElement.type === "photo") {
      setCoords(null);
      return;
    }

    const elem = document.querySelector(`[data-canvas-id="${selectedElement.id}"]`);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      const canvasContainer = document.getElementById("resume-canvas-viewport");
      if (canvasContainer) {
        const containerRect = canvasContainer.getBoundingClientRect();
        setCoords({
          top: Math.max(10, rect.top - containerRect.top - 46),
          left: Math.max(10, rect.left - containerRect.left + rect.width / 2),
        });
      }
    }
  }, [selectedElement]);

  if (!coords || !selectedElement) return null;

  const applyCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  return (
    <div
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transform: "translateX(-50%)",
      }}
      className="absolute z-50 flex items-center gap-1 bg-neutral-900/95 backdrop-blur-md border border-white/20 px-2 py-1 rounded-2xl shadow-2xl text-white text-xs font-mono print:hidden animate-in fade-in zoom-in-95"
    >
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyCommand("bold");
        }}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-200 hover:text-white"
        title="Bold (Ctrl+B)"
      >
        <Bold size={13} />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyCommand("italic");
        }}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-200 hover:text-white"
        title="Italic (Ctrl+I)"
      >
        <Italic size={13} />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyCommand("underline");
        }}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-200 hover:text-white"
        title="Underline (Ctrl+U)"
      >
        <Underline size={13} />
      </button>

      <div className="h-4 w-px bg-white/20 mx-1" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyCommand("justifyLeft");
        }}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-200 hover:text-white"
        title="Align Left"
      >
        <AlignLeft size={13} />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyCommand("justifyCenter");
        }}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-200 hover:text-white"
        title="Align Center"
      >
        <AlignCenter size={13} />
      </button>

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyCommand("justifyRight");
        }}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-200 hover:text-white"
        title="Align Right"
      >
        <AlignRight size={13} />
      </button>

      <div className="h-4 w-px bg-white/20 mx-1" />

      <button
        type="button"
        onClick={() => selectElement(null)}
        className="p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer text-neutral-400 hover:text-white"
        title="Close"
      >
        <X size={13} />
      </button>
    </div>
  );
};
